import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LogoMark } from "@/components/brand/logo";
import { companyLinks, productLinks, supportLinks } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socials = [
  { label: "Instagram", href: "https://instagram.com/farmersai", icon: Instagram },
  { label: "Discord", href: "https://discord.gg/farmersai", icon: MessageCircle },
  { label: "YouTube", href: "https://youtube.com/@farmersai", icon: Youtube },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // bot
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setEmail("");
      toast.success("You're subscribed to the Farmer's AI field notes.");
    }, 500);
  };

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-lg font-bold">Farmer&apos;s AI</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Biological vision intelligence for growers — crop health, soil diagnostics, seed
              quality and produce grading from a single photo.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex max-w-sm gap-2">
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@farm.com"
                aria-label="Email address"
              />
              <Button type="submit" disabled={busy}>
                Subscribe
              </Button>
            </form>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Product", items: productLinks },
            { title: "Company", items: companyLinks },
            { title: "Support", items: supportLinks },
          ].map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="transition-colors hover:text-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-3">
          <a
            className="flex items-center gap-2 hover:text-primary"
            href="mailto:rakshitisstillalive@gmail.com"
          >
            <Mail className="size-4" /> rakshitisstillalive@gmail.com
          </a>
          <a className="flex items-center gap-2 hover:text-primary" href="tel:+918178722739">
            <Phone className="size-4" /> +91 8178722739
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" /> New Delhi, India
          </span>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Farmer&apos;s AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/legal/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/legal/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
