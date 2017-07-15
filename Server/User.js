import {pErrHandler, HomeDir} from './utils.js'
import FileController from './FileController.js'
import {
  ClassFile,
  JavaFile,
  getFileType,
  trimExt,
  igFs,
  fTypes,
  fCates
} from './File.js'
module.exports = class User {
  constructor (pros) {
    this.Name = pros.Name || null
    this.Passwd = pros.Passwd || null
    this.Jobs = pros.Jobs || []
    this.Files = {}
    this.Files[fTypes.Class] = []
    this.Files[fTypes.Java] = []
  }

  getName () {
    return this.Name
  }

  setName (n) {
    this.Name = n
  }

  getPasswd () {
    return this.Passwd
  }

  setPasswd (n) {
    this.Passwd = n
  }

  addPub (type, cate, name) {
    if (!(type in this.Files)) { return -1 }

    let f = this.Files[type].find(f =>
      f.getCate() === cate && f.getName() === name
    )
    if (f !== undefined) {
      f.setPub(true)
      return 0
    } else { return -2 }
  }

  removePub (type, cate, name) {
    if (!(type in this.Files)) { return -1 }

    let f = this.Files[type].find(f =>
      f.getCate() === cate && f.getName() === name
    )
    if (f !== undefined) {
      f.setPub(false)
      return 0
    } else { return -2 }
  }

  getPubs (type) {
    return this.Files[type].filter(f => f.Pub)
  }

  async scanHome () {
    for (const cate in fCates) {
      let fs = await FileController
            .scanDirAll(`${HomeDir}/${this.Name}/${cate}`)
            .catch(pErrHandler)

      for (const f of fs) {
        const fname = trimExt(f.name)
        const ftype = getFileType(f.name)
        if (ftype === fTypes.unknown) { continue }
        let nf = (ftype === fTypes.Class)
          ? new ClassFile().setJPath(`${this.Name}.${cate}.${fname}`)
          : new JavaFile()

        nf.setOwner(this.Name)
          .setName(fname)
          .setPath(f.path)
          .setCate(fCates[cate])

        this.Files[ftype].push(nf)
      }
    }

    igFs(this.Files[fTypes.Class])
    igFs(this.Files[fTypes.Java])
  }

  getFile (type, cate, fname) {
    return this.Files[type].find(f =>
      f.getCate() === cate && f.getName() === fname
    )
  }

  getFilesByType (type) {
    return this.Files[type]
  }

  async newFile (cate, fname, content) {
    return FileController.writeFile(`${HomeDir}/${this.Name}/${cate}/${fname}.java`, content)
  }

  async getFileContent (cate, fname) {
    return FileController.readFile(`${HomeDir}/${this.Name}/${cate}/${fname}.java`)
  }

  async setFileContent (cate, fname, content) {
    return FileController.writeFile(`${HomeDir}/${this.Name}/${cate}/${fname}.java`, content)
  }

  getProperty () {
    return {
      Name: this.Name,
      Passwd: this.Passwd,
      Jobs: this.Jobs,
      Files: this.Files
    }
  }
}
