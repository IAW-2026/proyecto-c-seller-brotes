import Image from "next/image";
import { NavLink } from "@/components/NavLink";
import UserMenu from "@/components/UserMenu";

export interface SidebarLink {
  href: string;
  label: string;
  exact?: boolean;
  icon: React.ReactNode;
  external?: boolean; 
}

interface SidebarProps {
  links: SidebarLink[];
  subtitle?: string;
  bottom?: React.ReactNode;
}

export default function Sidebar({ links, subtitle, bottom }: SidebarProps) {
  return (
    <aside className="md:w-64 bg-[var(--color-verde-bosque)] text-white flex flex-col p-6 gap-6">
      <div className="flex flex-col items-center gap-2 py-2">
        <Image
          src="/brotes-logo.png"
          alt="Brotes"
          width={72}
          height={86}
          style={{ height: "auto" }}
          priority
        />
        {subtitle && (
          <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
            {subtitle}
          </span>
        )}
      </div>
      <nav className="flex flex-row md:flex-col gap-2">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} exact={link.exact} icon={link.icon}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto hidden md:flex md:flex-col gap-4">
        {bottom}
        <UserMenu />
      </div>
    </aside>
  );
}