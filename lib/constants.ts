import { IncomingOrderStatus, ProductCategory } from "@prisma/client";

export const statusLabels: Record<IncomingOrderStatus, string> = {
  pendiente: "Pendiente",
  recibida: "Recibida",
  en_preparacion: "En preparación",
  listo: "Listo",
  entregada: "Entregada",
};

export const statusColors: Record<IncomingOrderStatus, string> = {
  pendiente: "bg-orange-100 text-orange-800",
  recibida: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-yellow-100 text-yellow-800",
  listo: "bg-green-100 text-green-800",
  entregada: "bg-gray-100 text-gray-800",
};

export const categoryLabels: Record<ProductCategory, string> = {
  suculentas: "Suculentas",
  plantas_de_interior: "Plantas de interior",
  aromaticas: "Aromáticas",
  frutales: "Frutales",
  cactus: "Cactus",
  colecciones_raras: "Colecciones raras",
  macetas_y_kits: "Macetas & kits",
};

export const categoryOptions = Object.entries(categoryLabels) as [ProductCategory, string][];