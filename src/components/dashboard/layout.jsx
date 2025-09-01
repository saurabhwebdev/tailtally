"use client"

import { Header } from "./header"
import { Footer } from "./footer"

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Main Content - Full width layout */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] overflow-auto">
        <div className="flex-1 animate-fade-in p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}