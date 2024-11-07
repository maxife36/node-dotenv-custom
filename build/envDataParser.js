"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeParser_1 = __importDefault(require("./typeParser"));
class EnvDataParser {
    static applyParseType(type, envInfo) {
        switch (type) {
            case "boolean":
                typeParser_1.default.parseBoolean(envInfo);
                break;
            case "number":
                typeParser_1.default.parseNumber(envInfo);
                break;
            case "json":
                typeParser_1.default.parseJson(envInfo);
                break;
        }
    }
    static inferParseType(envInfo) {
        const envValue = envInfo.envValue;
        if (envValue === "true" || envValue === "false") {
            typeParser_1.default.parseBoolean(envInfo);
        }
        else if (!isNaN(Number(envValue))) {
            typeParser_1.default.parseNumber(envInfo);
        }
        else {
            try {
                typeParser_1.default.parseJson(envInfo);
            }
            catch (error) { }
        }
    }
}
exports.default = EnvDataParser;
//# sourceMappingURL=envDataParser.js.map