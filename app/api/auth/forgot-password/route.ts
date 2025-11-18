import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Siempre responder con éxito por seguridad (no revelar si el email existe)
    if (!user) {
      return NextResponse.json({
        message: 'Si el email existe, recibirás un enlace de recuperación',
      })
    }

    // Generar token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en la base de datos
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // En producción, aquí enviarías el email con el enlace
    // Por ahora, solo logueamos el token para desarrollo
    console.log(`Reset token for ${email}: ${token}`)
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`)

    // TODO: Integrar con servicio de email (Resend, SendGrid, etc.)
    // await sendEmail({
    //   to: email,
    //   subject: 'Restablecer contraseña',
    //   html: `<a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}">Restablecer contraseña</a>`
    // })

    return NextResponse.json({
      message: 'Si el email existe, recibirás un enlace de recuperación',
    })
  } catch (error) {
    console.error('Error in forgot-password:', error)
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}
