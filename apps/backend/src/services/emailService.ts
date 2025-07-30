import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM, // ex: myfocus.noreply@gmail.com
        pass: process.env.EMAIL_PASS,
    },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Redefinição de senha - MyFocus",
        html: `
      <p>Você solicitou a redefinição de senha. Clique no botão abaixo:</p>
      <a href="${resetLink}" style="padding: 10px 15px; background: #7C3AED; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
      <p>Este link expira em 15 minutos.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};
