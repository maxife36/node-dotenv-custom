import dotenv from "dotenv";
import * as T from "../types";
import EnvFileStructuring from "./envFileStructuring";
import TagProcessor from "./tagProcessor";

const initialEnv = { ...process.env };

class CustomEnv {
  readonly dotenv: { [key: T.EnvName]: any } = {};
  public env: { [key: T.EnvName]: any } = {};
  envStruct: T.EnvStruct = {};

  constructor(config: T.Config) {
    dotenv.config({ path: config.path });
    //Cargo solo las variables de entorno del .env establecido
    this.dotenv = this.envOnly();
    this.filterEnv();
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

    new EnvFileStructuring(this).init();

    new TagProcessor(this).init();
  }
}

export default CustomEnv;
