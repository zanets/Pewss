import {execFile as exec} from 'child_process';
import UserManager from './UserManager.js';
import envConfig from './Sim/envConfig.js';
import Utils from './Utils.js';

class SimController {

	constructor(){

	}

	simulate(pa, cb){
		const simLibrary = `${Utils.getSimLibrary()}`;
		const simArgument = ``;

		const parameter = `-cp ${library} com.use.CLILauncher --generator ${pa.generator} --scheduler ${pa.scheduler} --simulator ${pa.simulator} --platform ${pa.platform}`;
		const java = exec('java', parameter.split(' '), {encoding: 'utf-8'}, cb);
		java.stdin.write(Utils.getSimArgument(pa.settings));
		java.stdin.end();
	}

	compile(){
		
	}



}

module.exports = new SimController();
