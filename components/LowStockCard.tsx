import { prisma } from "@/lib/prisma";

const STOCK_THRESHOLD = 5;

export default async function LowStockCard() {
  const lowStockProducts = await prisma.product.findMany({
    where: {
      status: "active",
      stockAvailable: { lte: STOCK_THRESHOLD },
    },
    select: { id: true, name: true, stockAvailable: true },
    orderBy: { stockAvailable: "asc" },
    take: 6,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--color-gris-piedra)] p-5 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[var(--color-verde-profundo)] flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-marron-tierra)]">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Stock bajo
      </h2>

      {lowStockProducts.length === 0 ? (
        <p className="text-sm text-gray-400">Todo el stock está en nivel normal.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--color-gris-piedra)]">
          {lowStockProducts.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p.stockAvailable <= 2 ? "#E24B4A" : "#EF9F27" }}
                />
                <span className="text-sm text-gray-700 truncate max-w-[180px]">
                  {p.name}
                </span>
              </div>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: p.stockAvailable <= 2 ? "#A32D2D" : "#854F0B" }}
              >
                {p.stockAvailable} unid.
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}