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
        const path = this.getPath(usrName, FT.java, category, fileName);
        return await HomeScanner.readFile(path).catch(pErrHandler);
    }

    /* remove both class and source file */
    removeFile(usrName, category, fileName){
        // remove file

        // update this
    }

    getClassFiles(usrName, publishes){
        publishes = publishes || [];
        let res = [];
        // private
        res = res.concat(this.getFilesByType(usrName, FT.class));

        // publish
        for(const publish of publishes){
            if(publish.owner === usrName)
                continue;

            const otherFiles = this.getFilesByType(publish.owner, FT.class);
            for(const file of otherFiles){
                if(file.category === publish.category && file.name === publish.name)
                    res.push(file);
            }
        }
        return res;
	}

    // Currently, publish source file is not allow
	getJavaFiles(userName, publics){
        publics = publics || [];
        let res = [];
        // private
        res = res.concat(this.getFilesByType(userName, FT.java));

        return res;
	}

    getJPath(usrName, type, category, fileName){
        const fltFiles = this.getFilesByType(usrName, type);
        const tarFile = fltFiles.find(f =>
            f.category === category && f.name === fileName
        );
        return tarFile === undefined ? null : tarFile.jpath;
    }

    getPath(usrName, type, category, fileName){
        const fltFiles = this.getFilesByType(usrName, type);
        const tarFile = fltFiles.find(f =>
            f.category === category && f.name === fileName
        );
        return tarFile === undefined ? null : tarFile.path;
    }
}

module.exports = new HomeManager();
