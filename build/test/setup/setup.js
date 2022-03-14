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
const child_process_1 = require("child_process");
module.exports = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Setting up test DB');
        process.env.NODE_ENV = 'test';
        (0, child_process_1.execSync)('yarn knex migrate:latest');
        (0, child_process_1.execSync)('yarn knex seed:run');
    }
    catch (err) {
        // Log the error
        console.log('>>>>>> error setting up db >>> ', err);
    }
});
