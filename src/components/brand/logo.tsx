import { Link } from "@tanstack/react-router";

import logoMark from "@/assets/farmers-app-logo.png";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoMark}
      alt="Farmer's APP logo"
      width={816}
      height={816}
      loading="lazy"
      className={cn("object-contain", className ?? "size-9")}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">
        Farmer&apos;s&nbsp;&nbsp;<span className="text-gradient">APP</span>
      </span>
    </Link>
  );
}
