import { MongoClient } from 'mongodb';
import assert from 'assert';

class MongoController {
	constructor(){
		this.url = 'mongodb://localhost:6000/SimPlatform';
		this.db = null;
	}

	async connect(){
		if(this.db === null)
			this.db = await MongoClient.connect(this.url);
		assert.ok(this.db !== null, 'Connect to MongoDB fail');
	}	

	isConnect(){
		return this.db !== null;
	}

	initCollection(name){
		this.db.collection(name);
	}

	async isCollectionExist(name){
		const collections = await this.db.collections();

		if(collections === null)
			return false;

		for(const collection of collections){
			if(collection.collectionName === name)
				return true;
		}
		return false;
	}

	async getDocument(collectionName){
		assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.');
		const collection = this.db.collection(collectionName);
		return await collection.find().toArray();
	}

	async insertDocument(collectionName, doc){
		assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.');
		const collection = this.db.collection(collectionName);
		await collection.insertOne(doc);
	}

	async updateDocument(collectionName, select, property){
		assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.');
		const collection = this.db.collection(collectionName);
		await collection.updateOne(select, {$set:property});
	}

	async removeDocument(collectionName, select){
		assert.ok(this.isCollectionExist(collectionName), 'Collection NOT exist.');
		const collection = this.db.collection(collectionName);
		await collection.deleteOne(select);
	}


}

module.exports = new MongoController();