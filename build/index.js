"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configEnv_1 = __importDefault(require("./configEnv"));
function customEnvInit(config) {
    const customEnv = new configEnv_1.default(config);
    return customEnv.env;
}
module.exports = customEnvInit;
//# sourceMappingURL=index.js.map