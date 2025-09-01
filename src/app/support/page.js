"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MessageCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Support Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Find answers to your questions or get in touch with our support team.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Get help via email with detailed responses from our support team.
              </p>
              <p className="font-semibold">support@tailtally.com</p>
              <p className="text-sm text-muted-foreground">Response time: 24 hours</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Chat with our support team in real-time for immediate assistance.
              </p>
              <Button className="w-full">Start Live Chat</Button>
              <p className="text-sm text-muted-foreground mt-2">Available 9 AM - 6 PM EST</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Phone Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Speak directly with our support team for urgent issues.
              </p>
              <p className="font-semibold">1-800-TAILTALLY</p>
              <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
            </CardContent>
          </Card>
        </div>


        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">How do I get started with TailTally?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Getting started is easy! Simply sign up for an account, complete your business profile, 
                  and follow our setup wizard to configure your POS system, add your first products, 
                  and start managing your pet business.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Can I import my existing customer data?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! TailTally supports importing customer data from CSV files. You can also import 
                  product catalogs, inventory data, and appointment history. Our support team can help 
                  you with the import process.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure with TailTally?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! We use industry-standard encryption and security measures to protect your data. 
                  All data is backed up regularly, and we comply with relevant data protection regulations. 
                  Check our Privacy Policy for more details.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for subscription payments. 
                  For POS transactions, TailTally integrates with popular payment processors to accept 
                  credit cards, debit cards, and digital payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Still Need Help?</CardTitle>
              <p className="text-muted-foreground">Send us a message and we'll get back to you soon.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="How can we help you?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="Describe your question or issue in detail..." rows={4} />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
