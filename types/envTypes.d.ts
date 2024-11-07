export type EnvName = string;
export type EnvValue = any;
export type TagName = string;

export type EnvTags = { [key: TagName]: string };

export interface EnvInfo {
  envName: EnvName;
  envValue: EnvValue;
  envTags: EnvTags;
}

export type EnvStruct = { [key: EnvName]: EnvInfo };
