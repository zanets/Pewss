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

class ClassFile {
  constructor () {
    this.Owner = null
    this.Name = null
    this.Type = fTypes.Class
    this.Cate = null
    this.JPath = null
    this.Path = null
    this.Pub = false
  }

  setOwner (n) {
    this.Owner = n
    return this
  }

  getOwner () {
    return this.Type
  }

  setName (n) {
    this.Name = n
    return this
  }

  getName () {
    return this.Name
  }

  getType () {
    return this.t
  }

  setCate (c) {
    this.Cate = c
    return this
  }

  getCate () {
    return this.Cate
  }

  setJPath (p) {
    this.JPath = p
    return this
  }

  getJPath () {
    return this.JPath
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

class JavaFile {
  constructor () {
    this.Owner = null
    this.Name = null
    this.Type = fTypes.java
    this.Cate = null
    this.Path = null
    this.Pub = false
  }

  setOwner (n) {
    this.Owner = n
    return this
  }

  getOwner () {
    return this.Type
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

module.exports = {
  ClassFile,
  JavaFile,
  getFileType,
  trimExt,
  igFs,
  fTypes,
  fCates
}
