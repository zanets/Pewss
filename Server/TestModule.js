
import UserManager from './UserManager.js';
import MongoController from './MongoController.js';
import HomeManager from './HomeManager.js';
import {FT, FC} from './Utils.js';

const testUsers = ['darg', 'oeg'];

MongoController.connect().then(async () => {

	// ====== test UserManager ======
	await UserManager.loadUsers();
	if(UserManager.getUsersCount() === 0){
		console.log("======= No user. =======");
		for(const name of testUsers){
			await UserManager.createUser(name, name);
			console.log(`Create test user ${name}`);
		}
		await UserManager.loadUsers();
	}

	await UserManager.modUser(testUsers[0], {$updatePassword: 'sdf'});
	await UserManager.modUser(testUsers[0], {$addPublicFile: {type: FT.class, category: 'a', name:'a-name'}});
	await UserManager.modUser(testUsers[0], {$addPublicFile: {type: FT.class, category: 'c', name:'c-name'}});
	await UserManager.modUser(testUsers[0], {$removePublicFile: {type: FT.class, category: 'c', name:'c-name'}});
	await UserManager.modUser(testUsers[1], {$addPublicFile: {type: FT.class, category: 'scheduler', name:'aasd-name'}});

	for(const user of testUsers)
		console.log(UserManager.getUser(user));


	// ====== test HomeManager ======
	await HomeManager.scan(testUsers[0]);
	console.log(HomeManager.getClassFiles(testUsers[0]));
	console.log(HomeManager.getJavaFiles(testUsers[0]));
	console.log(await HomeManager.getFileContent(testUsers[0], 'scheduler', 'PEFT_MaxMin_MaxMin') + "");

	// ====== clear database ======
	for(const user of testUsers)
		await UserManager.removeUser(user);

});
