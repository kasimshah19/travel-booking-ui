import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, DiscIcon as Discord } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-sage px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        <div className="md:w-1/3">
          <p className="text-sand font-display font-semibold text-2xl mb-2">Wanderlist</p>
          <p className="text-sm text-sand/60 pr-4">
            Book your next premium trip without the guesswork. Hand-picked destinations across India for the modern traveler.
          </p>
          <div className="flex gap-4 mt-6 text-sand/60">
            <a href="#" className="hover:text-sand transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-sand transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-sand transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-24 text-sm w-full md:w-auto">
          {/* Column 1: Explore */}
          <div>
            <p className="text-sand font-semibold mb-4 text-base">Explore</p>
            <ul className="space-y-3 text-sand/70">
              <li><Link to="/#destinations" className="hover:text-sand transition-colors">Destinations</Link></li>
              <li><Link to="/deals" className="hover:text-sand transition-colors">Flash Deals</Link></li>
              <li><Link to="/" className="hover:text-sand transition-colors">Featured</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <p className="text-sand font-semibold mb-4 text-base">Company</p>
            <ul className="space-y-3 text-sand/70">
              <li><Link to="#" className="hover:text-sand transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-sand transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-sand transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <p className="text-sand font-semibold mb-4 text-base">Support</p>
            <ul className="space-y-3 text-sand/70">
              <li><Link to="/contact" className="hover:text-sand transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-sand transition-colors">Help Centre</Link></li>
              <li><Link to="/#destinations" className="hover:text-sand transition-colors">Cancellations</Link></li>
            </ul>
          </div>
        </div>

      </div>
      <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sand/50">
        <p>© {new Date().getFullYear()} Wanderlist. Built for demo purposes.</p>
        <p className="mt-2 md:mt-0">Seamlessly crafted for explorers.</p>
      </div>
    </footer>
  );
}
