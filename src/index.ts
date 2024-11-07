import CustomENV from "./configEnv"
import * as T from "../types";


export default function customEnvInit(config?: T.Config){
    const customEnv =  new CustomENV(config)
    return customEnv.env
}
