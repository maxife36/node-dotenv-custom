import CustomEnv from "./configEnv";
export default class EnvFileStructuring {
    #private;
    constructor(customEnv: CustomEnv);
    init(): void;
    private parseEnvString;
    private envStructConfig;
    private envTagsConfig;
    private tagValidator;
}
