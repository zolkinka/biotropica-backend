import { transporter } from 'src/core/transporter';

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export class Email {
  async sendMail(
    options: EmailOptions,
    callback: (err: any, success: any) => void,
  ) {
    console.log(
      process.env.MAILER_SERVICE,
      process.env.MAILER_USER,
      process.env.MAILER_PASSWORD,
    );

    transporter.sendMail(options, callback);
  }
}
