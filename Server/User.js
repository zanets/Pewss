import {FT, FC, pErrHandler} from './Utils.js';
module.exports = class User {

	constructor(property){
		this.name = property.name;
		this.passwd = property.passwd;
		/* Public { type, category, name } */
		this.publics = property.publics || [];
	}

	addPublic(fileType, fileCategory, fileName){
		// update this
		this.publics.push({
			type: fileType,
			category: fileCategory,
			name: fileName,
			owner: this.name
		});
	}

	removePublic(fileType, fileCategory, fileName){
		// update this
		this.publics = this.publics.filter(f =>
			f.type     !== fileType     ||
			f.category !== fileCategory ||
			f.name     !== fileName
		);
	}

	getPublicsByType(fileType){
		return fileType === undefined
			? this.publics
			: this.publics.filter(f =>
				f.type === fileType
			);
	}

	updatePassword(passwd){
		// update this
		this.passwd = passwd;
	}

	getProperty(){
		return {
			name: this.name,
			passwd: this.passwd,
			publics: this.publics
		};
	}
};
