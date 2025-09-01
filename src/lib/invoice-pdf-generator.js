// Import jsPDF and autoTable for the functions below
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Re-export all functions from the new working invoice generator
export * from './invoice-generator-new';

// Import specific functions for backward compatibility
import { generatePDF, downloadPDF, getPDFBlob, getPDFDataURL, testPDF } from './invoice-generator-new';

// Helper function to format currency
const formatCurrency = (amount) => {
  return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Get invoice settings from localStorage
const getInvoiceSettings = () => {
  const defaultSettings = {
    company: {
      name: 'TailTally Pet Care Solutions',
      address: '123 Pet Street, Animal City, AC 12345',
      phone: '+91 98765 43210',
      email: 'info@tailtally.com',
      website: 'www.tailtally.com',
      gstin: '22AAAAA0000A1Z5',
      pan: 'AAAAA0000A'
    },
    invoice: {
      prefix: 'INV',
      terms: 'Payment is due within 30 days of invoice date.',
      footer: 'Thank you for your business!',
      notes: 'All disputes are subject to local jurisdiction.'
    },
    design: {
      primaryColor: [37, 99, 235], // Blue
      secondaryColor: [100, 116, 139], // Slate
      accentColor: [34, 197, 94] // Green
    }
  };

  try {
    const savedSettings = localStorage.getItem('invoiceSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Merge with defaults to ensure all properties exist
      return {
        company: { ...defaultSettings.company, ...(parsed.company || {}) },
        invoice: { ...defaultSettings.invoice, ...(parsed.invoice || {}) },
        design: { 
          primaryColor: parsed.design?.primaryColor || defaultSettings.design.primaryColor,
          secondaryColor: parsed.design?.secondaryColor || defaultSettings.design.secondaryColor,
          accentColor: parsed.design?.accentColor || defaultSettings.design.accentColor
        }
      };
    }
  } catch (error) {
    console.warn('Error loading invoice settings, using defaults:', error);
  }
  
  return defaultSettings;
};

// Main PDF generation function
export const generateInvoicePDF = (invoiceData) => {
  try {
    const settings = getInvoiceSettings();
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Document metadata
    doc.setProperties({
      title: `Invoice ${invoiceData.invoiceNumber || 'INV-001'}`,
      subject: 'Invoice',
      author: settings.company.name,
      creator: 'TailTally'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let yPos = margin;

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 30) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // ========== HEADER SECTION ==========
    // Company Logo/Name
    doc.setFontSize(22);
    doc.setTextColor(...settings.design.primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.company.name, margin, yPos);
    
    // Invoice Title (right aligned)
    doc.setFontSize(28);
    doc.setTextColor(...settings.design.primaryColor);
    doc.text('INVOICE', pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 10;
    
    // Company Details (left side)
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.company.address, margin, yPos);
    yPos += 4;
    doc.text(`Phone: ${settings.company.phone}`, margin, yPos);
    yPos += 4;
    doc.text(`Email: ${settings.company.email}`, margin, yPos);
    yPos += 4;
    if (settings.company.website) {
      doc.text(`Website: ${settings.company.website}`, margin, yPos);
      yPos += 4;
    }
    
    // Invoice Details (right side)
    let rightYPos = yPos - 12;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number:', pageWidth - margin - 50, rightYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber || 'INV-001', pageWidth - margin, rightYPos, { align: 'right' });
    
    rightYPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date:', pageWidth - margin - 50, rightYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(invoiceData.invoiceDate || new Date()), pageWidth - margin, rightYPos, { align: 'right' });
    
    rightYPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Due Date:', pageWidth - margin - 50, rightYPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(invoiceData.dueDate || new Date()), pageWidth - margin, rightYPos, { align: 'right' });
    
    if (invoiceData.saleNumber) {
      rightYPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Sale Reference:', pageWidth - margin - 50, rightYPos);
      doc.setFont('helvetica', 'normal');
      doc.text(invoiceData.saleNumber, pageWidth - margin, rightYPos, { align: 'right' });
    }
    
    // GST Details
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    if (settings.company.gstin) {
      doc.text(`GSTIN: ${settings.company.gstin}`, margin, yPos);
      yPos += 4;
    }
    if (settings.company.pan) {
      doc.text(`PAN: ${settings.company.pan}`, margin, yPos);
    }
    
    yPos += 10;
    
    // ========== BILLING SECTION ==========
    // Draw a separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    // Bill To Section
    doc.setFontSize(12);
    doc.setTextColor(...settings.design.primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', margin, yPos);
    
    yPos += 6;
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    
    // Customer Name
    const customerName = invoiceData.customer?.owner ? 
      `${invoiceData.customer.owner.firstName || ''} ${invoiceData.customer.owner.lastName || ''}`.trim() :
      (invoiceData.customer?.details?.name || 'Cash Customer');
    doc.text(customerName, margin, yPos);
    
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Customer Address
    if (invoiceData.customer?.owner?.address) {
      const addr = invoiceData.customer.owner.address;
      const addressText = `${addr.street || ''} ${addr.city || ''} ${addr.state || ''} ${addr.zipCode || ''}`.trim();
      if (addressText) {
        const addressLines = doc.splitTextToSize(addressText, 80);
        addressLines.forEach(line => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
      }
    } else if (invoiceData.customer?.details?.address) {
      doc.text(invoiceData.customer.details.address, margin, yPos);
      yPos += 4;
    }
    
    // Customer Contact
    if (invoiceData.customer?.owner?.phone || invoiceData.customer?.details?.phone) {
      doc.text(`Phone: ${invoiceData.customer?.owner?.phone || invoiceData.customer?.details?.phone}`, margin, yPos);
      yPos += 4;
    }
    if (invoiceData.customer?.owner?.email || invoiceData.customer?.details?.email) {
      doc.text(`Email: ${invoiceData.customer?.owner?.email || invoiceData.customer?.details?.email}`, margin, yPos);
      yPos += 4;
    }
    
    // Pet Information (if available)
    if (invoiceData.customer?.pet) {
      yPos += 4;
      doc.setFontSize(10);
      doc.setTextColor(...settings.design.primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('PET DETAILS:', margin, yPos);
      
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const pet = invoiceData.customer.pet;
      doc.text(`${pet.name} - ${pet.species} (${pet.breed || 'Mixed'})`, margin, yPos);
      if (pet.age) {
        yPos += 4;
        doc.text(`Age: ${pet.age} years`, margin, yPos);
      }
    }
    
    yPos += 10;
    
    // ========== ITEMS TABLE ==========
    checkNewPage(50);
    
    // Prepare table data
    const tableColumns = ['#', 'Description', 'HSN/SAC', 'Qty', 'Rate', 'Disc.', 'Taxable', 'GST', 'Amount'];
    
    const tableRows = [];
    let items = [];
    
    // Use invoice items if available, otherwise use sale items
    if (invoiceData.items && invoiceData.items.length > 0) {
      items = invoiceData.items;
    } else if (invoiceData.sale?.items && invoiceData.sale.items.length > 0) {
      items = invoiceData.sale.items;
    }
    
    items.forEach((item, index) => {
      const qty = item.quantity || 1;
      const rate = item.unitPrice || item.rate || 0;
      const discount = item.discount || 0;
      const discountAmount = item.discountType === 'percentage' ? 
        (qty * rate * discount / 100) : discount;
      const taxable = (qty * rate) - discountAmount;
      const gstRate = item.gst?.rate || item.gstRate || 0;
      const gstAmount = gstRate > 0 ? (taxable * gstRate / 100) : 0;
      const total = taxable + gstAmount;
      
      tableRows.push([
        (index + 1).toString(),
        item.name || item.description || 'Item',
        item.sku || item.hsnCode || item.sacCode || '-',
        qty.toString(),
        formatCurrency(rate),
        discount > 0 ? (item.discountType === 'percentage' ? `${discount}%` : formatCurrency(discount)) : '-',
        formatCurrency(taxable),
        gstRate > 0 ? `${gstRate}%` : '-',
        formatCurrency(total)
      ]);
    });
    
    // Add a default row if no items
    if (tableRows.length === 0) {
      tableRows.push([
        '1',
        'Service Charge',
        '-',
        '1',
        formatCurrency(invoiceData.totals?.finalAmount || 0),
        '-',
        formatCurrency(invoiceData.totals?.finalAmount || 0),
        '-',
        formatCurrency(invoiceData.totals?.finalAmount || 0)
      ]);
    }
    
    // Draw the table using autoTable
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: yPos,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: {
        fillColor: settings.design.primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 'auto' },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'center', cellWidth: 12 },
        4: { halign: 'right', cellWidth: 20 },
        5: { halign: 'center', cellWidth: 15 },
        6: { halign: 'right', cellWidth: 22 },
        7: { halign: 'center', cellWidth: 15 },
        8: { halign: 'right', cellWidth: 25 }
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      didDrawPage: function(data) {
        // Footer on each page
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // ========== TOTALS SECTION ==========
    checkNewPage(60);
    
    // Draw totals box on the right
    const totalsX = pageWidth - margin - 70;
    const totalsWidth = 70;
    
    // Background for totals
    doc.setFillColor(248, 249, 250);
    doc.rect(totalsX - 5, yPos - 5, totalsWidth + 5, 55, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    // Subtotal
    doc.text('Subtotal:', totalsX, yPos);
    doc.text(formatCurrency(invoiceData.totals?.subtotal || invoiceData.totals?.finalAmount || 0), 
      totalsX + totalsWidth - 5, yPos, { align: 'right' });
    yPos += 6;
    
    // Discount
    if ((invoiceData.totals?.totalDiscount || 0) > 0) {
      const accentColor = settings.design?.accentColor || [34, 197, 94];
      doc.setTextColor(...accentColor);
      doc.text('Discount:', totalsX, yPos);
      doc.text(`-${formatCurrency(invoiceData.totals.totalDiscount)}`, 
        totalsX + totalsWidth - 5, yPos, { align: 'right' });
      yPos += 6;
      doc.setTextColor(60, 60, 60);
    }
    
    // Taxable Amount
    doc.text('Taxable:', totalsX, yPos);
    doc.text(formatCurrency(invoiceData.totals?.taxableAmount || invoiceData.totals?.totalTaxable || 0), 
      totalsX + totalsWidth - 5, yPos, { align: 'right' });
    yPos += 6;
    
    // GST
    if ((invoiceData.totals?.totalGST || 0) > 0) {
      doc.text('GST:', totalsX, yPos);
      doc.text(formatCurrency(invoiceData.totals.totalGST), 
        totalsX + totalsWidth - 5, yPos, { align: 'right' });
      yPos += 6;
    }
    
    // Draw line above grand total
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(totalsX, yPos, totalsX + totalsWidth - 5, yPos);
    yPos += 4;
    
    // Grand Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...settings.design.primaryColor);
    doc.text('GRAND TOTAL:', totalsX, yPos);
    doc.text(formatCurrency(invoiceData.totals?.finalAmount || invoiceData.totals?.grandTotal || 0), 
      totalsX + totalsWidth - 5, yPos, { align: 'right' });
    
    // ========== PAYMENT INFORMATION ==========
    yPos += 15;
    checkNewPage(40);
    
    doc.setFontSize(11);
    doc.setTextColor(...settings.design.primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT INFORMATION', margin, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Payment Method
    doc.text(`Payment Method: ${(invoiceData.payment?.method || 'Cash').toUpperCase()}`, margin, yPos);
    yPos += 5;
    
    // Payment Status
    const paymentStatus = invoiceData.payment?.status || 'pending';
    doc.setFont('helvetica', 'bold');
    if (paymentStatus === 'paid') {
      const accentColor = settings.design?.accentColor || [34, 197, 94];
      doc.setTextColor(...accentColor);
    } else if (paymentStatus === 'partial') {
      doc.setTextColor(255, 159, 64);
    } else {
      doc.setTextColor(220, 53, 69);
    }
    doc.text(`Payment Status: ${paymentStatus.toUpperCase()}`, margin, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Paid Amount
    if (invoiceData.payment?.paidAmount > 0) {
      doc.text(`Paid Amount: ${formatCurrency(invoiceData.payment.paidAmount)}`, margin, yPos);
      yPos += 5;
    }
    
    // Due Amount
    if (invoiceData.payment?.dueAmount > 0) {
      doc.setTextColor(220, 53, 69);
      doc.setFont('helvetica', 'bold');
      doc.text(`Due Amount: ${formatCurrency(invoiceData.payment.dueAmount)}`, margin, yPos);
      yPos += 5;
    }
    
    // ========== TERMS & CONDITIONS ==========
    if (settings.invoice.terms) {
      yPos += 10;
      checkNewPage(30);
      
      doc.setFontSize(10);
      doc.setTextColor(...settings.design.primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('TERMS & CONDITIONS', margin, yPos);
      
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      const termsLines = doc.splitTextToSize(settings.invoice.terms, pageWidth - (2 * margin));
      termsLines.forEach(line => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
    }
    
    // ========== FOOTER ==========
    if (settings.invoice.footer) {
      // Position footer at bottom of page
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'italic');
      doc.text(settings.invoice.footer, pageWidth / 2, pageHeight - 15, { align: 'center' });
    }
    
    // ========== NOTES ==========
    if (settings.invoice.notes) {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text(settings.invoice.notes, pageWidth / 2, pageHeight - 20, { align: 'center' });
    }
    
    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Export function to download the invoice
export const downloadInvoicePDF = async (invoiceData) => {
  try {
    console.log('Generating invoice PDF with data:', invoiceData);
    
    // Validate data
    if (!invoiceData) {
      throw new Error('No invoice data provided');
    }
    
    // Generate the PDF
    const doc = generateInvoicePDF(invoiceData);
    
    // Generate filename
    const filename = `Invoice_${invoiceData.invoiceNumber || 'DRAFT'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('Invoice PDF generated successfully:', filename);
    return true;
  } catch (error) {
    console.error('Failed to generate invoice PDF:', error);
    return false;
  }
};

// Export function for testing
export const testInvoicePDF = () => {
  const testData = {
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    saleNumber: 'SALE-2024-001',
    customer: {
      owner: {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        phone: '+91 98765 43210',
        email: 'john.doe@example.com'
      },
      pet: {
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3
      }
    },
    items: [
      {
        name: 'Pet Grooming Service - Full Package',
        sku: 'GRM-001',
        quantity: 1,
        unitPrice: 1500,
        discount: 10,
        discountType: 'percentage',
        gst: { rate: 18, isApplicable: true },
        total: 1593
      },
      {
        name: 'Premium Dog Food - 5kg',
        sku: 'PDF-005',
        quantity: 2,
        unitPrice: 800,
        discount: 0,
        discountType: 'amount',
        gst: { rate: 5, isApplicable: true },
        total: 1680
      },
      {
        name: 'Pet Vaccination - Rabies',
        sku: 'VAC-RAB',
        quantity: 1,
        unitPrice: 500,
        discount: 0,
        discountType: 'amount',
        gst: { rate: 18, isApplicable: true },
        total: 590
      }
    ],
    totals: {
      subtotal: 3800,
      totalDiscount: 150,
      taxableAmount: 3650,
      totalGST: 213,
      finalAmount: 3863
    },
    payment: {
      method: 'upi',
      status: 'partial',
      paidAmount: 2000,
      dueAmount: 1863
    }
  };
  
  return downloadInvoicePDF(testData);
};
