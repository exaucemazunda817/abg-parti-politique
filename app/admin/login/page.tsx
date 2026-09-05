import type { Metadata } from "next";
import Image from "next/image";
import { party } from "@/lib/content";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: `Espace secrétariat — ${party.sigle}`,
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/logo-abg.png"
          alt={`Logo du parti ${party.sigle}`}
          width={72}
          height={72}
          className="abg-logo-shadow h-16 w-16 object-contain"
        />
        <h1 className="mt-4 text-xl font-extrabold text-abg-green-dark">
          Espace Secrétariat Général
        </h1>
        <p className="mt-1 text-sm text-foreground/60">Accès réservé au personnel du parti</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
