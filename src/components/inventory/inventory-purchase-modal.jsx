'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, User, Heart, Calculator, AlertTriangle, Plus, Minus, Trash2 } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'check', label: 'Check' },
  { value: 'insurance', label: 'Insurance' }
];

export default function InventoryPurchaseModal({ 
  isOpen, 
  onClose, 
  items = [], // Pre-selected inventory items
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Select Customer, 2: Configure Items, 3: Payment
  
  // Customer selection
  const [customerType, setCustomerType] = useState('owner'); // 'owner' or 'pet'
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [petSearch, setPetSearch] = useState('');
  
  // Purchase items
  const [purchaseItems, setPurchaseItems] = useState([]);
  
  // Payment details
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [generateInvoice, setGenerateInvoice] = useState(true);
  
  // Totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalGST: 0,
    totalAmount: 0,
    totalItems: 0
  });

  useEffect(() => {
    if (isOpen) {
      // Initialize with pre-selected items
      if (items.length > 0) {
        const initialItems = items.map(item => ({
          ...item,
          quantity: 1,
          notes: '',
          priceBreakdown: item.calculateGSTBreakdown ? item.calculateGSTBreakdown() : {
            basePrice: item.price || 0,
            totalGST: 0,
            totalPriceWithGST: item.price || 0
          }
        }));
        setPurchaseItems(initialItems);
      }
      fetchOwners();
    }
  }, [isOpen, items]);

  useEffect(() => {
    calculateTotals();
  }, [purchaseItems]);

  useEffect(() => {
    if (selectedOwner) {
      fetchPetsByOwner(selectedOwner._id);
    }
  }, [selectedOwner]);

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/owners?limit=100&active=true');
      const data = await response.json();
      if (data.success) {
        setOwners(data.data.owners || []);
      }
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  const fetchPetsByOwner = async (ownerId) => {
    try {
      const response = await fetch(`/api/pets?owner=${ownerId}&active=true`);
      const data = await response.json();
      if (data.success) {
        setPets(data.data.pets || []);
      }
    } catch (err) {
      console.error('Failed to fetch pets:', err);
      setPets([]);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;
    let totalItems = 0;

    purchaseItems.forEach(item => {
      const itemSubtotal = item.priceBreakdown.basePrice * item.quantity;
      const itemGST = item.priceBreakdown.totalGST * item.quantity;
      
      subtotal += itemSubtotal;
      totalGST += itemGST;
      totalItems += item.quantity;
    });

    setTotals({
      subtotal: Math.round(subtotal * 100) / 100,
      totalGST: Math.round(totalGST * 100) / 100,
      totalAmount: Math.round((subtotal + totalGST) * 100) / 100,
      totalItems
    });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setPurchaseItems(prev => prev.map(item => 
      item._id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const updateItemNotes = (itemId, notes) => {
    setPurchaseItems(prev => prev.map(item => 
      item._id === itemId 
        ? { ...item, notes }
        : item
    ));
  };

  const removeItem = (itemId) => {
    setPurchaseItems(prev => prev.filter(item => item._id !== itemId));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate customer selection
      if (customerType === 'owner' && !selectedOwner) {
        setError('Please select an owner');
        return;
      }
      if (customerType === 'pet' && !selectedPet) {
        setError('Please select a pet');
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      // Validate items
      if (purchaseItems.length === 0) {
        setError('Please add at least one item');
        return;
      }
      setError(null);
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const purchaseData = {
        items: purchaseItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity,
          notes: item.notes
        })),
        petId: customerType === 'pet' ? selectedPet._id : null,
        ownerId: customerType === 'owner' ? selectedOwner._id : selectedPet?.owner?._id || selectedOwner?._id,
        paymentMethod,
        notes,
        generateInvoice
      };

      const response = await fetch('/api/inventory/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record purchase');
      }

      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const filteredOwners = owners.filter(owner => 
    owner.fullName?.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    owner.email?.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    owner.phone?.includes(ownerSearch)
  );

  const filteredPets = pets.filter(pet => 
    pet.name?.toLowerCase().includes(petSearch.toLowerCase()) ||
    pet.species?.toLowerCase().includes(petSearch.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(petSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Record Purchase - Step {step} of 3
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Select the customer for this purchase'}
            {step === 2 && 'Configure items and quantities'}
            {step === 3 && 'Review and complete the purchase'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Customer Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Owner Only
                    </div>
                  </SelectItem>
                  <SelectItem value="pet">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Pet & Owner
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {customerType === 'owner' && (
              <div className="space-y-2">
                <Label>Select Owner</Label>
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={ownerSearch}
                  onChange={(e) => setOwnerSearch(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  {filteredOwners.map(owner => (
                    <div
                      key={owner._id}
                      className={`p-3 cursor-pointer hover:bg-muted ${
                        selectedOwner?._id === owner._id ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedOwner(owner)}
                    >
                      <div className="font-medium">{owner.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {owner.email} • {owner.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerType === 'pet' && (
              <>
                <div className="space-y-2">
                  <Label>Select Owner First</Label>
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                  />
                  <div className="max-h-32 overflow-y-auto border rounded-md">
                    {filteredOwners.map(owner => (
                      <div
                        key={owner._id}
                        className={`p-2 cursor-pointer hover:bg-muted ${
                          selectedOwner?._id === owner._id ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => setSelectedOwner(owner)}
                      >
                        <div className="font-medium text-sm">{owner.fullName}</div>
                        <div className="text-xs text-muted-foreground">{owner.email}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOwner && (
                  <div className="space-y-2">
                    <Label>Select Pet</Label>
                    <Input
                      placeholder="Search pets..."
                      value={petSearch}
                      onChange={(e) => setPetSearch(e.target.value)}
                    />
                    <div className="max-h-32 overflow-y-auto border rounded-md">
                      {filteredPets.map(pet => (
                        <div
                          key={pet._id}
                          className={`p-2 cursor-pointer hover:bg-muted ${
                            selectedPet?._id === pet._id ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => setSelectedPet(pet)}
                        >
                          <div className="font-medium text-sm">{pet.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {pet.species} {pet.breed && `• ${pet.breed}`} {pet.age && `• ${pet.age} years`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Items Configuration */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Purchase Items</CardTitle>
                <CardDescription>
                  Configure quantities and add notes for each item
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchaseItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No items selected
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseItems.map(item => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.sku} • {item.category}
                              </div>
                              {item.gst?.isGSTApplicable && (
                                <Badge variant="outline" className="text-xs">
                                  GST {item.gst.gstRate}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatCurrency(item.priceBreakdown.totalPriceWithGST)}</div>
                              {item.gst?.isGSTApplicable && (
                                <div className="text-xs text-muted-foreground">
                                  Base: {formatCurrency(item.priceBreakdown.basePrice)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item._id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                                disabled={item.quantity >= item.quantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.priceBreakdown.totalPriceWithGST * item.quantity)}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Notes..."
                              value={item.notes}
                              onChange={(e) => updateItemNotes(item._id, e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment & Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerType === 'pet' && selectedPet && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">{selectedPet.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPet.species} {selectedPet.breed && `• ${selectedPet.breed}`}
                      </div>
                      <Separator />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedOwner?.fullName || selectedPet?.owner?.fullName}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOwner?.email || selectedPet?.owner?.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOwner?.phone || selectedPet?.owner?.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Items ({totals.totalItems}):</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST:</span>
                      <span>{formatCurrency(totals.totalGST)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(totals.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional notes about this purchase..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generateInvoice"
                    checked={generateInvoice}
                    onChange={(e) => setGenerateInvoice(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="generateInvoice">Generate Invoice</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext} disabled={loading}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Complete Purchase'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}