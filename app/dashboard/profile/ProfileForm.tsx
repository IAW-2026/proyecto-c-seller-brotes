'use client'

import { useActionState, useRef, useState } from 'react'
import Image from 'next/image'
import { updateSellerProfile, type UpdateProfileState } from './actions'

type City = { postalCode: number; name: string }

type Props = {
  seller: {
    name: string
    address: string | null
    iconUrl: string | null
    cityPostalCode: number | null
  }
  cities: City[]
}

const initialState: UpdateProfileState = { success: false }

export default function ProfileForm({ seller, cities }: Props) {
  const [state, formAction, pending] = useActionState(updateSellerProfile, initialState)
  const [previewUrl, setPreviewUrl] = useState<string | null>(seller.iconUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <form action={formAction} className="space-y-6 max-w-lg">

      {/* Ícono */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {previewUrl ? (
            <Image src={previewUrl} alt="Ícono del vendedor" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              🌿
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-green-700 hover:underline font-medium"
          >
            Cambiar imagen
          </button>
          <p className="text-xs text-gray-400 mt-0.5">PNG o JPG, máximo 2MB</p>
          <input
            ref={fileInputRef}
            type="file"
            name="icon"
            accept="image/png,image/jpeg"
            onChange={handleIconChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Nombre */}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del vivero
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={seller.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Ciudad */}
      <div className="space-y-1">
        <label htmlFor="cityPostalCode" className="block text-sm font-medium text-gray-700">
          Ciudad
        </label>
        <select
          id="cityPostalCode"
          name="cityPostalCode"
          defaultValue={seller.cityPostalCode ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
        >
          <option value="">Sin especificar</option>
          {cities.map((city) => (
            <option key={city.postalCode} value={city.postalCode}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dirección */}
      <div className="space-y-1">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={seller.address ?? ''}
          placeholder="Ej: Av. Corrientes 1234"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Feedback */}
      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-green-600">Perfil actualizado correctamente.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
