// POST /api/incoming-payouts
// Lo llama Payments App para avisarte que te acreditaron el dinero de una venta. 
// Recibe el ID del payout, el ID del pago, tu seller ID y el monto. 

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  let body: {
    payout_id?: string;
    payment_id?: string;
    seller_id?: string | number;
    amount?: { value: number; currency: string };
    created_at?: string;
  };

  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON", 400); 
  }

  const { payout_id, payment_id, seller_id, amount } = body;

  if (!payout_id || !payment_id || !seller_id || !amount) {
    return apiError("Missing required fields", 400); 
  }

  try {
    const seller = await prisma.seller.findUnique({
      where: { id: typeof seller_id === "string" ? parseInt(seller_id) : seller_id },
    });

    if (!seller) {
      return apiError("Seller not found", 404);  
    }

    console.log(
      `[incoming-payout] payout_id=${payout_id} payment_id=${payment_id} seller_id=${seller_id} amount=${amount.value} ${amount.currency}`
    );

    return NextResponse.json(
      { acknowledged: true, payout_id, seller_id: seller.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/incoming-payouts]", error);
    return apiError("Error al procesar el payout", 500);
  }
}
