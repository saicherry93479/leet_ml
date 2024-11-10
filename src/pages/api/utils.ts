// import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend("re_SxoJxBDZ_M7c3vp64UV7Rvm77XpTNvr1Q");

interface ISendEmail {
  email: string;
  html: string;
  subject: string;
  name: string;
}

async function sendEmail(email) {
  try {
    const emailCode = Math.floor(100000 + Math.random() * 900000);
    const resp = await resend.emails.send({
      from: "verification@leetml.site",
      to: email,
      subject: "Email verification",
      html: `<p>ypur email code is <strong>${emailCode}</strong>!</p>`,
    });

    console.log("response is ",resp)
    return emailCode;
  } catch (e) {
    return 0;
  }
}

export { sendEmail };
