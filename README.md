# Sistema de Gestión Empresarial

Sistema completo de gestión empresarial desarrollado con el stack tecnológico recomendado para startups de desarrollo web.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** NextAuth.js (configuración pendiente)
- **Validación:** Zod
- **State Management:** Zustand (opcional)
- **UI Components:** Componentes personalizados estilo shadcn/ui

## 📋 Características

### Dashboard Principal
- Vista general con estadísticas en tiempo real
- Actividad reciente del sistema
- Alertas de stock bajo
- Gráficos de ventas (placeholder para integración)

### Gestión de Clientes
- CRUD completo de clientes
- Estados: Activo, Inactivo, Prospecto
- Búsqueda y filtrado
- Información de contacto completa

### Gestión de Productos
- Control de inventario
- Alertas de stock bajo
- Categorización de productos
- Precios y costos
- Estados: Activo, Inactivo, Sin Stock

### Gestión de Órdenes
- Creación y seguimiento de órdenes
- Estados: Pendiente, Confirmada, Procesando, Enviada, Entregada, Cancelada
- Cálculo automático de totales
- Historial de órdenes

### Reportes
- Resumen de ventas mensuales
- Productos más vendidos
- Métricas de crecimiento
- Exportación de datos (próximamente)

### Configuración
- Perfil de usuario
- Seguridad y contraseñas
- Preferencias de notificaciones
- Gestión de base de datos

## 🛠️ Instalación

### Requisitos Previos
- Node.js 20+ LTS
- PostgreSQL 14+
- pnpm (recomendado) o npm

### Paso 1: Clonar el repositorio

```bash
git clone <tu-repositorio>
cd Template-gestion
```

### Paso 2: Instalar dependencias

```bash
pnpm install
# o
npm install
```

### Paso 3: Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/template_gestion"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Paso 4: Configurar la base de datos

```bash
# Crear las tablas en la base de datos
pnpm db:push

# (Opcional) Abrir Prisma Studio para ver los datos
pnpm db:studio
```

### Paso 5: Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
Template-gestion/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Páginas del dashboard
│   │   ├── customers/       # Gestión de clientes
│   │   ├── products/        # Gestión de productos
│   │   ├── orders/          # Gestión de órdenes
│   │   ├── reports/         # Reportes y analíticas
│   │   ├── settings/        # Configuración
│   │   ├── layout.tsx       # Layout del dashboard
│   │   └── page.tsx         # Dashboard principal
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout raíz
│   └── page.tsx             # Página de inicio
├── components/              # Componentes reutilizables
│   ├── dashboard/           # Componentes del dashboard
│   │   ├── header.tsx       # Header con búsqueda
│   │   ├── sidebar.tsx      # Navegación lateral
│   │   └── stat-card.tsx    # Tarjetas de estadísticas
│   └── ui/                  # Componentes UI base
│       ├── button.tsx       # Componente Button
│       └── card.tsx         # Componente Card
├── lib/                     # Utilidades y configuración
│   ├── validations/         # Esquemas de validación Zod
│   │   ├── customer.ts
│   │   ├── product.ts
│   │   └── order.ts
│   ├── prisma.ts            # Cliente de Prisma
│   └── utils.ts             # Funciones de utilidad
├── prisma/                  # Configuración de Prisma
│   └── schema.prisma        # Esquema de base de datos
├── .env.example             # Variables de entorno ejemplo
├── next.config.js           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias del proyecto
```

## 🗄️ Base de Datos

### Modelos Principales

- **User:** Usuarios del sistema con roles (USER, ADMIN, MANAGER)
- **Customer:** Clientes con información de contacto
- **Product:** Productos con control de inventario
- **Order:** Órdenes de compra con items
- **OrderItem:** Items individuales de cada orden

### Scripts de Prisma

```bash
# Aplicar cambios al esquema en la BD
pnpm db:push

# Abrir Prisma Studio (GUI para ver datos)
pnpm db:studio

# Generar el cliente de Prisma
pnpm db:generate
```

## 🎨 Personalización

### Colores

Los colores están definidos en `app/globals.css` usando variables CSS. Puedes personalizarlos editando las variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... más colores */
}
```

### Componentes UI

Los componentes siguen el patrón de shadcn/ui. Puedes agregar más componentes en `components/ui/`.

## 🔐 Autenticación (Próximamente)

NextAuth.js está configurado en las dependencias. Para implementarlo:

1. Crear `app/api/auth/[...nextauth]/route.ts`
2. Configurar providers (credentials, Google, GitHub, etc.)
3. Proteger rutas con middleware
4. Agregar sesión en el layout

## 📈 Próximas Mejoras

- [ ] Implementar autenticación con NextAuth.js
- [ ] Agregar API routes para CRUD
- [ ] Integrar librería de gráficos (recharts)
- [ ] Implementar formularios reactivos con React Hook Form
- [ ] Agregar paginación en tablas
- [ ] Sistema de búsqueda avanzada
- [ ] Exportación de reportes a PDF/Excel
- [ ] Integración con Stripe para pagos
- [ ] Sistema de notificaciones con Resend
- [ ] Tests con Vitest
- [ ] Deploy a Vercel

## 🚀 Deploy

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Deploy automático

### Variables de Entorno en Vercel

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 📝 Licencia

MIT License - Siéntete libre de usar este template para tus proyectos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

**Desarrollado con ❤️ siguiendo la Guía Definitiva de Tecnologías para Startups**
