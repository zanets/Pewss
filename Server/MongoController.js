import { MongoClient } from 'mongodb'
import Config from './Config.json'
import assert from 'assert'

class MongoController {
  constructor () {
    this.url = `mongodb://127.0.0.1:${Config.Mongodb.Port}/${Config.Mongodb.Name}`
    this.db = null
  }

  async connect () {
    if (this.db === null) { this.db = await MongoClient.connect(this.url).catch(global.error.exit) }
    assert.ok(this.db !== null, 'Connect to MongoDB fail')
  }

  isConnect () {
    return this.db !== null
  }

  initCollection (name) {
    this.db.collection(name)
  }

  async isCollectionExist (name) {
    const collections = await this.db.collections().catch(global.error.exit)

    if (collections === null) { return false }

    for (const collection of collections) {
      if (collection.collectionName === name) { return true }
    }
    return false
  }

  async getDocument (collectionName) {
    assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.')
    const collection = this.db.collection(collectionName)
    return collection.find().toArray()
  }

  async insertDocument (collectionName, doc) {
    assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.')
    const collection = this.db.collection(collectionName)
    await collection.insertOne(doc).catch(global.error.exit)
  }

  async updateDocument (collectionName, select, property) {
    assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.')
    const collection = this.db.collection(collectionName)
    await collection.updateOne(select, { $set: property }).catch(global.error.exit)
  }

  async removeDocument (collectionName, select) {
    assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.')
    const collection = this.db.collection(collectionName)
    await collection.deleteOne(select).catch(global.error.exit)
  }
}

module.exports = new MongoController()
