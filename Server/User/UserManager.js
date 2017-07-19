import assert from 'assert'
import MongoController from '../MongoController.js'
import User from './User.js'
import {fTypes} from '../File'
import uuid from 'uuid/v4'
import Encrypt from '../Encrypt.js'
class UserManager {
  async init () {
    this.Users = []
    this.CollectionName = 'User'
    this.Props = null
    await MongoController.connect()
  }

  getUser (uid, uname) {
    return (uid !== null)
      ? this.Users.find(u => u.getId() === uid)
      : this.Users.find(u => u.getName() === uname)
  }

  getUsers () {
    return this.Users
  }

  async loadUsers () {
    // init DB
    assert.ok(MongoController.isConnect(), 'DB NOT connected')
    MongoController.initCollection(this.CollectionName)

    // load user data from db
    this.Props = await MongoController.getDocument(this.CollectionName)
  }

  // remove user from DB
  async removeUser (uid) {
    assert.ok(MongoController.isConnect(), 'DB NOT connected')

    await MongoController
      .removeDocument(this.CollectionName, { Id: uid })
      .then(() => delete this.Users[uid])
      .catch(global.eErrHandler)
  }

  // create new user to DB
  async createUser (Name, Passwd) {
    const Id = uuid()
    const newUser = new User()
      .setId(Id)
      .setName(Name)
      .setPasswd(Encrypt.enc(Passwd))

    await MongoController
      .insertDocument(this.CollectionName, newUser.getProperty())
      .catch(global.eErrHandler)

    this.Users.push(newUser)

    return Id
  }

  createUsers () {
    this.Users = []
    for (const pro of this.Props) {
      const newUser = new User()
        .setId(pro.Id)
        .setName(pro.Name)
        .setPasswd(pro.Passwd)
      this.Users.push(newUser)
    }
  }

  // update user data in DB
  async updateDB (tUsr) {
    assert.ok(tUsr !== null, `User ${tUsr.getName()} NOT exist`)
    return MongoController.updateDocument(
      this.CollectionName,
      { Id: tUsr.getId() },
      tUsr.getProperty()
    )
  }

  // operate: {op: v}
  // op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
  async modUser (uid, operate) {
    const tarUser = this.getUser(uid)
    assert.ok(tarUser !== null, `User ${tarUser.getName()} NOT exist`)
    const op = Object.keys(operate)[0]
    const v = operate[op]

    if (op === '$addPub') {
      tarUser.addPub(v.fType, v.fCate, v.fName)
    } else if (op === '$removePub') {
      tarUser.removePub(v.fType, v.fCate, v.fName)
    } else if (op === '$setPasswd') {
      tarUser.setPasswd(v)
    } else {
      log(`Unknown modUser command : ${op}`, 'error')
    }

    return this.updateDB(tarUser)
  }

  isPub (uid, fType, fCate, fName) {
    const pubs = this.getUser(uid).getPubs(fType)
    for (const pub of pubs) {
      if (pub.getName() === fName && pub.getCate() === fCate) {
        return true
      }
    }

    return false
  }

  getClassFiles (uid) {
    // private
    let res = this.getUser(uid).getFilesByType(fTypes.Class)
    // publish
    for (const user of this.Users) {
      if (user.getId() === uid) continue
      res = res.concat(user.getPubs(fTypes.Class))
    }
    return res
  }

  // Currently, publish source file is not allow
  getJavaFiles (uid) {
    // private
    let res = this.getUser(uid).getFilesByType(fTypes.Java)
    return res
  }
}

module.exports = new UserManager()
