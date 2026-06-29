// app/onboarding/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSeller } from "./actions";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Si ya tiene perfil, mandar al dashboard
  const existing = await prisma.seller.findUnique({
    where: { clerkUserId: userId },
  });
  if (existing) redirect("/dashboard");

  const user = await currentUser();
  const defaultEmail = user?.emailAddresses[0]?.emailAddress ?? "";
  const defaultName = user?.fullName ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#3d5a3e] mb-2">Completá tu perfil</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Necesitamos algunos datos para configurar tu cuenta de vendedor.
        </p>

        <form action={createSeller} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre del vivero *</label>
            <input
              name="name"
              defaultValue={defaultName}
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a3e]"
              placeholder="Ej: Vivero Las Flores"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input
              name="email"
              defaultValue={defaultEmail}
              required
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a3e]"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Dirección</label>
            <input
              name="address"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a3e]"
              placeholder="Av. Corrientes 1234"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Ciudad</label>
            <input
              name="city"
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d5a3e]"
              placeholder="Ej: Buenos Aires"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#3d5a3e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#2f4530] transition"
          >
            Comenzar a vender
          </button>
        </form>
      </div>
    </div>
  );
}