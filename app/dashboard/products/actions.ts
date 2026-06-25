//Archivo que agrupa todas las Server Actions relacionadas con productos
"use server";

import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProductStatus, ProductCategory } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

export async function createProduct(formData: FormData) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as ProductCategory;
  const price = parseFloat(formData.get("price") as string);
  const stockAvailable = parseInt(formData.get("stock") as string);
  
  const imageFile = formData.get("imagen") as File | null;
  let imageUrl: string | null = null;

  if (!name || !category || isNaN(price) || isNaN(stockAvailable)) {
    throw new Error("Faltan campos obligatorios");
  }

  if (imageFile && imageFile.size > 0) {
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    folder: "brotes/products",
  });
  imageUrl = result.secure_url;
}

  await prisma.product.create({
    data: {
      sellerId: seller.id,
      name,
      description,
      category,
      price,
      stockAvailable,
      imageUrl: imageUrl || null,
      status: ProductStatus.active,
    },
  });

  redirect("/dashboard/products");
}

export async function updateProduct(id: number, formData: FormData) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const name = formData.get("name") as string;
  const description = formData.get("description") as string; const category = formData.get("category") as ProductCategory;
  const price = parseFloat(formData.get("price") as string);
  const stockAvailable  = parseInt(formData.get("stock") as string);
  const imageFile = formData.get("imagen") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder: "brotes/products",
    });
    imageUrl = result.secure_url;
  }

  if (!name || !category || isNaN(price) || isNaN(stockAvailable )) {
    throw new Error("Faltan campos obligatorios");
  }

  await prisma.product.update({
    where: { id, sellerId: seller.id },
    data: {
      name,
      description,
      category,
      price,
      stockAvailable ,
      imageUrl: imageUrl ?? undefined,
    },
  });

  redirect("/dashboard/products");
}

export async function toggleProductStatus(id: number, currentStatus: ProductStatus) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const newStatus = currentStatus === ProductStatus.active
    ? ProductStatus.inactive
    : ProductStatus.active;

  await prisma.product.update({
    where: { id, sellerId: seller.id },
    data: { status: newStatus },
  });

  redirect("/dashboard/products");
}
