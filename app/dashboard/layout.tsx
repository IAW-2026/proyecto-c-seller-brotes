import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import WeatherWidget from "@/components/WeatherWidget";
import type { SidebarLink } from "@/components/Sidebar";
import { IconHome, IconPlant, IconBox, IconDollar } from "@/components/icons";

const links: SidebarLink[] = [
  { href: "/dashboard",               label: "Inicio",         exact: true, icon: <IconHome /> },
  { href: "/dashboard/products",      label: "Mis productos",               icon: <IconPlant /> },
  { href: "/dashboard/orders",        label: "Pedidos",                     icon: <IconBox /> },
  { href: "/dashboard/notifications", label: "Acreditaciones",              icon: <IconDollar /> },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  const seller = await prisma.seller.findUnique({
    where: { clerkUserId: userId! },
  });

  if (seller?.status === "inactive") {
    redirect("/account-disabled");
  }

  return (
    <AppShell
      sidebar={
        <Sidebar
          links={links}
          bottom={
            seller?.city ? (
              <WeatherWidget cityName={seller.city} variant="sidebar" />
            ) : undefined
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}