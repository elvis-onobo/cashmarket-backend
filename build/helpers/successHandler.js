"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
function successHandler(message, status = 200, data = null) {
    return (req, res) => {
        return res.status(status).json({
            success: true,
            status,
            message,
            data,
        });
    };
}
exports.successHandler = successHandler;
