import nodemailer, { createTransport } from "nodemailer";
import { asyncHandler } from "./asyncHandller.js";

export const sendMail = asyncHandler(async (email, sub, txt) => {
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.EMAIL_SECURE),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: sub,
        text: txt
    })

    if (info.messageId) {
        console.log("Email sent successfully")
    }
    return info
})
