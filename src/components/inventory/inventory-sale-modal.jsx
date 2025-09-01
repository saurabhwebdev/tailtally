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
import { AlertTriangle, ShoppingCart, User, PawPrint, DollarSign, Package } from 'lucide-react';

export default function InventorySaleModal({ item, onSuccess, onCancel }) {
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [error, setError] = useState(null);

  // Fetch owners on component mount
  useEffect(() => {
    fetchOwners();
  }, []);

  // Fetch pets when owner is selected
  useEffect(() => {
    if (selectedOwner) {
      fetchPetsForOwner(selectedOwner);
    } else {
      setPets([]);
      setSelectedPet('');
    }
  }, [selectedOwner]);

  const fetchOwners = async () => {
    try {
      setLoadingOwners(true);
      const response = await fetch('/api/owners?limit=100');
      const data = await response.json();

      if (response.ok) {
        setOwners(data.data.owners || []);
      } else {
        throw new Error(data.message || 'Failed to fetch owners');
      }
    } catch (err) {
      setError(`Failed to load owners: ${err.message}`);
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchPetsForOwner = async (ownerId) => {
    try {
      setLoadingPets(true);
      const response = await fetch(`/api/pets?owner=${ownerId}&limit=100`);
      const data = await response.json();

      if (response.ok) {
        setPets(data.data.pets || []);
      } else {
        throw new Error(data.message || 'Failed to fetch pets');
      }
    } catch (err) {
      setError(`Failed to load pets: ${err.message}`);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedOwner || !selectedPet || !quantity || parseInt(quantity) <= 0) {
      setError('Please select an owner, pet, and enter a valid quantity');
      return;
    }

    if (parseInt(quantity) > item.quantity) {
      setError(`Cannot sell ${quantity} items. Only ${item.quantity} available in stock.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/inventory/${item._id}/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: selectedPet,
          ownerId: selectedOwner,
          quantity: parseInt(quantity),
          notes,
          invoiceNumber
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process sale');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const price = item.currentPrice || item.price;
    const qty = parseInt(quantity) || 0;
    return price * qty;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getSelectedOwner = () => {
    return owners.find(owner => owner._id === selectedOwner);
  };

  const getSelectedPet = () => {
    return pets.find(pet => pet._id === selectedPet);
  };

  const isValidForPet = () => {
    const pet = getSelectedPet();
    if (!pet || !item.petSpecies || item.petSpecies.length === 0) return true;
    
    return item.petSpecies.includes('all') || item.petSpecies.includes(pet.species);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sell Inventory Item
          </DialogTitle>
          <DialogDescription>
            Process a sale for {item.name}
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

          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Item Name</p>
                  <p className="font-medium">{item.name}</p>
                  {item.brand && (
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-mono text-sm">{item.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Stock</p>
                  <p className="font-medium">{item.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit Price</p>
                  <p className="font-medium">{formatPrice(item.currentPrice || item.price)}</p>
                  {item.isOnSale && (
                    <Badge variant="secondary" className="mt-1">On Sale</Badge>
                  )}
                </div>
              </div>
              
              {item.petSpecies && item.petSpecies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Suitable for:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.petSpecies.map((species) => (
                      <Badge key={species} variant="outline" className="capitalize">
                        {species === 'all' ? 'All Species' : species}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sale Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Sale Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Owner Selection */}
              <div>
                <Label htmlFor="owner">Select Owner *</Label>
                <Select 
                  value={selectedOwner} 
                  onValueChange={setSelectedOwner}
                  disabled={loadingOwners}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingOwners ? "Loading owners..." : "Select an owner"} />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner._id} value={owner._id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{owner.firstName} {owner.lastName}</span>
                          {owner.email && (
                            <span className="text-sm text-muted-foreground">({owner.email})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pet Selection */}
              <div>
                <Label htmlFor="pet">Select Pet *</Label>
                <Select 
                  value={selectedPet} 
                  onValueChange={setSelectedPet}
                  disabled={!selectedOwner || loadingPets}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedOwner ? "Select owner first" :
                      loadingPets ? "Loading pets..." :
                      "Select a pet"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet._id} value={pet._id}>
                        <div className="flex items-center gap-2">
                          <PawPrint className="h-4 w-4" />
                          <span>{pet.name}</span>
                          <Badge variant="outline" className="capitalize">
                            {pet.species}
                          </Badge>
                          {pet.breed && (
                            <span className="text-sm text-muted-foreground">({pet.breed})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedPet && !isValidForPet() && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: This item may not be suitable for {getSelectedPet()?.species}s.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Max: {item.quantity} available
                  </p>
                </div>
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sale notes (optional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sale Summary */}
          {selectedOwner && selectedPet && quantity && (
            <Card>
              <CardHeader>
                <CardTitle>Sale Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">
                      {getSelectedOwner()?.firstName} {getSelectedOwner()?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pet:</span>
                    <span className="font-medium">{getSelectedPet()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Item:</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span className="font-medium">{formatPrice(item.currentPrice || item.price)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedOwner || !selectedPet || !quantity}
            >
              {loading ? 'Processing Sale...' : 'Complete Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}