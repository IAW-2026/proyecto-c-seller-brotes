import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminReportsPage() {
  await requireAdmin();

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stockAvailable: { lte: LOW_STOCK_THRESHOLD },
      status: "active",
    },
    orderBy: { stockAvailable: "asc" },
    include: { seller: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Reportes
      </h1>

      <div className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-verde-profundo)]">
            Productos con stock bajo
          </h2>
          <span className="text-sm text-gray-500">
            Umbral: {LOW_STOCK_THRESHOLD} unidades o menos
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="text-[var(--color-gris-piedra)]">
            No hay productos con stock bajo.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
              <tr>
                <th className="text-left px-4 py-3">Producto</th>
                <th className="text-left px-4 py-3">Seller</th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-left px-4 py-3">Stock actual</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[var(--color-gris-piedra)]"
                >
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.seller.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        product.stockAvailable  === 0
                          ? "text-red-600"
                          : "text-[var(--color-terracota)]"
                      }`}
                    >
                      {product.stockAvailable  === 0 ? "Sin stock" : product.stockAvailable }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
