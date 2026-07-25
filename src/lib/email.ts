import nodemailer from 'nodemailer';

// Since this is a demo, we will use Ethereal Email which is a fake SMTP service for testing.
// In a real production app, you would use SendGrid, Resend, or Google Workspace SMTP here.
export async function sendOtpEmail(to: string, otp: string) {
  // Create a Nodemailer transporter using Ethereal Email
  // (We use a hardcoded test account for demo purposes)
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'mylene.lubowitz36@ethereal.email',
      pass: 'Pcx8qSttQ278X9WkKc'
    }
  });

  const mailOptions = {
    from: '"LearnNov System" <no-reply@learnnov.com>',
    to,
    subject: 'رمز التحقق الخاص بك من منصة LearnNov',
    text: `مرحباً، رمز التحقق الخاص بك للتسجيل في منصة LearnNov هو: ${otp}\nيرجى إدخال هذا الرمز لإكمال عملية التسجيل.`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: right; direction: rtl;">
        <h2 style="color: #6366f1;">مرحباً بك في منصة LearnNov</h2>
        <p>لقد قمت بطلب إنشاء حساب جديد. يرجى استخدام رمز التحقق التالي لإكمال التسجيل:</p>
        <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>إذا لم تقم بهذا الطلب، يرجى تجاهل هذه الرسالة.</p>
        <p>مع تحيات فريق LearnNov</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Return the preview URL so we can log it (helpful for testing since it's Ethereal)
  return nodemailer.getTestMessageUrl(info);
}
