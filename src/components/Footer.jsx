import { Link } from "react-router-dom";

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
            <a href="#" className="hover:text-sand transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="#" className="hover:text-sand transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
            </a>
            <a href="#" className="hover:text-sand transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
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
