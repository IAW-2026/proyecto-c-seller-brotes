import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import WeatherWidget from "@/components/WeatherWidget";

export default async function DashboardPage() {
  await requireSeller();

  const user = await currentUser();

  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const [pendingOrders, activeProducts, outOfStockProducts, recentOrders, topProducts] =
    await Promise.all([
      prisma.incomingOrder.count({
        where: {
          sellerId: seller.id,
          status: { in: ["pendiente", "recibida"] },
        },
      }),
      prisma.product.count({
        where: { sellerId: seller.id, status: "active" },
      }),
      prisma.product.count({
        where: { sellerId: seller.id, stockAvailable: 0 },
      }),
      // Últimos 5 pedidos
      prisma.incomingOrder.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // Productos más vendidos (por cantidad de unidades en orders)
      prisma.incomingOrderItem.groupBy({
        by: ["productId", "productNameSnapshot"],
        where: {
          incomingOrder: { sellerId: seller.id },
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const cards = [
    {
      label: "Pedidos pendientes",
      value: pendingOrders,
      href: "/dashboard/orders",
      accent: "var(--color-verde-bosque)",
    },
    {
      label: "Productos activos",
      value: activeProducts,
      href: "/dashboard/products",
      accent: "var(--color-verde-hoja)",
    },
    {
      label: "Productos sin stock",
      value: outOfStockProducts,
      href: "/dashboard/products",
      accent: outOfStockProducts > 0 ? "#e57373" : "var(--color-gris-piedra)",
    },
  ];

  const statusLabels: Record<string, string> = {
    pendiente: "Pendiente",
    recibida: "Recibida",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregada: "Entregada",
  };

  const statusColors: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    recibida: "bg-blue-100 text-blue-800",
    en_preparacion: "bg-orange-100 text-orange-800",
    listo: "bg-green-100 text-green-800",
    entregada: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado con botón de perfil */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
            Bienvenida, {seller.name}
          </h1>
          <p className="text-gray-500">Panel de vendedor</p>
        </div>
        <a
          href="/dashboard/profile"
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-verde-bosque)] border border-[var(--color-verde-bosque)] rounded-lg px-4 py-2 hover:bg-[var(--color-verde-bosque)] hover:text-white transition-colors"
        >
          👤 Editar perfil
        </a>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-lg border border-[var(--color-gris-piedra)] px-5 py-4 flex flex-col gap-1 hover:shadow-md transition-shadow"
          >
            <span className="text-4xl font-bold" style={{ color: card.accent }}>
              {card.value}
            </span>
            <span className="text-sm text-gray-500">{card.label}</span>
          </a>
        ))}
      </div>

      {/* Widget del clima */}
      {seller.city ? (
        <WeatherWidget cityName={seller.city} />
      ) : (
        <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] px-4 py-3 text-sm text-gray-500">
          🌿 Completá tu ciudad en{" "}
          <a href="/dashboard/profile" className="text-[var(--color-verde-bosque)] underline">
            tu perfil
          </a>{" "}
          para ver el clima del día.
        </div>
      )}

      {/* Últimos pedidos y productos más vendidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Últimos pedidos */}
        <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-verde-profundo)]">
              Últimos pedidos
            </h2>
            <a
              href="/dashboard/orders"
              className="text-xs text-[var(--color-verde-bosque)] underline"
            >
              Ver todos
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no recibiste pedidos.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      Pedido #{order.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      ${order.total.toLocaleString("es-AR")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-verde-profundo)]">
              Productos más vendidos
            </h2>
            <a
              href="/dashboard/products"
              className="text-xs text-[var(--color-verde-bosque)] underline"
            >
              Ver todos
            </a>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no hay ventas registradas.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topProducts.map((item, index) => (
                <li key={item.productId} className="flex items-center gap-3 text-sm">
                  <span className="text-lg font-bold text-[var(--color-gris-piedra)] w-5 text-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-700 truncate">
                    {item.productNameSnapshot}
                  </span>
                  <span className="font-medium text-[var(--color-verde-bosque)]">
                    {item._sum.quantity} uds.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}