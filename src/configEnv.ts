import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");

const initialEnv = { ...process.env };

/* 
Esta herramienta esta diseñada para generar un objeto con todas las variables de entorno finales que se usaran en la aplicación, asegurando la aplicacion de valores por defecto establecidas o detectar errores si son obligatorias (required) y no se proporciono nigun valor. 

TAGS:
<default=value> -> Este tag permite establecer un valor por defecto a la variable de entorno en caso de que no se le asigne un valor o se le pase un string vacio
<required> -> Este tag obliga al usuario a declarar la variable de entorno, en este caso el tag <default=value> no lo tomara en cuenta
<type=typeof> -> OPCIONAL, es un tag que permite indetificar claramente que tipo de dato es y pueda ser procesado correctamente. En caso de no pasarle este tag, el sistema tratara de inferir el tipo, pero puede obtener resultados inesperados. Los typeof permitidos son [boolean, string, number, json]
*/

type Options = {
  path?: string;
  isSingleton: boolean;
};

type EnvName = string;
type EnvValue = any;
type TagName = string; //sin los <> o los =value

type EnvTags = { [key: TagName]: string };

type EnvInfo = {
  envName: EnvName;
  envValue: EnvValue; // puede ser null o el enValue
  envTags: EnvTags;
};

type EnvStruct = { [key: EnvName]: EnvInfo };

const validTags = ["required", "default", "type"];
const tagOrderExecute = ["required", "default", "type"];
const validTypes = ["boolean", "string", "number", "json"];

class CustomEnv {
  private static instance: CustomEnv;
  private env: { [key: EnvName]: any } = {};
  private filteredEnv: { [key: EnvName]: any } = {};
  private options: Options = {
    path: envPath,
    isSingleton: true,
  };
  private envStruct: EnvStruct = {};

  public static init(options?: Options) {
    if (!CustomEnv.instance) {
      CustomEnv.instance = new CustomEnv(options);
      return CustomEnv.instance;
    }

    return CustomEnv.instance;
  }

  private constructor(options?: Options) {
    //Establezco un path personalizable al archivo .env si es que no se encuentra en la raiz del proyecto
    options?.path ? (this.options.path = options.path) : this.options;

    dotenv.config(this.options);

    //Cargo las variables de entorno del .env
    this.env = this.envOnly();
  }

  private envOnly() {
    const envOnly: { [key: string]: any } = {};

    const keys = Object.keys(process.env);
    for (const env of keys) {
      if (!(env in initialEnv)) {
        envOnly[env] = process.env[env];
      }
    }

    return envOnly;
  }

  public filterEnv() {
    if (Object.keys(this.env).length === 0) return;

    const originalEnv = this.env;

    for (const envName in originalEnv) {
      if (!originalEnv[envName]?.trim()) continue;

      const envComponents = this.parseEnvString(originalEnv[envName]);

      this.envStructConfig(envName, envComponents);
      this.envTagsConfig(envName, envComponents);
    }

    this.TagProcessor();

    return this.filteredEnv;
  }

  /* Limpieza y estructuracion de ENVs */
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
    const envInfo: EnvInfo = {
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

    this.envStruct[envName] = envInfo;
  }

  private envTagsConfig(envName: string, envComponents: string[]) {
    for (const tag of envComponents) {
      const [tagName, tagValue] = this.tagValidator(tag);

      this.envStruct[envName].envTags = { [tagName]: tagValue };
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
    if (!validTags.includes(tagName)) {
      throw new Error(`El tag ${tag} no esta permitido`);
    }

    return [tagName, tagValue];
  }

  /* Procesadores de Tags */

  private TagProcessor() {
    for (const envName in this.envStruct) {
      this.validateEnvInfo(envName);
      this.tagAnalyzer(envName);
      this.filteredEnvConstructor(envName);
    }
  }

  private validateEnvInfo(envName: string) {
    const envInfo = this.envStruct[envName];
    const tagsName = Object.keys(envInfo.envTags);

    if (tagsName.length === 0 && !envInfo.envValue) {
      throw new Error(
        `No se proporcionó un valor a la variable ${envName}, ni un valor por defecto <default=value>`
      );
    }
  }

  private tagAnalyzer(envName: string) {
    const envInfo = this.envStruct[envName];
    const envTags = envInfo.envTags;

    for (const tagName of tagOrderExecute) {
      if (envTags.hasOwnProperty(tagName)) {
        switch (tagName) {
          case "required":
            this.handleRequired(envInfo);
            break;
          case "default":
            this.handleDefault(envInfo, tagName);
            break;
          case "type":
            this.handleType(envInfo, tagName);
            break;
        }
      } else if (tagName === "type") {
        this.inferParseType(envInfo);
      }
    }
  }

  private filteredEnvConstructor(envName: string) {
    const envValue = this.envStruct[envName].envValue;

    this.filteredEnv[envName] = envValue;
  }

  /* Tags Handlres */

  private handleRequired(envInfo: EnvInfo) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    if (!envValue) throw new Error(`La variable ${envName} es <required>`);
  }

  private handleDefault(envInfo: EnvInfo, tagName: TagName) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    const tagValue = envInfo.envTags[tagName];

    if (!envValue) {
      if (!tagValue)
        throw new Error(
          `La variable ${envName} no proporciono un <default=value> valido`
        );

      envInfo.envValue = tagValue;
    }
  }

  private handleType(envInfo: EnvInfo, tagName: TagName) {
    const envName = envInfo.envName;
    const tagValue = envInfo.envTags[tagName];

    if (tagValue) {
      if (!validTypes.includes(tagValue))
        throw new Error(
          `La variable ${envName} no proporciono un <type=value> valido`
        );
      this.applyParseType(tagValue, envInfo);
    }
  }

  /* Applications Parse Functions */

  private applyParseType(type: string, envInfo: EnvInfo) {
    switch (type) {
      case "boolean":
        this.parseBoolean(envInfo);
        break;
      case "number":
        this.parseNumber(envInfo);
        break;
      case "json":
        this.parseJson(envInfo);
        break;
    }
  }

  private inferParseType(envInfo: EnvInfo) {
    const envValue = envInfo.envValue;

    if (envValue === "true" || envValue === "false") {
      this.parseBoolean(envInfo);
    } else if (!isNaN(Number(envValue))) {
      this.parseNumber(envInfo);
    } else {
      try {
        this.parseJson(envInfo);
      } catch (error) {}
    }
  }

  /* Parser Functions */

  private parseBoolean(envInfo: EnvInfo) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    let parsedValue: any;

    if (envValue === "true") {
      parsedValue = true;
    } else if (envValue === "false") {
      parsedValue = false;
    } else {
      throw new Error(
        `La variable ${envName} no puede parsearse a <type=boolean>`
      );
    }

    envInfo.envValue = parsedValue;
  }

  private parseNumber(envInfo: EnvInfo) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    const parsedValue = Number(envValue);

    if (isNaN(parsedValue))
      //verifico con isNaN por si envValue = "0" que es un numero valido
      throw new Error(
        `La variable ${envName} no puede parsearse a <type=number>`
      );

    envInfo.envValue = parsedValue;
  }

  private parseJson(envInfo: EnvInfo) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    let parsedValue: JSON;

    try {
      parsedValue = JSON.parse(envValue);
    } catch {
      throw new Error(
        `La variable ${envName} no puede parsearse a <type=json>`
      );
    }

    envInfo.envValue = parsedValue;
  }
}

export default CustomEnv;
