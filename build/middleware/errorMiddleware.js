"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = __importDefault(require("../helpers/logger"));
const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    logger_1.default.error(err);
    const message = err.message || 'There\'s a problem from our end. We are working to fix this.';
    res.header("Content-Type", 'application/json');
    res.status(status).json({
        success: false,
        status,
        message
    });
};
exports.errorMiddleware = errorMiddleware;
