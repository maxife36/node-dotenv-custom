"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const C = __importStar(require("./constants"));
const envDataParser_1 = __importDefault(require("./envDataParser"));
class TagHandlers {
    static handleRequired(envInfo) {
        const envName = envInfo.envName;
        const envValue = envInfo.envValue;
        if (!envValue)
            throw new Error(`La variable ${envName} es <required>`);
    }
    static handleDefault(envInfo, tagName) {
        const envName = envInfo.envName;
        const envValue = envInfo.envValue;
        const tagValue = envInfo.envTags[tagName];
        if (!envValue) {
            if (!tagValue)
                throw new Error(`La variable ${envName} no proporciono un <default=value> valido`);
            envInfo.envValue = tagValue;
        }
    }
    static handleType(envInfo, tagName) {
        const envName = envInfo.envName;
        const tagValue = envInfo.envTags[tagName];
        if (tagValue) {
            if (!C.validTypes.includes(tagValue)) {
                throw new Error(`La variable ${envName} no proporciono un <type=value> valido`);
            }
            else {
                envDataParser_1.default.applyParseType(tagValue, envInfo);
            }
        }
    }
}
exports.default = TagHandlers;
//# sourceMappingURL=tagHandlers.js.map