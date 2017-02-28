import assert from 'assert';
import MongoController from './MongoController.js';
import User from './User.js';
import { BaseDir, eErrHandler, FT, FC } from './Utils.js';

class UserManager {

	constructor(){
		this.Users = [];
		this.CollectionName = 'User';
	}

	/* use it in internal */
	getUser(userName){
		const u = this.Users.find(_u => _u.Name === userName);
		return u !== undefined ? u : null;
	}

	getUsersCount(){
		return this.Users.length;
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

		this.Users=[];

		// create user instance
		for(const UserProperty of UserProperties){
			// scan and update user file list
			const tarUser = new User(UserProperty);
			await tarUser.scanHome();
			// update user data to db
			await this.updateUser(tarUser);
			this.Users.push(tarUser);
		}
	}

	// remove user from DB
	async removeUser(userName){
		assert.ok(MongoController.isConnect(), 'DB NOT connected');

		await MongoController.removeDocument(this.CollectionName, {Name: userName})
			.then(() => {
				this.Users = this.Users.filter(_User => _User.Name !== userName);
			})
			.catch(eErrHandler);
	}

	// create new user to DB
	async createUser(Name, Password){
		const newUser = new User({Name, Password});
		await MongoController.insertDocument(this.CollectionName, newUser.getProperty())
			.catch(eErrHandler);
		this.Users.push(newUser);
		return Name;
	}

	// update user data in DB
	async updateUser(userName){
		const tarUser = this.getUser(userName);
		if(tarUser === null)
			return -1;
		await MongoController.updateDocument(
			this.CollectionName,
			{Name: tarUser.Name},
			tarUser.getProperty()
		).catch(eErrHandler);
		return 0;
	}

	// operate: {op: v}
	// op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
	async modUser(userName, operate){
		const tarUser = this.getUser(userName);
		if(tarUser === null)
			return -1;

		const op = Object.keys(operate)[0];
		const v = operate[op];

		if(op === '$removeFile')
			tarUser.removeFile(v.category, v.name);
		else if(op === '$addPublicFile')
			tarUser.addPublicFile(v.type, v.category, v.name);
		else if(op === '$removePublicFile')
			tarUser.removePublicFile(v.type, v.category, v.name);
		else if(op === '$updatePassword')
			tarUser.updatePassword(v);

		await this.updateUser(tarUser).catch(eErrHandler);
		return 0;
	}

	getClassFiles(userName){
		const tarUser = this.getUser(userName);
		if(tarUser === null)
			return -1;
		let resFiles = [];
		// private files
		resFiles = resFiles.concat(tarUser.getFiles(FT.class));
		// publish files
		this.Users.forEach(_u => {
			if(_u.Name === userName) return;
			resFiles = resFiles.concat(_u.getPublicFiles(FT.class));
		});
		return resFiles;
	}

	getJavaFiles(userName){
		const tarUser = this.getUser(userName);
		if(tarUser === null)
			return -1;
		return tarUser.getFiles(FT.java)
	}
}

module.exports = new UserManager();
