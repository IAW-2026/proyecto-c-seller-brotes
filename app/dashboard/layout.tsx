import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";

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
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[var(--color-verde-bosque)] text-white flex flex-col p-6 gap-6">
        <div className="text-2xl font-bold">🌿 Brotes</div>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="px-4 py-2 rounded hover:bg-[var(--color-verde-hoja)]">Inicio</a>
          <a href="/dashboard/products" className="px-4 py-2 rounded hover:bg-[var(--color-verde-hoja)]">Mis productos</a>
          <a href="/dashboard/orders" className="px-4 py-2 rounded hover:bg-[var(--color-verde-hoja)]">Pedidos</a>
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