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

  // ─── Sellers adicionales ────────────────────────────────────────────────────
  const sellerVerde = await prisma.seller.upsert({
    where: { clerkUserId: "seed_seller_verde_cordoba" },
    update: {
      name: "Verde Córdoba",
      email: "verde@cordoba.com",
      cityPostalCode: 5000,
      address: "Bv. San Juan 567, Córdoba",
    },
    create: {
      clerkUserId: "seed_seller_verde_cordoba",
      name: "Verde Córdoba",
      email: "verde@cordoba.com",
      cityPostalCode: 5000,
      address: "Bv. San Juan 567, Córdoba",
    },
  });

  const sellerBotanica = await prisma.seller.upsert({
    where: { clerkUserId: "seed_seller_botanica_rosario" },
    update: {
      name: "Botánica Rosario",
      email: "botanica@rosario.com",
      cityPostalCode: 3000,
      address: "Av. Pellegrini 890, Santa Fe",
    },
    create: {
      clerkUserId: "seed_seller_botanica_rosario",
      name: "Botánica Rosario",
      email: "botanica@rosario.com",
      cityPostalCode: 3000,
      address: "Av. Pellegrini 890, Santa Fe",
    },
  });

  const sellerMar = await prisma.seller.upsert({
    where: { clerkUserId: "seed_seller_plantas_mar" },
    update: {
      name: "Plantas del Mar",
      email: "plantas@mardelplata.com",
      cityPostalCode: 7600,
      address: "Diagonal 74 nro 321, Mar del Plata",
    },
    create: {
      clerkUserId: "seed_seller_plantas_mar",
      name: "Plantas del Mar",
      email: "plantas@mardelplata.com",
      cityPostalCode: 7600,
      address: "Diagonal 74 nro 321, Mar del Plata",
    },
  });

  console.log("✅ Sellers adicionales creados");

  // ─── Productos — Seller principal ───────────────────────────────────────────
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

  console.log("✅ Productos del seller principal creados");

  // ─── Productos — Verde Córdoba ───────────────────────────────────────────────
  const productosVerde = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: sellerVerde.id,
        name: "Ficus Lyrata",
        description: "Planta de interior imponente con hojas en forma de violín. Prefiere luz indirecta brillante.",
        category: ProductCategory.plantas_de_interior,
        price: 8500,
        stockAvailable: 4,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerVerde.id,
        name: "Cactus San Pedro",
        description: "Columnar de rápido crecimiento. Tolera sequías prolongadas.",
        category: ProductCategory.cactus,
        price: 3100,
        stockAvailable: 10,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerVerde.id,
        name: "Romero Rastrero",
        description: "Aromática de cobertura ideal para jardines mediterráneos. Muy resistente al calor.",
        category: ProductCategory.aromaticas,
        price: 950,
        stockAvailable: 18,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1515586838455-8a8a9b7ed5e6?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerVerde.id,
        name: "Haworthia Zebra",
        description: "Suculenta compacta con rayas blancas distintivas. Perfecta para escritorios.",
        category: ProductCategory.suculentas,
        price: 1100,
        stockAvailable: 20,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerVerde.id,
        name: "Naranjo Navel",
        description: "Frutal de exterior que produce naranjas dulces sin semillas. Necesita riego regular.",
        category: ProductCategory.frutales,
        price: 5200,
        stockAvailable: 3,
        stockReserved: 0,
        status: ProductStatus.inactive,
        imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Verde Córdoba creados");

  // ─── Productos — Botánica Rosario ────────────────────────────────────────────
  const productosBotanica = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: sellerBotanica.id,
        name: "Alocasia Amazónica",
        description: "Planta exótica con hojas oscuras y nervaduras blancas. Alta humedad y luz indirecta.",
        category: ProductCategory.colecciones_raras,
        price: 9200,
        stockAvailable: 2,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerBotanica.id,
        name: "Menta Piperita",
        description: "Aromática refrescante para infusiones y cocina. Crece rápido y necesita mucha agua.",
        category: ProductCategory.aromaticas,
        price: 550,
        stockAvailable: 30,
        stockReserved: 5,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerBotanica.id,
        name: "Kit Aromáticas x3",
        description: "Set de albahaca, menta y perejil en macetas de cerámica. Listo para balcón.",
        category: ProductCategory.macetas_y_kits,
        price: 2800,
        stockAvailable: 9,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerBotanica.id,
        name: "Agave Azul",
        description: "Suculenta grande de exterior con hojas azuladas. Muy resistente y de larga vida.",
        category: ProductCategory.suculentas,
        price: 4100,
        stockAvailable: 6,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Botánica Rosario creados");

  // ─── Productos — Plantas del Mar ────────────────────────────────────────────
  const productosMar = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: sellerMar.id,
        name: "Hiedra Inglesa",
        description: "Trepadora clásica de interior y exterior. Crece rápido y purifica el aire.",
        category: ProductCategory.plantas_de_interior,
        price: 1300,
        stockAvailable: 15,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerMar.id,
        name: "Gymnocalycium",
        description: "Cactus de flor llamativa, ideal para interior. Sin espinas en la base de los tubérculos.",
        category: ProductCategory.cactus,
        price: 1800,
        stockAvailable: 14,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerMar.id,
        name: "Mandarina Satsuma",
        description: "Frutal enano para maceta. Produce frutos dulces sin semillas, ideal para balcón.",
        category: ProductCategory.frutales,
        price: 6000,
        stockAvailable: 4,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerMar.id,
        name: "Tillandsia Ionantha",
        description: "Planta de aire sin sustrato. Solo necesita humedad y luz. Floración espectacular.",
        category: ProductCategory.colecciones_raras,
        price: 1600,
        stockAvailable: 22,
        stockReserved: 3,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerMar.id,
        name: "Maceta Terracota 20cm",
        description: "Maceta de barro cocido artesanal. Permite transpiración óptima para las raíces.",
        category: ProductCategory.macetas_y_kits,
        price: 700,
        stockAvailable: 40,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Plantas del Mar creados");

  // ─── Pedidos — Seller principal ─────────────────────────────────────────────
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

  console.log("✅ Pedidos del seller principal creados");

  // ─── Pedidos — Verde Córdoba ────────────────────────────────────────────────
  const ordenesVerde = [
    {
      buyerOrderId: "ord_v01",
      buyerId: "buyer_hhh",
      total: 9450,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      items: [
        { product: productosVerde[0], quantity: 1 }, // 1x Ficus Lyrata
        { product: productosVerde[2], quantity: 1 }, // 1x Romero
      ],
    },
    {
      buyerOrderId: "ord_v02",
      buyerId: "buyer_iii",
      total: 6200,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      items: [
        { product: productosVerde[1], quantity: 2 }, // 2x Cactus San Pedro
      ],
    },
    {
      buyerOrderId: "ord_v03",
      buyerId: "buyer_jjj",
      total: 2200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      items: [
        { product: productosVerde[3], quantity: 2 }, // 2x Haworthia
      ],
    },
    {
      buyerOrderId: "ord_v04",
      buyerId: "buyer_kkk",
      total: 950,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
      items: [
        { product: productosVerde[2], quantity: 1 }, // 1x Romero
      ],
    },
  ];

  for (const orden of ordenesVerde) {
    await prisma.incomingOrder.create({
      data: {
        sellerId: sellerVerde.id,
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

  console.log("✅ Pedidos de Verde Córdoba creados");

  // ─── Pedidos — Botánica Rosario ──────────────────────────────────────────────
  const ordenesBotanica = [
    {
      buyerOrderId: "ord_b01",
      buyerId: "buyer_lll",
      total: 9200,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      items: [
        { product: productosBotanica[0], quantity: 1 }, // 1x Alocasia
      ],
    },
    {
      buyerOrderId: "ord_b02",
      buyerId: "buyer_mmm",
      total: 3350,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      items: [
        { product: productosBotanica[2], quantity: 1 }, // 1x Kit Aromáticas
        { product: productosBotanica[1], quantity: 1 }, // 1x Menta
      ],
    },
    {
      buyerOrderId: "ord_b03",
      buyerId: "buyer_nnn",
      total: 8200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
      items: [
        { product: productosBotanica[3], quantity: 2 }, // 2x Agave
      ],
    },
  ];

  for (const orden of ordenesBotanica) {
    await prisma.incomingOrder.create({
      data: {
        sellerId: sellerBotanica.id,
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

  console.log("✅ Pedidos de Botánica Rosario creados");

  // ─── Pedidos — Plantas del Mar ───────────────────────────────────────────────
  const ordenesMar = [
    {
      buyerOrderId: "ord_m01",
      buyerId: "buyer_ooo",
      total: 7600,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 90),
      items: [
        { product: productosMar[2], quantity: 1 }, // 1x Mandarina
        { product: productosMar[3], quantity: 1 }, // 1x Tillandsia
      ],
    },
    {
      buyerOrderId: "ord_m02",
      buyerId: "buyer_ppp",
      total: 4200,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      items: [
        { product: productosMar[1], quantity: 2 }, // 2x Gymnocalycium
        { product: productosMar[4], quantity: 1 }, // 1x Maceta
      ],
    },
    {
      buyerOrderId: "ord_m03",
      buyerId: "buyer_qqq",
      total: 1300,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      items: [
        { product: productosMar[0], quantity: 1 }, // 1x Hiedra
      ],
    },
    {
      buyerOrderId: "ord_m04",
      buyerId: "buyer_rrr",
      total: 3200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80),
      items: [
        { product: productosMar[3], quantity: 2 }, // 2x Tillandsia
      ],
    },
  ];

  for (const orden of ordenesMar) {
    await prisma.incomingOrder.create({
      data: {
        sellerId: sellerMar.id,
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

  console.log("✅ Pedidos de Plantas del Mar creados");
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
