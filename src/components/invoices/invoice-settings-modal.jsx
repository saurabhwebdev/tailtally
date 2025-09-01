'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  FileText, 
  Palette,
  Save,
  Upload,
  X
} from 'lucide-react';

export function InvoiceSettingsModal({ open, onClose }) {
  const [settings, setSettings] = useState({
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
  });

  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('invoiceSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('invoiceSettings', JSON.stringify(settings));
    onClose();
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setSettings(prev => ({
          ...prev,
          design: {
            ...prev.design,
            logo: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSettings(prev => ({
      ...prev,
      design: {
        ...prev.design,
        logo: null
      }
    }));
  };

  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Invoice Settings
          </DialogTitle>
          <DialogDescription>
            Customize your invoice appearance and company information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoice
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.company.name}
                      onChange={(e) => updateSetting('company', 'name', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={settings.company.phone}
                      onChange={(e) => updateSetting('company', 'phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.company.email}
                      onChange={(e) => updateSetting('company', 'email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={settings.company.website}
                      onChange={(e) => updateSetting('company', 'website', e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyGSTIN">GSTIN</Label>
                    <Input
                      id="companyGSTIN"
                      value={settings.company.gstin}
                      onChange={(e) => updateSetting('company', 'gstin', e.target.value)}
                      placeholder="Enter GSTIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPAN">PAN</Label>
                    <Input
                      id="companyPAN"
                      value={settings.company.pan}
                      onChange={(e) => updateSetting('company', 'pan', e.target.value)}
                      placeholder="Enter PAN"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.company.address}
                    onChange={(e) => updateSetting('company', 'address', e.target.value)}
                    placeholder="Enter company address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input
                      id="invoicePrefix"
                      value={settings.invoice.prefix}
                      onChange={(e) => updateSetting('invoice', 'prefix', e.target.value)}
                      placeholder="INV"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startNumber">Start Number</Label>
                    <Input
                      id="startNumber"
                      type="number"
                      value={settings.invoice.startNumber}
                      onChange={(e) => updateSetting('invoice', 'startNumber', parseInt(e.target.value))}
                      placeholder="1001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input
                      id="currency"
                      value={settings.invoice.currency}
                      onChange={(e) => updateSetting('invoice', 'currency', e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencyCode">Currency Code</Label>
                    <Input
                      id="currencyCode"
                      value={settings.invoice.currencyCode}
                      onChange={(e) => updateSetting('invoice', 'currencyCode', e.target.value)}
                      placeholder="INR"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={settings.invoice.terms}
                    onChange={(e) => updateSetting('invoice', 'terms', e.target.value)}
                    placeholder="Enter terms and conditions"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer">Footer Text</Label>
                  <Textarea
                    id="footer"
                    value={settings.invoice.footer}
                    onChange={(e) => updateSetting('invoice', 'footer', e.target.value)}
                    placeholder="Enter footer text"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => document.getElementById('logoUpload').click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    {logoPreview && (
                      <Button variant="outline" onClick={removeLogo}>
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                  {logoPreview && (
                    <div className="mt-4">
                      <img src={logoPreview} alt="Logo preview" className="h-20 w-auto object-contain border rounded" />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Color Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="primaryColor"
                        type="color"
                        value={settings.design.primaryColor}
                        onChange={(e) => updateSetting('design', 'primaryColor', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={settings.design.primaryColor}
                        onChange={(e) => updateSetting('design', 'primaryColor', e.target.value)}
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="secondaryColor"
                        type="color"
                        value={settings.design.secondaryColor}
                        onChange={(e) => updateSetting('design', 'secondaryColor', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={settings.design.secondaryColor}
                        onChange={(e) => updateSetting('design', 'secondaryColor', e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Display Options */}
                <div className="space-y-4">
                  <Label>Display Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="showLogo"
                        type="checkbox"
                        checked={settings.design.showLogo}
                        onChange={(e) => updateSetting('design', 'showLogo', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showLogo">Show Logo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="showGST"
                        type="checkbox"
                        checked={settings.design.showGST}
                        onChange={(e) => updateSetting('design', 'showGST', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showGST">Show GST Details</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="showTerms"
                        type="checkbox"
                        checked={settings.design.showTerms}
                        onChange={(e) => updateSetting('design', 'showTerms', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showTerms">Show Terms</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="showFooter"
                        type="checkbox"
                        checked={settings.design.showFooter}
                        onChange={(e) => updateSetting('design', 'showFooter', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showFooter">Show Footer</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {settings.design.showLogo && settings.design.logo && (
                        <img src={settings.design.logo} alt="Logo" className="h-12 w-auto mb-2" />
                      )}
                      <h2 className="text-xl font-bold" style={{ color: settings.design.primaryColor }}>
                        {settings.company.name}
                      </h2>
                      <p className="text-sm text-gray-600">{settings.company.address}</p>
                      <p className="text-sm text-gray-600">Phone: {settings.company.phone}</p>
                      <p className="text-sm text-gray-600">Email: {settings.company.email}</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold" style={{ color: settings.design.primaryColor }}>
                        INVOICE
                      </h1>
                      <p className="text-sm text-gray-600">#{settings.invoice.prefix}-{settings.invoice.startNumber}</p>
                      <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Sample Content */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Bill To:</h3>
                        <p className="text-sm">John Doe</p>
                        <p className="text-sm">123 Customer St</p>
                        <p className="text-sm">City, State 12345</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Ship To:</h3>
                        <p className="text-sm">John Doe</p>
                        <p className="text-sm">123 Customer St</p>
                        <p className="text-sm">City, State 12345</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b" style={{ backgroundColor: settings.design.secondaryColor + '20' }}>
                            <th className="text-left p-2">Item</th>
                            <th className="text-right p-2">Qty</th>
                            <th className="text-right p-2">Price</th>
                            <th className="text-right p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Sample Product</td>
                            <td className="text-right p-2">2</td>
                            <td className="text-right p-2">{settings.invoice.currency}500.00</td>
                            <td className="text-right p-2">{settings.invoice.currency}1,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mt-4">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{settings.invoice.currency}1,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (18%):</span>
                          <span>{settings.invoice.currency}180.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{settings.invoice.currency}1,180.00</span>
                        </div>
                      </div>
                    </div>

                    {settings.design.showTerms && (
                      <div className="mt-6 p-4 bg-gray-50 rounded">
                        <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
                        <p className="text-sm text-gray-600">{settings.invoice.terms}</p>
                      </div>
                    )}

                    {settings.design.showFooter && (
                      <div className="mt-6 text-center text-sm text-gray-600">
                        {settings.invoice.footer}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
