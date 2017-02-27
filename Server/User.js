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

	addFile(category, name){

	}

	removeFile(category, name){
		// remove file

		// update this
	}

	addPublicFile(category, name){
		// update this
		this.Public.push({name, category});
	}

	removePublicFile(category, name){
		// update this
		this.Public = this.Public.filter(_file =>
			!(_file.category === category && _file.name === name)
		);
	}

	updatePassword(Password){
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

	getFiles(){
		return this.Files;
	}

	getClassFiles(){
		return this.getFiles().filter(_file => _file.type === FT.class);
	}

	getSourceFiles(){
		return this.getFiles().filter(_file => _file.type === FT.java);
	}
}
