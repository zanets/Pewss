module.exports = class User {
  constructor (property) {
    this.name = property.name
    this.passwd = property.passwd
    /* Public { type, category, name } */
    this.publishes = property.publishes || []
  }

  addPublish (fileType, fileCategory, fileName) {
    // update this
    this.publishes.push({
      type: fileType,
      category: fileCategory,
      name: fileName,
      owner: this.name
    })
  }

  removePublish (fileType, fileCategory, fileName) {
    // update this
    this.publishes = this.publishes.filter(f =>
      f.type !== fileType ||
      f.category !== fileCategory ||
      f.name !== fileName
    )
  }

  getPublishesByType (fileType) {
    return fileType === undefined
      ? this.publishes
      : this.publishes.filter(f =>
        f.type === fileType
      )
  }

  updatePassword (passwd) {
    // update this
    this.passwd = passwd
  }

  getProperty () {
    return {
      name: this.name,
      passwd: this.passwd,
      publishes: this.publishes
    }
  }
}
