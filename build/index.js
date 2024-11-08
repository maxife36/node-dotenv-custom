"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const configEnv_1 = __importDefault(require("./core/configEnv"));
const dotenvExample_1 = __importDefault(require("./utils/dotenvExample"));
const envPath = path_1.default.resolve(process.cwd(), ".env");
const exampleEnvPath = path_1.default.resolve(process.cwd(), "example.env");
const defaultConfig = {
    path: envPath,
    exampleEnvPath: exampleEnvPath
};
function customEnvInit(config) {
    const customOption = Object.assign(Object.assign({}, defaultConfig), config);
    const customEnv = new configEnv_1.default(customOption);
    (0, dotenvExample_1.default)(customOption, customEnv.envStruct);
    return customEnv.env;
}
module.exports = customEnvInit;
//# sourceMappingURL=index.js.map