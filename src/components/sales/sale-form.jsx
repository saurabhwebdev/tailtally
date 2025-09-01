'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Plus,
    Minus,
    Search,
    X,
    Calculator,
    User,
    PawPrint,
    Package,
    CreditCard,
    AlertTriangle,
    Check,
    RefreshCw
} from 'lucide-react';

export function SaleForm({ sale, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);

    // Form data
    const [formData, setFormData] = useState({
        customer: {
            owner: '',
            pet: 'none'
        },
        items: [],
        payment: {
            method: 'cash',
            status: 'pending',
            paidAmount: 0,
            dueDate: ''
        },
        notes: '',
        deliveryDate: ''
    });

    // Search states
    const [owners, setOwners] = useState([]);
    const [pets, setPets] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [ownerSearch, setOwnerSearch] = useState('');
    const [inventorySearch, setInventorySearch] = useState('');

    // Calculated totals
    const [totals, setTotals] = useState({
        subtotal: 0,
        totalDiscount: 0,
        totalTaxable: 0,
        totalGST: 0,
        grandTotal: 0
    });

    // Load initial data
    useEffect(() => {
        fetchOwners();
        fetchInventory();

        if (sale) {
            setFormData({
                customer: sale.customer,
                items: sale.items,
                payment: sale.payment,
                notes: sale.notes || '',
                deliveryDate: sale.deliveryDate ? new Date(sale.deliveryDate).toISOString().split('T')[0] : ''
            });
        }
    }, [sale]);

    // Calculate totals when items change
    useEffect(() => {
        calculateTotals();
    }, [formData.items]);

    const fetchOwners = async (search = '') => {
        try {
            const params = new URLSearchParams({ limit: '20' });
            if (search) params.append('search', search);

            const response = await fetch(`/api/owners?${params}`);
            const data = await response.json();

            if (response.ok && data.data && Array.isArray(data.data.owners)) {
                setOwners(data.data.owners);
            } else {
                console.error('Invalid owners data structure:', data);
                setOwners([]);
            }
        } catch (err) {
            console.error('Failed to fetch owners:', err);
            setOwners([]);
        }
    };

    const fetchPets = async (ownerId) => {
        try {
            const response = await fetch(`/api/pets?owner=${ownerId}&limit=50`);
            const data = await response.json();

            if (response.ok && data.data && Array.isArray(data.data.pets)) {
                setPets(data.data.pets);
            } else {
                console.error('Invalid pets data structure:', data);
                setPets([]);
            }
        } catch (err) {
            console.error('Failed to fetch pets:', err);
            setPets([]);
        }
    };

    const fetchInventory = async (search = '') => {
        try {
            const params = new URLSearchParams({ limit: '50' });
            if (search) params.append('search', search);

            const response = await fetch(`/api/inventory?${params}`);
            const data = await response.json();

            if (response.ok && data.data && Array.isArray(data.data.items)) {
                setInventory(data.data.items);
            } else {
                console.error('Invalid inventory data structure:', data);
                setInventory([]);
            }
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
            setInventory([]);
        }
    };

    const handleOwnerSelect = (ownerId) => {
        setFormData(prev => ({
            ...prev,
            customer: { ...prev.customer, owner: ownerId, pet: 'none' }
        }));
        fetchPets(ownerId);
    };

    const addItem = (inventoryItem) => {
        const existingItemIndex = formData.items.findIndex(item => item.inventory === inventoryItem._id);

        if (existingItemIndex >= 0) {
            // Increase quantity if item already exists
            const updatedItems = [...formData.items];
            updatedItems[existingItemIndex].quantity += 1;
            setFormData(prev => ({ ...prev, items: updatedItems }));
        } else {
            // Add new item
            const newItem = {
                inventory: inventoryItem._id,
                name: inventoryItem.name,
                sku: inventoryItem.sku,
                quantity: 1,
                unitPrice: inventoryItem.price,
                discount: 0,
                discountType: 'percentage',
                gst: {
                    isApplicable: inventoryItem.gst?.isGSTApplicable || false,
                    rate: inventoryItem.gst?.gstRate || 0,
                    type: inventoryItem.gst?.gstType || 'CGST_SGST',
                    hsnCode: inventoryItem.gst?.hsnCode || '',
                    sacCode: inventoryItem.gst?.sacCode || ''
                },
                notes: ''
            };

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
        }
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalGST = 0;

        formData.items.forEach(item => {
            const itemSubtotal = item.quantity * item.unitPrice;
            const discountAmount = item.discountType === 'percentage'
                ? (itemSubtotal * item.discount) / 100
                : item.discount;
            const taxableAmount = itemSubtotal - discountAmount;
            const gstAmount = item.gst?.isApplicable ? (taxableAmount * (item.gst?.rate || 0)) / 100 : 0;

            subtotal += itemSubtotal;
            totalDiscount += discountAmount;
            totalGST += gstAmount;
        });

        const totalTaxable = subtotal - totalDiscount;
        const grandTotal = totalTaxable + totalGST;

        setTotals({
            subtotal,
            totalDiscount,
            totalTaxable,
            totalGST,
            grandTotal
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate form
            if (!formData.customer.owner) {
                throw new Error('Please select a customer');
            }

            if (formData.items.length === 0) {
                throw new Error('Please add at least one item');
            }

            const url = sale ? `/api/sales/${sale._id}` : '/api/sales';
            const method = sale ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save sale');
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectedOwner = owners.find(owner => owner._id === formData.customer.owner);
    const selectedPet = formData.customer.pet !== 'none' ? pets.find(pet => pet._id === formData.customer.pet) : null;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {sale ? 'Edit Sale' : 'Create New Sale'}
                    </DialogTitle>
                    <DialogDescription>
                        {sale ? 'Update sale information' : 'Create a new sales transaction'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {error && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Tabs value={step.toString()} onValueChange={(value) => setStep(parseInt(value))}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="1" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Customer
                            </TabsTrigger>
                            <TabsTrigger value="2" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Items
                            </TabsTrigger>
                            <TabsTrigger value="3" className="flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger value="4" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment
                            </TabsTrigger>
                        </TabsList>

                        {/* Step 1: Customer Selection */}
                        <TabsContent value="1" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Customer</CardTitle>
                                    <CardDescription>Choose the customer for this sale</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="owner-search">Search Customer</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="owner-search"
                                                placeholder="Search by name, email, or phone..."
                                                value={ownerSearch}
                                                onChange={(e) => {
                                                    setOwnerSearch(e.target.value);
                                                    fetchOwners(e.target.value);
                                                }}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {selectedOwner && (
                                        <Card className="border-primary">
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{selectedOwner.fullName}</h4>
                                                        <p className="text-sm text-muted-foreground">{selectedOwner.email}</p>
                                                        <p className="text-sm text-muted-foreground">{selectedOwner.phone}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setFormData(prev => ({ ...prev, customer: { owner: '', pet: 'none' } }))}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {!selectedOwner && (
                                        <div className="grid gap-2 max-h-60 overflow-y-auto">
                                            {owners && owners.length > 0 ? owners.map((owner) => (
                                                <Card key={owner._id} className="cursor-pointer hover:bg-accent" onClick={() => handleOwnerSelect(owner._id)}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{owner.fullName}</h4>
                                                                <p className="text-sm text-muted-foreground">{owner.email}</p>
                                                                <p className="text-sm text-muted-foreground">{owner.phone}</p>
                                                            </div>
                                            <Badge variant="secondary">{owner.activePetsCount || owner.petsCount || 0} pets</Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )) : (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    No customers found
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Pet Selection */}
                                    {pets && pets.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Select Pet (Optional)</Label>
                                            <Select value={formData.customer.pet} onValueChange={(value) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, pet: value } }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a pet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No specific pet</SelectItem>
                                                    {pets && pets.map((pet) => (
                                                        <SelectItem key={pet._id} value={pet._id}>
                                                            <div className="flex items-center gap-2">
                                                                <PawPrint className="h-4 w-4" />
                                                                {pet.name} ({pet.species} - {pet.breed})
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Step 2: Items Selection */}
                        <TabsContent value="2" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Available Items */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Available Items</CardTitle>
                                        <CardDescription>Select items to add to the sale</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search inventory..."
                                                value={inventorySearch}
                                                onChange={(e) => {
                                                    setInventorySearch(e.target.value);
                                                    fetchInventory(e.target.value);
                                                }}
                                                className="pl-10"
                                            />
                                        </div>

                                        <div className="grid gap-2 max-h-96 overflow-y-auto">
                                            {inventory && inventory.length > 0 ? inventory.map((item) => (
                                                <Card key={item._id} className="cursor-pointer hover:bg-accent" onClick={() => addItem(item)}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{item.name}</h4>
                                                                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                                                <p className="text-sm font-medium">₹{item.price}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant={item.quantity > 0 ? 'success' : 'destructive'}>
                                                                    {item.quantity} in stock
                                                                </Badge>
                                                                <Button size="sm" className="ml-2">
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )) : (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    {inventory === undefined ? 'Loading inventory...' : 'No inventory items found'}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Selected Items */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Selected Items</CardTitle>
                                        <CardDescription>Items in this sale</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {formData.items.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No items selected
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formData.items && formData.items.map((item, index) => (
                                                    <Card key={index}>
                                                        <CardContent className="pt-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="font-medium">{item.name}</h4>
                                                                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => removeItem(index)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <Label>Quantity</Label>
                                                                        <Input
                                                                            type="number"
                                                                            min="1"
                                                                            value={item.quantity}
                                                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Unit Price</Label>
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={item.unitPrice}
                                                                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <Label>Discount</Label>
                                                                        <Input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={item.discount}
                                                                            onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Discount Type</Label>
                                                                        <Select value={item.discountType} onValueChange={(value) => updateItem(index, 'discountType', value)}>
                                                                            <SelectTrigger>
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Subtotal: ₹{(item.quantity * item.unitPrice).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Step 3: Summary */}
                        <TabsContent value="3" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sale Summary</CardTitle>
                                    <CardDescription>Review the sale details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="font-medium mb-2">Customer Information</h4>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <p><strong>Name:</strong> {selectedOwner?.fullName}</p>
                                            <p><strong>Email:</strong> {selectedOwner?.email}</p>
                                            <p><strong>Phone:</strong> {selectedOwner?.phone}</p>
                                            {selectedPet && (
                                                <p><strong>Pet:</strong> {selectedPet.name} ({selectedPet.species})</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items Summary */}
                                    <div>
                                        <h4 className="font-medium mb-2">Items ({formData.items.length})</h4>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Item</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Discount</TableHead>
                                                        <TableHead>Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {formData.items && formData.items.map((item, index) => {
                                                        const subtotal = item.quantity * item.unitPrice;
                                                        const discountAmount = item.discountType === 'percentage'
                                                            ? (subtotal * item.discount) / 100
                                                            : item.discount;
                                                        const total = subtotal - discountAmount;

                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    <div>
                                                                        <div className="font-medium">{item.name}</div>
                                                                        <div className="text-sm text-muted-foreground">{item.sku}</div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>{item.quantity}</TableCell>
                                                                <TableCell>₹{item.unitPrice}</TableCell>
                                                                <TableCell>
                                                                    {item.discount > 0 && (
                                                                        <span>
                                                                            {item.discountType === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>₹{total.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="bg-muted p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>₹{totals.subtotal.toFixed(2)}</span>
                                            </div>
                                            {totals.totalDiscount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Total Discount:</span>
                                                    <span>-₹{totals.totalDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span>Taxable Amount:</span>
                                                <span>₹{totals.totalTaxable.toFixed(2)}</span>
                                            </div>
                                            {totals.totalGST > 0 && (
                                                <div className="flex justify-between">
                                                    <span>Total GST:</span>
                                                    <span>₹{totals.totalGST.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                <span>Grand Total:</span>
                                                <span>₹{totals.grandTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any notes for this sale..."
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Step 4: Payment */}
                        <TabsContent value="4" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Information</CardTitle>
                                    <CardDescription>Configure payment details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="payment-method">Payment Method</Label>
                                            <Select value={formData.payment.method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, method: value } }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="upi">UPI</SelectItem>
                                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                    <SelectItem value="cheque">Cheque</SelectItem>
                                                    <SelectItem value="credit">Credit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="payment-status">Payment Status</Label>
                                            <Select value={formData.payment.status} onValueChange={(value) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, status: value } }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="partial">Partial</SelectItem>
                                                    <SelectItem value="paid">Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="paid-amount">Paid Amount</Label>
                                            <Input
                                                id="paid-amount"
                                                type="number"
                                                step="0.01"
                                                max={totals.grandTotal}
                                                value={formData.payment.paidAmount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, paidAmount: parseFloat(e.target.value) || 0 } }))}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="due-amount">Due Amount</Label>
                                            <Input
                                                id="due-amount"
                                                type="number"
                                                value={(totals.grandTotal - formData.payment.paidAmount).toFixed(2)}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {formData.payment.status === 'credit' && (
                                        <div>
                                            <Label htmlFor="due-date">Due Date</Label>
                                            <Input
                                                id="due-date"
                                                type="date"
                                                value={formData.payment.dueDate}
                                                onChange={(e) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, dueDate: e.target.value } }))}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="delivery-date">Delivery Date (Optional)</Label>
                                        <Input
                                            id="delivery-date"
                                            type="date"
                                            value={formData.deliveryDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep(step - 1)}>
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>

                            {step < 4 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={
                                        (step === 1 && !formData.customer.owner) ||
                                        (step === 2 && formData.items.length === 0)
                                    }
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            {sale ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            {sale ? 'Update Sale' : 'Create Sale'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}