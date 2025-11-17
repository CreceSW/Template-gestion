# 🚀 Guía de Instalación y Configuración

Esta guía te ayudará a configurar y ejecutar el Sistema de Gestión Empresarial.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado y ejecutándose
- Git instalado

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd Template-gestion
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está configurado con valores por defecto. Si necesitas cambiarlos:

```bash
# Editar .env con tus valores
nano .env
```

Variables importantes:
- `DATABASE_URL`: Conexión a PostgreSQL
- `NEXTAUTH_SECRET`: Secreto para NextAuth (ya generado)
- `NEXTAUTH_URL`: URL de la aplicación

### 4. Configurar la base de datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Generar el cliente de Prisma
npm run db:generate

# Llenar la base de datos con datos de prueba
npm run db:seed
```

O ejecutar todo en un solo comando:

```bash
npm run db:setup
```

## 🎯 Ejecutar la aplicación

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Modo producción

```bash
npm run build
npm start
```

## 🔐 Credenciales de prueba

Después de ejecutar el seed, puedes usar estas credenciales:

- **Email:** admin@test.com
- **Password:** password123

## 🎨 Características Implementadas

### ✅ Autenticación Completa
- Login con email y contraseña
- Registro de nuevos usuarios
- Sesiones con NextAuth.js
- Protección de rutas con middleware
- OAuth con Google y GitHub (configurable)

### ✅ Gestión de Clientes
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Búsqueda y filtrado
- Estados: Activo, Inactivo, Prospecto
- Historial de órdenes por cliente

### ✅ Gestión de Productos
- CRUD completo
- Control de inventario
- Alertas de stock bajo
- SKU único por producto
- Categorización

### ✅ Gestión de Órdenes
- Crear órdenes con múltiples items
- Estados de orden: Pendiente, Confirmada, Procesando, Enviada, Entregada, Cancelada
- Cálculo automático de totales e impuestos
- Actualización automática de inventario
- Restauración de stock al cancelar

### ✅ Dashboard
- Estadísticas en tiempo real
- Gráficos de ventas (placeholder)
- Actividad reciente
- Alertas de stock bajo
- KPIs principales

## 🗂️ Estructura del Proyecto

```
Template-gestion/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Autenticación
│   │   ├── customers/          # API de clientes
│   │   ├── products/           # API de productos
│   │   ├── orders/             # API de órdenes
│   │   └── dashboard/          # API de estadísticas
│   ├── auth/                   # Páginas de auth
│   │   └── register/           # Registro
│   ├── dashboard/              # Panel de control
│   └── page.tsx                # Login (home)
├── components/                  # Componentes React
│   ├── dashboard/              # Componentes del dashboard
│   ├── providers/              # Providers (Session)
│   └── ui/                     # Componentes UI base
├── lib/                        # Utilidades
│   ├── auth.ts                # Configuración NextAuth
│   ├── prisma.ts              # Cliente Prisma
│   └── utils.ts               # Helpers
├── prisma/                     # Base de datos
│   ├── schema.prisma          # Esquema de BD
│   └── seed.ts                # Datos de prueba
└── types/                      # TypeScript types
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/[...nextauth]` - Endpoints de NextAuth

### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Crear cliente
- `GET /api/customers/:id` - Obtener cliente
- `PUT /api/customers/:id` - Actualizar cliente
- `DELETE /api/customers/:id` - Eliminar cliente

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener orden
- `PUT /api/orders/:id` - Actualizar orden
- `DELETE /api/orders/:id` - Eliminar orden (solo PENDING)

### Dashboard
- `GET /api/dashboard/stats` - Obtener estadísticas

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de datos
npm run db:push          # Aplicar esquema a la BD
npm run db:generate      # Generar cliente Prisma
npm run db:seed          # Llenar con datos de prueba
npm run db:setup         # Push + Seed en un comando
npm run db:studio        # Abrir Prisma Studio

# Producción
npm run build            # Construir para producción
npm start                # Iniciar servidor de producción

# Docker
npm run docker:dev       # Levantar contenedores dev
npm run docker:prod      # Levantar contenedores prod
```

## 🐳 Docker (Opcional)

Si prefieres usar Docker:

```bash
# Desarrollo
npm run docker:dev

# Producción
npm run docker:prod
```

## 🎓 Próximos Pasos

1. **Conectar las páginas del frontend con las APIs**
   - Las páginas actuales muestran datos de ejemplo
   - Necesitan conectarse a las APIs creadas

2. **Agregar gráficos reales**
   - Instalar recharts o chart.js
   - Implementar visualizaciones de datos

3. **Mejorar validaciones**
   - Agregar más validaciones en formularios
   - Feedback visual mejorado

4. **Tests**
   - Agregar tests unitarios
   - Tests de integración

5. **Deploy**
   - Configurar para Vercel/Railway
   - Variables de entorno de producción

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL está ejecutándose
sudo service postgresql status

# Verificar la URL de conexión en .env
```

### Error al generar Prisma Client
```bash
# Limpiar y regenerar
rm -rf node_modules/.prisma
npm run db:generate
```

### Problemas con NextAuth
```bash
# Verificar que NEXTAUTH_SECRET está configurado
# Regenerar si es necesario
openssl rand -base64 32
```

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, por favor abre un issue en el repositorio.

---

¡Listo! Tu sistema de gestión está configurado y funcionando. 🎉
