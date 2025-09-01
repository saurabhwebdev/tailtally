'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, Info, AlertTriangle } from 'lucide-react';

const GST_TYPES = [
    { value: 'CGST_SGST', label: 'CGST + SGST (Intra-state)', description: 'For sales within the same state' },
    { value: 'IGST', label: 'IGST (Inter-state)', description: 'For sales to different states' },
    { value: 'EXEMPT', label: 'GST Exempt', description: 'No GST applicable' },
    { value: 'NIL_RATED', label: 'Nil Rated', description: '0% GST rate' },
    { value: 'ZERO_RATED', label: 'Zero Rated', description: 'Export/SEZ supplies' }
];

const TAX_CATEGORIES = [
    { value: 'GOODS', label: 'Goods', description: 'Physical products' },
    { value: 'SERVICES', label: 'Services', description: 'Service offerings' }
];

const COMMON_GST_RATES = [
    { rate: 0, label: '0% - Essential items' },
    { rate: 5, label: '5% - Basic necessities' },
    { rate: 12, label: '12% - Standard rate' },
    { rate: 18, label: '18% - Most goods/services' },
    { rate: 28, label: '28% - Luxury items' }
];

const INDIAN_STATES = [
    { code: '01', name: 'Jammu and Kashmir' },
    { code: '02', name: 'Himachal Pradesh' },
    { code: '03', name: 'Punjab' },
    { code: '04', name: 'Chandigarh' },
    { code: '05', name: 'Uttarakhand' },
    { code: '06', name: 'Haryana' },
    { code: '07', name: 'Delhi' },
    { code: '08', name: 'Rajasthan' },
    { code: '09', name: 'Uttar Pradesh' },
    { code: '10', name: 'Bihar' },
    { code: '11', name: 'Sikkim' },
    { code: '12', name: 'Arunachal Pradesh' },
    { code: '13', name: 'Nagaland' },
    { code: '14', name: 'Manipur' },
    { code: '15', name: 'Mizoram' },
    { code: '16', name: 'Tripura' },
    { code: '17', name: 'Meghalaya' },
    { code: '18', name: 'Assam' },
    { code: '19', name: 'West Bengal' },
    { code: '20', name: 'Jharkhand' },
    { code: '21', name: 'Odisha' },
    { code: '22', name: 'Chhattisgarh' },
    { code: '23', name: 'Madhya Pradesh' },
    { code: '24', name: 'Gujarat' },
    { code: '25', name: 'Daman and Diu' },
    { code: '26', name: 'Dadra and Nagar Haveli' },
    { code: '27', name: 'Maharashtra' },
    { code: '29', name: 'Karnataka' },
    { code: '30', name: 'Goa' },
    { code: '31', name: 'Lakshadweep' },
    { code: '32', name: 'Kerala' },
    { code: '33', name: 'Tamil Nadu' },
    { code: '34', name: 'Puducherry' },
    { code: '35', name: 'Andaman and Nicobar Islands' },
    { code: '36', name: 'Telangana' },
    { code: '37', name: 'Andhra Pradesh' }
];

