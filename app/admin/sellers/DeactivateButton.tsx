"use client";

import { deactivateSeller, activateSeller } from "./actions";

export function SellerStatusButton({ sellerId, status }: { sellerId: number, status: string }) {
  if (status === "active") {
    return (
      <button
        onClick={() => deactivateSeller(sellerId)}
        className="text-red-500 hover:underline text-sm"
      >
        Desactivar
      </button>
    );
  }

  return (
    <button
      onClick={() => activateSeller(sellerId)}
      className="text-green-500 hover:underline text-sm"
    >
      Activar
    </button>
  );
}