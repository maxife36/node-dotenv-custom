import * as T from "../types";
export default class EnvDataParser {
    static applyParseType(type: string, envInfo: T.EnvInfo): void;
    static inferParseType(envInfo: T.EnvInfo): void;
}
