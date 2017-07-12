import fs from 'fs'
import { pErrHandler } from './Utils.js'

module.exports = class FileController {
  static async scanDirRecursive (dirPath, files) {
    files = files || []
    let entries = []

    await this.scanDir(dirPath).then((_entries) => {
      entries = _entries
    }).catch(pErrHandler)

    for (let name of entries) {
      const path = `${dirPath}/${name}`
      await this.isDir(path).then(async (isDir) => {
        if (isDir) { await this.scanRecursive(path, files) } else { files.push({ name, path }) }
      }).catch(pErrHandler)
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
    let stat = null
    await this.stat(path).then((_stat) => {
      stat = _stat
    }).catch((err) => {
      throw err
    })

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
