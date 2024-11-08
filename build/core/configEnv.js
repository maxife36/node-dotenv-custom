"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFileStructuring_1 = __importDefault(require("./envFileStructuring"));
const tagProcessor_1 = __importDefault(require("./tagProcessor"));
const initialEnv = Object.assign({}, process.env);
class CustomEnv {
    constructor(config) {
        this.dotenv = {};
        this.env = {};
        this.envStruct = {};
        dotenv_1.default.config({ path: config.path });
        //Cargo solo las variables de entorno del .env establecido
        this.dotenv = this.envOnly();
        this.filterEnv();
    }
    envOnly() {
        const envOnly = {};
        const keys = Object.keys(process.env);
        for (const env of keys) {
            if (!(env in initialEnv)) {
                envOnly[env] = process.env[env];
            }
        }
        return envOnly;
    }
    filterEnv() {
        if (Object.keys(this.dotenv).length === 0)
            return;
        new envFileStructuring_1.default(this).init();
        new tagProcessor_1.default(this).init();
    }
}
exports.default = CustomEnv;
//# sourceMappingURL=configEnv.js.map