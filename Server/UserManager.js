import assert from 'assert'
import MongoController from './MongoController.js'
import User from './User.js'
import { eErrHandler, log } from './Utils.js'
import Encrypt from './Encrypt.js'
import {fTypes} from './File.js'
class UserManager {
  async init () {
    this.Users = {}
    this.CollectionName = 'User'
    await MongoController.connect()
    await this.loadUsers()
  }

  getUser (name) {
    return this.Users[name]
  }

  getUsers () {
    return this.Users
  }

  async loadUsers () {
    // init DB
    assert.ok(MongoController.isConnect(), 'DB NOT connected')
    MongoController.initCollection(this.CollectionName)

    // load user data from db
    const pros = await MongoController.getDocument(this.CollectionName)

    // create user instance
    this.Users = {}
    for (const pro of pros) {
      this.Users[pro.Name] = new User(pro)
    }
  }

  // remove user from DB
  async removeUser (uname) {
    assert.ok(MongoController.isConnect(), 'DB NOT connected')

    await MongoController
      .removeDocument(this.CollectionName, { Name: uname })
      .then(() => delete this.Users[uname])
      .catch(eErrHandler)
  }

  // create new user to DB
  async createUser (name, passwd) {
    const newUser = new User({Name: name, Passwd: Encrypt.enc(passwd)})

    await MongoController
      .insertDocument(this.CollectionName, newUser.getProperty())
      .catch(eErrHandler)

    this.Users[name] = newUser

    return name
  }

  // update user data in DB
  async updateDB (tUsr) {
    assert.ok(tUsr !== null, `User ${tUsr.getName()} NOT exist`)

    return MongoController.updateDocument(
      this.CollectionName,
      { Name: tUsr.getName() },
      tUsr.getProperty()
    )
  }

  // operate: {op: v}
  // op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
  async modUser (uname, operate) {
    const tarUser = this.getUser(uname)

    assert.ok(tarUser !== null, `User ${uname} NOT exist`)

    const op = Object.keys(operate)[0]

    const v = operate[op]

    if (op === '$addPub') {
      tarUser.addPub(v.type, v.cate, v.name)
    } else if (op === '$removePub') {
      tarUser.removePub(v.type, v.cate, v.name)
    } else if (op === '$setPasswd') {
      tarUser.setPasswd(Encrypt.enc(v))
    } else {
      log(`Unknown modUser command : ${op}`, 'error')
    }

    return this.updateDB(tarUser)
  }

  isPub (owner, type, cate, fname) {
    const pubs = this.Users[owner].getPubs(type)

    for (const pub of pubs) {
      if (pub.getName() === fname && pub.getCate === cate) { return true }
    }

    return false
  }

  getClassFiles (uname) {
    // private
    let res = this.getUser(uname).getFilesByType(fTypes.Class)

    // publish
    for (const u in this.Users) {
      res = res.concat(this.Users[u].getPubs(fTypes.Class))
    }
    return res
  }

  // Currently, publish source file is not allow
  getJavaFiles (uname) {
    // private
    let res = this.getUser(uname).getFilesByType(fTypes.Java)

    return res
  }
}

module.exports = new UserManager()
