import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const seller = await prisma.seller.findUnique({
    where: { clerkUserId: userId },
    select: {
      name: true,
      address: true,
      iconUrl: true,
      city: true,
    },
  })

  if (!seller) redirect('/redirect')

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Mi perfil</h1>
      <ProfileForm seller={seller} />
    </div>
  )
}