import FileController from './FileController.js'
import { FT, FC, HomeDir } from './Utils.js'

module.exports = class HomeController {
  static async scan (userName) {
    let resFiles = []

    for (const category in FC) {
      const path = `${HomeDir}/${userName}/${category}`
      await FileController.scanDirRecursive(path).then(fs => {
        fs.forEach(f => {
          const name = this.trimExtension(f.name)
          resFiles.push({
            name: name,
            path: f.path,
            jpath: `${userName}.${category}.${name}`,
            type: this.getFileType(f.name),
            category: FC[category],
            owner: userName
          })
        })
      }).catch((err) => {
        throw err
      })
    }
    resFiles = this.ignoreFiles(resFiles)
    return resFiles
  }

  static getFileType (filename) {
    if (filename.endsWith(FT.class)) { return FT.class } else if (filename.endsWith(FT.java)) { return FT.java } else { return FT.unknown }
  }

  static trimExtension (filename) {
    ['.java', '.class'].forEach((extension) => {
      const pos = filename.indexOf(extension)
      filename = (pos === -1)
        ? filename
        : filename.slice(0, pos)
    })
    return filename
  }

  static async readFile (path) {
    return await FileController.readFile(path)
  }

  static async writeFile (path, content) {
    return await FileController.writeFile(path, content)
  }

  static ignoreFiles (files) {
    ['.DS_Store'].forEach(ignore => {
      files = files.filter(file =>
        ignore !== file.name
      )
    })
    return files
  }
}
