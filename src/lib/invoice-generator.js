import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Load saved invoice settings
const getInvoiceSettings = () => {
  const savedSettings = localStorage.getItem('invoiceSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  
  // Default settings
  return {
    company: {
      name: 'PetCare Solutions',
      address: '123 Pet Street, Animal City, AC 12345',
      phone: '+91 98765 43210',
      email: 'info@petcare.com',
      website: 'www.petcare.com',
      gstin: '22AAAAA0000A1Z5',
      pan: 'AAAAA0000A'
    },
    invoice: {
      prefix: 'INV',
      startNumber: 1001,
      terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
      footer: 'Thank you for choosing PetCare Solutions!',
      currency: '₹',
      currencyCode: 'INR'
    },
    design: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      logo: null,
      showLogo: true,
      showGST: true,
      showTerms: true,
      showFooter: true
    }
  };
};

// Convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Format currency with proper rupee symbol
const formatCurrency = (amount, currency = '₹') => {
  // Use Unicode escape sequence for Rupee symbol to ensure proper rendering
  const rupeeSymbol = '\u20B9';
  return `${rupeeSymbol}${parseFloat(amount).toFixed(2)}`;
};

// Generate invoice number
const generateInvoiceNumber = (prefix, startNumber) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${prefix}-${year}${month}-${String(startNumber).padStart(4, '0')}`;
};

// Debug function to test PDF generation
export const testPDFGeneration = () => {
  const testSaleData = {
    saleNumber: 'TEST-001',
    saleDate: new Date().toISOString(),
    customer: {
      owner: {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345'
        },
        phone: '+91 98765 43210',
        email: 'john.doe@example.com'
      },
      pet: {
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3
      }
    },
    items: [
      {
        name: 'Pet Grooming Service',
        sku: 'PGS001',
        quantity: 1,
        unitPrice: 500,
        discount: 50,
        discountType: 'amount',
        gst: {
          isApplicable: true,
          rate: 18
        },
        total: 450
      },
      {
        name: 'Pet Food - Premium',
        sku: 'PF001',
        quantity: 2,
        unitPrice: 200,
        discount: 0,
        discountType: 'amount',
        gst: {
          isApplicable: true,
          rate: 5
        },
        total: 400
      }
    ],
    totals: {
      subtotal: 900,
      totalDiscount: 50,
      totalTaxable: 850,
      totalGST: 101,
      grandTotal: 951
    },
    payment: {
      method: 'cash',
      status: 'paid',
      paidAmount: 951,
      dueAmount: 0
    }
  };

  console.log('Testing PDF generation with sample data:', testSaleData);
  return downloadInvoice(testSaleData);
};

// Generate PDF invoice using HTML to PDF conversion
export const generateInvoicePDF = async (saleData) => {
  try {
    // Try html2pdf first for better formatting
    const htmlContent = generateInvoiceHTML(saleData);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);
    
    // Dynamic import of html2pdf
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Invoice-${saleData.saleNumber}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };
    
    // Generate and download PDF
    await html2pdf().set(opt).from(container).save();
    
    // Clean up
    document.body.removeChild(container);
    
    return true;
  } catch (error) {
    console.error('Error with html2pdf, falling back to jsPDF:', error);
    
    // Fallback to jsPDF if html2pdf fails
    try {
      const doc = generateInvoicePDFFallback(saleData);
      const filename = `Invoice-${saleData.saleNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      return true;
    } catch (fallbackError) {
      console.error('Error with jsPDF fallback:', fallbackError);
      return false;
    }
  }
};

