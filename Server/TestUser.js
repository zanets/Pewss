
import UserManager from './UserManager.js';
import MongoController from './MongoController.js'

const getUsers = async () => {
	await UserManager.loadUsers();
	return UserManager.getUsers();
};

const testUsers = ['darg', 'oeg'];

MongoController.connect().then(async () => {
	let users = await getUsers();
	if(users.length === 0){
		console.log("======= No user. =======");
		for(const name of testUsers){
			await UserManager.createUser(name, name);
			console.log(`Create test user ${name}`);
		}

		users = await getUsers();
	}
	console.log(users[0]);
	await UserManager.modUser(users[0], {$updatePassword: 'sdf'});
	await UserManager.modUser(users[0], {$addPublicFile: {category: 'a', name:'a-name'}});
	await UserManager.modUser(users[0], {$addPublicFile: {category: 'c', name:'c-name'}});
	await UserManager.modUser(users[0], {$removePublicFile: {category: 'c', name:'c-name'}});
	//await UserManager.modUser(users[0], {$removePublicFile: {category: 'a', name:'a-name'}});
	for(const user of users){
		//await UserManager.removeUser(user);
	}
});
