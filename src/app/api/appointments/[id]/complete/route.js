import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Sale from '@/models/Sale';
import Inventory from '@/models/Inventory';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// POST /api/appointments/[id]/complete - Complete appointment with optional sale
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_APPOINTMENTS]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to complete appointments' },
        { status: 403 }
      );
    }

    const { user } = authResult;
    const body = await request.json();
    const { 
      completionNotes, 
      medicalRecord, 
      vaccination,
      items = [], // Items sold during appointment
      payment 
    } = body;

    const appointment = await Appointment.findById(params.id)
      .populate('owner')
      .populate('pet');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (appointment.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Appointment is already completed' },
        { status: 400 }
      );
    }

    // Update appointment status
    appointment.status = 'completed';
    if (completionNotes) {
      appointment.notes = (appointment.notes || '') + '\n\nCompletion Notes: ' + completionNotes;
    }
    await appointment.save();

    // Add medical record if provided
    if (medicalRecord) {
      await appointment.pet.addMedicalRecord({
        type: appointment.type,
        description: medicalRecord.description || `${appointment.type} appointment completed`,
        veterinarian: medicalRecord.veterinarian || (appointment.assignedTo ? 
          `${appointment.assignedTo.firstName} ${appointment.assignedTo.lastName}` : 'Staff'),
        notes: medicalRecord.notes || completionNotes,
        cost: medicalRecord.cost || 0,
        date: new Date()
      });
    }

    // Add vaccination record if provided
    if (vaccination) {
      await appointment.pet.addVaccination(
        vaccination.name,
        new Date(),
        vaccination.nextDue ? new Date(vaccination.nextDue) : null
      );
    }

    let sale = null;
    
    // Create sale if items were sold during appointment
    if (items && items.length > 0) {
      // Process and validate items
      const processedItems = [];
      for (const item of items) {
        const inventoryItem = await Inventory.findById(item.inventory);
        if (!inventoryItem) {
          return NextResponse.json(
            { success: false, message: `Inventory item not found: ${item.inventory}` },
            { status: 404 }
          );
        }

        if (inventoryItem.quantity < item.quantity) {
          return NextResponse.json(
            { success: false, message: `Insufficient stock for ${inventoryItem.name}` },
            { status: 400 }
          );
        }

        // Calculate item totals
        const unitPrice = item.unitPrice || inventoryItem.price;
        const subtotal = item.quantity * unitPrice;
        const discountAmount = item.discountType === 'percentage' 
          ? (subtotal * (item.discount || 0)) / 100 
          : (item.discount || 0);
        const taxableAmount = subtotal - discountAmount;
        const gstRate = inventoryItem.gst?.gstRate ?? 18;
        const isGSTApplicable = inventoryItem.gst?.isGSTApplicable ?? true;
        const gstAmount = isGSTApplicable ? (taxableAmount * gstRate) / 100 : 0;
        const total = taxableAmount + gstAmount;

        processedItems.push({
          inventory: inventoryItem._id,
          name: inventoryItem.name,
          sku: inventoryItem.sku,
          quantity: item.quantity,
          unitPrice: unitPrice,
          discount: item.discount || 0,
          discountType: item.discountType || 'percentage',
          subtotal: subtotal,
          discountAmount: discountAmount,
          taxableAmount: taxableAmount,
          gst: {
            isApplicable: isGSTApplicable,
            rate: gstRate,
            type: (inventoryItem.gst?.gstType ?? 'CGST_SGST').replace(/[+]/g, '_'),
            hsnCode: inventoryItem.gst?.hsnCode ?? '',
            sacCode: inventoryItem.gst?.sacCode ?? ''
          },
          gstAmount: gstAmount,
          total: total,
          notes: `Sold during ${appointment.type} appointment`
        });
      }

      // Calculate sale totals
      const subtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalDiscount = processedItems.reduce((sum, item) => sum + item.discountAmount, 0);
      const totalTaxable = processedItems.reduce((sum, item) => sum + item.taxableAmount, 0);
      const totalGST = processedItems.reduce((sum, item) => sum + item.gstAmount, 0);
      const grandTotal = processedItems.reduce((sum, item) => sum + item.total, 0);

      // Generate sale number
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      const lastSale = await Sale.findOne({
        saleNumber: new RegExp(`^SAL-${year}${month}-`)
      }).sort({ saleNumber: -1 });
      
      let sequence = 1;
      if (lastSale) {
        const lastSequence = parseInt(lastSale.saleNumber.split('-')[2]);
        sequence = lastSequence + 1;
      }
      
      const saleNumber = `SAL-${year}${month}-${String(sequence).padStart(4, '0')}`;

      // Create sale
      const saleData = {
        saleNumber: saleNumber,
        customer: {
          owner: appointment.owner._id,
          pet: appointment.pet._id
        },
        items: processedItems,
        totals: {
          subtotal: subtotal,
          totalDiscount: totalDiscount,
          totalTaxable: totalTaxable,
          totalGST: totalGST,
          grandTotal: grandTotal
        },
        payment: {
          method: payment?.method || 'cash',
          status: payment?.status || 'paid',
          paidAmount: payment?.paidAmount || grandTotal,
          dueAmount: grandTotal - (payment?.paidAmount || grandTotal)
        },
        salesPerson: user._id,
        notes: `Sale from ${appointment.type} appointment (${appointment.appointmentNumber})`,
        status: 'confirmed'
      };

      sale = new Sale(saleData);
      await sale.save();

      // Update inventory quantities
      await sale.updateInventory();

      // Update customer spending
      await appointment.owner.addToTotalSpent(sale.totals.grandTotal);

      // Link sale to pet's usage history
      for (const item of processedItems) {
        const inventoryItem = await Inventory.findById(item.inventory);
        await inventoryItem.sellToPet(
          appointment.pet._id, 
          appointment.owner._id, 
          item.quantity, 
          `Used during ${appointment.type} appointment`
        );
      }
    }

    // Update owner's last visit
    await appointment.owner.updateLastVisit();

    // Populate the response
    await appointment.populate([
      { path: 'owner', select: 'firstName lastName email phone' },
      { path: 'pet', select: 'name species breed age medicalHistory vaccinations' },
      { path: 'assignedTo', select: 'firstName lastName' }
    ]);

    const response = {
      success: true,
      message: 'Appointment completed successfully',
      data: { 
        appointment,
        sale: sale ? await sale.populate([
          { path: 'customer.owner', select: 'firstName lastName' },
          { path: 'customer.pet', select: 'name species' },
          { path: 'items.inventory', select: 'name sku' }
        ]) : null
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Complete appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to complete appointment', error: error.message },
      { status: 500 }
    );
  }
}