"use client";

import { useClerk } from "@clerk/nextjs";
import Image from "next/image";

export default function AccountDisabledPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-[var(--color-arena)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-6 text-center">

        <Image
          src="/brotes-logo.png"
          alt="Brotes"
          width={120}
          height={120}
          className="animate-pulse-subtle"
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
            Tu cuenta fue desactivada
          </h1>
          <p className="text-[var(--color-gris-piedra)] text-sm">
            Tu cuenta de vendedor en Brotes fue desactivada por un administrador.
            Si creés que esto es un error, comunicate con el equipo de soporte.
          </p>
        </div>

        <div className="w-full border-t border-[var(--color-beige)]" />

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="w-full bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)] rounded-xl py-3 text-sm font-medium hover:bg-[var(--color-verde-brote)] transition-colors text-center"
          >
            Volver al inicio
          </button>
        </div>

      </div>
    </div>
  );
}
