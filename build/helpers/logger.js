"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, errors, json, colorize, printf } = winston_1.format;
const environment = process.env.NODE_ENV;
const logger = () => {
    let logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp}, ${level}, ${stack || message}`;
    });
    if (environment === 'development') {
        return (0, winston_1.createLogger)({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
            transports: [new winston_1.transports.Console()],
        });
    }
    else {
        return (0, winston_1.createLogger)({
            format: combine(timestamp(), errors({ stack: true }), json()),
            transports: [new winston_1.transports.Console()],
        });
    }
};
exports.default = logger();