export default function GSTSettingsModal({
    isOpen,
    onClose,
    items = [],
    onSave,
    bulkUpdate = false
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gstSettings, setGstSettings] = useState({
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
    });

    const [priceBreakdown, setPriceBreakdown] = useState(null);
    const [samplePrice, setSamplePrice] = useState(100);

    useEffect(() => {
        if (items.length === 1 && !bulkUpdate) {
            // Pre-fill with existing item data
            const item = items[0];
            if (item.gst) {
                setGstSettings({
                    isGSTApplicable: item.gst.isGSTApplicable ?? true,
                    gstRate: item.gst.gstRate ?? 18,
                    gstType: item.gst.gstType ?? 'CGST_SGST',
                    taxCategory: item.gst.taxCategory ?? 'GOODS',
                    hsnCode: item.gst.hsnCode ?? '',
                    sacCode: item.gst.sacCode ?? '',
                    cessRate: item.gst.cessRate ?? 0,
                    reverseCharge: item.gst.reverseCharge ?? false,
                    placeOfSupply: {
                        stateCode: item.gst.placeOfSupply?.stateCode ?? '',
                        stateName: item.gst.placeOfSupply?.stateName ?? ''
                    }
                });
            }
            setSamplePrice(item.price || 100);
        }
    }, [items, bulkUpdate]);

    useEffect(() => {
        calculatePriceBreakdown();
    }, [gstSettings, samplePrice]);

    const calculatePriceBreakdown = () => {
        if (!gstSettings.isGSTApplicable) {
            setPriceBreakdown({
                basePrice: samplePrice,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0,
                cessAmount: 0,
                totalGST: 0,
                totalPriceWithGST: samplePrice
            });
            return;
        }

        const gstRate = gstSettings.gstRate / 100;
        const cessRate = gstSettings.cessRate / 100;

        // Calculate base price (price without GST)
        const basePrice = samplePrice / (1 + gstRate + cessRate);

        // Calculate individual GST components
        let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

        if (gstSettings.gstType === 'CGST_SGST') {
            cgstAmount = basePrice * (gstSettings.gstRate / 2 / 100);
            sgstAmount = basePrice * (gstSettings.gstRate / 2 / 100);
        } else if (gstSettings.gstType === 'IGST') {
            igstAmount = basePrice * (gstSettings.gstRate / 100);
        }

        const cessAmount = basePrice * cessRate;
        const totalGST = cgstAmount + sgstAmount + igstAmount + cessAmount;

        setPriceBreakdown({
            basePrice: Math.round(basePrice * 100) / 100,
            cgstAmount: Math.round(cgstAmount * 100) / 100,
            sgstAmount: Math.round(sgstAmount * 100) / 100,
            igstAmount: Math.round(igstAmount * 100) / 100,
            cessAmount: Math.round(cessAmount * 100) / 100,
            totalGST: Math.round(totalGST * 100) / 100,
            totalPriceWithGST: Math.round(samplePrice * 100) / 100
        });
    };

    const handleStateChange = (stateCode) => {
        const state = INDIAN_STATES.find(s => s.code === stateCode);
        setGstSettings(prev => ({
            ...prev,
            placeOfSupply: {
                stateCode,
                stateName: state ? state.name : ''
            }
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (gstSettings.isGSTApplicable) {
                if (gstSettings.taxCategory === 'GOODS' && !gstSettings.hsnCode) {
                    throw new Error('HSN Code is required for goods');
                }
                if (gstSettings.taxCategory === 'SERVICES' && !gstSettings.sacCode) {
                    throw new Error('SAC Code is required for services');
                }
            }

            const itemIds = items.map(item => item._id);

            const response = await fetch('/api/inventory/gst', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemIds,
                    gstSettings,
                    bulkUpdate
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update GST settings');
            }

            onSave?.(data);
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        GST Settings
                        {bulkUpdate && <Badge variant="secondary">Bulk Update</Badge>}
                    </DialogTitle>
                    <DialogDescription>
                        {bulkUpdate
                            ? `Configure GST settings for ${items.length} selected items`
                            : items.length === 1
                                ? `Configure GST settings for "${items[0]?.name}"`
                                : 'Configure default GST settings'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* GST Configuration */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">GST Configuration</CardTitle>
                                <CardDescription>
                                    Set up GST rates and tax categories
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="gstApplicable"
                                        checked={gstSettings.isGSTApplicable}
                                        onCheckedChange={(checked) =>
                                            setGstSettings(prev => ({ ...prev, isGSTApplicable: checked }))
                                        }
                                    />
                                    <Label htmlFor="gstApplicable">GST Applicable</Label>
                                </div>

                                {gstSettings.isGSTApplicable && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="gstRate">GST Rate (%)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="gstRate"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={gstSettings.gstRate}
                                                    onChange={(e) =>
                                                        setGstSettings(prev => ({
                                                            ...prev,
                                                            gstRate: parseFloat(e.target.value) || 0
                                                        }))
                                                    }
                                                    className="flex-1"
                                                />
                                                <Select
                                                    value={gstSettings.gstRate.toString()}
                                                    onValueChange={(value) =>
                                                        setGstSettings(prev => ({
                                                            ...prev,
                                                            gstRate: parseFloat(value)
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Common rates" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COMMON_GST_RATES.map((rate) => (
                                                            <SelectItem key={rate.rate} value={rate.rate.toString()}>
                                                                {rate.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gstType">GST Type</Label>
                                            <Select
                                                value={gstSettings.gstType}
                                                onValueChange={(value) =>
                                                    setGstSettings(prev => ({ ...prev, gstType: value }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GST_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            <div>
                                                                <div className="font-medium">{type.label}</div>
                                                                <div className="text-sm text-muted-foreground">{type.description}</div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="taxCategory">Tax Category</Label>
                                            <Select
                                                value={gstSettings.taxCategory}
                                                onValueChange={(value) =>
                                                    setGstSettings(prev => ({ ...prev, taxCategory: value }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TAX_CATEGORIES.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            <div>
                                                                <div className="font-medium">{category.label}</div>
                                                                <div className="text-sm text-muted-foreground">{category.description}</div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="hsnCode">
                                                    HSN Code {gstSettings.taxCategory === 'GOODS' && <span className="text-red-500">*</span>}
                                                </Label>
                                                <Input
                                                    id="hsnCode"
                                                    placeholder="e.g., 2309"
                                                    value={gstSettings.hsnCode}
                                                    onChange={(e) =>
                                                        setGstSettings(prev => ({ ...prev, hsnCode: e.target.value }))
                                                    }
                                                    disabled={gstSettings.taxCategory !== 'GOODS'}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sacCode">
                                                    SAC Code {gstSettings.taxCategory === 'SERVICES' && <span className="text-red-500">*</span>}
                                                </Label>
                                                <Input
                                                    id="sacCode"
                                                    placeholder="e.g., 998361"
                                                    value={gstSettings.sacCode}
                                                    onChange={(e) =>
                                                        setGstSettings(prev => ({ ...prev, sacCode: e.target.value }))
                                                    }
                                                    disabled={gstSettings.taxCategory !== 'SERVICES'}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cessRate">Cess Rate (%)</Label>
                                            <Input
                                                id="cessRate"
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={gstSettings.cessRate}
                                                onChange={(e) =>
                                                    setGstSettings(prev => ({
                                                        ...prev,
                                                        cessRate: parseFloat(e.target.value) || 0
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="placeOfSupply">Place of Supply</Label>
                                            <Select
                                                value={gstSettings.placeOfSupply.stateCode}
                                                onValueChange={handleStateChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {INDIAN_STATES.map((state) => (
                                                        <SelectItem key={state.code} value={state.code}>
                                                            {state.code} - {state.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="reverseCharge"
                                                checked={gstSettings.reverseCharge}
                                                onCheckedChange={(checked) =>
                                                    setGstSettings(prev => ({ ...prev, reverseCharge: checked }))
                                                }
                                            />
                                            <Label htmlFor="reverseCharge">Reverse Charge Applicable</Label>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Price Breakdown Preview */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Price Breakdown Preview</CardTitle>
                                <CardDescription>
                                    See how GST affects pricing
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="samplePrice">Sample Price (₹)</Label>
                                    <Input
                                        id="samplePrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={samplePrice}
                                        onChange={(e) => setSamplePrice(parseFloat(e.target.value) || 0)}
                                    />
                                </div>

                                {priceBreakdown && (
                                    <div className="space-y-3">
                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Base Price:</span>
                                                <span className="font-medium">{formatCurrency(priceBreakdown.basePrice)}</span>
                                            </div>

                                            {gstSettings.isGSTApplicable && (
                                                <>
                                                    {priceBreakdown.cgstAmount > 0 && (
                                                        <div className="flex justify-between text-sm">
                                                            <span>CGST ({gstSettings.gstRate / 2}%):</span>
                                                            <span>{formatCurrency(priceBreakdown.cgstAmount)}</span>
                                                        </div>
                                                    )}

                                                    {priceBreakdown.sgstAmount > 0 && (
                                                        <div className="flex justify-between text-sm">
                                                            <span>SGST ({gstSettings.gstRate / 2}%):</span>
                                                            <span>{formatCurrency(priceBreakdown.sgstAmount)}</span>
                                                        </div>
                                                    )}

                                                    {priceBreakdown.igstAmount > 0 && (
                                                        <div className="flex justify-between text-sm">
                                                            <span>IGST ({gstSettings.gstRate}%):</span>
                                                            <span>{formatCurrency(priceBreakdown.igstAmount)}</span>
                                                        </div>
                                                    )}

                                                    {priceBreakdown.cessAmount > 0 && (
                                                        <div className="flex justify-between text-sm">
                                                            <span>Cess ({gstSettings.cessRate}%):</span>
                                                            <span>{formatCurrency(priceBreakdown.cessAmount)}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between font-medium">
                                                        <span>Total GST:</span>
                                                        <span>{formatCurrency(priceBreakdown.totalGST)}</span>
                                                    </div>
                                                </>
                                            )}

                                            <Separator />

                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Price:</span>
                                                <span>{formatCurrency(priceBreakdown.totalPriceWithGST)}</span>
                                            </div>
                                        </div>

                                        {gstSettings.isGSTApplicable && (
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    GST Rate: {gstSettings.gstRate}% |
                                                    Type: {GST_TYPES.find(t => t.value === gstSettings.gstType)?.label} |
                                                    Effective Tax: {((priceBreakdown.totalGST / priceBreakdown.basePrice) * 100).toFixed(2)}%
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* GST Compliance Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    GST Compliance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p>• HSN codes are mandatory for goods with turnover {'>'}₹5 crores</p>
                                    <p>• SAC codes are required for all services</p>
                                    <p>• Use CGST+SGST for intra-state supplies</p>
                                    <p>• Use IGST for inter-state supplies</p>
                                    <p>• Reverse charge applies to specific categories</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save GST Settings'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}