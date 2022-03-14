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
const amqplib_1 = __importDefault(require("amqplib"));
const rabbit = amqplib_1.default.connect('amqp://localhost');
const events_1 = __importDefault(require("../events/events"));
class RabbitMQ {
    /**
     * Initialize RabbitMQ
     */
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield rabbit).createChannel();
        });
    }
    /**
     * Publishes data to the queue
     * @param channel
     * @param data
     */
    static publish(channel, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataToPublish = JSON.stringify(data);
                const process = yield this.connect();
                yield process.assertQueue(channel);
                process.sendToQueue(channel, Buffer.from(dataToPublish));
                process.close();
            }
            catch (error) {
                console.log('Error publishing data >>> ', error);
            }
        });
    }
    /**
     * Consume published data from a channel
     * @param channel
     */
    static consume(channel, event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const process = yield this.connect();
                process.assertQueue(channel);
                process.consume(channel, (message) => {
                    if (message !== null) {
                        const data = JSON.parse(message.content.toString());
                        // emit an event to call the appropriate function
                        events_1.default.emit(event, data);
                        process.ack(message);
                        process.close();
                    }
                });
            }
            catch (error) {
                console.log('Error consuming data >>> ', error);
            }
        });
    }
}
exports.default = RabbitMQ;
