import * as T from "../types";
import * as C from "./constants";
import EnvDataParser from "./envDataParser";

export default class TagHandlers {
  public static handleRequired(envInfo: T.EnvInfo) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    if (!envValue) throw new Error(`La variable ${envName} es <required>`);
  }

  public static handleDefault(envInfo: T.EnvInfo, tagName: T.TagName) {
    const envName = envInfo.envName;
    const envValue = envInfo.envValue;
    const tagValue = envInfo.envTags[tagName];

    if (!envValue) {
      if (!tagValue)
        throw new Error(
          `La variable ${envName} no proporciono un <default=value> valido`
        );

      envInfo.envValue = tagValue;
    }
  }

  public static handleType(envInfo: T.EnvInfo, tagName: T.TagName) {
    const envName = envInfo.envName;
    const tagValue = envInfo.envTags[tagName];

    if (tagValue) {
      if (!C.validTypes.includes(tagValue)) {
        throw new Error(
          `La variable ${envName} no proporciono un <type=value> valido`
        );
      } else {
        EnvDataParser.applyParseType(tagValue, envInfo);
      }
    }
  }
}
