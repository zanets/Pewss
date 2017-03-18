import HomeController from './HomeController.js';

import assert from 'assert';
import {  pErrHandler,  FT,  HomeDir } from './Utils.js';
class HomeManager{

    constructor(){
		this.UsersFiles = {};
	}

    async scan(usrName){
        await HomeController.scan(usrName).then(Files => {
            this.UsersFiles[usrName] = Files;
        }).catch(pErrHandler);
    }

    getFile(usrName, type, category, fileName){
        const fltFiles = this.getFilesByType(usrName, type);
        const file = fltFiles.find(f => {
            return (f.category === category && f.name === fileName);
        });

        return file ? file : null;
    }

    getFilesByType(usrName, type){
        const usrFiles = this.UsersFiles[usrName];
        assert.ok(usrFiles !== undefined, `User ${usrName} NOT exist`);
        return usrFiles.filter(f => f.type === type);
    }

    async getFileContent(meta){
        const path = this.getPath(meta);
        return await HomeController.readFile(path).catch(pErrHandler);
    }

    async setFileContent(meta){
        const path = this.getPath(meta);
        return await HomeController.writeFile(path, meta.content).catch(pErrHandler);
    }

    async newFile(meta){
        const path = `${HomeDir}/${meta.owner}/${meta.category}/${meta.name}.java`;
        return await HomeController.writeFile(path, meta.content).catch(pErrHandler);
    }

    getClassFiles(usrName, publishes){
        publishes = publishes || [];
        let res = [];
        // private
        this.getFilesByType(usrName, FT.class).forEach(f => {
            res.push({name: f.name, category: f.category, owner: f.owner,type: f.type});
        });

        // publish
        for(const publish of publishes){
            if(publish.owner === usrName)
                continue;

            const otherFiles = this.getFilesByType(publish.owner, FT.class);
            for(const f of otherFiles){
                if(f.category === publish.category && f.name === publish.name)
                    res.push({name: f.name, category: f.category, owner: f.owner, type: f.type});
            }
        }
        return res;
	}

    // Currently, publish source file is not allow
	getJavaFiles(usrName, publics){
        publics = publics || [];
        let res = [];
        // private
        this.getFilesByType(usrName, FT.java).forEach(f => {
            res.push({name: f.name, category: f.category, owner: f.owner, type: f.type, isPub: true});
        });

        return res;
	}



    // meta: {type, owner, category, name}
    getJPath(meta){

        const fltFiles = this.getFilesByType(meta.owner, meta.type);
        const tarFile = fltFiles.find(f =>
            f.category === meta.category && f.name === meta.name
        );
        return tarFile === undefined ? null : tarFile.jpath;
    }

    // meta: {type, owner, category, filename}
    getPath(meta){
        const fltFiles = this.getFilesByType(meta.owner, meta.type);
        const tarFile = fltFiles.find(f =>
            f.category === meta.category && f.name === meta.name
        );
        return tarFile === undefined ? null : tarFile.path;
    }

}

module.exports = new HomeManager();
