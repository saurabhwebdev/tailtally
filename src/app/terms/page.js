"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These terms govern your use of TailTally services. Please read them carefully.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing and using TailTally, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TailTally is a comprehensive pet business management platform that provides point-of-sale (POS) 
                functionality, appointment scheduling, inventory management, customer management, and other 
                business tools specifically designed for pet-related businesses.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Registration</h3>
                <p className="text-muted-foreground">
                  You must register for an account to use certain features of our service. You agree to provide 
                  accurate, current, and complete information during registration and to update such information 
                  to keep it accurate, current, and complete.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Security</h3>
                <p className="text-muted-foreground">
                  You are responsible for safeguarding the password and all activities that occur under your account. 
                  You agree to immediately notify us of any unauthorized use of your account.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You agree not to use the service to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Upload or transmit malicious software</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for any unlawful or fraudulent purposes</li>
                <li>Interfere with or disrupt the service or servers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Payment and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Subscription Fees</h3>
                <p className="text-muted-foreground">
                  Some features of TailTally require a paid subscription. You agree to pay all applicable fees 
                  as described in our pricing plans. Fees are charged in advance and are non-refundable except 
                  as required by law.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-muted-foreground">
                  We use third-party payment processors to handle billing and payments. By providing payment 
                  information, you authorize us to charge the applicable fees to your chosen payment method.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection and use of personal information is governed by 
                our Privacy Policy, which is incorporated into these terms by reference.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                While we strive to provide reliable service, we cannot guarantee that the service will be 
                available at all times. We may suspend or discontinue the service for maintenance, updates, 
                or other operational reasons. We will provide reasonable notice when possible.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TailTally and its affiliates shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, data, 
                use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Either party may terminate this agreement at any time. We may suspend or terminate your account 
                if you violate these terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of any material 
                changes via email or through the service. Your continued use of the service after changes 
                constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-1">
                <p className="text-muted-foreground">Email: legal@tailtally.com</p>
                <p className="text-muted-foreground">Last updated: January 2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
