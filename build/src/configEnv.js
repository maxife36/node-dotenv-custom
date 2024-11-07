"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _CustomEnv_config;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFileStructuring_1 = __importDefault(require("./envFileStructuring"));
const tagProcessor_1 = __importDefault(require("./tagProcessor"));
const envPath = path_1.default.resolve(process.cwd(), ".env");
const initialEnv = Object.assign({}, process.env);
class CustomEnv {
    constructor(config) {
        this.dotenv = {};
        this.env = {};
        this.envStruct = {};
        const customOption = Object.assign(Object.assign({}, __classPrivateFieldGet(_a, _a, "f", _CustomEnv_config)), config);
        dotenv_1.default.config({ path: customOption.path });
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
_a = CustomEnv;
_CustomEnv_config = { value: {
        path: envPath
    } };
exports.default = CustomEnv;
//# sourceMappingURL=configEnv.js.map