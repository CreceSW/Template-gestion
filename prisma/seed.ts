import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin Test',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario creado:', user.email)

  // Crear clientes de prueba
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'juan.perez@example.com' },
      update: {},
      create: {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '+52 555 1234 567',
        address: 'Av. Reforma 123',
        city: 'Ciudad de México',
        country: 'México',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
    prisma.customer.upsert({
      where: { email: 'maria.garcia@example.com' },
      update: {},
      create: {
        name: 'María García',
        email: 'maria.garcia@example.com',
        phone: '+52 555 9876 543',
        address: 'Calle Principal 456',
        city: 'Guadalajara',
        country: 'México',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
    prisma.customer.upsert({
      where: { email: 'carlos.lopez@example.com' },
      update: {},
      create: {
        name: 'Carlos López',
        email: 'carlos.lopez@example.com',
        phone: '+52 555 2468 135',
        address: 'Blvd. de los Héroes 789',
        city: 'Monterrey',
        country: 'México',
        status: 'PROSPECT',
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ ${customers.length} clientes creados`)

  // Crear productos de prueba
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' },
      update: {},
      create: {
        name: 'Laptop Dell XPS 13',
        description: 'Laptop ultradelgada de alto rendimiento',
        sku: 'PROD-001',
        price: 1299.99,
        cost: 899.99,
        stock: 15,
        minStock: 5,
        category: 'Electrónica',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' },
      update: {},
      create: {
        name: 'Mouse Logitech MX Master 3',
        description: 'Mouse inalámbrico ergonómico',
        sku: 'PROD-002',
        price: 99.99,
        cost: 59.99,
        stock: 3,
        minStock: 5,
        category: 'Accesorios',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' },
      update: {},
      create: {
        name: 'Teclado Mecánico Keychron K8',
        description: 'Teclado mecánico inalámbrico',
        sku: 'PROD-003',
        price: 89.99,
        cost: 49.99,
        stock: 0,
        minStock: 3,
        category: 'Accesorios',
        status: 'OUT_OF_STOCK',
        userId: user.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-004' },
      update: {},
      create: {
        name: 'Monitor LG 27" 4K',
        description: 'Monitor 4K UHD con HDR',
        sku: 'PROD-004',
        price: 399.99,
        cost: 279.99,
        stock: 8,
        minStock: 3,
        category: 'Electrónica',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-005' },
      update: {},
      create: {
        name: 'Audífonos Sony WH-1000XM4',
        description: 'Audífonos con cancelación de ruido',
        sku: 'PROD-005',
        price: 349.99,
        cost: 249.99,
        stock: 12,
        minStock: 5,
        category: 'Audio',
        status: 'ACTIVE',
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ ${products.length} productos creados`)

  // Crear órdenes de prueba
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-000001',
      customerId: customers[0].id,
      subtotal: 1399.98,
      tax: 223.99,
      total: 1623.97,
      status: 'DELIVERED',
      notes: 'Entregado exitosamente',
      items: {
        create: [
          {
            productId: products[0].id, // Laptop
            quantity: 1,
            price: 1299.99,
            subtotal: 1299.99,
          },
          {
            productId: products[1].id, // Mouse
            quantity: 1,
            price: 99.99,
            subtotal: 99.99,
          },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-000002',
      customerId: customers[1].id,
      subtotal: 399.99,
      tax: 64.00,
      total: 463.99,
      status: 'SHIPPED',
      notes: 'En camino',
      items: {
        create: [
          {
            productId: products[3].id, // Monitor
            quantity: 1,
            price: 399.99,
            subtotal: 399.99,
          },
        ],
      },
    },
  })

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-000003',
      customerId: customers[0].id,
      subtotal: 699.98,
      tax: 111.99,
      total: 811.97,
      status: 'PENDING',
      notes: 'Esperando confirmación',
      items: {
        create: [
          {
            productId: products[4].id, // Audífonos
            quantity: 2,
            price: 349.99,
            subtotal: 699.98,
          },
        ],
      },
    },
  })

  console.log(`✅ 3 órdenes creadas`)

  console.log('✨ Seed completado exitosamente!')
  console.log('\n📧 Credenciales de prueba:')
  console.log('   Email: admin@test.com')
  console.log('   Password: password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
