import "dotenv/config";
import {
  ProductStatus,
  IncomingOrderStatus,
  ProductCategory,
  SellerStatus,
} from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Iniciando seed...");

  // ─── Limpieza ────────────────────────────────────────────────────────────────
  await prisma.payoutNotification.deleteMany();
  await prisma.incomingOrderItem.deleteMany();
  await prisma.incomingOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();

  console.log("🧹 Base de datos limpiada");

  // ─── Sellers (usuarios reales de Clerk) ─────────────────────────────────────
  // seller+clerktest@iaw.com  → Marta Giménez
  // seller2+clerktest@iaw.com → Carlos Pereyra
  // seller3+clerktest@iaw.com → Lucía Fernández
  // seller4+clerktest@iaw.com → Roberto Medina

  const seller1 = await prisma.seller.upsert({
    where: { clerkUserId: "user_3EY7eSzyIkdMpeDaQmaVna6SSOa" },
    update: {
      name: "Vivero Giménez",
      email: "seller+clerktest@iaw.com",
      city: "Buenos Aires",
      address: "Av. Santa Fe 1234, Buenos Aires",
      status: SellerStatus.active,
    },
    create: {
      clerkUserId: "user_3EY7eSzyIkdMpeDaQmaVna6SSOa",
      name: "Vivero Giménez",
      email: "seller+clerktest@iaw.com",
      city: "Buenos Aires",
      address: "Av. Santa Fe 1234, Buenos Aires",
      status: SellerStatus.active,
    },
  });

  const seller2 = await prisma.seller.upsert({
    where: { clerkUserId: "user_3EY7jNuQR1CNBssPx6BMQVtkDB0" },
    update: {
      name: "Verde Córdoba",
      email: "seller2+clerktest@iaw.com",
      city: "Córdoba",
      address: "Bv. San Juan 567, Córdoba",
      status: SellerStatus.active,
    },
    create: {
      clerkUserId: "user_3EY7jNuQR1CNBssPx6BMQVtkDB0",
      name: "Verde Córdoba",
      email: "seller2+clerktest@iaw.com",
      city: "Córdoba",
      address: "Bv. San Juan 567, Córdoba",
      status: SellerStatus.active,
    },
  });

  const seller3 = await prisma.seller.upsert({
    where: { clerkUserId: "user_3EY7pCE7PB56pVV0nQuuACvxeQd" },
    update: {
      name: "Botánica Fernández",
      email: "seller3+clerktest@iaw.com",
      city: "Rosario",
      address: "Av. Pellegrini 890, Rosario",
      status: SellerStatus.active,
    },
    create: {
      clerkUserId: "user_3EY7pCE7PB56pVV0nQuuACvxeQd",
      name: "Botánica Fernández",
      email: "seller3+clerktest@iaw.com",
      city: "Rosario",
      address: "Av. Pellegrini 890, Rosario",
      status: SellerStatus.active,
    },
  });

  const seller4 = await prisma.seller.upsert({
    where: { clerkUserId: "user_3EY8eNUrPs0VhCcEgynSR20YA05" },
    update: {
      name: "Plantas del Mar",
      email: "seller4+clerktest@iaw.com",
      city: "Mar del Plata",
      address: "Diagonal 74 nro 321, Mar del Plata",
      status: SellerStatus.active,
    },
    create: {
      clerkUserId: "user_3EY8eNUrPs0VhCcEgynSR20YA05",
      name: "Plantas del Mar",
      email: "seller4+clerktest@iaw.com",
      city: "Mar del Plata",
      address: "Diagonal 74 nro 321, Mar del Plata",
      status: SellerStatus.active,
    },
  });

  console.log("✅ Sellers creados");

  // ─── Productos — Vivero Giménez (seller1) ────────────────────────────────────
  const p1 = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Pothos Dorado",
        description:
          "Planta de interior resistente y fácil de cuidar. Ideal para ambientes con poca luz. Sus hojas variegadas en verde y amarillo la hacen muy decorativa.",
        category: ProductCategory.plantas_de_interior,
        price: 1500,
        stockAvailable: 12,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Cactus Barrel",
        description:
          "Cactus globoso de crecimiento lento. Necesita mucha luz solar y riegos espaciados. Puede vivir décadas con el cuidado adecuado.",
        category: ProductCategory.cactus,
        price: 2200,
        stockAvailable: 8,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Suculenta Echeveria",
        description:
          "Roseta perfecta de hojas gruesas y coloridas en tonos verde, lila y rosado. Muy poco riego necesario, ideal para principiantes.",
        category: ProductCategory.suculentas,
        price: 800,
        stockAvailable: 25,
        stockReserved: 3,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Lavanda Angustifolia",
        description:
          "Aromática mediterránea con flores violetas perfumadas. Ideal para exterior soleado. Atrae mariposas y abejas.",
        category: ProductCategory.aromaticas,
        price: 1200,
        stockAvailable: 14,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Limonero Eureka",
        description:
          "Frutal cítrico de alto rendimiento. Produce limones durante todo el año. Perfecto para jardín o macetón grande.",
        category: ProductCategory.frutales,
        price: 4500,
        stockAvailable: 5,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Monstera Deliciosa",
        description:
          "La reina de las plantas de interior. Hojas grandes con cortes característicos. Crece vigorosa con luz indirecta y riego moderado.",
        category: ProductCategory.colecciones_raras,
        price: 6800,
        stockAvailable: 3,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Kit Suculentas x5",
        description:
          "Cinco suculentas surtidas en maceta de barro artesanal. Perfecto para regalo o para empezar tu colección.",
        category: ProductCategory.macetas_y_kits,
        price: 3200,
        stockAvailable: 7,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Sansevieria Trifasciata",
        description:
          "Planta lengua de suegra, extremadamente resistente. Tolera el descuido y purifica el aire. Ideal para oficinas.",
        category: ProductCategory.plantas_de_interior,
        price: 1900,
        stockAvailable: 10,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Albahaca Genovesa",
        description:
          "Aromática esencial para cocina italiana. Hojas grandes y perfumadas. Requiere sol directo y riego frecuente.",
        category: ProductCategory.aromaticas,
        price: 600,
        stockAvailable: 0,
        stockReserved: 0,
        status: ProductStatus.inactive,
        imageUrl:
          "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        name: "Cactus Opuntia",
        description:
          "Tuna o nopal de tallo plano. Muy resistente al calor y sequía. Produce frutos comestibles en verano.",
        category: ProductCategory.cactus,
        price: 1700,
        stockAvailable: 6,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Vivero Giménez creados");

  // ─── Productos — Verde Córdoba (seller2) ─────────────────────────────────────
  const p2 = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Ficus Lyrata",
        description:
          "Planta de interior imponente con hojas en forma de violín. Prefiere luz indirecta brillante. Se adapta bien a espacios amplios.",
        category: ProductCategory.plantas_de_interior,
        price: 8500,
        stockAvailable: 4,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Cactus San Pedro",
        description:
          "Columnar de rápido crecimiento con flores blancas nocturnas. Tolera sequías prolongadas y climas variados.",
        category: ProductCategory.cactus,
        price: 3100,
        stockAvailable: 10,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Romero Rastrero",
        description:
          "Aromática de cobertura ideal para jardines mediterráneos y rocallas. Muy resistente al calor y al viento.",
        category: ProductCategory.aromaticas,
        price: 950,
        stockAvailable: 18,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1515586838455-8a8a9b7ed5e6?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Haworthia Zebra",
        description:
          "Suculenta compacta con rayas blancas distintivas. Perfecta para escritorios y estantes. No necesita sol directo.",
        category: ProductCategory.suculentas,
        price: 1100,
        stockAvailable: 20,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Naranjo Navel",
        description:
          "Frutal de exterior que produce naranjas dulces sin semillas. Necesita riego regular y fertilización en primavera.",
        category: ProductCategory.frutales,
        price: 5200,
        stockAvailable: 3,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Philodendron Gloriosum",
        description:
          "Planta rastrera con enormes hojas aterciopeladas de color verde oscuro y nervaduras blancas. Pieza de colección.",
        category: ProductCategory.colecciones_raras,
        price: 12000,
        stockAvailable: 2,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Kit Cactus Terrario",
        description:
          "Tres cactus miniatura con arena decorativa de colores y guijarros en contenedor de vidrio. Listo para armar.",
        category: ProductCategory.macetas_y_kits,
        price: 2600,
        stockAvailable: 8,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Calathea Orbifolia",
        description:
          "Planta ornamental de hojas grandes con rayas plateadas. Necesita alta humedad y luz indirecta. Un lujo para interiores.",
        category: ProductCategory.plantas_de_interior,
        price: 4200,
        stockAvailable: 5,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        name: "Tomillo Común",
        description:
          "Aromática perenne de uso culinario y medicinal. Resistente a la sequía y a las heladas leves. Muy fácil de cultivar.",
        category: ProductCategory.aromaticas,
        price: 700,
        stockAvailable: 22,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1515586838455-8a8a9b7ed5e6?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Verde Córdoba creados");

  // ─── Productos — Botánica Fernández (seller3) ────────────────────────────────
  const p3 = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Alocasia Amazónica",
        description:
          "Planta exótica con hojas oscuras y nervaduras blancas pronunciadas. Requiere alta humedad y luz indirecta. Impresionante.",
        category: ProductCategory.colecciones_raras,
        price: 9200,
        stockAvailable: 2,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Menta Piperita",
        description:
          "Aromática refrescante para infusiones, cócteles y cocina. Crece muy rápido con agua abundante. Ideal para maceta.",
        category: ProductCategory.aromaticas,
        price: 550,
        stockAvailable: 30,
        stockReserved: 5,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Kit Aromáticas x3",
        description:
          "Set de albahaca, menta y perejil en macetas de cerámica pintadas a mano. Listo para colocar en tu balcón o ventana.",
        category: ProductCategory.macetas_y_kits,
        price: 2800,
        stockAvailable: 9,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Agave Azul",
        description:
          "Suculenta grande de exterior con hojas azuladas y puntas filosas. Muy resistente y de larga vida. Paisajismo y diseño.",
        category: ProductCategory.suculentas,
        price: 4100,
        stockAvailable: 6,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Higuera Brown Turkey",
        description:
          "Frutal rústico de rápido crecimiento. Produce higos dulces en verano y otoño. Tolera sequías una vez establecida.",
        category: ProductCategory.frutales,
        price: 3800,
        stockAvailable: 4,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Zamioculca Zamiifolia",
        description:
          "Planta ZZ, extremadamente tolerante a la falta de agua y luz. Sus hojas brillantes y oscuras son muy decorativas.",
        category: ProductCategory.plantas_de_interior,
        price: 2300,
        stockAvailable: 11,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Cactus Cereus",
        description:
          "Columnar clásico de crecimiento vertical. Puede alcanzar varios metros. Ideal para jardines con estética desértica.",
        category: ProductCategory.cactus,
        price: 2500,
        stockAvailable: 7,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        name: "Orquídea Phalaenopsis",
        description:
          "La orquídea más popular para interiores. Floración prolongada de hasta tres meses. Solo necesita agua una vez por semana.",
        category: ProductCategory.colecciones_raras,
        price: 5500,
        stockAvailable: 5,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Botánica Fernández creados");

  // ─── Productos — Plantas del Mar (seller4) ───────────────────────────────────
  const p4 = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Hiedra Inglesa",
        description:
          "Trepadora clásica de interior y exterior. Crece rápido y purifica el aire de formaldehído y benceno.",
        category: ProductCategory.plantas_de_interior,
        price: 1300,
        stockAvailable: 15,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Gymnocalycium",
        description:
          "Cactus de flor llamativa en tonos rosados y blancos. Ideal para interior por su adaptación a luz tenue.",
        category: ProductCategory.cactus,
        price: 1800,
        stockAvailable: 14,
        stockReserved: 2,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1567611663076-424b8d73e65b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Mandarina Satsuma",
        description:
          "Frutal enano apto para maceta grande. Produce mandarinas dulces y sin semillas. Perfecto para balcón soleado.",
        category: ProductCategory.frutales,
        price: 6000,
        stockAvailable: 4,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Tillandsia Ionantha",
        description:
          "Planta de aire que no necesita tierra ni maceta. Solo requiere humedad y luz. Floración rojiza espectacular.",
        category: ProductCategory.colecciones_raras,
        price: 1600,
        stockAvailable: 22,
        stockReserved: 3,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Maceta Terracota 20cm",
        description:
          "Maceta de barro cocido artesanal. Permite transpiración óptima para las raíces. Compatible con cualquier planta de interior.",
        category: ProductCategory.macetas_y_kits,
        price: 700,
        stockAvailable: 40,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Sedum Morganianum",
        description:
          "Suculenta colgante con tallos largos de hojitas redondeadas. Ideal para macetas colgantes o estantes altos.",
        category: ProductCategory.suculentas,
        price: 1400,
        stockAvailable: 16,
        stockReserved: 1,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Perejil Gigante",
        description:
          "Aromática y condimento indispensable en la cocina argentina. Crece rápido y se puede cortar continuamente.",
        category: ProductCategory.aromaticas,
        price: 480,
        stockAvailable: 25,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400",
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        name: "Kit Starter Jardín",
        description:
          "Kit completo para principiantes: 2 suculentas, 1 cactus, sustrato especial y 3 macetas de cerámica. Regalo ideal.",
        category: ProductCategory.macetas_y_kits,
        price: 4500,
        stockAvailable: 6,
        stockReserved: 0,
        status: ProductStatus.active,
        imageUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      },
    }),
  ]);

  console.log("✅ Productos de Plantas del Mar creados");

  // ─── Helper para crear órdenes ───────────────────────────────────────────────
  type OrderSeed = {
    buyerOrderId: string;
    buyerId: string;
    total: number;
    status: IncomingOrderStatus;
    createdAt: Date;
    sellerId: number;
    items: { product: { id: number; name: string; price: number }; quantity: number }[];
  };

  async function crearOrden(orden: OrderSeed) {
    return prisma.incomingOrder.create({
      data: {
        sellerId: orden.sellerId,
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

  // ─── Pedidos — Vivero Giménez (seller1) ──────────────────────────────────────
  const ordenesS1: OrderSeed[] = [
    {
      buyerOrderId: "ord_s1_001",
      buyerId: "buyer_ext_001",
      total: 3800,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      sellerId: seller1.id,
      items: [{ product: p1[0], quantity: 2 }, { product: p1[2], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_002",
      buyerId: "buyer_ext_002",
      total: 6800,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      sellerId: seller1.id,
      items: [{ product: p1[5], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_003",
      buyerId: "buyer_ext_003",
      total: 7600,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      sellerId: seller1.id,
      items: [{ product: p1[1], quantity: 2 }, { product: p1[6], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_004",
      buyerId: "buyer_ext_004",
      total: 4500,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      sellerId: seller1.id,
      items: [{ product: p1[4], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_005",
      buyerId: "buyer_ext_005",
      total: 3200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      sellerId: seller1.id,
      items: [{ product: p1[6], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_006",
      buyerId: "buyer_ext_006",
      total: 2300,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      sellerId: seller1.id,
      items: [{ product: p1[0], quantity: 1 }, { product: p1[2], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s1_007",
      buyerId: "buyer_ext_007",
      total: 1600,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
      sellerId: seller1.id,
      items: [{ product: p1[2], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s1_008",
      buyerId: "buyer_ext_008",
      total: 5700,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
      sellerId: seller1.id,
      items: [{ product: p1[3], quantity: 2 }, { product: p1[9], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s1_009",
      buyerId: "buyer_ext_009",
      total: 1900,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144),
      sellerId: seller1.id,
      items: [{ product: p1[7], quantity: 1 }],
    },
  ];

  for (const o of ordenesS1) await crearOrden(o);
  console.log("✅ Pedidos de Vivero Giménez creados");

  // ─── Pedidos — Verde Córdoba (seller2) ───────────────────────────────────────
  const ordenesS2: OrderSeed[] = [
    {
      buyerOrderId: "ord_s2_001",
      buyerId: "buyer_ext_010",
      total: 9450,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      sellerId: seller2.id,
      items: [{ product: p2[0], quantity: 1 }, { product: p2[2], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s2_002",
      buyerId: "buyer_ext_011",
      total: 6200,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      sellerId: seller2.id,
      items: [{ product: p2[1], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s2_003",
      buyerId: "buyer_ext_012",
      total: 5200,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      sellerId: seller2.id,
      items: [{ product: p2[4], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s2_004",
      buyerId: "buyer_ext_013",
      total: 2200,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      sellerId: seller2.id,
      items: [{ product: p2[3], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s2_005",
      buyerId: "buyer_ext_014",
      total: 950,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      sellerId: seller2.id,
      items: [{ product: p2[2], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s2_006",
      buyerId: "buyer_ext_015",
      total: 14600,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
      sellerId: seller2.id,
      items: [{ product: p2[5], quantity: 1 }, { product: p2[0], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s2_007",
      buyerId: "buyer_ext_016",
      total: 4900,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 84),
      sellerId: seller2.id,
      items: [{ product: p2[7], quantity: 1 }, { product: p2[8], quantity: 1 }],
    },
  ];

  for (const o of ordenesS2) await crearOrden(o);
  console.log("✅ Pedidos de Verde Córdoba creados");

  // ─── Pedidos — Botánica Fernández (seller3) ──────────────────────────────────
  const ordenesS3: OrderSeed[] = [
    {
      buyerOrderId: "ord_s3_001",
      buyerId: "buyer_ext_017",
      total: 9200,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      sellerId: seller3.id,
      items: [{ product: p3[0], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s3_002",
      buyerId: "buyer_ext_018",
      total: 3350,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      sellerId: seller3.id,
      items: [{ product: p3[2], quantity: 1 }, { product: p3[1], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s3_003",
      buyerId: "buyer_ext_019",
      total: 11000,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      sellerId: seller3.id,
      items: [{ product: p3[7], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s3_004",
      buyerId: "buyer_ext_020",
      total: 4100,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      sellerId: seller3.id,
      items: [{ product: p3[3], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s3_005",
      buyerId: "buyer_ext_021",
      total: 8200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
      sellerId: seller3.id,
      items: [{ product: p3[3], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s3_006",
      buyerId: "buyer_ext_022",
      total: 6100,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 75),
      sellerId: seller3.id,
      items: [{ product: p3[5], quantity: 1 }, { product: p3[4], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s3_007",
      buyerId: "buyer_ext_023",
      total: 1650,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100),
      sellerId: seller3.id,
      items: [{ product: p3[1], quantity: 3 }],
    },
  ];

  for (const o of ordenesS3) await crearOrden(o);
  console.log("✅ Pedidos de Botánica Fernández creados");

  // ─── Pedidos — Plantas del Mar (seller4) ─────────────────────────────────────
  const ordenesS4: OrderSeed[] = [
    {
      buyerOrderId: "ord_s4_001",
      buyerId: "buyer_ext_024",
      total: 7600,
      status: IncomingOrderStatus.recibida,
      createdAt: new Date(Date.now() - 1000 * 60 * 90),
      sellerId: seller4.id,
      items: [{ product: p4[2], quantity: 1 }, { product: p4[3], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s4_002",
      buyerId: "buyer_ext_025",
      total: 4300,
      status: IncomingOrderStatus.pendiente,
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      sellerId: seller4.id,
      items: [{ product: p4[1], quantity: 2 }, { product: p4[4], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s4_003",
      buyerId: "buyer_ext_026",
      total: 4500,
      status: IncomingOrderStatus.en_preparacion,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      sellerId: seller4.id,
      items: [{ product: p4[7], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s4_004",
      buyerId: "buyer_ext_027",
      total: 2800,
      status: IncomingOrderStatus.listo,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      sellerId: seller4.id,
      items: [{ product: p4[5], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s4_005",
      buyerId: "buyer_ext_028",
      total: 1300,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      sellerId: seller4.id,
      items: [{ product: p4[0], quantity: 1 }],
    },
    {
      buyerOrderId: "ord_s4_006",
      buyerId: "buyer_ext_029",
      total: 3200,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 55),
      sellerId: seller4.id,
      items: [{ product: p4[3], quantity: 2 }],
    },
    {
      buyerOrderId: "ord_s4_007",
      buyerId: "buyer_ext_030",
      total: 5900,
      status: IncomingOrderStatus.entregada,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80),
      sellerId: seller4.id,
      items: [{ product: p4[2], quantity: 1 }, { product: p4[4], quantity: 1 }, { product: p4[6], quantity: 2 }],
    },
  ];

  for (const o of ordenesS4) await crearOrden(o);
  console.log("✅ Pedidos de Plantas del Mar creados");

  // ─── Acreditaciones ──────────────────────────────────────────────────────────
  // Una PayoutNotification por cada orden entregada

  const payouts: {
    sellerId: number;
    paymentId: string;
    amount: number;
    read: boolean;
    createdAt: Date;
  }[] = [
    // seller1 — entregadas: s1_005, s1_006, s1_007, s1_008, s1_009
    { sellerId: seller1.id, paymentId: "pay_s1_005", amount: 3200, read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 49) },
    { sellerId: seller1.id, paymentId: "pay_s1_006", amount: 2300, read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 73) },
    { sellerId: seller1.id, paymentId: "pay_s1_007", amount: 1600, read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 97) },
    { sellerId: seller1.id, paymentId: "pay_s1_008", amount: 5700, read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 121) },
    { sellerId: seller1.id, paymentId: "pay_s1_009", amount: 1900, read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 145) },
    // seller2 — entregadas: s2_005, s2_006, s2_007
    { sellerId: seller2.id, paymentId: "pay_s2_005", amount: 950,   read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 37) },
    { sellerId: seller2.id, paymentId: "pay_s2_006", amount: 14600, read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 61) },
    { sellerId: seller2.id, paymentId: "pay_s2_007", amount: 4900,  read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 85) },
    // seller3 — entregadas: s3_005, s3_006, s3_007
    { sellerId: seller3.id, paymentId: "pay_s3_005", amount: 8200,  read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 51) },
    { sellerId: seller3.id, paymentId: "pay_s3_006", amount: 6100,  read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 76) },
    { sellerId: seller3.id, paymentId: "pay_s3_007", amount: 1650,  read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 101) },
    // seller4 — entregadas: s4_005, s4_006, s4_007
    { sellerId: seller4.id, paymentId: "pay_s4_005", amount: 1300,  read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 31) },
    { sellerId: seller4.id, paymentId: "pay_s4_006", amount: 3200,  read: true,  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 56) },
    { sellerId: seller4.id, paymentId: "pay_s4_007", amount: 5900,  read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 81) },
  ];

  await Promise.all(
    payouts.map((p) =>
      prisma.payoutNotification.create({
        data: { ...p, currency: "ARS" },
      })
    )
  );

  console.log("✅ Acreditaciones creadas");
  console.log("🌿 Seed completado con éxito");
  console.log("");
  console.log("📋 Resumen:");
  console.log("   4 sellers (usuarios reales de Clerk)");
  console.log("   35 productos en total");
  console.log("   30 pedidos en total (todos los estados cubiertos)");
  console.log("   14 acreditaciones");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });