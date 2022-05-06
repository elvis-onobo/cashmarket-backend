"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path'
require("express-async-errors");
require("dotenv/config");
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const cors_1 = __importDefault(require("cors"));
// import { engine, create } from 'express-handlebars'
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
/**
 * THE COMMENTED CODE HANDLES VIEWS FOR E_MAIL
 */
// const hbs = create({ /* config */ })
// app.engine('.hbs', engine({extname: '.hbs'}))
// app.set('view engine', '.hbs')
// app.set('views', path.join(__dirname, 'views'))
// app.get('/email', (req, res) => {
//     return res.render('email', {layout: false})
// })
const hash = crypto_1.default
    .createHmac('sha512', 'R9dbzqCv6hd7u0TZ6sQnl1xRA0LQNEEu'.toString())
    .update(JSON.stringify({
    "event": "collection.successful",
    "data": {
        "business": "626282f4b5a8a655c7675644",
        "virtualAccount": "61dc08222d2cc644566c5a591",
        "sourceCurrency": "NGN",
        "destinationCurrency": "NGN",
        "sourceAmount": 400,
        "destinationAmount": 380,
        "amountReceived": 380,
        "fee": 20,
        "customerName": "Efe Ultimate Global Ventures",
        "settlementDestination": "wallet",
        "status": "successful",
        "initiatedAt": "2022-03-28T07:15:19.402Z",
        "createdAt": "2022-03-28T07:15:19.403Z",
        "updatedAt": "2022-03-28T07:15:19.403Z",
        "reference": "f9121b33-7e15-409e-b588-36c6146d5823"
    }
}))
    .digest('hex');
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_APP_URL
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', appRoutes_1.default);
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
