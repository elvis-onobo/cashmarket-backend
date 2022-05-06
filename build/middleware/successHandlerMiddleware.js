"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
const successHandler = (status = 200, message, data) => {
    return (req, res) => {
        return res.status(status).json({
            success: true,
            status,
            message,
            data,
        });
    };
};
exports.successHandler = successHandler;
