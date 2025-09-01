'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Package, 
  PawPrint, 
  UserCheck,
  Calculator,
  ShoppingCart,
  BarChart3,
  Settings,
  BookOpen,
  FileText
} from 'lucide-react';

import { InventoryHelp } from './help-sections/inventory-help';
import { PetHelp } from './help-sections/pet-help';
import { OwnerHelp } from './help-sections/owner-help';
import { UserJourneyHelp } from './help-sections/user-journey-help';
import { SalesHelp } from './help-sections/sales-help';
import { InvoiceHelp } from './help-sections/invoice-help';
import { SettingsHelp } from './help-sections/settings-help';

export default function ComprehensiveHelpModal({ isOpen, onClose, defaultTab = "getting-started" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            TailTally Help & Documentation
          </DialogTitle>
          <DialogDescription>
            Comprehensive help documentation for all TailTally features and functionality
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="getting-started" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Start</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              <span className="hidden sm:inline">Pets</span>
            </TabsTrigger>
            <TabsTrigger value="owners" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Owners</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="gst" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">GST</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Getting Started Help */}
          <TabsContent value="getting-started">
            <UserJourneyHelp />
          </TabsContent>

          {/* Inventory Help */}
          <TabsContent value="inventory">
            <InventoryHelp />
          </TabsContent>

          {/* Pet Help */}
          <TabsContent value="pets">
            <PetHelp />
          </TabsContent>

          {/* Owner Help */}
          <TabsContent value="owners">
            <OwnerHelp />
          </TabsContent>

          {/* GST Help - Import the existing GST help content */}
          <TabsContent value="gst">
            <div className="space-y-4">
              {/* We'll import the GST help content from the existing modal */}
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">GST Compliance Help</h3>
                <p className="text-muted-foreground">
                  Comprehensive GST help is available in the Inventory section under the GST tab.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Sales Help */}
          <TabsContent value="sales">
            <SalesHelp />
          </TabsContent>

          {/* Invoices Help */}
          <TabsContent value="invoices">
            <InvoiceHelp />
          </TabsContent>

          {/* Reports Help */}
          <TabsContent value="reports">
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reports & Analytics Help</h3>
                <p className="text-muted-foreground">
                  Detailed reporting help is available in the respective sections (Inventory, Pets, Owners) under their Reports tabs.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Settings Help */}
          <TabsContent value="settings">
            <SettingsHelp />
          </TabsContent>

          {/* API Help */}
          <TabsContent value="api">
            <div className="space-y-4">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">API Documentation</h3>
                <p className="text-muted-foreground">
                  Complete API documentation is available in the main documentation section. Navigate to the API Docs page for detailed information.
                </p>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}