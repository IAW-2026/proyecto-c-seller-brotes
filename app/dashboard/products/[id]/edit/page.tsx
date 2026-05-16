import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProduct, toggleProductStatus } from "../../actions";
import { ProductStatus } from "@prisma/client";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id: parseInt(id), sellerId: seller.id },
  });

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);
  const toggleStatusWithId = toggleProductStatus.bind(null, product.id, product.status);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
          Editar producto
        </h1>
        <form action={toggleStatusWithId}>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-sm font-medium ${
              product.status === ProductStatus.active
                ? "bg-[var(--color-gris-piedra)] text-white hover:opacity-80"
                : "bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)] hover:opacity-80"
            }`}
          >
            {product.status === ProductStatus.active ? "Desactivar" : "Activar"}
          </button>
        </form>
      </div>
      <form action={updateProductWithId} className="flex flex-col gap-4 bg-white p-6 rounded shadow">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product.name}
            className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product.description ?? ""}
            className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium">
            Categoría *
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            defaultValue={product.category}
            className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="price" className="text-sm font-medium">
              Precio *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product.price}
              className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="stock" className="text-sm font-medium">
              Stock *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={product.stock}
              className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            URL de imagen
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={product.imageUrl ?? ""}
            className="border border-[var(--color-gris-piedra)] rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4 justify-end">
          <a
            href="/dashboard/products"
            className="px-4 py-2 border border-[var(--color-gris-piedra)] rounded hover:bg-[var(--color-beige)]"
          >
            Cancelar
          </a>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-verde-bosque)] text-white rounded hover:bg-[var(--color-verde-hoja)]"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
