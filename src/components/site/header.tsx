import { Link } from "@tanstack/react-router";
import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme, type ThemeMode } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";

export const productLinks = [
  { label: "Crop Health Analyzer", to: "/product/crop-health" as const },
  { label: "Soil Diagnostics", to: "/product/soil-diagnostics" as const },
  { label: "Brix & pH Assessor", to: "/product/brix-ph" as const },
  { label: "Seed Quality Tester", to: "/product/seed-quality" as const },
];

export const companyLinks = [
  { label: "About Us", to: "/company/about" as const },
  { label: "Careers", to: "/company/careers" as const },
  { label: "Research", to: "/company/research" as const },
  { label: "Press Kit", to: "/company/press" as const },
];

export const supportLinks = [
  { label: "Contact Support", to: "/support/contact" as const },
  { label: "API Documentation", to: "/support/api" as const },
  { label: "User Manual", to: "/manual" as const },
];

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "System", icon: Monitor },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const Active = themeOptions.find((o) => o.mode === theme)?.icon ?? Monitor;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          <Active className="size-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themeOptions.map((o) => (
          <DropdownMenuItem key={o.mode} onSelect={() => setTheme(o.mode)}>
            <o.icon className="mr-2 size-4" />
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; to: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm font-medium">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {items.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link to={item.to}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          <NavDropdown label="Product" items={productLinks} />
          <NavDropdown label="Company" items={companyLinks} />
          <NavDropdown label="Support" items={supportLinks} />
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <Link to="/analyze">Analyze</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeSwitcher />
          {user ? (
            <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/auth" search={{ redirect: "/dashboard" }}>Sign in</Link>
              </Button>
              <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
                <Link to="/analyze">Try free</Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-4 space-y-6">
                {[
                  { title: "Product", items: productLinks },
                  { title: "Company", items: companyLinks },
                  { title: "Support", items: supportLinks },
                ].map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="flex flex-col">
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/analyze">Start free analysis</Link>
                  </Button>
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link to={user ? "/dashboard" : "/auth"}>{user ? "Dashboard" : "Sign in"}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
