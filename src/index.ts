import path from "path";
import CustomENV from "./core/configEnv"
import dotenvExampleBuild from "./utils/dotenvExample";
import * as T from "./types";

const envPath = path.resolve(process.cwd(), ".env");
const exampleEnvPath = path.resolve(process.cwd(),"example.env");

const defaultConfig: T.Config = {
    path: envPath,
    exampleEnvPath: exampleEnvPath
  }


function customEnvInit(config?: T.Config){
    const customOption = {...defaultConfig, ...config}

    const customEnv =  new CustomENV(customOption)
    
    dotenvExampleBuild(customOption, customEnv.envStruct)   

    return customEnv.env
}

export = customEnvInit