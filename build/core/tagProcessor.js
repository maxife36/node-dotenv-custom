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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TagProcessor_customEnv;
Object.defineProperty(exports, "__esModule", { value: true });
const C = __importStar(require("./constants"));
const tagHandlers_1 = __importDefault(require("./tagHandlers"));
const envDataParser_1 = __importDefault(require("./envDataParser"));
class TagProcessor {
    constructor(customEnv) {
        _TagProcessor_customEnv.set(this, void 0);
        __classPrivateFieldSet(this, _TagProcessor_customEnv, customEnv, "f");
    }
    init() {
        for (const envName in __classPrivateFieldGet(this, _TagProcessor_customEnv, "f").envStruct) {
            this.validateEnvInfo(envName);
            this.tagAnalyzer(envName);
            this.envConstructor(envName);
        }
    }
    validateEnvInfo(envName) {
        const envInfo = __classPrivateFieldGet(this, _TagProcessor_customEnv, "f").envStruct[envName];
        const tagsName = Object.keys(envInfo.envTags);
        if (tagsName.length === 0 && !envInfo.envValue) {
            throw new Error(`No se proporcionó un valor a la variable ${envName}, ni un valor por defecto <default=value>`);
        }
    }
    tagAnalyzer(envName) {
        const envInfo = __classPrivateFieldGet(this, _TagProcessor_customEnv, "f").envStruct[envName];
        const envTags = envInfo.envTags;
        for (const tagName of C.tagOrderExecute) {
            if (envTags.hasOwnProperty(tagName)) {
                switch (tagName) {
                    case "required":
                        tagHandlers_1.default.handleRequired(envInfo);
                        break;
                    case "default":
                        tagHandlers_1.default.handleDefault(envInfo, tagName);
                        break;
                    case "type":
                        tagHandlers_1.default.handleType(envInfo, tagName);
                        break;
                }
            }
            else if (tagName === "type") {
                envDataParser_1.default.inferParseType(envInfo);
            }
        }
    }
    envConstructor(envName) {
        const envValue = __classPrivateFieldGet(this, _TagProcessor_customEnv, "f").envStruct[envName].envValue;
        __classPrivateFieldGet(this, _TagProcessor_customEnv, "f").env[envName] = envValue;
    }
}
_TagProcessor_customEnv = new WeakMap();
exports.default = TagProcessor;
//# sourceMappingURL=tagProcessor.js.map