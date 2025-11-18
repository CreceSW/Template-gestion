import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@tudominio.com'
const APP_NAME = 'Sistema de Gestión'

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName: string
) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return { success: false, error: 'Email service not configured' }
  }

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Restablecer contraseña - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer Contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="width: 48px; height: 48px; background-color: #0f172a; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px; font-weight: bold;">G</span>
                      </div>
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                        Restablecer Contraseña
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #475569;">
                        Hola ${userName},
                      </p>
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #475569;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña:
                      </p>

                      <!-- Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: white; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                              Restablecer Contraseña
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #64748b;">
                        Este enlace expirará en <strong>1 hora</strong>. Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.
                      </p>

                      <p style="margin: 16px 0 0; font-size: 14px; line-height: 20px; color: #64748b;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:
                      </p>
                      <p style="margin: 8px 0 0; font-size: 12px; line-height: 18px; color: #94a3b8; word-break: break-all;">
                        ${resetUrl}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px;">
                      <hr style="margin: 0 0 20px; border: none; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8; text-align: center;">
                        Este correo fue enviado por ${APP_NAME}.<br>
                        Si no solicitaste este cambio, contacta a soporte.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  total: number
) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Orden ${orderNumber} confirmada - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="padding: 40px; text-align: center;">
                      <h1 style="margin: 0 0 20px; font-size: 24px; color: #0f172a;">
                        Orden Confirmada
                      </h1>
                      <p style="margin: 0 0 16px; font-size: 16px; color: #475569;">
                        Hola ${customerName},
                      </p>
                      <p style="margin: 0 0 24px; font-size: 16px; color: #475569;">
                        Tu orden <strong>#${orderNumber}</strong> ha sido confirmada.
                      </p>
                      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                        Total: $${total.toFixed(2)} MXN
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function sendLowStockAlert(
  email: string,
  productName: string,
  currentStock: number,
  minStock: number
) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Alerta de stock bajo: ${productName} - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc;">
          <table style="width: 100%;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table style="width: 600px; background-color: white; border-radius: 8px;">
                  <tr>
                    <td style="padding: 40px;">
                      <h1 style="margin: 0 0 20px; color: #dc2626;">
                        Alerta de Stock Bajo
                      </h1>
                      <p style="margin: 0 0 16px; color: #475569;">
                        El producto <strong>${productName}</strong> tiene stock bajo.
                      </p>
                      <p style="margin: 0 0 8px; color: #475569;">
                        Stock actual: <strong>${currentStock}</strong>
                      </p>
                      <p style="margin: 0; color: #475569;">
                        Stock mínimo: <strong>${minStock}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
