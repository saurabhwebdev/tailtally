'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertTriangle, X, Plus, Calculator } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'treats', label: 'Treats' },
  { value: 'toys', label: 'Toys' },
  { value: 'medication', label: 'Medication' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'health', label: 'Health' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'other', label: 'Other' }
];

const PET_SPECIES = [
  { value: 'all', label: 'All Species' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'bird', label: 'Birds' },
  { value: 'fish', label: 'Fish' },
  { value: 'rabbit', label: 'Rabbits' },
  { value: 'hamster', label: 'Hamsters' },
  { value: 'other', label: 'Other' }
];

const AGE_GROUPS = [
  { value: 'all', label: 'All Ages' },
  { value: 'puppy', label: 'Puppy/Kitten' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' }
];

const SIZES = [
  { value: 'universal', label: 'Universal' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra Large' }
];

const GST_TYPES = [
  { value: 'CGST_SGST', label: 'CGST + SGST (Intra-state)' },
  { value: 'IGST', label: 'IGST (Inter-state)' },
  { value: 'EXEMPT', label: 'GST Exempt' },
  { value: 'NIL_RATED', label: 'Nil Rated' },
  { value: 'ZERO_RATED', label: 'Zero Rated' }
];

const TAX_CATEGORIES = [
  { value: 'GOODS', label: 'Goods' },
  { value: 'SERVICES', label: 'Services' }
];

const COMMON_GST_RATES = [0, 5, 12, 18, 28];

export default function InventoryForm({ item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    cost: '',
    quantity: '',
    minStockLevel: '5',
    maxStockLevel: '',
    sku: '',
    barcode: '',
    brand: '',
    petSpecies: ['all'],
    ageGroup: 'all',
    size: 'universal',
    expirationDate: null,
    batchNumber: '',
    isPerishable: false,
    requiresPrescription: false,
    isOnSale: false,
    salePrice: '',
    saleStartDate: null,
    saleEndDate: null,
    tags: [],
    notes: '',
    supplier: {
      name: '',
      contactInfo: {
        email: '',
        phone: '',
        address: ''
      },
      supplierCode: ''
    },
    gst: {
      isGSTApplicable: true,
      gstRate: 18,
      gstType: 'CGST_SGST',
      taxCategory: 'GOODS',
      hsnCode: '',
      sacCode: '',
      cessRate: 0,
      reverseCharge: false,
      placeOfSupply: {
        stateCode: '',
        stateName: ''
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        subcategory: item.subcategory || '',
        price: item.price?.toString() || '',
        cost: item.cost?.toString() || '',
        quantity: item.quantity?.toString() || '',
        minStockLevel: item.minStockLevel?.toString() || '5',
        maxStockLevel: item.maxStockLevel?.toString() || '',
        sku: item.sku || '',
        barcode: item.barcode || '',
        brand: item.brand || '',
        petSpecies: item.petSpecies || ['all'],
        ageGroup: item.ageGroup || 'all',
        size: item.size || 'universal',
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
        batchNumber: item.batchNumber || '',
        isPerishable: item.isPerishable || false,
        requiresPrescription: item.requiresPrescription || false,
        isOnSale: item.isOnSale || false,
        salePrice: item.salePrice?.toString() || '',
        saleStartDate: item.saleStartDate ? new Date(item.saleStartDate) : null,
        saleEndDate: item.saleEndDate ? new Date(item.saleEndDate) : null,
        tags: item.tags || [],
        notes: item.notes || '',
        supplier: {
          name: item.supplier?.name || '',
          contactInfo: {
            email: item.supplier?.contactInfo?.email || '',
            phone: item.supplier?.contactInfo?.phone || '',
            address: item.supplier?.contactInfo?.address || ''
          },
          supplierCode: item.supplier?.supplierCode || ''
        },
        gst: {
          isGSTApplicable: item.gst?.isGSTApplicable ?? true,
          gstRate: item.gst?.gstRate ?? 18,
          gstType: item.gst?.gstType ?? 'CGST_SGST',
          taxCategory: item.gst?.taxCategory ?? 'GOODS',
          hsnCode: item.gst?.hsnCode ?? '',
          sacCode: item.gst?.sacCode ?? '',
          cessRate: item.gst?.cessRate ?? 0,
          reverseCharge: item.gst?.reverseCharge ?? false,
          placeOfSupply: {
            stateCode: item.gst?.placeOfSupply?.stateCode ?? '',
            stateName: item.gst?.placeOfSupply?.stateName ?? ''
          }
        }
      });
    }
  }, [item]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSupplierContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        contactInfo: {
          ...prev.supplier.contactInfo,
          [field]: value
        }
      }
    }));
  };

  const handleGSTChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      gst: {
        ...prev.gst,
        [field]: value
      }
    }));
  };

  const handleGSTPlaceOfSupplyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      gst: {
        ...prev.gst,
        placeOfSupply: {
          ...prev.gst.placeOfSupply,
          [field]: value
        }
      }
    }));
  };

  const handleSpeciesChange = (species, checked) => {
    setFormData(prev => {
      let newSpecies = [...prev.petSpecies];
      
      if (species === 'all') {
        newSpecies = checked ? ['all'] : [];
      } else {
        if (checked) {
          newSpecies = newSpecies.filter(s => s !== 'all');
          newSpecies.push(species);
        } else {
          newSpecies = newSpecies.filter(s => s !== species);
        }
        
        if (newSpecies.length === 0) {
          newSpecies = ['all'];
        }
      }
      
      return { ...prev, petSpecies: newSpecies };
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || formData.quantity === '') {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        quantity: parseInt(formData.quantity),
        minStockLevel: parseInt(formData.minStockLevel),
        maxStockLevel: formData.maxStockLevel ? parseInt(formData.maxStockLevel) : undefined,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      };

      const url = item ? `/api/inventory/${item._id}` : '/api/inventory';
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save inventory item');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </DialogTitle>
          <DialogDescription>
            {item ? 'Update the inventory item details below.' : 'Enter the details for the new inventory item.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    placeholder="Subcategory"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Barcode"
                  />
                </div>
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    placeholder="Batch number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing and Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    min="0"
                    value={formData.maxStockLevel}
                    onChange={(e) => handleInputChange('maxStockLevel', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Sale Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isOnSale"
                    checked={formData.isOnSale}
                    onCheckedChange={(checked) => handleInputChange('isOnSale', checked)}
                  />
                  <Label htmlFor="isOnSale">Item is on sale</Label>
                </div>

                {formData.isOnSale && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Sale Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.saleStartDate ? format(formData.saleStartDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.saleStartDate}
                            onSelect={(date) => handleInputChange('saleStartDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Sale End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.saleEndDate ? format(formData.saleEndDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.saleEndDate}
                            onSelect={(date) => handleInputChange('saleEndDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Suitable for Pet Species</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {PET_SPECIES.map((species) => (
                    <div key={species.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`species-${species.value}`}
                        checked={formData.petSpecies.includes(species.value)}
                        onCheckedChange={(checked) => handleSpeciesChange(species.value, checked)}
                      />
                      <Label htmlFor={`species-${species.value}`} className="text-sm">
                        {species.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select 
                    value={formData.ageGroup} 
                    onValueChange={(value) => handleInputChange('ageGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGE_GROUPS.map((age) => (
                        <SelectItem key={age.value} value={age.value}>
                          {age.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(value) => handleInputChange('size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPerishable"
                    checked={formData.isPerishable}
                    onCheckedChange={(checked) => handleInputChange('isPerishable', checked)}
                  />
                  <Label htmlFor="isPerishable">Perishable item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresPrescription"
                    checked={formData.requiresPrescription}
                    onCheckedChange={(checked) => handleInputChange('requiresPrescription', checked)}
                  />
                  <Label htmlFor="requiresPrescription">Requires prescription</Label>
                </div>
              </div>

              {formData.isPerishable && (
                <div>
                  <Label>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expirationDate ? format(formData.expirationDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expirationDate}
                        onSelect={(date) => handleInputChange('expirationDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplier.name}
                    onChange={(e) => handleNestedInputChange('supplier', 'name', e.target.value)}
                    placeholder="Supplier name"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierCode">Supplier Code</Label>
                  <Input
                    id="supplierCode"
                    value={formData.supplier.supplierCode}
                    onChange={(e) => handleNestedInputChange('supplier', 'supplierCode', e.target.value)}
                    placeholder="Supplier code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierEmail">Supplier Email</Label>
                  <Input
                    id="supplierEmail"
                    type="email"
                    value={formData.supplier.contactInfo.email}
                    onChange={(e) => handleSupplierContactChange('email', e.target.value)}
                    placeholder="supplier@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierPhone">Supplier Phone</Label>
                  <Input
                    id="supplierPhone"
                    value={formData.supplier.contactInfo.phone}
                    onChange={(e) => handleSupplierContactChange('phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplierAddress">Supplier Address</Label>
                <Textarea
                  id="supplierAddress"
                  value={formData.supplier.contactInfo.address}
                  onChange={(e) => handleSupplierContactChange('address', e.target.value)}
                  placeholder="Supplier address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* GST Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                GST Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gstApplicable"
                  checked={formData.gst.isGSTApplicable}
                  onCheckedChange={(checked) => handleGSTChange('isGSTApplicable', checked)}
                />
                <Label htmlFor="gstApplicable">GST Applicable</Label>
              </div>

              {formData.gst.isGSTApplicable && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstRate">GST Rate (%)</Label>
                      <Select 
                        value={formData.gst.gstRate.toString()} 
                        onValueChange={(value) => handleGSTChange('gstRate', parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_GST_RATES.map((rate) => (
                            <SelectItem key={rate} value={rate.toString()}>
                              {rate}% {rate === 0 ? '(Exempt)' : rate === 18 ? '(Standard)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="gstType">GST Type</Label>
                      <Select 
                        value={formData.gst.gstType} 
                        onValueChange={(value) => handleGSTChange('gstType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GST_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxCategory">Tax Category</Label>
                      <Select 
                        value={formData.gst.taxCategory} 
                        onValueChange={(value) => handleGSTChange('taxCategory', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TAX_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cessRate">Cess Rate (%)</Label>
                      <Input
                        id="cessRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.gst.cessRate}
                        onChange={(e) => handleGSTChange('cessRate', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hsnCode">
                        HSN Code {formData.gst.taxCategory === 'GOODS' && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id="hsnCode"
                        value={formData.gst.hsnCode}
                        onChange={(e) => handleGSTChange('hsnCode', e.target.value)}
                        placeholder="e.g., 2309"
                        disabled={formData.gst.taxCategory !== 'GOODS'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sacCode">
                        SAC Code {formData.gst.taxCategory === 'SERVICES' && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id="sacCode"
                        value={formData.gst.sacCode}
                        onChange={(e) => handleGSTChange('sacCode', e.target.value)}
                        placeholder="e.g., 998361"
                        disabled={formData.gst.taxCategory !== 'SERVICES'}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reverseCharge"
                      checked={formData.gst.reverseCharge}
                      onCheckedChange={(checked) => handleGSTChange('reverseCharge', checked)}
                    />
                    <Label htmlFor="reverseCharge">Reverse Charge Applicable</Label>
                  </div>

                  {/* GST Price Preview */}
                  {formData.price && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Price Breakdown Preview</h4>
                      <div className="text-sm space-y-1">
                        {(() => {
                          const price = parseFloat(formData.price) || 0;
                          const gstRate = formData.gst.gstRate / 100;
                          const cessRate = formData.gst.cessRate / 100;
                          const basePrice = price / (1 + gstRate + cessRate);
                          const gstAmount = basePrice * gstRate;
                          const cessAmount = basePrice * cessRate;
                          
                          return (
                            <>
                              <div className="flex justify-between">
                                <span>Base Price:</span>
                                <span>₹{basePrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>GST ({formData.gst.gstRate}%):</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                              </div>
                              {cessAmount > 0 && (
                                <div className="flex justify-between">
                                  <span>Cess ({formData.gst.cessRate}%):</span>
                                  <span>₹{cessAmount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Total Price:</span>
                                <span>₹{price.toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}