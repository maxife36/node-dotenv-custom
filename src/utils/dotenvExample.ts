import path from "path";
import fs from "fs";
import readline from "readline";
import * as T from "../types";

export default function dotenvExampleBuild(
  config: T.Config,
  envStruct: T.EnvStruct
) {
  if (typeof config.path === "string") {
    writeExampleEnvFiles(config.path, config.exampleEnvPath, envStruct);
  } else if (Array.isArray(config.path)) {
    for (const envPath of config.path) {
      const exampleEnvPath = addExamplePrefix(envPath);
      writeExampleEnvFiles(envPath, exampleEnvPath, envStruct);
    }
  } else {
    console.error(
      "El path proporcionado no es valido, solo puede ser string | string[]"
    );
  }
}

function writeExampleEnvFiles(
  envPath: string,
  exampleEnvPath: string,
  envStruct: T.EnvStruct
) {
  if (!fs.existsSync(envPath)) {
    console.error(`El archivo ${envPath} no existe.`);
    return;
  }

  if (fs.existsSync(exampleEnvPath)) {
    fs.unlinkSync(exampleEnvPath);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(envPath),
    terminal: false,
  });

  rl.on("line", (line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("#") || trimmedLine.startsWith(";")) {
      appendLineToFile(exampleEnvPath, trimmedLine+"\n");
    } else if (trimmedLine) {
      const regex = /^([^=]*)/;
      const match = regex.exec(trimmedLine);

      let envExampleLine = "";

      if (match) {
        const envname = match[1];
        const envTags = envStruct[envname]?.envTags;

        if (envTags) {
          let envContent = `${envname}=`;

          if (envTags.hasOwnProperty("required")) {
            envContent += `<required>`;
          } else {
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

  rl.on("close", () => {});

  rl.on("error", (err) => {
    console.error("Error al leer el archivo:", err);
  });
}

function appendLineToFile(filename: string, line: string) {
  fs.appendFile(filename, line, (err) => {
    if (err) {
      console.error("Error escribiendo en el archivo:", err);
    }
  });
}

function addExamplePrefix(filePath: string) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  const exampleFileName = ext?  `example.${baseName}${ext}`:`example.${baseName}`

  return path.join(dir, exampleFileName);
}
