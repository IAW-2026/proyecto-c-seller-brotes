import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import type { SidebarLink } from "@/components/Sidebar";
import { IconHome, IconStore, IconPlant, IconBox } from "@/components/icons";

const links: SidebarLink[] = [
  { href: "/admin",          label: "Inicio",      exact: true, icon: <IconHome /> },
  { href: "/admin/sellers",  label: "Vendedores",               icon: <IconStore /> },
  { href: "/admin/products", label: "Productos",                icon: <IconPlant /> },
  { href: "/admin/orders",   label: "Pedidos",                  icon: <IconBox /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<Sidebar links={links} subtitle="Panel Admin" />}>
      {children}
    </AppShell>
  );
}