import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    // Для разработки используем тестовый SMTP или реальный SMTP сервер
    // В продакшене настройте реальный SMTP (Gmail, SendGrid, Mailgun и т.д.)
    this.transporter = createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true для 465, false для других портов
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendLoginCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@lms.com',
      to: email,
      subject: 'Код для входа в LMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e85d04;">Код для входа</h2>
          <p>Ваш код для входа в систему:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #3b82f6; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">Код действителен в течение 10 минут.</p>
          <p style="color: #666; font-size: 14px;">Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
        </div>
      `,
      text: `Ваш код для входа: ${code}\nКод действителен в течение 10 минут.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      // В режиме разработки можно логировать вместо реальной отправки
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV MODE] Код для ${email}: ${code}`);
      } else {
        throw new Error('Не удалось отправить код на email');
      }
    }
  }
}
