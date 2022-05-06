"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const host = process.env.MAILTRAP_SMTP;
const port = process.env.MAILTRAP_PORT;
const user = process.env.MAILTRAP_USER;
const pass = process.env.MAILTRAP_PASSWORD;
class SendNotification {
    static sendMail(template, to, subject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host,
                port,
                auth: {
                    user,
                    pass,
                },
            });
            const handlebarsOptions = {
                viewEngine: {
                    extname: '.hbs',
                    partialsDir: path_1.default.join(__dirname, '../views/email-templates'),
                    defaultLayout: false,
                },
                viewPath: path_1.default.join(__dirname, '../views/email-templates'),
                extName: '.hbs',
            };
            transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarsOptions));
            const mailVar = {
                from: this.mailIsFrom,
                to,
                subject,
                template,
                context: data,
            };
            yield transporter.sendMail(mailVar);
        });
    }
    static sendPushNotification() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = SendNotification;
SendNotification.mailIsFrom = `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`;
