const fTypes = {
  Class: 'class',
  Java: 'java',
  unknown: null
}

const fCates = {
  Scheduler: 'scheduler',
  Generator: 'generator',
  Platform: 'platform',
  Simulator: 'simulator'
}

const getFileType = (name) => {
  if (name.endsWith(fTypes.Class)) {
    return fTypes.Class
  } else if (name.endsWith(fTypes.Java)) {
    return fTypes.Java
  }
  return fTypes.unknown
}

const trimExt = (name) => {
  ['.java', '.class'].forEach(ext => {
    const pos = name.indexOf(ext)
    name = (pos === -1)
      ? name
      : name.slice(0, pos)
  })
  return name
}

const igFs = (files) => {
  ['.DS_Store'].forEach(ignore => {
    files = files.filter(file =>
        ignore !== file.name
      )
  })
  return files
}

class File {
  constructor () {
    this.Owner = null
    this.Name = null
    this.Cate = null
    this.Path = null
    this.Pub = false
    this.Type = fTypes.unknown
  }

  setOwner (n) {
    this.Owner = n
    return this
  }

  getOwner () {
    return this.Owner
  }

  setName (n) {
    this.Name = n
    return this
  }

  getName () {
    return this.Name
  }

  getType () {
    return this.Type
  }

  setCate (c) {
    this.Cate = c
    return this
  }

  getCate () {
    return this.Cate
  }

  setPath (p) {
    this.Path = p
    return this
  }

  getPath () {
    return this.Path
  }

  setPub (p) {
    this.Pub = p
    return this
  }

  getPub () {
    return this.Pub
  }
}

class ClassFile extends File {
  constructor () {
    super()
    this.Type = fTypes.Class
    this.JPath = null
  }

  setJPath (p) {
    this.JPath = p
    return this
  }

  getJPath () {
    return this.JPath
  }
}

class JavaFile extends File {
  constructor () {
    super()
    this.Type = fTypes.Java
  }
}

module.exports = {
  ClassFile,
  JavaFile,
  getFileType,
  trimExt,
  igFs,
  fTypes,
  fCates
}
