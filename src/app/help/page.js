'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Package, 
  PawPrint, 
  UserCheck,
  Calendar,
  ShoppingCart,
  FileText,
  Server,
  BookOpen,
  Settings
} from 'lucide-react';

import { InventoryHelp } from '@/components/help/help-sections/inventory-help';
import { PetHelp } from '@/components/help/help-sections/pet-help';
import { OwnerHelp } from '@/components/help/help-sections/owner-help';
import { AppointmentHelp } from '@/components/help/help-sections/appointment-help';
import { SalesHelp } from '@/components/help/help-sections/sales-help';
import { InvoiceHelp } from '@/components/help/help-sections/invoice-help';
import { APIHelp } from '@/components/help/help-sections/api-help';
import { UserJourneyHelp } from '@/components/help/help-sections/user-journey-help';
import { SettingsHelp } from '@/components/help/help-sections/settings-help';

export default function HelpPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'getting-started';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="h-10 w-10 text-primary" />
            TailTally Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive documentation and help for all TailTally features. Find guides, tutorials, and API documentation to get the most out of your pet business management system.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 lg:grid-cols-9 h-auto p-1">
              <TabsTrigger value="getting-started" className="flex flex-col items-center gap-2 p-4">
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm">Getting Started</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex flex-col items-center gap-2 p-4">
                <Package className="h-5 w-5" />
                <span className="text-sm">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="pets" className="flex flex-col items-center gap-2 p-4">
                <PawPrint className="h-5 w-5" />
                <span className="text-sm">Pets</span>
              </TabsTrigger>
              <TabsTrigger value="owners" className="flex flex-col items-center gap-2 p-4">
                <UserCheck className="h-5 w-5" />
                <span className="text-sm">Owners</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex flex-col items-center gap-2 p-4">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex flex-col items-center gap-2 p-4">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">Sales</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex flex-col items-center gap-2 p-4">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Invoices</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex flex-col items-center gap-2 p-4">
                <Server className="h-5 w-5" />
                <span className="text-sm">API</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center gap-2 p-4">
                <Settings className="h-5 w-5" />
                <span className="text-sm">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Getting Started Help */}
            <TabsContent value="getting-started" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Getting Started Guide
                </h2>
                <p className="text-muted-foreground">
                  Complete user journey and step-by-step guide to using TailTally effectively
                </p>
              </div>
              <UserJourneyHelp />
            </TabsContent>

            {/* Inventory Help */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Inventory Management Help
                </h2>
                <p className="text-muted-foreground">
                  Complete guide to managing your pet business inventory with GST compliance
                </p>
              </div>
              <InventoryHelp />
            </TabsContent>

            {/* Pet Help */}
            <TabsContent value="pets" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <PawPrint className="h-6 w-6 text-primary" />
                  Pet Management Help
                </h2>
                <p className="text-muted-foreground">
                  Everything you need to know about managing pet records and care
                </p>
              </div>
              <PetHelp />
            </TabsContent>

            {/* Owner Help */}
            <TabsContent value="owners" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  Owner Management Help
                </h2>
                <p className="text-muted-foreground">
                  Customer relationship management and owner profile handling
                </p>
              </div>
              <OwnerHelp />
            </TabsContent>

            {/* Appointment Help */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Appointment Management Help
                </h2>
                <p className="text-muted-foreground">
                  Complete guide to scheduling and managing pet appointments
                </p>
              </div>
              <AppointmentHelp />
            </TabsContent>

            {/* Sales Help */}
            <TabsContent value="sales" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  Sales Management Help
                </h2>
                <p className="text-muted-foreground">
                  Complete guide to recording sales and managing transactions
                </p>
              </div>
              <SalesHelp />
            </TabsContent>

            {/* Invoice Help */}
            <TabsContent value="invoices" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Invoice Management Help
                </h2>
                <p className="text-muted-foreground">
                  Professional invoicing with GST compliance and payment tracking
                </p>
              </div>
              <InvoiceHelp />
            </TabsContent>

            {/* API Help */}
            <TabsContent value="api" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Server className="h-6 w-6 text-primary" />
                  API Documentation
                </h2>
                <p className="text-muted-foreground">
                  Complete API reference for integrating with TailTally
                </p>
              </div>
              <APIHelp />
            </TabsContent>

            {/* Settings Help */}
            <TabsContent value="settings" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Settings className="h-6 w-6 text-primary" />
                  Settings & Configuration Help
                </h2>
                <p className="text-muted-foreground">
                  Complete guide to configuring email integration and public booking system
                </p>
              </div>
              <SettingsHelp />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}