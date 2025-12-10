import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/reservations-logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/stays', label: 'Stays' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/destinations', label: 'Destinations' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
      <div className="container-app">
        <div className="flex items-center justify-between h-24 sm:h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Reservations.ph" className="h-20 sm:h-24 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-sm ${
                  location.pathname === link.href ? 'text-foreground' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/register">
                List your property
              </Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/admin">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border/50" />
              <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                List your property
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="mx-4 mt-2"
              >
                <Button className="w-full bg-primary">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
