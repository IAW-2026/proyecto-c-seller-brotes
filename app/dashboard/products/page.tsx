import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/constants";
import { ProductFilters } from "./ProductFilters";
import { Suspense } from "react";

const PRODUCTS_PER_PAGE = 10;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const { search, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const where = {
    sellerId: seller.id,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PRODUCTS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
          Mis productos
        </h1>
        <a
          href="/dashboard/products/new"
          className="bg-[var(--color-verde-bosque)] text-white px-4 py-2 rounded hover:bg-[var(--color-verde-hoja)]"
        >
          + Nuevo producto
        </a>
      </div>

      <Suspense>
        <ProductFilters />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">
          {search ? "No se encontraron productos con ese nombre." : "No hay productos."}
        </p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-gris-piedra)] -mt-3">
            {total} resultado{total !== 1 ? "s" : ""}
          </p>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full bg-white text-sm min-w-[560px]">
              <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
                <tr>
                  <th scope="col" className="text-left px-4 py-3">Nombre</th>
                  <th scope="col" className="text-left px-4 py-3">Categoría</th>
                  <th scope="col" className="text-left px-4 py-3">Precio</th>
                  <th scope="col" className="text-left px-4 py-3">Stock</th>
                  <th scope="col" className="text-left px-4 py-3">Estado</th>
                  <th scope="col" className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[var(--color-gris-piedra)]">
                    <td className="px-4 py-3">{product.name}</td>
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
                    <td className="px-4 py-3">
                      <a
                        href={`/dashboard/products/${product.id}/edit`}
                        aria-label={`Editar producto ${product.name}`}
                        className="text-[var(--color-verde-bosque)] hover:underline"
                      >
                        Editar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}${search ? `&search=${search}` : ""}`}
              aria-current={p === currentPage ? "page" : undefined}
              aria-label={`Página ${p}`}
              className={`px-3 py-1 rounded ${
                p === currentPage
                  ? "bg-[var(--color-verde-bosque)] text-white"
                  : "bg-white border border-[var(--color-gris-piedra)]"
              }`}
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}