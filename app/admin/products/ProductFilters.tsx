"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { ProductCategory } from "@prisma/client";

const categoryLabels: Record<ProductCategory, string> = {
  suculentas: "Suculentas",
  plantas_de_interior: "Plantas de interior",
  aromaticas: "Aromáticas",
  frutales: "Frutales",
  cactus: "Cactus",
  colecciones_raras: "Colecciones raras",
  macetas_y_kits: "Macetas y kits",
};

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gris-piedra)] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("search", e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-gris-piedra)] bg-white text-sm text-[var(--color-verde-profundo)] placeholder:text-[var(--color-gris-piedra)] focus:outline-none focus:ring-2 focus:ring-[var(--color-verde-suave)] transition"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--color-verde-profundo)] border-t-transparent animate-spin" />
        )}
      </div>

      <select
        defaultValue={currentCategory}
        onChange={(e) => updateParams("category", e.target.value)}
        className="px-3 py-2 rounded-lg border border-[var(--color-gris-piedra)] bg-white text-sm text-[var(--color-verde-profundo)] focus:outline-none focus:ring-2 focus:ring-[var(--color-verde-suave)] transition cursor-pointer"
      >
        <option value="">Todas las categorías</option>
        {Object.values(ProductCategory).map((cat) => (
          <option key={cat} value={cat}>
            {categoryLabels[cat]}
          </option>
        ))}
      </select>

      <select
        defaultValue={currentStatus}
        onChange={(e) => updateParams("status", e.target.value)}
        className="px-3 py-2 rounded-lg border border-[var(--color-gris-piedra)] bg-white text-sm text-[var(--color-verde-profundo)] focus:outline-none focus:ring-2 focus:ring-[var(--color-verde-suave)] transition cursor-pointer"
      >
        <option value="">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>
  );
}