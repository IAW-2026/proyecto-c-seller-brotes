import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/constants";


export default async function CategoryBreakdownCard() {
  const productsByCategory = await prisma.product.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const maxCount = productsByCategory[0]?._count.id ?? 1;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-gris-piedra)] p-5 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[var(--color-verde-profundo)] flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-verde-bosque)]">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
          <path d="M22 12A10 10 0 0 0 12 2v10z"/>
        </svg>
        Productos por categoría
      </h2>

      {productsByCategory.length === 0 ? (
        <p className="text-sm text-gray-400">No hay productos publicados.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {productsByCategory.map((cat) => {
            const count = cat._count.id;
            const pct = Math.round((count / maxCount) * 100);
            const label = categoryLabels[cat.category] ?? cat.category;
            return (
              <li key={cat.category} className="flex items-center gap-3 text-sm">
                <span className="w-24 flex-shrink-0 text-gray-500 truncate">{label}</span>
                <div className="flex-1 bg-[var(--color-beige)] rounded-full h-2">
                  <div
                    className="bg-[var(--color-verde-bosque)] h-2 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-5 text-right text-gray-400 tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}