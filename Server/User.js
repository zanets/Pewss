import HomeScanner from './HomeScanner.js';
import {FT, FC, pErrHandler} from './Utils.js';
class User {

	constructor(Property){
		this.Name = Property.Name;
		this.Password = Property.Password;
		/* Public { type, category, name } */
		this.Public = Property.Public || [];
		/* File { type, category, name, path, jpath} */
		this.Files = Property.Files || [];
	}

	/* add source file */
	addFile(category, name){

	}

	/* remove both class and source file */
	removeFile(category, name){
		// remove file

		// update this
	}

	addPublicFile(type, category, name){
		// update this
		this.Public.push({type, name, category, owner: this.Name});
	}

	removePublicFile(type, category, name){
		// update this
		this.Public = this.Public.filter(_f =>
			_f.type !== type ||
			_f.category !== category ||
			_f.name !== name
		);
	}

	getPublicFiles(type){
		return type === undefined ?
				this.Public :
				this.Public.filter(_f =>_f.type === type);
	}

	getFiles(type){
		const typeFiles = this.Files.filter(_f => _f.type === type);
		const resFiles = [];
		typeFiles.forEach(_f => {
			resFiles.push({
				type: _f.type,
				category: _f.category,
				name: _f.name
			});
		});
		return resFiles;
	}

	updatePassword(Password){
		// update this
		this.Password = Password;
	}

	async scanHome(){
		await HomeScanner.scan(this.Name).then(Files => {
			console.log(Files);
			this.Files = Files;
		}).catch(pErrHandler);
	}

	getProperty(){
		return {
			Name: this.Name,
			Password: this.Password,
			Public: this.Public,
			Files: this.Files
		};
	}

	getFile(type, category, fileName){
		const tarFile = this.Files.find(_f => {
			return (_f.type === type && _f.category === category && _f.name === fileName);
		});
		return tarFile ? tarFile : null;
	}

	async getFileContent(category, fileName){
		const tarFile =	this.Files.find(_f => {
			return (_f.name === fileName && _f.category === category);
		});
		// open file and return source code
		return await HomeScanner.readFile(tarFile.path).catch(pErrHandler);
	}
}

module.exports = User;
