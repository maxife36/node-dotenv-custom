import CustomENV from "./configEnv"

const instance = CustomENV.init()

const customeEnv = instance.filterEnv()

console.log(customeEnv);
