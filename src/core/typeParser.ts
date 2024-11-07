import * as T from "../../types";

export default class TypeParser{
    public static parseBoolean(envInfo: T.EnvInfo) {
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
    
      public static parseNumber(envInfo: T.EnvInfo) {
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
    
      public static parseJson(envInfo: T.EnvInfo) {
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