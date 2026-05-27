import "dotenv/config";
import { ProductStatus, IncomingOrderStatus, ProductCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Iniciando seed...");

  // ─── Ciudades ───────────────────────────────────────────────────────────────
  await prisma.city.createMany({
    data: [
      { postalCode: 1000, name: "Buenos Aires" },
      { postalCode: 5000, name: "Córdoba" },
      { postalCode: 3000, name: "Santa Fe" },
      { postalCode: 7600, name: "Mar del Plata" },
      { postalCode: 4000, name: "San Miguel de Tucumán" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Ciudades creadas");

  // ─── Seller principal (tu cuenta) ───────────────────────────────────────────
  const seller = await prisma.seller.upsert({
    where: { clerkUserId: "user_3DlMcPLckasFoKzWsooPNyIWakU" },
    update: {
      name: "Vivero La Brote",
      email: "labrote@brotes.com",
      cityPostalCode: 1000,
      address: "Av. Santa Fe 1234, Buenos Aires",
    },
    create: {
      clerkUserId: "user_3DlMcPLckasFoKzWsooPNyIWakU",
      name: "Vivero La Brote",
      email: "labrote@brotes.com",
      cityPostalCode: 1000,
      address: "Av. Santa Fe 1234, Buenos Aires",
    },
  });

  console.log("✅ Seller principal creado");

  // ─── Productos ──────────────────────────────────────────────────────────────
  const productos = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Pothos Dorado",
        description: "Planta de interior resistente y fácil de cuidar. Ideal para ambientes con poca luz.",
        category: ProductCategory.plantas_de_interior,
        price: 1500,
        stockAvailable: 12,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Cactus Barrel",
        description: "Cactus globoso de crecimiento lento. Necesita mucha luz solar y poco riego.",
        category: ProductCategory.cactus,
        price: 2200,
        stockAvailable: 8,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Suculenta Echeveria",
        description: "Roseta perfecta de hojas gruesas y coloridas. Muy poco riego necesario.",
        category: ProductCategory.suculentas,
        price: 800,
        stockAvailable: 25,
        stockReserved: 3,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Lavanda",
        description: "Aromática mediterránea con flores violetas. Ideal para exterior soleado.",
        category: ProductCategory.aromaticas,
        price: 1200,
        stockAvailable: 0,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Limonero Eureka",
        description: "Frutal cítrico de alto rendimiento. Produce limones durante todo el año.",
        category: ProductCategory.frutales,
        price: 4500,
        stockAvailable: 5,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Monstera Deliciosa",
        description: "La reina de las plantas de interior. Hojas grandes con cortes característicos.",
        category: ProductCategory.colecciones_raras,
        price: 6800,
        stockAvailable: 3,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Kit Suculentas x5",
        description: "Cinco suculentas surtidas en maceta de barro. Perfecto para regalo.",
        category: ProductCategory.macetas_y_kits,
        price: 3200,
        stockAvailable: 7,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller.id,
        name: "Albahaca Genovesa",
        description: "Aromática esencial para cocina. Hojas grandes y perfumadas.",
        category: ProductCategory.aromaticas,
        price: 600,
        stockAvailable: 0,
        stockReserved: 0,
        status: ProductStatus.inactive,
        imageUrl: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=400",
      },
    }),
  ]);

  console.log("✅ Productos creados");

  // ─── Pedidos entrantes ───────────────────────────────────────────────────────
  const ordenes = [
    {
      buyerOrderId: "ord_001",
      buyerId: "buyer_aaa",
      total: 4500,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // hace 30 min
      items: [
        { product: productos[0], quantity: 2 }, // 2x Pothos
        { product: productos[2], quantity: 1 }, // 1x Echeveria
      ],
    },
    {
      buyerOrderId: "ord_002",
      buyerId: "buyer_bbb",
      total: 6800,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // hace 2 hs
      items: [
        { product: productos[5], quantity: 1 }, // 1x Monstera
      ],
    },
    {
      buyerOrderId: "ord_003",
      buyerId: "buyer_ccc",
      total: 8000,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // hace 5 hs
      items: [
        { product: productos[1], quantity: 2 }, // 2x Cactus
        { product: productos[6], quantity: 1 }, // 1x Kit suculentas
      ],
    },
    {
      buyerOrderId: "ord_004",
      buyerId: "buyer_ddd",
      total: 4500,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // hace 1 día
      items: [
        { product: productos[4], quantity: 1 }, // 1x Limonero
      ],
    },
    {
      buyerOrderId: "ord_005",
      buyerId: "buyer_eee",
      total: 3200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // hace 2 días
      items: [
        { product: productos[6], quantity: 1 }, // 1x Kit suculentas
      ],
    },
    {
      buyerOrderId: "ord_006",
      buyerId: "buyer_fff",
      total: 2400,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // hace 3 días
      items: [
        { product: productos[0], quantity: 1 }, // 1x Pothos
        { product: productos[2], quantity: 1 }, // 1x Echeveria
      ],
    },
    {
      buyerOrderId: "ord_007",
      buyerId: "buyer_ggg",
      total: 1600,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // hace 4 días
      items: [
        { product: productos[2], quantity: 2 }, // 2x Echeveria
      ],
    },
  ];

  for (const orden of ordenes) {
    await prisma.incomingOrder.create({
      data: {
        sellerId: seller.id,
        buyerOrderId: orden.buyerOrderId,
        buyerId: orden.buyerId,
        total: orden.total,
        status: orden.status,
        createdAt: orden.createdAt,
        items: {
          create: orden.items.map((item) => ({
            productId: item.product.id,
            productNameSnapshot: item.product.name,
            unitPriceSnapshot: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  console.log("✅ Pedidos creados");
  console.log("🌿 Seed completado con éxito");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
