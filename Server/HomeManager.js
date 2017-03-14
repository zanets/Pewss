import HomeScanner from './HomeScanner.js';
import assert from 'assert';
import { BaseDir, pErrHandler, eErrHandler, FT, FC } from './Utils.js';
class HomeManager{

    constructor(){
	       this.UsersFiles = {};
	}

    async scan(usrName){
        await HomeScanner.scan(usrName).then(Files => {
            this.UsersFiles[usrName] = Files;
        }).catch(pErrHandler);
    }

    getFile(usrName, type, category, fileName){
        const fltFiles = this.getFilesByType(usrName, type);
        const file = fltFiles.find(f => {
            return (f.category === category && f.name === name);
        });

        return file ? file : null;
    }

    getFilesByType(usrName, type){
        const usrFiles = this.UsersFiles[usrName];
        assert.ok(usrFiles !== undefined, `User ${usrName} NOT exist`);

        return usrFiles.filter(f => f.type === type);
    }

    async getFileContent(usrName, category, fileName){
        const fltFiles = this.getFilesByType(usrName, FT.java);
        const tarFile =	fltFiles.find(f => {
            return (f.name === fileName && f.category === category);
        });
        // open file and return source code
        return await HomeScanner.readFile(tarFile.path).catch(pErrHandler);
    }

    /* remove both class and source file */
    removeFile(usrName, category, name){
        // remove file

        // update this
    }

    getClassFiles(userName){
        return this.getFilesByType(userName, FT.class);
	}

	getJavaFiles(userName){
		return this.getFilesByType(userName, FT.java);
	}
}

module.exports = new HomeManager();
