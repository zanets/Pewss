import assert from 'assert';
import MongoController from './MongoController.js';
import User from './User.js';

const BaseDir = __dirname;

class UserManager {

	constructor(){
		this.Users = [];
		this.CollectionName = 'User';
	}

	async loadUsers(){
		// init DB
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		await MongoController.initCollection(this.CollectionName);

		// load user data from db
		const UserProperties = await MongoController.getDocument(this.CollectionName);

		for(const UserProperty of UserProperties){
			// scan and update user file list
			const user = new User(UserProperty);
			await user.scanHome();

			// update user data to db
			await this.updateUser(user);
			this.Users.push(user);
		}
	}

	async removeUser(Name){
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		await MongoController.removeDocument(this.CollectionName, {Name});
		this.Users = this.Users.filter((user) => { user.Name !== Name});
	}

	getUsers(){
		return this.Users;
	}

	async createUser(Name, Password){
		const newUser = new User({Name, Password});
		await MongoController.insertDocument(this.CollectionName, newUser.getProperty());
	}

	async updateUser(user){
		await MongoController.updateDocument(
			this.CollectionName,
			{Name: user.Name},
			user.getProperty()
		);
	}
}

module.exports = new UserManager();
