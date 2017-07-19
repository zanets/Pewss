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
  constructor () {
    this.Id = null
    this.Name = null
    this.Passwd = null
    this.Files = {}
    this.Files[fTypes.Class] = []
    this.Files[fTypes.Java] = []
  }

  restore () {
    this.Files[fTypes.Class].forEach(reFile => {
      let f = this.getFile(fTypes.Class, reFile.Cate, reFile.Name)
      if (f !== undefined) { f.setPub(reFile.Pub) }
    })
  }

  setId (n) {
    this.Id = n
    return this
  }

  getId () {
    return this.Id
  }

  getName () {
    return this.Name
  }

  setName (n) {
    this.Name = n
    return this
  }

  getPasswd () {
    return this.Passwd
  }

  setPasswd (n) {
    this.Passwd = n
    return this
  }

  addPub (fType, fCate, fName) {
    let f = this.Files[fType].find(f =>
      f.getCate() === fCate && f.getName() === fName
    )
    if (f !== undefined) {
      f.setPub(true)
      return 0
    } else { return -1 }
  }

  removePub (fType, fCate, fName) {
    let f = this.Files[fType].find(f =>
      f.getCate() === fCate && f.getName() === fName
    )
    if (f !== undefined) {
      f.setPub(false)
      return 0
    } else { return -2 }
  }

  getPubs (fType) {
    return this.Files[fType].filter(f => f.getPub())
  }

  isPub (fType, fCate, fName) {
    return this.getPubs(fType).find(f =>
      f.getCate() === fCate && f.getName() === fName
    )
  }

  async scanHome () {
    for (const fCate in fCates) {
      let fs = await FileController
            .scanDirAll(`${HomeDir}/${this.Name}/${fCate}`)
            .catch(pErrHandler)

      for (const f of fs) {
        const fName = trimExt(f.name)
        const fType = getFileType(f.name)

        /* Ignore non-class and non-java files */
        if (fType === fTypes.unknown) { continue }

        /* ScanHome may be called while file list is not empty */
        if (this.Files[fType].find(f =>
          f.getName() === fName &&
          f.getCate() === fCates[fCate])
        ) { continue }

        let nf = (fType === fTypes.Class)
          ? new ClassFile().setJPath(`${this.Name}.${fCates[fCate]}.${fName}`)
          : new JavaFile()

        nf.setOwner(this.Name)
          .setName(fName)
          .setPath(f.path)
          .setCate(fCates[fCate])

        this.Files[fType].push(nf)
      }
    }

    igFs(this.Files[fTypes.Class])
    igFs(this.Files[fTypes.Java])
  }

  getFile (fType, fCate, fName) {
    return this.Files[fType].find(f =>
      f.getCate() === fCate && f.getName() === fName
    )
  }

  getFilesByType (fType) {
    return this.Files[fType]
  }

  async newFile (fCate, fName, fContent) {
    return FileController.writeFile(`${HomeDir}/${this.Name}/${fCate}/${fName}.java`, fContent)
  }

  async deleteFile (fCate, fName) {
    return FileController.deleteFile(`${HomeDir}/${this.Name}/${fCate}/${fName}.java`)
  }

  async getFileContent (fCate, fName) {
    return FileController.readFile(`${HomeDir}/${this.Name}/${fCate}/${fName}.java`)
  }

  async setFileContent (fCate, fName, fContent) {
    return FileController.writeFile(`${HomeDir}/${this.Name}/${fCate}/${fName}.java`, fContent)
  }

  getProperty () {
    return {
      Id: this.Id,
      Name: this.Name,
      Passwd: this.Passwd,
      Files: this.Files
    }
  }
}
