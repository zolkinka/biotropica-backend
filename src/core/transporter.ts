import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support2@newshift.ru',
    pass: 'i45xLc2ujCNwE7yQ',
  },
});
