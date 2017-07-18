import fs from 'fs'
import { pErrHandler } from '../Utils.js'

module.exports = class FileController {
  static async scanDirAll (dirPath, files) {
    files = files || []
    const entries = await this.scanDir(dirPath).catch(pErrHandler)

    for (let name of entries) {
      const path = `${dirPath}/${name}`

      if (await this.isDir(path)) {
        await this.scanDirAll(path, files)
      } else {
        files.push({ name, path })
      }
    }

    return files
  }

  static scanDir (path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) { reject(err) } else { resolve(files) }
      })
    })
  }

  static stat (path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stat) => {
        if (err) { reject(err) } else { resolve(stat) }
      })
    })
  }

  static async isDir (path) {
    let stat = await this.stat(path)
    return stat.isDirectory()
  }

  static deleteFile (path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) { reject(err) } else { resolve() }
      })
    })
  }

  static writeFile (path, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, (err) => {
        if (err) { reject(err) } else { resolve() }
      })
    })
  }

  static readFile (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, content) => {
        if (err) { reject(err) } else { resolve(content) }
      })
    })
  }
}
