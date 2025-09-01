import { Rocket, Sparkles, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ComingSoon() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-4xl text-center shadow-xl border-0 bg-background/80 backdrop-blur">
        <CardHeader className="space-y-8 pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center group hover:scale-110 transition-transform duration-300">
            <Rocket className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          <div className="space-y-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard Coming Soon
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're crafting an exceptional experience for your pet business management needs
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="font-bold text-lg">Modern Interface</h3>
              <p className="text-muted-foreground leading-relaxed">
                Clean, intuitive design built for maximum efficiency and user delight
              </p>
            </div>

            <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Clock className="w-8 h-8 text-green-600 animate-spin" style={{animationDuration: '3s'}} />
              </div>
              <h3 className="font-bold text-lg">Real-time Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live data synchronization across all devices with instant notifications
              </p>
            </div>

            <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-purple-600 animate-bounce" />
              </div>
              <h3 className="font-bold text-lg">Advanced Features</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive suite of tools designed specifically for pet care professionals
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Badge variant="secondary" className="text-base px-6 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 animate-pulse">
              🚀 In Active Development
            </Badge>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Expected launch: <span className="font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Q2 2025</span>
              </p>
              <Button className="px-8 py-3 text-base font-semibold hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                Get Notified When Ready
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="text-muted-foreground">
              In the meantime, explore the navigation menu to discover all the features we're building for you
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}