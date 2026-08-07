import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Linkedin, Mail, BadgeCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-bold text-primary">Asá</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Nigeria's trusted services marketplace. Connect with verified professionals, post jobs, chat and pay securely.
          </p>
          <div className="mt-6 flex gap-2">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/categories" className="transition hover:text-primary">Categories</Link></li>
            <li><Link to="/find-professionals" className="transition hover:text-primary">Find Professionals</Link></li>
            <li><Link to="/directory" className="transition hover:text-primary">Member Directory</Link></li>
            <li><Link to="/feed" className="transition hover:text-primary">Community Feed</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="transition hover:text-primary">About Asá</Link></li>
            <li><Link to="/how-it-works" className="transition hover:text-primary">How It Works</Link></li>
            <li><Link to="/contact" className="transition hover:text-primary">Contact</Link></li>
            <li><Link to="/faq" className="transition hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Legal & Support</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="transition hover:text-primary">Privacy</Link></li>
            <li><Link to="/terms" className="transition hover:text-primary">Terms</Link></li>
            <li><Link to="/become-a-provider" className="transition hover:text-primary">Become a Provider</Link></li>
          </ul>
          <a href="mailto:hello@asa.ng" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
            <Mail className="h-4 w-4" /> hello@asa.ng
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Asá. All rights reserved.</p>
          <p>Powered by <span className="font-semibold text-primary">HEPTALABS</span></p>
        </div>
      </div>
    </footer>
  );
}
