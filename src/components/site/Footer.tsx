import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[oklch(0.22_0.04_160)] text-white/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="font-display text-3xl font-bold gold-gradient">Asá</div>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Nigeria's premium marketplace for verified skilled professionals. Trusted. Verified. Nearby.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/categories" className="hover:text-gold">Categories</Link></li>
            <li><Link to="/find-professionals" className="hover:text-gold">Find Professionals</Link></li>
            <li><Link to="/become-a-provider" className="hover:text-gold">Become a Provider</Link></li>
            <li><Link to="/how-it-works" className="hover:text-gold">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold">About Asá</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-gold">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Get the app</h4>
          <p className="text-sm text-white/70">Coming soon on iOS and Android.</p>
          <a href="mailto:hello@asa.ng" className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-gold">
            <Mail className="h-4 w-4" /> hello@asa.ng
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Asá. All rights reserved.</p>
          <p>Powered by <span className="font-semibold text-[#BDE0FE]">HEPTALABS</span></p>
        </div>
      </div>
    </footer>
  );
}