// Fallback PDF generation using jsPDF
const generateInvoicePDFFallback = (saleData) => {
  const settings = getInvoiceSettings();
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice - ${saleData.saleNumber}`,
    subject: 'Invoice',
    author: settings.company.name,
    creator: 'TailTally Pet Care'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

  // Add some debugging
  console.log('Generating PDF with data:', {
    saleNumber: saleData.saleNumber,
    itemsCount: saleData.items?.length,
    customerName: saleData.customer?.owner?.firstName
  });

  // Header - Company Information (Left Side)
  const headerY = yPosition;
  
  // Company Information
  const primaryColor = hexToRgb(settings.design.primaryColor);
  if (primaryColor) {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  }
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.company.name, margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  // Split address if too long
  const addressLines = doc.splitTextToSize(settings.company.address, contentWidth * 0.4);
  doc.text(addressLines, margin, yPosition);
  yPosition += (addressLines.length * 5);
  
  yPosition += 3;
  doc.text(`Phone: ${settings.company.phone}`, margin, yPosition);
  
  yPosition += 5;
  doc.text(`Email: ${settings.company.email}`, margin, yPosition);
  
  if (settings.company.website) {
    yPosition += 5;
    doc.text(`Website: ${settings.company.website}`, margin, yPosition);
  }

  // Invoice Title and Number (Right Side)
  yPosition = headerY;
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  if (primaryColor) {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  }
  doc.text('INVOICE', pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const invoiceNumber = generateInvoiceNumber(settings.invoice.prefix, settings.invoice.startNumber);
  doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 6;
  doc.text(`Date: ${new Date(saleData.saleDate).toLocaleDateString()}`, pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 6;
  doc.text(`Sale #: ${saleData.saleNumber}`, pageWidth - margin, yPosition, { align: 'right' });

  // Customer Information Section
  const customerSectionY = Math.max(yPosition + 15, 100);
  yPosition = customerSectionY;
  
  // Bill To Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Bill To:', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const customerName = `${saleData.customer?.owner?.firstName || ''} ${saleData.customer?.owner?.lastName || ''}`.trim();
  doc.text(customerName, margin, yPosition);
  
  if (saleData.customer?.owner?.address) {
    yPosition += 5;
    const address = saleData.customer.owner.address;
    const addressText = `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.postalCode || ''}`;
    const addressLines = doc.splitTextToSize(addressText, contentWidth * 0.4);
    doc.text(addressLines, margin, yPosition);
    yPosition += (addressLines.length * 5);
  }
  
  if (saleData.customer?.owner?.phone) {
    yPosition += 5;
    doc.text(`Phone: ${saleData.customer.owner.phone}`, margin, yPosition);
  }
  
  if (saleData.customer?.owner?.email) {
    yPosition += 5;
    doc.text(`Email: ${saleData.customer.owner.email}`, margin, yPosition);
  }

  // Pet Information (if available) - Right side of customer section
  if (saleData.customer?.pet) {
    yPosition = customerSectionY;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Pet Information:', pageWidth - margin - 80, yPosition);
    
    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const petName = saleData.customer.pet.name;
    const petDetails = `${saleData.customer.pet.species || ''} • ${saleData.customer.pet.breed || ''}`;
    doc.text(`${petName} (${petDetails})`, pageWidth - margin - 80, yPosition);
  }

  // Items Table
  yPosition += 25;
  const tableY = yPosition;
  
  const tableData = saleData.items?.map(item => [
    item.name,
    item.sku || 'N/A',
    item.quantity.toString(),
    formatCurrency(item.unitPrice, settings.invoice.currency),
    item.discount > 0 ? 
      (item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount, settings.invoice.currency)) : 
      '-',
    item.gst?.isApplicable ? `${item.gst.rate || 0}%` : '-',
    formatCurrency(item.total, settings.invoice.currency)
  ]) || [];

  const secondaryColor = hexToRgb(settings.design.secondaryColor);
  const headerColor = secondaryColor ? [secondaryColor.r, secondaryColor.g, secondaryColor.b] : [80, 80, 80];

  autoTable(doc, {
    startY: tableY,
    head: [['Item', 'SKU', 'Qty', 'Unit Price', 'Discount', 'GST', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: headerColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      0: { cellWidth: 50, cellPadding: 5, overflow: 'linebreak' },
      1: { cellWidth: 25, cellPadding: 5, overflow: 'linebreak', halign: 'center' },
      2: { cellWidth: 15, halign: 'center', cellPadding: 5 },
      3: { cellWidth: 25, halign: 'right', cellPadding: 5 },
      4: { cellWidth: 20, halign: 'center', cellPadding: 5 },
      5: { cellWidth: 15, halign: 'center', cellPadding: 5 },
      6: { cellWidth: 25, halign: 'right', cellPadding: 5 }
    },
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    styles: {
      overflow: 'linebreak',
      cellWidth: 'auto',
      cellPadding: 5
    }
  });

  // Totals Section
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : yPosition + 80;
  yPosition = finalY;
  
  const totalsX = pageWidth - margin - 100;
  const totalsWidth = 80;
  
  // Draw totals box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(totalsX - 5, yPosition - 5, totalsWidth + 10, 100, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  // Subtotal
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(formatCurrency(saleData.totals?.subtotal || 0, settings.invoice.currency), totalsX + totalsWidth, yPosition, { align: 'right' });
  
  // Total Discount
  if (saleData.totals?.totalDiscount > 0) {
    yPosition += 7;
    doc.setTextColor(0, 128, 0);
    doc.text('Discount:', totalsX, yPosition);
    doc.text(`-${formatCurrency(saleData.totals.totalDiscount, settings.invoice.currency)}`, totalsX + totalsWidth, yPosition, { align: 'right' });
    doc.setTextColor(60, 60, 60);
  }
  
  // Taxable Amount
  yPosition += 7;
  doc.text('Taxable:', totalsX, yPosition);
  doc.text(formatCurrency(saleData.totals?.totalTaxable || 0, settings.invoice.currency), totalsX + totalsWidth, yPosition, { align: 'right' });
  
  // Total GST
  if (saleData.totals?.totalGST > 0) {
    yPosition += 7;
    doc.text('GST:', totalsX, yPosition);
    doc.text(formatCurrency(saleData.totals.totalGST, settings.invoice.currency), totalsX + totalsWidth, yPosition, { align: 'right' });
  }
  
  // Grand Total
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  if (primaryColor) {
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  } else {
    doc.setTextColor(0, 0, 0);
  }
  doc.text('Grand Total:', totalsX, yPosition);
  doc.text(formatCurrency(saleData.totals?.grandTotal || 0, settings.invoice.currency), totalsX + totalsWidth, yPosition, { align: 'right' });

  // Payment Information
  yPosition += 25;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Payment Information:', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Method: ${saleData.payment?.method?.replace('_', ' ').toUpperCase()}`, margin, yPosition);
  
  yPosition += 5;
  doc.text(`Status: ${saleData.payment?.status?.toUpperCase()}`, margin, yPosition);
  
  if (saleData.payment?.paidAmount > 0) {
    yPosition += 5;
    doc.text(`Paid Amount: ${formatCurrency(saleData.payment.paidAmount, settings.invoice.currency)}`, margin, yPosition);
  }
  
  if (saleData.payment?.dueAmount > 0) {
    yPosition += 5;
    doc.setTextColor(220, 0, 0);
    doc.text(`Due Amount: ${formatCurrency(saleData.payment.dueAmount, settings.invoice.currency)}`, margin, yPosition);
    doc.setTextColor(60, 60, 60);
  }

  // GST Information
  if (settings.design.showGST && settings.company.gstin) {
    yPosition += 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`GSTIN: ${settings.company.gstin}`, margin, yPosition);
    
    yPosition += 5;
    doc.text(`PAN: ${settings.company.pan}`, margin, yPosition);
  }

  // Terms and Conditions
  if (settings.design.showTerms && settings.invoice.terms) {
    yPosition += 25;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Terms & Conditions:', margin, yPosition);
    
    yPosition += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    // Split terms into multiple lines if needed
    const termsLines = doc.splitTextToSize(settings.invoice.terms, contentWidth);
    doc.text(termsLines, margin, yPosition);
  }

  // Footer
  if (settings.design.showFooter && settings.invoice.footer) {
    const footerY = pageHeight - 30;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(settings.invoice.footer, pageWidth / 2, footerY, { align: 'center' });
  }

  // Page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  return doc;
};

