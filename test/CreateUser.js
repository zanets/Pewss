import UserManager from './Server/UserManager.js';

const testUsers = ['darg', 'otk'];

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
