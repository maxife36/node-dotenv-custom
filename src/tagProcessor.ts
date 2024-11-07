import CustomEnv from "./configEnv";
import * as C from "./constants";
import TagHandlers from "./tagHandlers"
import EnvDataParser from "./envDataParser";

export default class TagProcessor{
    readonly #customEnv:CustomEnv

    constructor(customEnv : CustomEnv){
      this.#customEnv = customEnv
      this.init()
    }
      
    public init() {
        for (const envName in this.#customEnv.envStruct) {
          this.validateEnvInfo(envName);
          this.tagAnalyzer(envName);
          this.envConstructor(envName);
        }
      }
    
      private validateEnvInfo(envName: string) {
        const envInfo = this.#customEnv.envStruct[envName];
        const tagsName = Object.keys(envInfo.envTags);
    
        if (tagsName.length === 0 && !envInfo.envValue) {
          throw new Error(
            `No se proporcionó un valor a la variable ${envName}, ni un valor por defecto <default=value>`
          );
        }
      }
    
      private tagAnalyzer(envName: string) {
        const envInfo = this.#customEnv.envStruct[envName];
        const envTags = envInfo.envTags;
    
        for (const tagName of C.tagOrderExecute) {
          if (envTags.hasOwnProperty(tagName)) {
            switch (tagName) {
              case "required":
                TagHandlers.handleRequired(envInfo);
                break;
              case "default":
                TagHandlers.handleDefault(envInfo, tagName);
                break;
              case "type":
                TagHandlers.handleType(envInfo, tagName);
                break;
            }
          } else if (tagName === "type") {
            EnvDataParser.inferParseType(envInfo);
          }
        }
      }
    
      private envConstructor(envName: string) {
        const envValue = this.#customEnv.envStruct[envName].envValue;
    
        this.#customEnv.env[envName] = envValue;
      }
}