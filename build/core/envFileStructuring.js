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
var _EnvFileStructuring_customEnv;
Object.defineProperty(exports, "__esModule", { value: true });
const C = __importStar(require("./constants"));
class EnvFileStructuring {
    constructor(customEnv) {
        _EnvFileStructuring_customEnv.set(this, void 0);
        __classPrivateFieldSet(this, _EnvFileStructuring_customEnv, customEnv, "f");
    }
    init() {
        var _a;
        const originalEnv = __classPrivateFieldGet(this, _EnvFileStructuring_customEnv, "f").dotenv;
        for (const envName in originalEnv) {
            if (!((_a = originalEnv[envName]) === null || _a === void 0 ? void 0 : _a.trim()))
                continue;
            const envComponents = this.parseEnvString(originalEnv[envName]);
            this.envStructConfig(envName, envComponents);
            this.envTagsConfig(envName, envComponents);
        }
    }
    parseEnvString(input) {
        // Elimina espacios en blanco al inicio y final de la cadena
        const trimmedInput = input.trim();
        // Expresión regular para capturar tagos entre <>
        const regex = /<([^>]+)>/g;
        const matches = [];
        let match;
        // Captura todos los elementos entre <>
        while ((match = regex.exec(trimmedInput)) !== null) {
            const cleanedMatch = match[1].replace(/\s+/g, ""); // Elimina todos los espacios
            matches.push(`<${cleanedMatch}>`);
        }
        // Captura el último valor que no está entre <>
        const lastValue = trimmedInput.replace(regex, "").trim();
        // Añade el último valor al array si no está vacío
        if (lastValue) {
            matches.push(lastValue);
        }
        // en definitiva separo los tags, sea el orden que sea en que se los haya establecido y me aseguro que si existe un valor proporcionado este al ultimo del array matches
        return matches;
    }
    envStructConfig(envName, envComponents) {
        const envInfo = {
            envName: envName,
            envValue: null,
            envTags: {},
        };
        if (envComponents.length != 0) {
            //evalua si no se paso ningun valor, aún pasandole tags; ej: ENV_VARIABLE=<required>
            const lastValue = envComponents[envComponents.length - 1];
            const isTag = lastValue.startsWith("<") && lastValue.endsWith(">");
            //Si existe una variable porporcionada se la extrae y configura a envComponents en un array de solo tags
            envInfo.envValue = isTag ? null : envComponents.pop();
        }
        else {
            //evalua si no se paso ningun valor, ni siquiera tags; ej: ENV_VARIABLE=
            throw new Error(`No se proporcionó un valor a la variable ${envName}`);
        }
        __classPrivateFieldGet(this, _EnvFileStructuring_customEnv, "f").envStruct[envName] = envInfo;
    }
    envTagsConfig(envName, envComponents) {
        for (const tag of envComponents) {
            const [tagName, tagValue] = this.tagValidator(tag);
            __classPrivateFieldGet(this, _EnvFileStructuring_customEnv, "f").envStruct[envName].envTags[tagName] = tagValue;
        }
    }
    tagValidator(tag) {
        // Esta expresión regular captura el tag y el valor opcional
        const validFormatRegex = /^<(\w+)(?:=(.*))?>$/;
        const match = validFormatRegex.exec(tag);
        // Analizo si el tag no coincide con el formato esperado
        if (!match)
            throw new Error(`El tag ${tag} no tiene un formato valido`);
        const [, tagName, tagValue] = match;
        // Verifico si el tag extraído es uno de los válidos
        if (!C.validTags.includes(tagName)) {
            throw new Error(`El tag ${tag} no esta permitido`);
        }
        return [tagName, tagValue];
    }
}
_EnvFileStructuring_customEnv = new WeakMap();
exports.default = EnvFileStructuring;
//# sourceMappingURL=envFileStructuring.js.map