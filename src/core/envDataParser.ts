
import * as T from "../types";
import TypeParser from "./typeParser";

export default class EnvDataParser{
    public static applyParseType(type: string, envInfo: T.EnvInfo) {
        switch (type) {
          case "boolean":
            TypeParser.parseBoolean(envInfo);
            break;
          case "number":
            TypeParser.parseNumber(envInfo);
            break;
          case "json":
            TypeParser.parseJson(envInfo);
            break;
        }
      }
    
      public static inferParseType(envInfo: T.EnvInfo) {
        const envValue = envInfo.envValue;
    
        if (envValue === "true" || envValue === "false") {
            TypeParser.parseBoolean(envInfo);
        } else if (!isNaN(Number(envValue))) {
            TypeParser.parseNumber(envInfo);
        } else {
          try {
            TypeParser.parseJson(envInfo);
          } catch (error) {}
        }
      }
     
}