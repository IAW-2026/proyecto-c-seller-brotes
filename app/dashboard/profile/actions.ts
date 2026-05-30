'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export type UpdateProfileState = {
  success: boolean
  error?: string
}

export async function updateSellerProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'No autenticado' }

  const seller = await prisma.seller.findUnique({ where: { clerkUserId: userId } })
  if (!seller) return { success: false, error: 'Vendedor no encontrado' }

  const name     = (formData.get('name') as string)?.trim()
  const address  = (formData.get('address') as string)?.trim() || null
  const city     = (formData.get('city') as string)?.trim() || null // ← cambió
  const iconFile = formData.get('icon') as File | null

  if (!name) return { success: false, error: 'El nombre es requerido' }

  let iconUrl = seller.iconUrl

  if (iconFile && iconFile.size > 0) {
    try {
      const buffer = Buffer.from(await iconFile.arrayBuffer())
      const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'brotes/sellers', public_id: `seller_${seller.id}`, overwrite: true },
            (err, result) => (err ? reject(err) : resolve(result as { secure_url: string }))
          )
          .end(buffer)
      })
      iconUrl = uploaded.secure_url
    } catch {
      return { success: false, error: 'Error al subir la imagen' }
    }
  }

  await prisma.seller.update({
    where: { id: seller.id },
    data: { name, address, city, iconUrl }, 
  })

  revalidatePath('/dashboard/profile')
  return { success: true }
}