import Link from 'next/link'
import { ArrowRight, BarChart3, Users, Package, Settings } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Sistema de Gestión Empresarial
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Plataforma completa para gestionar tu negocio con Next.js 14, TypeScript y Tailwind CSS
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Dashboard"
            description="Visualiza métricas y KPIs en tiempo real"
            href="/dashboard"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Clientes"
            description="Gestiona tu cartera de clientes"
            href="/dashboard/customers"
          />
          <FeatureCard
            icon={<Package className="w-8 h-8" />}
            title="Inventario"
            description="Control total de productos y stock"
            href="/dashboard/inventory"
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8" />}
            title="Configuración"
            description="Personaliza tu sistema"
            href="/dashboard/settings"
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Ir al Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Stack Tecnológico
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <TechBadge>Next.js 14</TechBadge>
            <TechBadge>TypeScript</TechBadge>
            <TechBadge>Tailwind CSS</TechBadge>
            <TechBadge>PostgreSQL</TechBadge>
            <TechBadge>Prisma ORM</TechBadge>
            <TechBadge>NextAuth.js</TechBadge>
            <TechBadge>Zod</TechBadge>
            <TechBadge>Zustand</TechBadge>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 group"
    >
      <div className="text-slate-900 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </Link>
  )
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium">
      {children}
    </span>
  )
}
