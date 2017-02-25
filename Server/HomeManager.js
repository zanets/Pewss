import FileManager from './FileManager.js';
import Utils from './Utils.js';
const HomeDir = `${__dirname}/Home`;

// file type
const FT = {
	class: 'class',
	java: 'java',
	unknown: null
};

// file category
const FC = {
	scheduler: 'scheduler',
	generator: 'generator',
	platform: 'platform',
	simulator: 'simulator'
};

class HomeManager{

	static async scan(userName){
		let files = [];

		for(const category in FC){
			
			const path = `${HomeDir}/${userName}/${category}`;
			const name = Utils.trimExtension(file.name);

			await FileManager.scanDirRecursive(path).then((_files) => {
				_files.forEach((file) => {
					files.push({
						name: name,
						path : file.path,
						jpath: `${userName}.${category}.${name}`,
						type: this.getFileType(file.name),
						category: FC[category]
					});
				});
			}).catch((err) => {
				throw err;
			});
		}
		return files;
	}

	static getFileType(filename){
		if(filename.endsWith(FT.class))
			return FT.class;
		else if(filename.endsWith(FT.java))
			return FT.java;
		else
			return FT.unknown;
	}
}

module.exports = {FT, FC, HomeManager};
