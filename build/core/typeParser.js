"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeParser {
    static parseBoolean(envInfo) {
        const envName = envInfo.envName;
        const envValue = envInfo.envValue;
        let parsedValue;
        if (envValue === "true") {
            parsedValue = true;
        }
        else if (envValue === "false") {
            parsedValue = false;
        }
        else {
            throw new Error(`La variable ${envName} no puede parsearse a <type=boolean>`);
        }
        envInfo.envValue = parsedValue;
    }
    static parseNumber(envInfo) {
        const envName = envInfo.envName;
        const envValue = envInfo.envValue;
        const parsedValue = Number(envValue);
        if (isNaN(parsedValue))
            //verifico con isNaN por si envValue = "0" que es un numero valido
            throw new Error(`La variable ${envName} no puede parsearse a <type=number>`);
        envInfo.envValue = parsedValue;
    }
    static parseJson(envInfo) {
        const envName = envInfo.envName;
        const envValue = envInfo.envValue;
        let parsedValue;
        try {
            parsedValue = JSON.parse(envValue);
        }
        catch (_a) {
            throw new Error(`La variable ${envName} no puede parsearse a <type=json>`);
        }
        envInfo.envValue = parsedValue;
    }
}
exports.default = TypeParser;
//# sourceMappingURL=typeParser.js.map