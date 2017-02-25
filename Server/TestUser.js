
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

	for(const name of testUsers){
		await UserManager.removeUser(name);
	}
});





