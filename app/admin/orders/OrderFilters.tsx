"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { statusLabels } from "@/lib/constants";

export function OrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

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
    <div className="flex flex-col gap-3">
      {/* Búsqueda */}
      <div className="relative flex-1">
        <label htmlFor="search-orders" className="sr-only">
          Buscar por nombre de seller
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
          id="search-orders"
          type="text"
          placeholder="Buscar por nombre de seller..."
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

      {/* Filtro estado */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        <button
          onClick={() => updateParams("status", "")}
          aria-pressed={!currentStatus}
          className={`px-3 py-1 rounded text-sm transition ${
            !currentStatus
              ? "bg-[var(--color-verde-bosque)] text-white"
              : "bg-white border border-[var(--color-gris-piedra)] text-[var(--color-verde-profundo)]"
          }`}
        >
          Todos
        </button>
        {Object.entries(statusLabels).map(([value, label]) => (
          <button
            key={value}
            onClick={() => updateParams("status", value)}
            aria-pressed={currentStatus === value}
            className={`px-3 py-1 rounded text-sm transition ${
              currentStatus === value
                ? "bg-[var(--color-verde-bosque)] text-white"
                : "bg-white border border-[var(--color-gris-piedra)] text-[var(--color-verde-profundo)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}