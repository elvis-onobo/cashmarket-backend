"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// controllers
const HealthCheckController_1 = __importDefault(require("./controllers/HealthCheckController"));
exports.default = router;
router.get('/healthcheck', HealthCheckController_1.default.check);
