import UserMenu from "@/components/UserMenu";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[var(--color-verde-profundo)] text-white flex flex-col p-6 gap-6">
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
        <nav className="flex flex-col gap-2">
          <a href="/admin" className="px-4 py-2 rounded hover:bg-[var(--color-verde-bosque)]">Inicio</a>
          <a href="/admin/sellers" className="px-4 py-2 rounded hover:bg-[var(--color-verde-bosque)]">Sellers</a>
          <a href="/admin/products" className="px-4 py-2 rounded hover:bg-[var(--color-verde-bosque)]">Productos</a>
          <a href="/admin/orders" className="px-4 py-2 rounded hover:bg-[var(--color-verde-bosque)]">Pedidos</a>
          <a href="/admin/reports" className="px-4 py-2 rounded hover:bg-[var(--color-verde-bosque)]">Reportes</a>
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
