import { spawn } from 'child_process'
import { SimDir, HomeDir } from './Utils.js'
import envConf from './Sim/envConfig.json'

module.exports = class SimController {
  static simulate (env, gen, sche, sim, plat, arg) {
    const argus = `-cp ${this.getEnvLibrary(env)} com.use.CLILauncher --generator ${gen} --scheduler ${sche} --simulator ${sim} --platform ${plat}`

    const proc = spawn('java', argus.split(' '))
    proc.stdin.write(this.getEnvArgument(arg))
    proc.stdin.end()
    return proc
  }

  static compile (env, owner, cate, fname) {
    const argus = `-Xlint:unchecked -cp ${this.getEnvLibrary(env)} ${HomeDir}/${owner}/${cate}/${fname}.java`

    const proc = spawn('javac', argus.split(' '))
    return proc
  }

  static getEnvArgument (argums) {
    let argvs = ''
    Object.keys(argums).forEach(key => {
      const argv = argums[key]

      argvs += `${key}=`

      if (argv.constructor === Array) {
        for (const v of argv) { argvs += `${v},` }
      } else {
        argvs += argv
      }

      argvs += '\r\n'
    })
    return argvs
  }

  static getEnvLibrary (env) {
    const _libs = envConf[env].lib

    let libs = ''

    for (const _lib of _libs) { libs += `${SimDir}/env/${_lib}:` }

    libs += `${HomeDir}`

    return libs
  }

  static getEnvs () {
    return Object.keys(envConf)
  }

  static getBuiltin (env) {
    return envConf[env].builtin
  }
}
