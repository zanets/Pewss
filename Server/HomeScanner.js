import FileScanner from './FileScanner.js';
import {FT, FC, HomeDir} from './Utils.js';


module.exports = class HomeScanner{

	static async scan(userName){
		let resFiles = [];

		for(const category in FC){
			const path = `${HomeDir}/${userName}/${category}`;
			await FileScanner.scanDirRecursive(path).then(_fs => {
				_fs.forEach(_f => {
					const name = this.trimExtension(_f.name);
					resFiles.push({
						name: name,
						path : _f.path,
						jpath: `${userName}.${category}.${name}`,
						type: this.getFileType(_f.name),
						category: FC[category],
						owner: userName
					});
				});
			}).catch((err) => {
				throw err;
			});
		}
		return resFiles;
	}

	static getFileType(filename){
		if(filename.endsWith(FT.class))
			return FT.class;
		else if(filename.endsWith(FT.java))
			return FT.java;
		else
			return FT.unknown;
	}

	static trimExtension(filename){
		['.java', '.class'].forEach((extension) => {
		const pos = filename.indexOf(extension);
		filename = (pos === -1) ?
			filename :
			filename.slice(0, pos);
		});
		return filename;
	}

	static async readFile(path){
		return await FileScanner.readFile(path);
	}
};
