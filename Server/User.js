import { 
	HomeManager, 
	FT, 
	FC 
} from './HomeManager.js';

const BaseDir = __dirname;

module.exports = class User {
	constructor(Property){
		this.Name = Property.Name;
		this.Password = Property.Password;
		this.Public = Property.Public || [];
		this.Files = Property.Files || [];
	}

	removeFile(category, name){
		// remove file

		// update this
	}

	addPublicFile(){
		// update database

		// update this
	}

	removePublicFile(){
		// update database

		// update this
	}

	changePassword(Password){
		// update database

		// update this
		this.Password = Password;
	}

	async scanHome(){
		await HomeManager.scan(this.Name).then((Files) => {
			this.Files = Files;
		}).catch((err) => {
			throw err;
		});
	}

	getProperty(){
		return {
			Name: this.Name,
			Password: this.Password,
			Public: this.Public,
			Files: this.Files
		};
	}
}