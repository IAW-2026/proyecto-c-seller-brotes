"use client";

import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  icon?: React.ReactNode;
  external?: boolean;
}

export function NavLink({ href, children, exact = false, icon, external = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-3 px-4 py-2 rounded transition ${
        isActive
          ? "bg-[var(--color-verde-hoja)] text-white font-medium"
          : "hover:bg-[var(--color-verde-hoja)] text-white"
      }`}
    >
      {icon}
      {children}
    </a>
  );
}