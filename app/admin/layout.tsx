import UserMenu from "@/components/UserMenu";
import Image from "next/image";
import { NavLink } from "@/components/NavLink";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[var(--color-verde-bosque)] text-white flex flex-col p-6 gap-6">
        <div className="flex flex-col items-center gap-2 py-2">
          <Image
            src="/brotes-logo.png"
            alt="Brotes"
            width={120}
            height={144}
            priority
          />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
            Panel Admin
          </span>
        </div>
        <nav aria-label="Navegación admin" className="flex flex-col gap-2">
          <NavLink href="/admin" exact>Inicio</NavLink>
          <NavLink href="/admin/sellers">Vendedores</NavLink>
          <NavLink href="/admin/products">Productos</NavLink>
          <NavLink href="/admin/orders">Pedidos</NavLink>
          <NavLink href="/admin/reports">Reportes</NavLink>
        </nav>
        <div className="mt-auto">
          <UserMenu />
        </div>
      </aside>
      <main className="flex-1 bg-[var(--color-arena)] p-8">
        {children}
      </main>
    </div>
  );
}