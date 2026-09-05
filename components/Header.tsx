"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { party } from "@/lib/content";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/le-parti", label: "Le Parti" },
  { href: "/direction", label: "Direction" },
  { href: "/programme", label: "Programme" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-abg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-abg.png"
            alt={`Logo du parti ${party.sigle}`}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight text-abg-blue-dark">
              {party.sigle}
            </span>
            <span className="text-[11px] font-medium text-abg-green-dark sm:text-xs">
              {party.nomComplet}
            </span>
          </span>
        </Link>
        <nav className="hidden shrink-0 gap-1 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-center transition-colors ${
                  isActive
                    ? "bg-abg-blue-dark text-white"
                    : "text-foreground/70 hover:bg-abg-blue-dark/10 hover:text-abg-blue-dark"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/connexion"
            className="hidden whitespace-nowrap rounded-full border-2 border-abg-blue-dark px-4 py-[7px] text-center text-sm font-semibold text-abg-blue-dark transition-colors hover:bg-abg-blue-dark hover:text-white lg:inline-block"
          >
            Espace dirigeants
          </Link>
          <Link
            href="/adhesion"
            className="whitespace-nowrap rounded-full bg-abg-red px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-abg-red-dark lg:inline-block"
          >
            Devenir membre
          </Link>
        </div>
      </div>
      <Link
        href="/connexion"
        className="flex items-center justify-center gap-2 border-t border-black/5 bg-abg-blue-dark/5 py-2.5 text-sm font-semibold text-abg-blue-dark lg:hidden"
      >
        Espace dirigeants
      </Link>
      <nav className="flex gap-2 overflow-x-auto border-t border-black/5 px-4 py-2.5 text-sm font-medium lg:hidden">
        {navLinks.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 transition-colors ${
                isActive
                  ? "bg-abg-blue-dark text-white"
                  : "bg-black/5 text-foreground/70 hover:bg-abg-blue-dark/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="abg-accent-bar" />
    </header>
  );
}
