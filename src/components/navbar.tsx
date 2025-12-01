import { ModeToggle } from "./mode-toggle"
import { BookOpen } from "lucide-react"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Talacards
          </span>
        </div>
        
       
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/ravvdevv/ravenkit" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}