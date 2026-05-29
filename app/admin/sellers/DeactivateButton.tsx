"use client";

import { deactivateSeller, activateSeller } from "./actions";

export function SellerStatusButton({ sellerId, status }: { sellerId: number, status: string }) {
  if (status === "active") {
    return (
      <button
        onClick={() => deactivateSeller(sellerId)}
        className="flex items-center gap-1 text-sm cursor-pointer bg-transparent border-none text-[#993C1D] hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4"/><path d="M22 22l-5 -5"/><path d="M17 22l5 -5"/>
        </svg>
        Desactivar
      </button>
    );
  }

  return (
    <button
      onClick={() => activateSeller(sellerId)}
      className="flex items-center gap-1 text-sm cursor-pointer bg-transparent border-none text-[#3B6D11] hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4"/><path d="M15 19l2 2l4 -4"/>
      </svg>
      Activar
    </button>
  );
}