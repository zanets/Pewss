import assert from 'assert';
import MongoController from './MongoController.js';
import User from './User.js';
import {eErrHandler, FT} from './Utils.js';
import Logger from './Logger.js';

class UserManager {

	constructor(){}

	async init()	{
		this.Users = {};
		this.CollectionName = 'User';
		await MongoController.connect();
		await this.loadUsers();
	}

	/* use it in internal */
	getUser(userName)	{
		const u = this.Users[userName];
		return u === undefined
			? null
			: u;
	}

	getUsers()	{
		return this.Users;
	}

	getUsersCount()	{
		return Object.keys(this.Users).length;
	}

	isUserExist(userName)	{
		return this.getUser(userName) !== null;
	}

	async loadUsers()	{
		// init DB
		assert.ok(MongoController.isConnect(), 'DB NOT connected');
		MongoController.initCollection(this.CollectionName);

		// load user data from db
		const UserProperties = await MongoController.getDocument(this.CollectionName);
		this.Users={};

		// create user instance
		for(const property of UserProperties)
			this.Users[property.name] = new User(property);
	}

	// remove user from DB
	async removeUser(userName)	{
		assert.ok( MongoController.isConnect(), 'DB NOT connected' );

		await MongoController
			.removeDocument(this.CollectionName, {name: userName})
			.then( () => delete this.Users[userName] )
			.catch(eErrHandler);
	}

	// create new user to DB
	async createUser(name, passwd)	{
		const newUser = new User({name, passwd});
		
		await MongoController
			.insertDocument( this.CollectionName, newUser.getProperty() )
			.catch(eErrHandler);
		
		this.Users[name] = newUser;
		
		return name;
	}

	// update user data in DB
	async updateDB(tarUser)	{
		assert.ok( tarUser !== null, `User ${tarUser.name} NOT exist` );

		await MongoController
			.updateDocument( this.CollectionName, {name: tarUser.name}, tarUser.getProperty() )
			.catch(eErrHandler);
		
		return 0;
	}

	// operate: {op: v}
	// op: $removeFile | $addPublicFile | $removePublicFile | $updatePassword
	async modUser(usrName, operate)	{
		const tarUser = this.getUser(usrName);
		
		assert.ok(tarUser !== null, `User ${usrName} NOT exist`);
		
		const op = Object.keys(operate)[0];
		
		const v = operate[op];

		if(op === '$addPublish')
			tarUser.addPublish(v.type, v.category, v.name);
		else if(op === '$removePublish')
			tarUser.removePublish(v.type, v.category, v.name);
		else if(op === '$updatePassword')
			tarUser.updatePassword(v);
		else
			Logger.error(`Unknown modUser command : ${op}`);

		await this.updateDB(tarUser).catch(eErrHandler);
		
		return 0;
	}

	getClassPublishes()	{
		let publishes = [];
		
		for(const name in this.Users)		{
			const usrPublishes = this.Users[name].getPublishesByType(FT.class);
			
			publishes = publishes.concat(usrPublishes);
		}
		
		return publishes;
	}

	isPublish(owner, category, type, filename)	{
		const usrPublishes = this.Users[owner].getPublishesByType(type);
		
		for(const publish of usrPublishes)		{
			if(publish.name === filename && publish.category === category)
				return true;
		}
		
		return false;
	}
}

module.exports = new UserManager();
