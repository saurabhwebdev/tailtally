'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export function PaymentModal({ invoice, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: invoice?.payment?.dueAmount || 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentData.amount <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }

    if (paymentData.amount > invoice.payment.dueAmount) {
      setError('Payment amount cannot exceed due amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices/${invoice._id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record payment');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
      case 'upi':
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment for invoice #{invoice?.invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Customer</Label>
                  <div className="font-medium">{invoice?.customer?.details?.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Invoice Date</Label>
                  <div>{new Date(invoice?.invoiceDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <div className="font-medium">₹{invoice?.totals?.finalAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Paid Amount</Label>
                  <div className="font-medium text-green-600">₹{invoice?.payment?.paidAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Due Amount</Label>
                  <div className="font-medium text-red-600">₹{invoice?.payment?.dueAmount?.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Payment Status:</Label>
                <Badge variant={
                  invoice?.payment?.status === 'paid' ? 'success' :
                  invoice?.payment?.status === 'partial' ? 'secondary' : 'warning'
                }>
                  {invoice?.payment?.status || 'pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={invoice?.payment?.dueAmount}
                  value={paymentData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter payment amount"
                  required
                />
                <div className="text-xs text-muted-foreground">
                  Maximum: ₹{invoice?.payment?.dueAmount?.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={paymentData.paymentMethod} 
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="upi">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      UPI
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="cheque">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cheque
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(paymentData.paymentMethod === 'card' || 
              paymentData.paymentMethod === 'upi' || 
              paymentData.paymentMethod === 'bank_transfer') && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={paymentData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Enter transaction/reference ID"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={paymentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about this payment"
                rows={3}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Payment Summary */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Amount:</span>
                  <span className="font-medium">₹{paymentData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining Due:</span>
                  <span className="font-medium">
                    ₹{(invoice?.payment?.dueAmount - paymentData.amount).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>New Status:</span>
                  <Badge variant={
                    (invoice?.payment?.dueAmount - paymentData.amount) <= 0 ? 'success' : 'secondary'
                  }>
                    {(invoice?.payment?.dueAmount - paymentData.amount) <= 0 ? 'Paid' : 'Partial'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This payment will be recorded immediately and cannot be undone. Please verify all details before submitting.
              </AlertDescription>
            </Alert>
          </form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || paymentData.amount <= 0}
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}