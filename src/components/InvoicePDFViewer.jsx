import React, { useState, useEffect, useRef } from 'react';
import { downloadPDF, getPDFBlob, getPDFDataURL } from '../lib/pdf-invoice';
import { Eye, Download, X, Printer, Mail, Share2 } from 'lucide-react';

const InvoicePDFViewer = ({ invoiceData, isOpen, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // Generate PDF preview when modal opens
  useEffect(() => {
    if (isOpen && invoiceData) {
      generatePreview();
    }
    
    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, invoiceData]);

  const generatePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const blob = getPDFBlob(invoiceData);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        setError('Failed to generate PDF preview');
      }
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Error generating preview: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const success = downloadPDF(invoiceData);
      if (success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Invoice downloaded successfully!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download PDF');
    }
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleEmail = () => {
    // Create mailto link with invoice details
    const subject = `Invoice ${invoiceData.invoiceNumber || 'DRAFT'}`;
    const body = `Please find attached the invoice ${invoiceData.invoiceNumber || ''} dated ${new Date(invoiceData.invoiceDate || new Date()).toLocaleDateString()}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Invoice Preview - {invoiceData?.invoiceNumber || 'DRAFT'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleEmail}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating preview...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <X className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={generatePreview}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="w-full h-full rounded-lg shadow-lg"
              title="Invoice PDF Preview"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Invoice Date: {new Date(invoiceData?.invoiceDate || new Date()).toLocaleDateString()}
            {invoiceData?.totals?.grandTotal && (
              <span className="ml-4">
                Total: ₹{invoiceData.totals.grandTotal.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Generated on {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Standalone button component to trigger the viewer
export const InvoicePDFButton = ({ invoiceData, className = '' }) => {
  const [showViewer, setShowViewer] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowViewer(true)}
        className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Eye className="w-4 h-4" />
        <span>Preview Invoice</span>
      </button>

      <InvoicePDFViewer
        invoiceData={invoiceData}
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </>
  );
};

export default InvoicePDFViewer;
