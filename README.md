[**Producción**](https://proyecto-c-seller-brotes.vercel.app)
---

## Usuarios de prueba

| Nombre | Email |
|--------|-------|
| Marta Giménez | seller+clerk_test@iaw.com |
| Carlos Pereyra | seller2+clerk_test@iaw.com|
| Lucía Fernández | seller3+clerk_test@iaw.com |
| Roberto Medina | seller4+clerk_test@iaw.com |
| Administrador | admin+clerk_test@iaw.com |

---

## Instrucciones para ejecutar la aplicación

1. Instalar dependencias:

```bash
npm install
```

2. Copiar `.env.example` a `.env.local` y completar las variables obligatorias:
   - `DATABASE_URL` — conexión a Postgres
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` — credenciales de Clerk
   - `OPENWEATHER_API_KEY` y `CLOUDINARY_*` — necesarias para las funcionalidades de clima e imágenes

3. Generar el cliente de Prisma y ejecutar migraciones:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Cargar los datos de prueba:

```bash
npm run seed
```

5. Levantar el servidor:

```bash
npm run dev
```

6. Abrir `http://localhost:3000` e ir a `/sign-in` para autenticarse con Clerk. Los usuarios de prueba ya están incluidos en el seed.

Para producción: `npm run build && npm start`, o desplegar directamente en Vercel.

> **Nota sobre Clerk:** los usuarios del seed tienen IDs fijos de Clerk. Para que la autenticación funcione, hay que usar el mismo proyecto de Clerk que usé yo, o reemplazar esos IDs por los del proyecto propio.

---

## Descripción

**Brotes** es un marketplace de plantas y productos de jardinería. Este repositorio corresponde a la **Seller App**, la aplicación que usan los vendedores para gestionar su catálogo, administrar stock y recibir pedidos entrantes desde la Buyer App.

La app también incluye un panel administrativo desde donde se pueden revisar vendedores, 
productos y notificaciones de pago. La autenticación es compartida con el resto del sistema 
mediante Clerk, usando roles definidos en `publicMetadata` del JWT. El registro está 
configurado para asignar el rol `seller` automáticamente a los nuevos usuarios.

Está construida con Next.js (App Router), Prisma sobre PostgreSQL, Cloudinary para imágenes y OpenWeather para información climática en los componentes de la tienda. Los endpoints expuestos siguen el contrato de APIs acordado con el equipo para la comunicación entre servicios.

---

## Notas para la corrección

- **Seed completa:** incluye 4 vendedores con productos variados para evaluar todos los flujos sin necesidad de cargar datos manualmente.
- **Reservas de stock:** implementé la lógica de `stockAvailable`/`stockReserved` con los endpoints de confirmación y rechazo de reservas según el contrato acordado con el equipo.
- **Notificaciones de payout:** el modelo incluye `PAYOUT_NOTIFICATION` y el endpoint `POST /api/incoming-payouts` que Payments App consume para notificar acreditaciones.
- **Imágenes:** la subida usa Cloudinary (`lib/cloudinary.ts`); sin las `CLOUDINARY_*` en el `.env` la carga de imágenes no va a funcionar, pero los productos del seed ya tienen URLs públicas cargadas.
- **Clima:** el widget de clima consume OpenWeather; sin la API key se muestra un fallback, no rompe la app.
- **Decisiones de diseño:** usé Server Components para todas las rutas que hacen queries a la base de datos. El seed se puede correr más de una vez sin que duplique datos ni tire errores.
