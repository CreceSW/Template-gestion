import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  price: z.number().positive('El precio debe ser positivo'),
  cost: z.number().positive('El costo debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  minStock: z.number().int().min(0).optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
})

// GET - Obtener todos los productos
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const products = await prisma.product.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(status && { status: status as any }),
        ...(category && { category }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    // Verificar si el SKU ya existe para este usuario
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: validatedData.sku,
        userId: session.user.id,
      },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este SKU' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
