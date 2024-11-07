import * as T from "../../types";
export default class TagHandlers {
    static handleRequired(envInfo: T.EnvInfo): void;
    static handleDefault(envInfo: T.EnvInfo, tagName: T.TagName): void;
    static handleType(envInfo: T.EnvInfo, tagName: T.TagName): void;
}
