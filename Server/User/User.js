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
    let nfs = []
    for (let fCate in fCates) {
      fCate = fCates[fCate]
      let _nfs = await FileController
        .scanDirAll(`${HomeDir}/${this.Name}/${fCate}`)
        .catch(pErrHandler)
      _nfs.forEach(_n => _n.cate = fCate)
      nfs = nfs.concat(_nfs)
    }

    /* create new file object */
    nfs = nfs.map(nf => {
      const fName = trimExt(nf.name)
      const fType = getFileType(nf.name)
      const fCate = nf.cate
      const nfile = (fType === fTypes.Class)
        ? new ClassFile().setJPath(`${this.Name}.${fCate}.${fName}`)
        : new JavaFile()
      nfile.setOwner(this.Name)
        .setName(fName)
        .setPath(nf.path)
        .setCate(fCate)
      return nfile
    })
    const isFileEqual = (of, nf) => {
      return of.getName() === nf.getName()
          && of.getCate() === nf.getCate()
          && nf.getType() === nf.getType()
    }
    for (let fType in fTypes) {
      fType = fTypes[fType]
      if (this.Files[fType] === undefined ) continue
      /* delete old files not exist in new files */
      this.Files[fType] = this.Files[fType].filter( of => nfs.find(nf => isFileEqual(of, nf)) )
      /* add new file not exist in old files */
      nfs.forEach(nf => {
        const isExist = this.Files[fType].find( of => isFileEqual(of, nf) )
        if (!isExist) {this.Files[fType].push(nf)}
      })
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

  async deleteFile (fType, fCate, fName) {
     await FileController.deleteFile(`${HomeDir}/${this.Name}/${fCate}/${fName}.${fType}`)
     await this.scanHome()
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
