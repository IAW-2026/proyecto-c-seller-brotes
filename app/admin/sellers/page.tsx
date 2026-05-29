import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SellerStatusButton } from "./DeactivateButton";
import { SellerFilters } from "./SellerFilters";
import { SellerStatus } from "@prisma/client";
import { Suspense } from "react";

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  await requireAdmin();

  const { search, status } = await searchParams;

  const validStatus =
    status && Object.values(SellerStatus).includes(status as SellerStatus)
      ? (status as SellerStatus)
      : undefined;

  const sellers = await prisma.seller.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        validStatus ? { status: validStatus } : {},
      ],
    },
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: {
          products: true,
          incomingOrders: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Sellers
      </h1>

      <Suspense>
        <SellerFilters />
      </Suspense>

      {sellers.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">
          {search || validStatus
            ? "No se encontraron sellers con ese criterio."
            : "No hay sellers registrados."}
        </p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-gris-piedra)] -mt-3">
            {sellers.length} resultado{sellers.length !== 1 ? "s" : ""}
          </p>
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Productos</th>
                <th className="text-left px-4 py-3">Pedidos</th>
                <th className="text-left px-4 py-3">Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="border-t border-[var(--color-gris-piedra)]">
                  <td className="px-4 py-3">{seller.id}</td>
                  <td className="px-4 py-3">{seller.name}</td>
                  <td className="px-4 py-3">{seller.email}</td>
                  <td className="px-4 py-3">{seller._count.products}</td>
                  <td className="px-4 py-3">{seller._count.incomingOrders}</td>
                  <td className="px-4 py-3">
                    <SellerStatusButton sellerId={seller.id} status={seller.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}