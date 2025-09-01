'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  CheckCircle, 
  Circle,
  UserPlus,
  PawPrint,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Lightbulb,
  Clock,
  Target
} from 'lucide-react';

export function UserJourneyHelp() {
  // Test if component renders
  console.log('UserJourneyHelp component is rendering');
  
  const journeySteps = [
    {
      id: 1,
      title: "Initial Setup",
      icon: Settings,
      duration: "5-10 minutes",
      description: "Configure your TailTally system for first use",
      tasks: [
        "Set up your business profile and GST settings",
        "Configure default tax rates and business information",
        "Set up user preferences and notification settings"
      ],
      tips: [
        "Complete GST setup first to ensure proper tax calculations",
        "Keep your business registration details handy"
      ]
    },
    {
      id: 2,
      title: "Add Inventory Items",
      icon: Package,
      duration: "15-30 minutes",
      description: "Set up your product catalog with all items you sell",
      tasks: [
        "Add product categories (Food, Toys, Accessories, etc.)",
        "Create inventory items with SKUs, prices, and descriptions",
        "Set up GST rates for each product category",
        "Configure stock levels and reorder points",
        "Add supplier information for purchase tracking"
      ],
      tips: [
        "Use clear, descriptive names for easy searching",
        "Set up proper GST classifications from the start",
        "Take photos of products for better identification"
      ]
    },
    {
      id: 3,
      title: "Register Pet Owners",
      icon: UserPlus,
      duration: "2-5 minutes per customer",
      description: "Build your customer database with owner information",
      tasks: [
        "Add customer contact details (name, phone, email, address)",
        "Record emergency contact information",
        "Set up customer preferences and notes",
        "Create customer groups for targeted marketing"
      ],
      tips: [
        "Collect complete contact information for better service",
        "Ask for preferred communication methods",
        "Note any special requirements or preferences"
      ]
    },
    {
      id: 4,
      title: "Add Pet Profiles",
      icon: PawPrint,
      duration: "3-5 minutes per pet",
      description: "Create detailed profiles for each pet",
      tasks: [
        "Record basic information (name, species, breed, age)",
        "Add medical history and vaccination records",
        "Note dietary restrictions and allergies",
        "Upload pet photos for identification",
        "Set up medical reminders and appointments"
      ],
      tips: [
        "Keep medical records up to date",
        "Note behavioral traits that affect service",
        "Record microchip and registration numbers"
      ]
    },
    {
      id: 5,
      title: "Process Sales",
      icon: ShoppingCart,
      duration: "2-5 minutes per sale",
      description: "Handle customer purchases and transactions",
      tasks: [
        "Select customer and pet (if applicable)",
        "Add items to the sale from inventory",
        "Apply discounts and promotional offers",
        "Calculate taxes and final amounts",
        "Process payment (cash, card, UPI, etc.)",
        "Generate receipt and delivery notes"
      ],
      tips: [
        "Double-check customer details before processing",
        "Verify stock availability before confirming sale",
        "Offer related products to increase sale value"
      ]
    },
    {
      id: 6,
      title: "Manage Invoices",
      icon: FileText,
      duration: "1-3 minutes per invoice",
      description: "Handle billing and payment tracking",
      tasks: [
        "Generate invoices for credit sales",
        "Track payment status and due dates",
        "Send payment reminders to customers",
        "Record partial payments and adjustments",
        "Generate GST-compliant invoices"
      ],
      tips: [
        "Set up automatic payment reminders",
        "Offer multiple payment options",
        "Keep detailed payment records for accounting"
      ]
    },
    {
      id: 7,
      title: "Track Payments",
      icon: CreditCard,
      duration: "1-2 minutes per payment",
      description: "Monitor and record all payment transactions",
      tasks: [
        "Record cash and digital payments",
        "Track pending and overdue amounts",
        "Generate payment receipts",
        "Reconcile daily cash and card transactions",
        "Handle refunds and adjustments"
      ],
      tips: [
        "Reconcile payments daily for accuracy",
        "Keep digital copies of all payment records",
        "Set up payment method preferences per customer"
      ]
    },
    {
      id: 8,
      title: "Monitor Analytics",
      icon: BarChart3,
      duration: "10-15 minutes daily",
      description: "Review business performance and insights",
      tasks: [
        "Check daily sales and revenue reports",
        "Monitor inventory levels and reorder needs",
        "Review customer purchase patterns",
        "Analyze product performance and profitability",
        "Track GST collections and payments"
      ],
      tips: [
        "Review reports at the same time daily",
        "Set up alerts for low stock items",
        "Use insights to plan inventory purchases"
      ]
    }
  ];

  const dailyWorkflow = [
    {
      time: "Opening (9:00 AM)",
      tasks: [
        "Check overnight orders and messages",
        "Review daily appointment schedule",
        "Verify cash register opening balance",
        "Check inventory for any urgent restocks"
      ]
    },
    {
      time: "Morning Operations (9:00 AM - 12:00 PM)",
      tasks: [
        "Process walk-in customers and sales",
        "Handle scheduled appointments",
        "Update pet medical records",
        "Receive and process inventory deliveries"
      ]
    },
    {
      time: "Afternoon Operations (12:00 PM - 6:00 PM)",
      tasks: [
        "Continue customer service and sales",
        "Process invoices and payments",
        "Follow up on overdue payments",
        "Update inventory after deliveries"
      ]
    },
    {
      time: "Closing (6:00 PM - 7:00 PM)",
      tasks: [
        "Reconcile daily cash and card transactions",
        "Generate daily sales report",
        "Check low stock alerts",
        "Plan next day's activities",
        "Backup important data"
      ]
    }
  ];

  const bestPractices = [
    {
      category: "Data Management",
      practices: [
        "Backup your data regularly",
        "Keep customer information updated",
        "Maintain accurate inventory counts",
        "Archive old records periodically"
      ]
    },
    {
      category: "Customer Service",
      practices: [
        "Always verify customer details before processing",
        "Keep detailed notes about customer preferences",
        "Follow up on pet health and wellness",
        "Provide clear receipts and documentation"
      ]
    },
    {
      category: "Inventory Management",
      practices: [
        "Set up automatic reorder points",
        "Track expiry dates for perishable items",
        "Organize products by category and frequency of use",
        "Regular stock audits and cycle counts"
      ]
    },
    {
      category: "Financial Management",
      practices: [
        "Reconcile payments daily",
        "Keep GST records organized",
        "Monitor cash flow regularly",
        "Set up payment terms clearly with customers"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Complete User Journey Guide</h2>
        <p className="text-muted-foreground">
          A step-by-step guide to using TailTally effectively for your pet business
        </p>
      </div>

      {/* Quick Start Alert */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Start Tip:</strong> Follow these steps in order for the best setup experience. 
          Each step builds on the previous one to create a complete business management system.
        </AlertDescription>
      </Alert>

      {/* Journey Steps */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Setup Journey (One-time Setup)</h3>
        
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === journeySteps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          Step {step.id}: {step.title}
                        </CardTitle>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                        </Badge>
                      </div>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tasks */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Tasks to Complete:
                    </h4>
                    <ul className="space-y-1">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2">
                          <Circle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span className="text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Pro Tips:
                    </h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow to next step */}
              {!isLast && (
                <div className="flex justify-center my-4">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Daily Workflow */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Daily Workflow Guide</h3>
        <p className="text-muted-foreground mb-4">
          Once your system is set up, follow this daily routine to manage your pet business efficiently.
        </p>
        
        <div className="grid gap-4">
          {dailyWorkflow.map((period, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{period.time}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {period.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span className="text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Best Practices */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
        <p className="text-muted-foreground mb-4">
          Follow these best practices to get the most out of TailTally and maintain efficient operations.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {bestPractices.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.practices.map((practice, practiceIndex) => (
                    <li key={practiceIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                      <span className="text-sm">{practice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          <strong>Success Indicators:</strong> You'll know you're using TailTally effectively when you can:
          process a sale in under 3 minutes, find any customer or pet record in seconds, 
          generate accurate GST reports monthly, and have real-time visibility into your inventory levels.
        </AlertDescription>
      </Alert>
    </div>
  );
}