import Image from "next/image";
import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-abg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-abg.jpg"
            alt={`Logo du parti ${party.sigle}`}
            width={44}
            height={44}
            className="h-11 w-11 rounded-md object-cover"
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
        <nav className="hidden gap-6 text-sm font-medium text-foreground/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-abg-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-abg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-abg-red-dark md:inline-block"
        >
          Nous contacter
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-black/5 px-4 py-2 text-sm font-medium text-foreground/80 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 transition-colors hover:text-abg-red"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
