import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductStatus } from "@prisma/client";

export default async function NewProductPage() {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !category || isNaN(price) || isNaN(stock)) {
      throw new Error("Faltan campos obligatorios");
    }

    await prisma.product.create({
      data: {
        sellerId: seller.id,
        name,
        description,
        category,
        price,
        stock,
        imageUrl: imageUrl || null,
        status: ProductStatus.active,
      },
    });

    redirect("/dashboard/products");
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Nuevo producto
      </h1>
      <form action={createProduct} className="flex flex-col gap-4 bg-white p-6 rounded shadow">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
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
            Crear producto
          </button>
        </div>
      </form>
    </div>
  );
}
