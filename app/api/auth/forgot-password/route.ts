import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Por seguridad, siempre retornar éxito aunque el usuario no exista
    if (!user) {
      return NextResponse.json({
        message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
      })
    }

    // Eliminar tokens anteriores del mismo email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en la base de datos
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Aquí se enviará el email con el token
    // Por ahora, guardamos el token para uso en desarrollo
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`

    // En desarrollo, mostrar el URL en la consola
    if (process.env.NODE_ENV === 'development') {
      console.log('Reset Password URL:', resetUrl)
    }

    // Si hay configuración de email, enviar el correo
    if (process.env.RESEND_API_KEY) {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail(email, token, user.name || 'Usuario')
    }

    return NextResponse.json({
      message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
      // Solo en desarrollo mostrar el token
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
