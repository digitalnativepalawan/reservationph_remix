import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import logo from '@/assets/reservations-logo.png';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container-app py-8 md:py-16">
        {/* Mobile Layout - Stacked and compact */}
        <div className="flex flex-col gap-8 md:hidden">
          {/* Brand + Social */}
          <div className="text-center">
            <Link to="/" className="inline-block mb-3">
              <img src={logo} alt="Reservations.ph" className="h-8 mx-auto" />
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
              Your gateway to the best accommodations in Palawan, Philippines.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="#"
                className="p-2.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Destinations</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/search?destination=puerto-princesa" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Puerto Princesa
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=port-barton" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Port Barton
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=san-vicente" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    San Vicente
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=el-nido" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    El Nido
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact - Stacked on mobile */}
          <div className="flex flex-col items-center gap-3">
            <a href="mailto:hello@reservations.ph" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
              <Mail className="h-4 w-4" />
              hello@reservations.ph
            </a>
            <a href="tel:+639123456789" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +63 912 345 6789
            </a>
          </div>

          {/* Bottom - Mobile */}
          <div className="pt-6 border-t border-border/50 text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
                Privacy
              </Link>
              <span className="text-border">•</span>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
                Terms
              </Link>
            </div>
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Reservations.ph
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-block mb-4">
                <img src={logo} alt="Reservations.ph" className="h-8" />
              </Link>
              <p className="text-muted-foreground text-sm mb-4">
                Your gateway to the best accommodations in Palawan, Philippines.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Destinations</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/search?destination=puerto-princesa" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Puerto Princesa
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=port-barton" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Port Barton
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=san-vicente" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    San Vicente
                  </Link>
                </li>
                <li>
                  <Link to="/search?destination=el-nido" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    El Nido
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="mailto:hello@reservations.ph" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    hello@reservations.ph
                  </a>
                </li>
                <li>
                  <a href="tel:+639123456789" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +63 912 345 6789
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-border/50 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Reservations.ph. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
