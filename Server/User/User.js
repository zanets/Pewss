import {pErrHandler, HomeDir} from '../utils.js'
import {
  FileController,
  ClassFile,
  JavaFile,
  getFileType,
  trimExt,
  igFs,
  fTypes,
  fCates
} from '../File'

module.exports = class User {
  constructor (pros) {
    this.Name = pros.Name || null
    this.Passwd = pros.Passwd || null
    this.Jobs = []
    this.Files = {}
    this.Files[fTypes.Class] = []
    this.Files[fTypes.Java] = []
    this.pros = pros
  }

  restore () {
    this.pros.Files[fTypes.Class].forEach(reFile => {
      let f = this.getFile(fTypes.Class, reFile.Cate, reFile.Name)
      if (f !== undefined) { f.setPub(reFile.Pub) }
    })
    this.pros = null
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
    let f = this.Files[type].find(f =>
      f.getCate() === cate && f.getName() === name
    )
    if (f !== undefined) {
      f.setPub(true)
      return 0
    } else { return -1 }
  }

  removePub (type, cate, name) {
    let f = this.Files[type].find(f =>
      f.getCate() === cate && f.getName() === name
    )
    if (f !== undefined) {
      f.setPub(false)
      return 0
    } else { return -2 }
  }

  getPubs (type) {
    return this.Files[type].filter(f => f.getPub())
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

        if (this.Files[ftype].find(f =>
          f.getName() === fname &&
          f.getCate() === fCates[cate])) { continue }

        let nf = (ftype === fTypes.Class)
          ? new ClassFile().setJPath(`${this.Name}.${fCates[cate]}.${fname}`)
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
