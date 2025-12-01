import nodemailer from 'nodemailer'

const EMAIL_USER = process.env.EMAIL_USER || 'ops.glitch.hack@gmail.com'
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'aycv xjcj gxvd fhab'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})

export async function sendAcceptanceEmail(isAccepted: boolean) {
  const subject = isAccepted ? 'Proposal Accepted! 🎉' : 'Proposal Response'
  const htmlContent = isAccepted
    ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4CAF50;">Great News! 🎉</h1>
      <p style="font-size: 16px; line-height: 1.6;">
        The proposal has been <strong>accepted</strong>!
      </p>
      <p style="font-size: 14px; color: #666;">
        This is an automated notification from the vulnerability engine system.
      </p>
    </div>
  `
    : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #f44336;">Proposal Update</h1>
      <p style="font-size: 16px; line-height: 1.6;">
        The proposal has been <strong>declined</strong>.
      </p>
      <p style="font-size: 14px; color: #666;">
        This is an automated notification from the vulnerability engine system.
      </p>
    </div>
  `

  const mailOptions = {
    from: EMAIL_USER,
    to: 'Smeet.niper2023@gmail.com',
    subject,
    html: htmlContent,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  }
  catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: String(error) }
  }
}
