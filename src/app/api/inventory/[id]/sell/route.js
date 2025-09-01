import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// POST /api/inventory/[id]/sell - Process inventory sale
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Check authentication and permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_BILLING]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to process sales' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { petId, ownerId, quantity, notes, invoiceNumber } = await request.json();

    // Validate required fields
    if (!petId || !ownerId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Pet ID, Owner ID, and valid quantity are required' },
        { status: 400 }
      );
    }

    // Find inventory item
    const item = await Inventory.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Check if item is active
    if (!item.isActive) {
      return NextResponse.json(
        { success: false, message: 'Cannot sell inactive inventory item' },
        { status: 400 }
      );
    }

    // Check stock availability
    if (item.quantity < quantity) {
      return NextResponse.json(
        { success: false, message: `Insufficient stock. Only ${item.quantity} units available` },
        { status: 400 }
      );
    }

    // Verify pet and owner exist
    const [pet, owner] = await Promise.all([
      Pet.findById(petId),
      Owner.findById(ownerId)
    ]);

    if (!pet) {
      return NextResponse.json(
        { success: false, message: 'Pet not found' },
        { status: 404 }
      );
    }

    if (!owner) {
      return NextResponse.json(
        { success: false, message: 'Owner not found' },
        { status: 404 }
      );
    }

    // Verify pet belongs to owner
    if (pet.owner.toString() !== ownerId) {
      return NextResponse.json(
        { success: false, message: 'Pet does not belong to the specified owner' },
        { status: 400 }
      );
    }

    // Check if item requires prescription
    if (item.requiresPrescription) {
      // In a real implementation, you might want to verify prescription validity
      // For now, we'll just add a note
      const prescriptionNote = notes ? `${notes} (Prescription required)` : 'Prescription required';
    }

    // Calculate sale details with GST
    const unitPrice = item.currentPrice || item.price;
    const gstBreakdown = item.gst && item.gst.isGSTApplicable ? 
      item.calculateGSTBreakdown(unitPrice) : null;
    
    const saleDetails = {
      unitPrice,
      quantity,
      subtotal: unitPrice * quantity,
      gstBreakdown: gstBreakdown ? {
        baseAmount: gstBreakdown.basePrice * quantity,
        cgstAmount: gstBreakdown.cgstAmount * quantity,
        sgstAmount: gstBreakdown.sgstAmount * quantity,
        igstAmount: gstBreakdown.igstAmount * quantity,
        cessAmount: gstBreakdown.cessAmount * quantity,
        totalGST: gstBreakdown.totalGST * quantity,
        totalWithGST: gstBreakdown.totalPriceWithGST * quantity
      } : null,
      totalAmount: gstBreakdown ? 
        gstBreakdown.totalPriceWithGST * quantity : 
        unitPrice * quantity
    };

    // Process the sale
    await item.sellToPet(petId, ownerId, quantity, notes);

    // Add detailed stock movement
    const saleNotes = [
      `Sold to ${pet.name} (${owner.firstName} ${owner.lastName})`,
      notes && `Notes: ${notes}`,
      invoiceNumber && `Invoice: ${invoiceNumber}`,
      gstBreakdown && `GST: ₹${saleDetails.gstBreakdown.totalGST.toFixed(2)}`
    ].filter(Boolean).join(' | ');

    await item.adjustStock(
      -quantity,
      'sale',
      authResult.user._id,
      saleNotes,
      invoiceNumber || `SALE-${Date.now()}`
    );

    // Reload item with updated data
    const updatedItem = await Inventory.findById(id)
      .populate('usedByPets.pet', 'name species breed')
      .populate('usedByPets.owner', 'firstName lastName email');

    return NextResponse.json({
      success: true,
      message: 'Sale processed successfully',
      data: {
        item: updatedItem,
        sale: {
          pet: {
            _id: pet._id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed
          },
          owner: {
            _id: owner._id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email
          },
          ...saleDetails,
          invoiceNumber,
          notes,
          date: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Inventory sale error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process sale', error: error.message },
      { status: 500 }
    );
  }
}