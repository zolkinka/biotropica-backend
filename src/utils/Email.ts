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
    transporter.sendMail(options, callback);
  }
}
