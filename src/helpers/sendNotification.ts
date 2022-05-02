import path from 'path'
import nodemailer from 'nodemailer'
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'

const host: string = process.env.MAILTRAP_SMTP as string
const port: number = process.env.MAILTRAP_PORT as unknown as number
const user: string = process.env.MAILTRAP_USER as string
const pass: string = process.env.MAILTRAP_PASSWORD as string

export default class SendNotification {
 private static mailIsFrom: string = `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`

 public static async sendMail(template: string, to: string, subject: string, data: any) {
  const transporter = nodemailer.createTransport({
   host,
   port,
   auth: {
    user,
    pass,
   },
  })

  const handlebarsOptions: NodemailerExpressHandlebarsOptions = {
   viewEngine: {
    extname: '.hbs',
    partialsDir: path.join(__dirname, '../views/email-templates'),
    defaultLayout: false,
   },
   viewPath: path.join(__dirname, '../views/email-templates'),
   extName: '.hbs',
  }

  transporter.use('compile', hbs(handlebarsOptions))

  const mailVar = {
   from: this.mailIsFrom,
   to,
   subject,
   template,
   context: data,
  }

  await transporter.sendMail(mailVar)
 }

 public static async sendPushNotification(){

 }
}