// Download invoice as PDF
export const downloadInvoice = async (saleData) => {
  try {
    // Validate input data
    if (!saleData) {
      console.error('No sale data provided');
      return false;
    }

    if (!saleData.saleNumber) {
      console.error('Sale number is missing');
      return false;
    }

    if (!saleData.items || saleData.items.length === 0) {
      console.error('No items found in sale data');
      return false;
    }

    console.log('Starting PDF generation for sale:', saleData.saleNumber);
    const success = await generateInvoicePDF(saleData);
    
    if (success) {
      console.log('PDF generated successfully');
    } else {
      console.error('PDF generation failed');
    }
    
    return success;
  } catch (error) {
    console.error('Error in downloadInvoice:', error);
    return false;
  }
};

// Generate invoice HTML for preview and PDF conversion
export const generateInvoiceHTML = (saleData) => {
  const settings = getInvoiceSettings();
  const invoiceNumber = generateInvoiceNumber(settings.invoice.prefix, settings.invoice.startNumber);
  
  // Use Unicode escape sequence for Rupee symbol in HTML
  const rupeeSymbol = '\u20B9';
  
  // Validate and provide defaults for missing data
  const customerName = `${saleData.customer?.owner?.firstName || 'N/A'} ${saleData.customer?.owner?.lastName || ''}`.trim();
  const saleDate = saleData.saleDate ? new Date(saleData.saleDate).toLocaleDateString() : new Date().toLocaleDateString();
  const items = saleData.items || [];
  const totals = saleData.totals || {
    subtotal: 0,
    totalDiscount: 0,
    totalTaxable: 0,
    totalGST: 0,
    grandTotal: 0
  };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${saleData.saleNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: white;
          color: #333;
          line-height: 1.6;
        }
        
        .invoice-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 0;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 3px solid ${settings.design.primaryColor};
          padding-bottom: 20px;
          background: linear-gradient(135deg, ${settings.design.primaryColor}08, ${settings.design.primaryColor}02);
          border-radius: 8px;
          padding: 25px 20px 20px 20px;
          margin-bottom: 40px;
        }
        
        .company-info h2 {
          color: ${settings.design.primaryColor};
          margin: 0 0 15px 0;
          font-size: 28px;
          font-weight: bold;
        }
        
        .company-info p {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h1 {
          color: ${settings.design.primaryColor};
          margin: 0 0 15px 0;
          font-size: 32px;
          font-weight: bold;
        }
        
        .invoice-title p {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }
        
        .customer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }
        
        .customer-info h3 {
          color: #333;
          margin: 0 0 15px 0;
          font-size: 18px;
          font-weight: bold;
        }
        
        .customer-info p {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }
        
        .customer-info strong {
          color: #333;
          font-weight: 600;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          font-size: 14px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th {
          background: linear-gradient(135deg, ${settings.design.secondaryColor}, ${settings.design.primaryColor});
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        td {
          padding: 15px 12px;
          border-bottom: 1px solid #eee;
          vertical-align: top;
        }
        
        tbody tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        tbody tr:hover {
          background-color: #e9ecef;
        }
        
        .item-name {
          font-weight: 600;
          color: #333;
        }
        
        .item-description {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-right {
          text-align: right;
        }
        
        .totals {
          text-align: right;
          margin-top: 30px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #dee2e6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .totals div {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          max-width: 350px;
          margin-left: auto;
          font-size: 14px;
          padding: 5px 0;
        }
        
        .grand-total {
          font-size: 20px;
          font-weight: bold;
          color: ${settings.design.primaryColor};
          border-top: 2px solid ${settings.design.primaryColor};
          padding-top: 15px;
          margin-top: 15px;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        
        .terms {
          margin-top: 40px;
          padding: 25px;
          background: linear-gradient(135deg, #f9f9f9, #f1f3f4);
          border-radius: 12px;
          border-left: 6px solid ${settings.design.primaryColor};
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .terms h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          font-weight: bold;
        }
        
        .terms p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .payment-info {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 12px;
          border: 1px solid #dee2e6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .payment-info h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          font-weight: bold;
        }
        
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .payment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        
        .payment-item:last-child {
          border-bottom: none;
        }
        
        .payment-label {
          font-weight: 600;
          color: #333;
        }
        
        .payment-value {
          font-weight: 600;
        }
        
        .payment-value.paid {
          color: #059669;
        }
        
        .payment-value.due {
          color: #dc2626;
        }
        
        .gst-info {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        
        @media print {
          body {
            background-color: white;
          }
          
          .invoice-container {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            ${settings.design.showLogo && settings.design.logo ? 
              `<img src="${settings.design.logo}" alt="Logo" style="height: 60px; margin-bottom: 15px;">` : ''
            }
            <h2>${settings.company.name}</h2>
            <p>${settings.company.address}</p>
            <p>Phone: ${settings.company.phone}</p>
            <p>Email: ${settings.company.email}</p>
            ${settings.company.website ? `<p>Website: ${settings.company.website}</p>` : ''}
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>Invoice #: ${invoiceNumber}</p>
            <p>Date: ${saleDate}</p>
            <p>Sale #: ${saleData.saleNumber || 'N/A'}</p>
          </div>
        </div>

        <div class="customer-section">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${customerName}</strong></p>
            ${saleData.customer?.owner?.address ? 
              `<p>${saleData.customer.owner.address.street || ''}, ${saleData.customer.owner.address.city || ''}</p>
               <p>${saleData.customer.owner.address.state || ''} ${saleData.customer.owner.address.postalCode || ''}</p>` : 
              '<p>Address not provided</p>'
            }
            ${saleData.customer?.owner?.phone ? `<p>Phone: ${saleData.customer.owner.phone}</p>` : ''}
            ${saleData.customer?.owner?.email ? `<p>Email: ${saleData.customer.owner.email}</p>` : ''}
          </div>
          ${saleData.customer?.pet ? `
            <div class="customer-info">
              <h3>Pet Information:</h3>
              <p><strong>${saleData.customer.pet.name}</strong></p>
              <p>${saleData.customer.pet.species || ''} • ${saleData.customer.pet.breed || ''}</p>
              ${saleData.customer.pet.age ? `<p>Age: ${saleData.customer.pet.age} years</p>` : ''}
            </div>
          ` : `
            <div class="customer-info">
              <h3>Service Information:</h3>
              <p>General Pet Care Services</p>
            </div>
          `}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-center">Discount</th>
              <th class="text-center">GST</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.length > 0 ? items.map(item => `
              <tr>
                <td>
                  <div class="item-name">${item.name || 'Unnamed Item'}</div>
                  ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </td>
                <td>${item.sku || 'N/A'}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">${rupeeSymbol}${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                <td class="text-center">
                  ${(item.discount || 0) > 0 ? 
                    (item.discountType === 'percentage' ? `${item.discount}%` : `${rupeeSymbol}${parseFloat(item.discount).toFixed(2)}`) : 
                    '-'
                  }
                </td>
                <td class="text-center">
                  ${item.gst?.isApplicable ? `${item.gst.rate || 0}%` : '-'}
                </td>
                <td class="text-right">
                  <strong>${rupeeSymbol}${parseFloat(item.total || 0).toFixed(2)}</strong>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" class="text-center" style="padding: 40px; color: #666;">
                  No items found in this invoice
                </td>
              </tr>
            `}
          </tbody>
        </table>

        <div class="totals">
          <div>
            <span>Subtotal:</span>
            <span>${rupeeSymbol}${parseFloat(totals.subtotal).toFixed(2)}</span>
          </div>
          ${totals.totalDiscount > 0 ? `
            <div style="color: #059669;">
              <span>Total Discount:</span>
              <span>-${rupeeSymbol}${parseFloat(totals.totalDiscount).toFixed(2)}</span>
            </div>
          ` : ''}
          <div>
            <span>Taxable Amount:</span>
            <span>${rupeeSymbol}${parseFloat(totals.totalTaxable).toFixed(2)}</span>
          </div>
          ${totals.totalGST > 0 ? `
            <div>
              <span>Total GST:</span>
              <span>${rupeeSymbol}${parseFloat(totals.totalGST).toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="grand-total">
            <span>Grand Total:</span>
            <span>${rupeeSymbol}${parseFloat(totals.grandTotal).toFixed(2)}</span>
          </div>
        </div>

        <div class="payment-info">
          <h3>Payment Information:</h3>
          <div class="payment-grid">
            <div class="payment-item">
              <span class="payment-label">Method:</span>
              <span class="payment-value">${(saleData.payment?.method || 'cash').replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="payment-item">
              <span class="payment-label">Status:</span>
              <span class="payment-value">${(saleData.payment?.status || 'pending').toUpperCase()}</span>
            </div>
            <div class="payment-item">
              <span class="payment-label">Paid Amount:</span>
              <span class="payment-value paid">${rupeeSymbol}${parseFloat(saleData.payment?.paidAmount || 0).toFixed(2)}</span>
            </div>
            <div class="payment-item">
              <span class="payment-label">Due Amount:</span>
              <span class="payment-value due">${rupeeSymbol}${parseFloat(saleData.payment?.dueAmount || totals.grandTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${settings.design.showGST && settings.company.gstin ? `
          <div class="gst-info">
            <p>GSTIN: ${settings.company.gstin} | PAN: ${settings.company.pan}</p>
          </div>
        ` : ''}

        ${settings.design.showTerms && settings.invoice.terms ? `
          <div class="terms">
            <h4>Terms & Conditions:</h4>
            <p>${settings.invoice.terms}</p>
          </div>
        ` : ''}

        ${settings.design.showFooter && settings.invoice.footer ? `
          <div class="footer">
            ${settings.invoice.footer}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};
