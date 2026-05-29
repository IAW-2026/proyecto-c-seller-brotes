import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCategory, ProductStatus } from "@prisma/client";
import { ProductFilters } from "./ProductFilters";
import { Suspense } from "react";

const categoryLabels: Record<ProductCategory, string> = {
  suculentas: "Suculentas",
  plantas_de_interior: "Plantas de interior",
  aromaticas: "Aromáticas",
  frutales: "Frutales",
  cactus: "Cactus",
  colecciones_raras: "Colecciones raras",
  macetas_y_kits: "Macetas y kits",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; category?: string; status?: string }>;
}) {
  await requireAdmin();

  const { search, page, category, status } = await searchParams;
  const currentPage = Number(page) || 1;
  const PRODUCTS_PER_PAGE = 10;
  const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const validCategory =
    category && Object.values(ProductCategory).includes(category as ProductCategory)
      ? (category as ProductCategory)
      : undefined;

  const validStatus =
    status && Object.values(ProductStatus).includes(status as ProductStatus)
      ? (status as ProductStatus)
      : undefined;

  const where = {
    AND: [
      search ? { name: { contains: search, mode: "insensitive" as const } } : {},
      validCategory ? { category: validCategory } : {},
      validStatus ? { status: validStatus } : {},
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PRODUCTS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: { seller: true },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Todos los productos
      </h1>

      <Suspense>
        <ProductFilters />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">
          {search || validCategory || validStatus
            ? "No se encontraron productos con ese criterio."
            : "No hay productos."}
        </p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-gris-piedra)] -mt-3">
            {total} resultado{total !== 1 ? "s" : ""}
          </p>
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Seller</th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-left px-4 py-3">Precio</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[var(--color-gris-piedra)]">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.seller.name}</td>
                  <td className="px-4 py-3">{categoryLabels[product.category]}</td>
                  <td className="px-4 py-3">${product.price}</td>
                  <td className="px-4 py-3">{product.stockAvailable}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.status === "active"
                        ? "bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)]"
                        : "bg-[var(--color-gris-piedra)] text-white"
                    }`}>
                      {product.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}${search ? `&search=${search}` : ""}${validCategory ? `&category=${validCategory}` : ""}${validStatus ? `&status=${validStatus}` : ""}`}
              className={`px-3 py-1 rounded ${
                p === currentPage
                  ? "bg-[var(--color-verde-bosque)] text-white"
                  : "bg-white border border-[var(--color-gris-piedra)]"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}