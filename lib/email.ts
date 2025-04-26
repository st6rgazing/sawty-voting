import nodemailer from "nodemailer"

// Email configuration
const emailUser = process.env.EMAIL_USER || "mariamshafey3@gmail.com"
const emailPass = process.env.EMAIL_PASS || "siffmirrcuqtvaeg" // app password

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
})

// Send an email
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text: string
  html?: string
}) {
  const mailOptions = {
    from: `"Sawty Voting" <${emailUser}>`,
    to,
    subject,
    text,
    html,
  }

  return transporter.sendMail(mailOptions)
}
