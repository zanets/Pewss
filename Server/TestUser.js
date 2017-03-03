
import UserManager from './UserManager.js';
import MongoController from './MongoController.js';
import {FT, FC} from './Utils.js';

const testUsers = ['darg', 'oeg'];

MongoController.connect().then(async () => {
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

	const javaFiles = UserManager.getJavaFiles(testUsers[0]);

	const code = await UserManager.getJavaContent(testUsers[0], javaFiles[0].category, javaFiles[0].name);
	console.log(code+"");
	for(const user of testUsers){
		await UserManager.removeUser(user);
	}
});
