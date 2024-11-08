"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dotenvExampleBuild;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
function dotenvExampleBuild(config, envStruct) {
    if (typeof config.path === "string") {
        const exampleEnvPath = config.exampleEnvPath
            ? config.exampleEnvPath
            : addExamplePrefix(config.path);
        writeExampleEnvFiles(config.path, exampleEnvPath, envStruct);
    }
    else if (Array.isArray(config.path)) {
        for (const envPath of config.path) {
            const exampleEnvPath = addExamplePrefix(envPath);
            writeExampleEnvFiles(envPath, exampleEnvPath, envStruct);
        }
    }
    else {
        console.error("El path proporcionado no es valido, solo puede ser string | string[]");
    }
}
function writeExampleEnvFiles(envPath, exampleEnvPath, envStruct) {
    if (!fs_1.default.existsSync(envPath)) {
        console.error(`El archivo ${envPath} no existe.`);
        return;
    }
    if (fs_1.default.existsSync(exampleEnvPath)) {
        fs_1.default.unlinkSync(exampleEnvPath);
    }
    const rl = readline_1.default.createInterface({
        input: fs_1.default.createReadStream(envPath),
        terminal: false,
    });
    rl.on("line", (line) => {
        var _a;
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("#") || trimmedLine.startsWith(";")) {
            appendLineToFile(exampleEnvPath, trimmedLine + "\n");
        }
        else if (trimmedLine) {
            const regex = /^([^=]*)/;
            const match = regex.exec(trimmedLine);
            let envExampleLine = "";
            if (match) {
                const envname = match[1];
                const envTags = (_a = envStruct[envname]) === null || _a === void 0 ? void 0 : _a.envTags;
                if (envTags) {
                    let envContent = `${envname}=`;
                    if (envTags.hasOwnProperty("required")) {
                        envContent += `<required>`;
                    }
                    else {
                        for (const tag in envTags) {
                            envContent += `<${tag}=${envTags[tag]}>`;
                        }
                    }
                    envExampleLine = `${envContent}\n`;
                }
            }
            appendLineToFile(exampleEnvPath, envExampleLine);
        }
    });
    rl.on("close", () => { });
    rl.on("error", (err) => {
        console.error("Error al leer el archivo:", err);
    });
}
function appendLineToFile(filename, line) {
    fs_1.default.appendFile(filename, line, (err) => {
        if (err) {
            console.error("Error escribiendo en el archivo:", err);
        }
    });
}
function addExamplePrefix(filePath) {
    const dir = path_1.default.dirname(filePath);
    const ext = path_1.default.extname(filePath);
    const baseName = path_1.default.basename(filePath, ext);
    const exampleFileName = ext
        ? `example.${baseName}${ext}`
        : `example.${baseName}`;
    return path_1.default.join(dir, exampleFileName);
}
//# sourceMappingURL=dotenvExample.js.map