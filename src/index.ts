import CustomENV from "./configEnv"
import * as T from "../types";


function customEnvInit(config?: T.Config){
    const customEnv =  new CustomENV(config)
    return customEnv.env
}

module.exports = customEnvInit