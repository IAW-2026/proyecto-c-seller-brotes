import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LowStockCard from "@/components/LowStockCard";
import CategoryBreakdownCard from "@/components/CategoryBreakdownCard";
import { IconHome, IconPlant, IconBox, IconDollar } from "@/components/icons";
import StatCard from "@/components/StatCard";

export default async function AdminPage() {
  await requireAdmin();

  const [totalSellers, totalProducts, totalOrders, totalPayouts] = await Promise.all([
    prisma.seller.count(),
    prisma.product.count(),
    prisma.incomingOrder.count(),
    prisma.payoutNotification.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Panel de administración
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Sellers registrados"
          value={totalSellers}
          href="/admin/sellers"
          icon={<IconHome size={28} />}
          bg="bg-[var(--color-verde-suave)]"
          iconColor="text-[var(--color-verde-bosque)]"
          linkLabel="Ver todos"
        />
        <StatCard
          label="Productos publicados"
          value={totalProducts}
          href="/admin/products"
          icon={<IconPlant size={28} />}
          bg="bg-[var(--color-verde-brote)]"
          iconColor="text-[var(--color-verde-profundo)]"
          linkLabel="Ver todos"
        />
        <StatCard
          label="Pedidos recibidos"
          value={totalOrders}
          href="/admin/orders"
          icon={<IconBox size={28} />}
          bg="bg-[var(--color-beige)]"
          iconColor="text-[var(--color-marron-tierra)]"
          linkLabel="Ver todos"
        />
        <StatCard
          label="Acreditaciones"
          value={totalPayouts}
          href="/admin/notifications" 
          icon={<IconDollar size={28} />}
          bg="bg-[var(--color-verde-suave)]"
          iconColor="text-[var(--color-verde-bosque)]"
          linkLabel="Ver todos"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LowStockCard />
        <CategoryBreakdownCard />
      </div>
    </div>
  );
}