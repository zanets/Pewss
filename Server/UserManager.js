import assert from 'assert';
import MongoController from './MongoController.js';
import User from './User.js';

const BaseDir = __dirname;

class UserManager {

	constructor(){
		this.Users = [];
		this.CollectionName = 'User';
	}

	getUser(username){
		const u = this.Users.find(_u => _u.Name === name);
		return (u === undefined) ? null : u;
	}

	getUsers(){
		return this.Users;
	}

	async loadUsers(){
		// init DB
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		await MongoController.initCollection(this.CollectionName);

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
	async removeUser(tarUser){
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		await MongoController.removeDocument(this.CollectionName, {Name: tarUser.Name});
		this.Users = this.Users.filter(_User => _User.Name !== tarUser.Name);
	}

	// create new user to DB
	async createUser(Name, Password){
		const newUser = new User({Name, Password});
		await MongoController.insertDocument(this.CollectionName, newUser.getProperty());
		this.Users.push(newUser);
	}

	// update user data in DB
	async updateUser(tarUser){
		await MongoController.updateDocument(
			this.CollectionName,
			{Name: tarUser.Name},
			tarUser.getProperty()
		);
	}

	// operate: {op: value}
	// op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
	async modUser(tarUser, operate){
		const op = Object.keys(operate)[0];
		const value = operate[op];
		if(op === '$removeFile'){
			tarUser.removeFile(value.category, value.name);
		} else if(op === '$addPublicFile'){
			tarUser.addPublicFile(value.category, value.name);
		} else if(op === '$removePublicFile'){
			tarUser.removePublicFile(value.category, value.name);
		} else if(op === '$updatePassword'){
			tarUser.updatePassword(value);
		}

		await this.updateUser(tarUser);
		return tarUser;
	}


}

module.exports = new UserManager();
