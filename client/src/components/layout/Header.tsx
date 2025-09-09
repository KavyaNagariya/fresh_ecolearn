import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, scrollToSection } = useNavigation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoLearn
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              data-testid="nav-features"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              data-testid="nav-about"
            >
              About
            </button>
            <Link href="/signup">
  <Button className="ml-2 bg-green-600 text-white hover:bg-green-700">
    Sign Up
  </Button>
</Link>
<Link href="/signin">
  <Button className="ml-2 bg-blue-600 text-white hover:bg-blue-700">
    Sign In
  </Button>
</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden relative w-6 h-6 focus:outline-none",
              isMobileMenuOpen && "hamburger-open"
            )}
            data-testid="button-mobile-menu"
          >
            <span className="hamburger-line line-1 absolute h-0.5 w-6 bg-foreground top-0 left-0 rounded"></span>
            <span className="hamburger-line line-2 absolute h-0.5 w-6 bg-foreground top-2.5 left-0 rounded"></span>
            <span className="hamburger-line line-3 absolute h-0.5 w-6 bg-foreground top-5 left-0 rounded"></span>
          </button>
        </div>
      </nav>

      {/* Enhanced Mobile Navigation Overlay */}
      <div className={cn(
        "nav-mobile fixed inset-y-0 right-0 w-full bg-background/98 backdrop-blur-xl md:hidden z-40",
        isMobileMenuOpen && "open"
      )}>
        <div className="flex flex-col items-center justify-center h-full space-y-10 p-8">
          <button 
            onClick={() => scrollToSection("home")}
            className="text-3xl font-bold text-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform slide-up"
            data-testid="mobile-nav-home"
          >
            <span className="relative">
              Home
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-20 rounded-lg -z-10 transition-opacity duration-300"></div>
            </span>
          </button>
          <button 
            onClick={() => scrollToSection("features")}
            className="text-3xl font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform slide-up"
            style={{animationDelay: "0.1s"}}
            data-testid="mobile-nav-features"
          >
            <span className="relative">
              Features
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-20 rounded-lg -z-10 transition-opacity duration-300"></div>
            </span>
          </button>
          <button 
            onClick={() => scrollToSection("about")}
            className="text-3xl font-bold text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform slide-up"
            style={{animationDelay: "0.2s"}}
            data-testid="mobile-nav-about"
          >
            <span className="relative">
              About
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 hover:opacity-20 rounded-lg -z-10 transition-opacity duration-300"></div>
            </span>
          </button>
          <Link href="/signup">
            <Button 
              className="morphing-gradient text-white px-12 py-4 rounded-full text-2xl font-bold hover:shadow-2xl hover:scale-110 transition-all duration-300 glow-pulse slide-up"
              style={{animationDelay: "0.3s"}}
              data-testid="mobile-button-signup"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Button>
          </Link>
          
          {/* Close button for mobile menu */}
          <button
            onClick={toggleMobileMenu}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm hover:bg-muted transition-colors duration-200"
            data-testid="button-close-mobile-menu"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
