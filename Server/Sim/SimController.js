import { spawn } from 'child_process'
import conf from './Config.json'

module.exports = class SimController {
  static simulate (env, gen, sche, sim, plat, argu) {
    const envArgu = this.getEnvArgument(argu)
    const procArgu = `-cp ${this.getEnvLibrary(env)} com.use.CLILauncher --generator ${gen} --scheduler ${sche} --simulator ${sim} --platform ${plat}`
    global.log(`java ${procArgu}`, 'info')
    const proc = spawn('java', procArgu.split(' '))
    proc.stdin.write(envArgu)
    proc.stdin.end()
    return proc
  }

  static compile (owner, cate, fname) {
    const argus = `-Xlint:unchecked -cp ${this.getEnvLibrary()} ${global.path.home}/${owner}/${cate}/${fname}.java`
    global.log(`javac ${argus}`, 'info')
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
    let libs = ''

    if (env) {
      for (const lib of conf[env].lib) { libs += `${global.path.sim}/env/${lib}:` }
    } else {
      for (const innerEnv in conf) {
        for (const lib of conf[innerEnv].lib) { libs += `${global.path.sim}/env/${lib}:` }
      }
    }

    libs += `${global.path.home}`

    return libs
  }

  static getEnvs () {
    return Object.keys(conf)
  }

  static getBuiltin (env) {
    return conf[env].builtin
  }
}
