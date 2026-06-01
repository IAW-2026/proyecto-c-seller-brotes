import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LowStockCard from "@/components/LowStockCard";
import CategoryBreakdownCard from "@/components/CategoryBreakdownCard";

const cards = [
  {
    label: "Sellers registrados",
    href: "/admin/sellers",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    bg: "bg-[var(--color-verde-suave)]",
    iconColor: "text-[var(--color-verde-bosque)]",
  },
  {
    label: "Productos publicados",
    href: "/admin/products",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    bg: "bg-[var(--color-verde-brote)]",
    iconColor: "text-[var(--color-verde-profundo)]",
  },
  {
    label: "Pedidos recibidos",
    href: "/admin/orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19"/>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    bg: "bg-[var(--color-beige)]",
    iconColor: "text-[var(--color-marron-tierra)]",
  },
  {
    label: "Acreditaciones",
    href: "/admin/payouts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    bg: "bg-[var(--color-verde-suave)]",
    iconColor: "text-[var(--color-verde-bosque)]",
  },
];

export default async function AdminPage() {
  await requireAdmin();

  const [totalSellers, totalProducts, totalOrders, totalPayouts] = await Promise.all([
    prisma.seller.count(),
    prisma.product.count(),
    prisma.incomingOrder.count(),
    prisma.payoutNotification.count(),
  ]);

  const values = [totalSellers, totalProducts, totalOrders, totalPayouts];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Panel de administración
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-[var(--color-gris-piedra)] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`${card.bg} ${card.iconColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500">{card.label}</span>
              <span className="text-4xl font-bold text-[var(--color-verde-profundo)]">
                {values[i]}
              </span>
            </div>
            <a
              href={card.href}
              className="text-sm text-[var(--color-verde-bosque)] hover:underline w-fit"
            >
              Ver todos →
            </a>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LowStockCard />
        <CategoryBreakdownCard />
      </div>
    </div>
  );
}