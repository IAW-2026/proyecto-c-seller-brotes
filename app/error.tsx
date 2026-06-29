"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--color-arena)" }}
    >
      <div
        className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "var(--color-verde-brote)" }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "var(--color-verde-hoja)" }}
      />

      <div className="mb-6 animate-pulse-subtle">
        <Image
          src="/brotes-logo.png"
          alt="Brotes"
          width={120}
          height={120}
          priority
        />
      </div>

      <p
        className="text-[6rem] leading-none font-black tracking-tighter mb-2 select-none"
        style={{ color: "var(--color-verde-bosque)", fontFamily: "Georgia, serif" }}
        aria-label="Error inesperado"
      >
        ¡Ups!
      </p>

      <h1
        className="text-2xl font-semibold mb-3 text-center"
        style={{ color: "var(--color-verde-profundo)" }}
      >
        Algo salió mal
      </h1>

      <p
        className="text-base text-center max-w-sm mb-10 leading-relaxed"
        style={{ color: "var(--color-verde-bosque)", opacity: 0.8 }}
      >
        Ocurrió un error inesperado. Podés intentar de nuevo o volver al panel.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: "var(--color-verde-bosque)",
            color: "var(--color-arena)",
          }}
        >
          Intentar de nuevo
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: "transparent",
            color: "var(--color-verde-bosque)",
            border: "2px solid var(--color-verde-bosque)",
          }}
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
