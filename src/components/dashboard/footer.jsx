import { Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left section - Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">© 2025</span>
            <span className="font-semibold text-sm" style={{fontFamily: 'Brush Script MT, cursive', color: '#e63946'}}>TailTally</span>
            <span className="text-sm text-muted-foreground">All rights reserved.</span>
          </div>
          
          {/* Right section - Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms
            </Link>
            <Link 
              href="/support" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Support
            </Link>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <span className="text-xs">Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}