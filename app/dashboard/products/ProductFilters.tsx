"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <label htmlFor="search-products" className="sr-only">
        Buscar productos por nombre
      </label>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gris-piedra)] pointer-events-none"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <input
        id="search-products"
        type="text"
        placeholder="Buscar productos..."
        defaultValue={currentSearch}
        onChange={(e) => updateParams("search", e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-gris-piedra)] bg-white text-sm text-[var(--color-verde-profundo)] placeholder:text-[var(--color-gris-piedra)] focus:outline-none focus:ring-2 focus:ring-[var(--color-verde-suave)] transition"
      />
      {isPending && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--color-verde-profundo)] border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
    </div>
  );
}