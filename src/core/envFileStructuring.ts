import CustomEnv from "./configEnv";
import * as T from "../../types";
import * as C from "./constants";

export default class EnvFileStructuring {
  readonly #customEnv:CustomEnv

  constructor(customEnv : CustomEnv){
    this.#customEnv = customEnv
  }

  public init(){
    const originalEnv = this.#customEnv.dotenv;

    for (const envName in originalEnv) {
      if (!originalEnv[envName]?.trim()) continue;

      const envComponents = this.parseEnvString(originalEnv[envName]);

      this.envStructConfig(envName, envComponents);
      this.envTagsConfig(envName, envComponents);
    }
  }
    
  private parseEnvString(input: string): string[] {
    // Elimina espacios en blanco al inicio y final de la cadena
    const trimmedInput = input.trim();

    // Expresión regular para capturar tagos entre <>
    const regex = /<([^>]+)>/g;
    const matches: string[] = [];
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

  private envStructConfig(envName: string, envComponents: string[]) {
    const envInfo: T.EnvInfo = {
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
    } else {
      //evalua si no se paso ningun valor, ni siquiera tags; ej: ENV_VARIABLE=
      throw new Error(`No se proporcionó un valor a la variable ${envName}`);
    }

    this.#customEnv.envStruct[envName] = envInfo;
  }

  private envTagsConfig(envName: string, envComponents: string[]) {
    for (const tag of envComponents) {
      const [tagName, tagValue] = this.tagValidator(tag);

      this.#customEnv.envStruct[envName].envTags[tagName] = tagValue
    }
  }

  private tagValidator(tag: string) {
    // Esta expresión regular captura el tag y el valor opcional
    const validFormatRegex = /^<(\w+)(?:=(.*))?>$/;
    const match = validFormatRegex.exec(tag);

    // Analizo si el tag no coincide con el formato esperado
    if (!match) throw new Error(`El tag ${tag} no tiene un formato valido`);

    const [, tagName, tagValue] = match;

    // Verifico si el tag extraído es uno de los válidos
    if (!C.validTags.includes(tagName)) {
      throw new Error(`El tag ${tag} no esta permitido`);
    }

    return [tagName, tagValue];
  }
}
