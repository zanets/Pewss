import { spawn } from 'child_process'
import { SimDir, HomeDir } from './Utils.js'
import envConf from './Sim/envConfig.json'

module.exports = class SimController {
  static simulate (env, gen, sche, sim, plat, arg) {
    console.log(gen)
    const JavaArguments = `-cp ${this.getEnvLibrary(env)} ` +
      'com.use.CLILauncher ' +
      `--generator ${gen} ` +
      `--scheduler ${sche} ` +
      `--simulator ${sim} ` +
      `--platform ${plat}`

    const javaProc = spawn('java', JavaArguments.split(' '))
    javaProc.stdin.write(this.getEnvArgument(arg))
    javaProc.stdin.end()

    return new Promise((resolve, reject) => {
      let _res = { status: null, msg: '' }

      javaProc.stdout.on('data', (chunk) => {
        _res.status = 'stdin'
        _res.msg += chunk
      })

      javaProc.stderr.on('data', (chunk) => {
        _res.status = 'stderr'
        _res.msg += chunk
      })

      javaProc.on('close', (code) => {
        resolve(_res)
      })

      javaProc.on('error', (code) => {
        reject(_res)
      })
    })
  }

  static compile (env, owner, cate, fname) {
    const JavaArguments = '-Xlint:unchecked ' +
      `-cp ${this.getEnvLibrary(env)} ` +
      `${HomeDir}/${owner}/${cate}/${fname}.java`

    const javaProc = spawn('javac', JavaArguments.split(' '))

    return new Promise((resolve, reject) => {
      let _res = { status: null, msg: '' }

      javaProc.stdout.on('data', (chunk) => {
        _res.status = 'stdin'
        _res.msg += chunk
      })

      javaProc.stderr.on('data', (chunk) => {
        _res.status = 'stderr'
        _res.msg += chunk
      })

      javaProc.on('close', (code) => {
        resolve(_res)
      })

      javaProc.on('error', (code) => {
        reject(_res)
      })
    })
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
