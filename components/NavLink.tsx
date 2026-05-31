"use client";

import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`px-4 py-2 rounded transition ${
        isActive
          ? "bg-[var(--color-verde-hoja)] text-white font-medium"
          : "hover:bg-[var(--color-verde-hoja)] text-white"
      }`}
    >
      {children}
    </a>
  );
}