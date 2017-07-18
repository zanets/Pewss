import { spawn } from 'child_process'
import { SimDir, HomeDir } from '../Utils.js'
import conf from './Config.json'

module.exports = class SimController {
  static simulate (env, gen, sche, sim, plat, argu) {
    const envArgu = this.getEnvArgument(argu)
    const procArgu = `-cp ${this.getEnvLibrary(env)} com.use.CLILauncher --generator ${gen} --scheduler ${sche} --simulator ${sim} --platform ${plat}`

    const proc = spawn('java', procArgu.split(' '))
    proc.stdin.write(envArgu)
    proc.stdin.end()
    return proc
  }

  static compile (env, owner, cate, fname) {
    const argus = `-Xlint:unchecked -cp ${this.getEnvLibrary(env)} ${HomeDir}/${owner}/${cate}/${fname}.java`

    const proc = spawn('javac', argus.split(' '))
    return proc
  }

  static getEnvArgument (argu) {
    let argvs = ''
    Object.keys(argu).forEach(key => {
      const argv = argu[key]

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
    const _libs = conf[env].lib

    let libs = ''

    for (const _lib of _libs) { libs += `${SimDir}/env/${_lib}:` }

    libs += `${HomeDir}`

    return libs
  }

  static getEnvs () {
    return Object.keys(conf)
  }

  static getBuiltin (env) {
    return conf[env].builtin
  }
}
