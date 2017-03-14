import assert from 'assert';
import MongoController from './MongoController.js';
import User from './User.js';
import { BaseDir, eErrHandler, FT, FC } from './Utils.js';
import envConfig from './Sim/envConfig.json';

class UserManager {

	constructor(){
	}
	
	async init(){
		this.Users = {};
		this.CollectionName = 'User';
		await MongoController.connect();
	}

	/* use it in internal */
	getUser(userName){
		const u = this.Users[userName];
		return u === undefined
			? null
			: u;
	}

	getUsers(){
		return this.Users;
	}

	getUsersCount(){
		return Object.keys(this.Users).length;
	}

	isUserExist(userName){
		return this.getUser(userName) !== null;
	}

	async loadUsers(){
		// init DB
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		MongoController.initCollection(this.CollectionName);

		// load user data from db
		const UserProperties = await MongoController.getDocument(this.CollectionName);
		this.Users={};

		// create user instance
		for(const property of UserProperties){
			const tarUser = new User(property);
			this.Users[property.name] = tarUser;
		}
	}

	// remove user from DB
	async removeUser(userName){
		assert.ok(MongoController.isConnect(), 'DB NOT connected');

		await MongoController.removeDocument(this.CollectionName, {name: userName})
			.then(() =>
				delete this.Users[userName]
			)
			.catch(eErrHandler);
	}

	// create new user to DB
	async createUser(name, passwd){
		const newUser = new User({name, passwd});
		await MongoController.insertDocument(this.CollectionName, newUser.getProperty())
			.catch(eErrHandler);
		this.Users[name] = newUser;
		return name;
	}

	// update user data in DB
	async updateDB(tarUser){
		assert.ok(tarUser !== null, `User ${tarUser.name} NOT exist`);

		await MongoController.updateDocument(
			this.CollectionName,
			{name: tarUser.name},
			tarUser.getProperty()
		).catch(eErrHandler);
		return 0;
	}

	// operate: {op: v}
	// op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
	async modUser(usrName, operate){
		const tarUser = this.getUser(usrName);
		assert.ok(tarUser !== null, `User ${usrName} NOT exist`);
		const op = Object.keys(operate)[0];
		const v = operate[op];


		if(op === '$addPublicFile')
			tarUser.addPublic(v.type, v.category, v.name);
		else if(op === '$removePublicFile')
			tarUser.removePublic(v.type, v.category, v.name);
		else if(op === '$updatePassword')
			tarUser.updatePassword(v);

		await this.updateDB(tarUser).catch(eErrHandler);
		return 0;
	}
}

module.exports = new UserManager();
