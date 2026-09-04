import Image from "next/image";
import Link from "next/link";
import { party } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-abg-blue-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Image
            src="/logo-abg.jpg"
            alt={`Logo du parti ${party.sigle}`}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-md object-cover"
          />
          <div>
            <p className="font-extrabold tracking-tight">{party.sigle}</p>
            <p className="text-sm text-white/70">{party.nomComplet}</p>
            <p className="mt-2 text-xs italic text-white/50">{party.devise}</p>
          </div>
        </div>

        <div className="text-sm text-white/80">
          <p className="mb-2 font-semibold text-white">Contact</p>
          <p>{party.siege}</p>
          <p className="mt-1">
            {party.telephoneLabel} : {party.telephone}
          </p>
          <p className="mt-1">
            {party.email}
            {party.emailIsPlaceholder && (
              <span className="ml-1 text-white/50">(à confirmer)</span>
            )}
          </p>
        </div>

        <div className="text-sm text-white/80">
          <p className="mb-2 font-semibold text-white">Navigation</p>
          <ul className="space-y-1">
            <li>
              <Link href="/le-parti" className="hover:text-white">
                Le Parti
              </Link>
            </li>
            <li>
              <Link href="/direction" className="hover:text-white">
                Direction
              </Link>
            </li>
            <li>
              <Link href="/programme" className="hover:text-white">
                Programme
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6">
        © {new Date().getFullYear()} {party.nomComplet} ({party.sigle}). Tous droits réservés.
      </div>
    </footer>
  );
}
