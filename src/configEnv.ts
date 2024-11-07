import dotenv from "dotenv";
import path from "path";
import * as T from "../types";
import EnvFileStructuring from "./envFileStructuring"
import TagProcessor from "./tagProcessor";

const envPath = path.resolve(process.cwd(), ".env");

const initialEnv = { ...process.env };

class CustomEnv {
  readonly dotenv: { [key: T.EnvName]: any } = {};
  public env: { [key: T.EnvName]: any } = {};
  static readonly #config: T.Config = {
    path: envPath
  };
  envStruct: T.EnvStruct = {};

  constructor(config?: T.Config) {
    const customOption = {...CustomEnv.#config, ...config}

    dotenv.config({ path: customOption.path });
    //Cargo solo las variables de entorno del .env establecido
    this.dotenv = this.envOnly();
    this.filterEnv()
  }

  private envOnly() {
    const envOnly: { [key: string]: any } = {};

    const keys = Object.keys(process.env);
    for (const env of keys) {
      if (!(env in initialEnv)) {
        envOnly[env] = process.env[env];
      }
    }

    return envOnly;
  }

  private filterEnv() {
    if (Object.keys(this.dotenv).length === 0) return;

    new EnvFileStructuring(this).init()

    new TagProcessor(this).init()
  }
}

export default CustomEnv;
