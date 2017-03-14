import UserManager from './UserManager.js';
import MongoController from './MongoController.js';
import HomeManager from './HomeManager.js';
import {FT, FC} from './Utils.js';

const testUsers = ['darg', 'oeg'];

UserManager.init().then(async () => {
    await UserManager.loadUsers();
	if(UserManager.getUsersCount() === 0){
		console.log("======= No user. =======");
		for(const name of testUsers){
			await UserManager.createUser(name, name);
			console.log(`Create test user ${name}`);
		}
		await UserManager.loadUsers();
	}
});
