import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Format currency for Indian Rupees
const formatCurrency = (amount) => {
  const num = parseFloat(amount || 0);
  return `₹${num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Main PDF generation function
export const generatePDF = (data) => {
  try {
    console.log('Generating PDF with data:', data);
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Get dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;
    
    // ===== HEADER SECTION =====
    // Company Name
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('TailTally Pet Care', margin, yPos);
    
    // Invoice label on right
    doc.setFontSize(18);
    doc.text('INVOICE', pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 12;
    
    // Company details
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Gray text
    const companyDetails = [
      '123 Pet Street, Animal City',
      'Phone: +91 98765 43210',
      'Email: info@tailtally.com',
      'GSTIN: 22AAAAA0000A1Z5'
    ];
    
    companyDetails.forEach(detail => {
      doc.text(detail, margin, yPos);
      yPos += 5;
    });
    
    // Invoice details on right
    let rightY = 32;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Invoice Number
    doc.text('Invoice No:', pageWidth - margin - 50, rightY);
    doc.text(data.invoiceNumber || 'INV-001', pageWidth - margin, rightY, { align: 'right' });
    
    rightY += 5;
    doc.text('Date:', pageWidth - margin - 50, rightY);
    doc.text(formatDate(data.invoiceDate || new Date()), pageWidth - margin, rightY, { align: 'right' });
    
    if (data.saleNumber) {
      rightY += 5;
      doc.text('Sale Ref:', pageWidth - margin - 50, rightY);
      doc.text(data.saleNumber, pageWidth - margin, rightY, { align: 'right' });
    }
    
    yPos += 10;
    
    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // ===== CUSTOMER SECTION =====
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Bill To:', margin, yPos);
    
    yPos += 7;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Customer name
    const customerName = data.customer?.owner ? 
      `${data.customer.owner.firstName || ''} ${data.customer.owner.lastName || ''}`.trim() : 
      'Cash Customer';
    doc.text(customerName, margin, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    // Customer details
    if (data.customer?.owner?.phone) {
      doc.text(`Phone: ${data.customer.owner.phone}`, margin, yPos);
      yPos += 5;
    }
    if (data.customer?.owner?.email) {
      doc.text(`Email: ${data.customer.owner.email}`, margin, yPos);
      yPos += 5;
    }
    if (data.customer?.owner?.address) {
      const addr = data.customer.owner.address;
      const addressText = `${addr.street || ''} ${addr.city || ''} ${addr.state || ''}`.trim();
      if (addressText) {
        doc.text(addressText, margin, yPos);
        yPos += 5;
      }
    }
    
    // Pet info
    if (data.customer?.pet) {
      yPos += 5;
      doc.setTextColor(37, 99, 235);
      doc.text('Pet:', margin, yPos);
      doc.setTextColor(80, 80, 80);
      doc.text(`${data.customer.pet.name} (${data.customer.pet.species} - ${data.customer.pet.breed || 'Mixed'})`, 
        margin + 15, yPos);
    }
    
    yPos += 10;
    
    // ===== ITEMS TABLE =====
    const tableColumns = [
      { header: '#', dataKey: 'sno' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Qty', dataKey: 'qty' },
      { header: 'Rate', dataKey: 'rate' },
      { header: 'Discount', dataKey: 'discount' },
      { header: 'GST', dataKey: 'gst' },
      { header: 'Amount', dataKey: 'amount' }
    ];
    
    const tableRows = [];
    const items = data.items || [];
    
    // Process each item
    items.forEach((item, index) => {
      // Get item details from the actual data structure
      let itemName = item.name || 'Item';
      let qty = item.quantity || 1;
      let rate = item.unitPrice || item.rate || 0;
      
      // Check if item has inventory details (for sales data)
      if (item.inventory) {
        itemName = item.inventory.name || itemName;
        rate = item.price || rate;
      }
      
      const discount = item.discount || 0;
      const discountAmount = item.discountType === 'percentage' ? 
        (qty * rate * discount / 100) : discount;
      const taxable = (qty * rate) - discountAmount;
      const gstRate = item.gst?.rate || item.gstRate || item.tax || 0;
      const gstAmount = gstRate > 0 ? (taxable * gstRate / 100) : 0;
      const total = item.total || (taxable + gstAmount);
      
      tableRows.push({
        sno: (index + 1).toString(),
        description: itemName,
        qty: qty.toString(),
        rate: formatCurrency(rate),
        discount: discount > 0 ? 
          (item.discountType === 'percentage' ? `${discount}%` : formatCurrency(discount)) : 
          '-',
        gst: gstRate > 0 ? `${gstRate}%` : '-',
        amount: formatCurrency(total)
      });
    });
    
    // Add default row if no items
    if (tableRows.length === 0) {
      tableRows.push({
        sno: '1',
        description: 'Service',
        qty: '1',
        rate: formatCurrency(data.totals?.grandTotal || data.totals?.finalAmount || 0),
        discount: '-',
        gst: '-',
        amount: formatCurrency(data.totals?.grandTotal || data.totals?.finalAmount || 0)
      });
    }
    
    // Draw the table
    doc.autoTable({
      columns: tableColumns,
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60]
      },
      columnStyles: {
        sno: { cellWidth: 15, halign: 'center' },
        description: { cellWidth: 'auto' },
        qty: { cellWidth: 20, halign: 'center' },
        rate: { cellWidth: 25, halign: 'right' },
        discount: { cellWidth: 25, halign: 'center' },
        gst: { cellWidth: 20, halign: 'center' },
        amount: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });
    
    // Get position after table
    yPos = doc.lastAutoTable.finalY + 10;
    
    // ===== TOTALS SECTION =====
    const totalsX = pageWidth - margin - 80;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Subtotal
    doc.text('Subtotal:', totalsX, yPos);
    doc.text(formatCurrency(data.totals?.subtotal || 0), pageWidth - margin, yPos, { align: 'right' });
    
    // Discount
    if ((data.totals?.totalDiscount || 0) > 0) {
      yPos += 6;
      doc.setTextColor(34, 197, 94); // Green
      doc.text('Discount:', totalsX, yPos);
      doc.text(`-${formatCurrency(data.totals.totalDiscount)}`, pageWidth - margin, yPos, { align: 'right' });
    }
    
    // GST
    if ((data.totals?.totalGST || data.totals?.totalTax || 0) > 0) {
      yPos += 6;
      doc.setTextColor(60, 60, 60);
      doc.text('GST:', totalsX, yPos);
      doc.text(formatCurrency(data.totals.totalGST || data.totals.totalTax), pageWidth - margin, yPos, { align: 'right' });
    }
    
    // Grand Total
    yPos += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX - 5, yPos - 2, pageWidth - margin, yPos - 2);
    yPos += 4;
    
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Total:', totalsX, yPos);
    doc.text(formatCurrency(data.totals?.grandTotal || data.totals?.finalAmount || 0), 
      pageWidth - margin, yPos, { align: 'right' });
    
    // ===== PAYMENT INFO =====
    yPos += 15;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Information', margin, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    const paymentMethod = (data.payment?.method || 'cash').toUpperCase();
    doc.text(`Method: ${paymentMethod}`, margin, yPos);
    
    yPos += 5;
    const paymentStatus = (data.payment?.status || 'pending').toUpperCase();
    if (paymentStatus === 'PAID') {
      doc.setTextColor(34, 197, 94); // Green
    } else if (paymentStatus === 'PARTIAL') {
      doc.setTextColor(255, 159, 64); // Orange
    } else {
      doc.setTextColor(220, 53, 69); // Red
    }
    doc.text(`Status: ${paymentStatus}`, margin, yPos);
    
    doc.setTextColor(60, 60, 60);
    
    if (data.payment?.paidAmount > 0) {
      yPos += 5;
      doc.text(`Paid: ${formatCurrency(data.payment.paidAmount)}`, margin, yPos);
    }
    
    if (data.payment?.dueAmount > 0) {
      yPos += 5;
      doc.setTextColor(220, 53, 69); // Red
      doc.text(`Due: ${formatCurrency(data.payment.dueAmount)}`, margin, yPos);
    }
    
    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text('Terms: Payment due within 30 days', pageWidth / 2, pageHeight - 25, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    return doc;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
};

// Download PDF function
export const downloadPDF = (data) => {
  try {
    console.log('Downloading PDF for:', data);
    const doc = generatePDF(data);
    const filename = `Invoice_${data.invoiceNumber || data.saleNumber || 'DRAFT'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Get PDF as blob
export const getPDFBlob = (data) => {
  try {
    const doc = generatePDF(data);
    return doc.output('blob');
  } catch (error) {
    console.error('Failed to generate PDF blob:', error);
    throw error;
  }
};

// Get PDF as data URL
export const getPDFDataURL = (data) => {
  try {
    const doc = generatePDF(data);
    return doc.output('datauristring');
  } catch (error) {
    console.error('Failed to generate PDF data URL:', error);
    throw error;
  }
};

// Test function with sample data
export const testPDF = () => {
  const testData = {
    invoiceNumber: 'INV-TEST-001',
    invoiceDate: new Date(),
    saleNumber: 'SALE-TEST-001',
    customer: {
      owner: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+91 98765 43210',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra'
        }
      },
      pet: {
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever'
      }
    },
    items: [
      {
        name: 'Pet Grooming Service',
        quantity: 1,
        unitPrice: 500,
        discount: 50,
        discountType: 'amount',
        gst: { rate: 18 },
        total: 531
      },
      {
        name: 'Dog Food - Premium 5kg',
        quantity: 2,
        unitPrice: 800,
        discount: 10,
        discountType: 'percentage',
        gst: { rate: 5 },
        total: 1512
      }
    ],
    totals: {
      subtotal: 2100,
      totalDiscount: 210,
      totalGST: 171,
      grandTotal: 2061,
      finalAmount: 2061
    },
    payment: {
      method: 'UPI',
      status: 'paid',
      paidAmount: 2061,
      dueAmount: 0
    }
  };
  
  return downloadPDF(testData);
};
