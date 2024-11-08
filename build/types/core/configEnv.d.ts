import * as T from "../types";
declare class CustomEnv {
    readonly dotenv: {
        [key: T.EnvName]: any;
    };
    env: {
        [key: T.EnvName]: any;
    };
    envStruct: T.EnvStruct;
    constructor(config: T.Config);
    private envOnly;
    private filterEnv;
}
export default CustomEnv;
