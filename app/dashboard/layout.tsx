import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import Image from "next/image";
import { NavLink } from "@/components/NavLink";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  const seller = await prisma.seller.findUnique({
    where: { clerkUserId: userId! },
  });

  if (seller?.status === "inactive") {
    redirect("/account-disabled");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="md:w-64 bg-[var(--color-verde-bosque)] text-white flex flex-col p-6 gap-6">
        <div className="flex items-center justify-center py-2">
          <Image
            src="/brotes-logo.png"
            alt="Brotes"
            width={140}
            height={168}
            priority
          />
        </div>
        <nav aria-label="Navegación principal" className="flex flex-row md:flex-col gap-2">
          <NavLink href="/dashboard" exact>Inicio</NavLink>
          <NavLink href="/dashboard/products">Mis productos</NavLink>
          <NavLink href="/dashboard/orders">Pedidos</NavLink>
          <NavLink href="/dashboard/notifications">Acreditaciones</NavLink>
        </nav>
        <div className="mt-auto hidden md:block">
          <UserMenu />
        </div>
      </aside>
      <main className="flex-1 bg-[var(--color-arena)] p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}