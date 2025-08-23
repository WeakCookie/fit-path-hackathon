import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, Dumbbell } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md shadow-sm border-b border-white/70">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 bg-gradient-to-r from-fitness-orange to-fitness-orange-hover rounded-lg shadow-md">
              <Dumbbell className="h-5 w-5 text-fitness-orange-foreground" />
            </div>
            FitPath
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/program"
              className={`text-sm font-medium transition-colors ${
                isActive("/program") 
                  ? "text-fitness-orange" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Program
            </Link>
            <Link
              to="/knowledge-base"
              className={`text-sm font-medium transition-colors ${
                isActive("/knowledge-base") 
                  ? "text-fitness-orange" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Knowledge Base
            </Link>
            <Link
              to="/training-history"
              className={`text-sm font-medium transition-colors ${
                isActive("/training-history") 
                  ? "text-fitness-orange" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Training History
            </Link>
            <Link
              to="/recovery"
              className={`text-sm font-medium transition-colors ${
                isActive("/recovery") 
                  ? "text-fitness-orange" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Recovery
            </Link>
            <Link
              to="/research-confidence"
              className={`text-sm font-medium transition-colors ${
                isActive("/research-confidence") 
                  ? "text-fitness-orange" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Research Confidence
            </Link>
            <Button 
              variant="hero" 
              size="sm" 
              asChild
            >
              <Link to="/training-log">Start Training</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/training-log"
                className={`text-sm font-medium transition-colors ${
                  isActive("/training-log") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Training Log
              </Link>
              <Link
                to="/training-history"
                className={`text-sm font-medium transition-colors ${
                  isActive("/training-history") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Training History
              </Link>
              <Link
                to="/research-confidence"
                className={`text-sm font-medium transition-colors ${
                  isActive("/research-confidence") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Research Confidence
              </Link>
              <Link
                to="/knowledge-base"
                className={`text-sm font-medium transition-colors ${
                  isActive("/knowledge-base") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Knowledge Base
              </Link>
              <Link
                to="/recovery"
                className={`text-sm font-medium transition-colors ${
                  isActive("/recovery") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Recovery
              </Link>
              <Link
                to="/program"
                className={`text-sm font-medium transition-colors ${
                  isActive("/program") 
                    ? "text-fitness-orange" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Program
              </Link>
              <Button 
                variant="hero" 
                size="sm" 
                className="w-fit"
                asChild
              >
                <Link to="/training-log" onClick={() => setIsOpen(false)}>
                  Start Training
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}