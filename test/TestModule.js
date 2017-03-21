
import UserManager from './Server/UserManager.js';
import MongoController from './Server/MongoController.js';
import HomeManager from './Server/HomeManager.js';
import {FT, FC} from './Server/Utils.js';

const testUsers = ['darg', 'oeg'];

UserManager.init().then(async () => {

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
	await UserManager.modUser(testUsers[0], {$addPublish: {type: FT.class, category: 'a', name:'a-name'}});
	await UserManager.modUser(testUsers[0], {$addPublish: {type: FT.class, category: 'c', name:'c-name'}});
	await UserManager.modUser(testUsers[0], {$removePublish: {type: FT.class, category: 'c', name:'c-name'}});
	await UserManager.modUser(testUsers[1], {$addPublish: {type: FT.class, category: 'scheduler', name:'aasd-name'}});
	await UserManager.modUser(testUsers[0], {$addPublish: {type: FT.class, category: 'scheduler', name:'PEFT_MaxMin_MaxMin'}});


	for(const user of testUsers){
		console.log(`====== user ${user} ======`);
		console.log(UserManager.getUser(user));
	}

	// ====== test HomeManager ======
	console.log("====== test HomeManager ======");
	await HomeManager.scan(testUsers[0]);
	await HomeManager.scan(testUsers[1]);
	console.log(`====== Java file from ${testUsers[0]} ======`);
	console.log(HomeManager.getJavaFiles(testUsers[0]));
	console.log(`====== Class file from ${testUsers[1]} ======`);
	console.log(HomeManager.getClassFiles(testUsers[1]));
	console.log("====== class publics ======");
	console.log(UserManager.getClassPublishes());
	console.log(`====== Class file from ${testUsers[1]} with publish ======`);
	console.log(HomeManager.getClassFiles(testUsers[1], UserManager.getClassPublishes()));



	// ====== clear database ======
	for(const user of testUsers)
		await UserManager.removeUser(user);

});
