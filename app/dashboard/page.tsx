import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller.ts";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await requireSeller();

  const user = await currentUser();

  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenida, {seller.name}</h1>
      <p className="text-gray-500">Panel de vendedor</p>
    </div>
  );
}