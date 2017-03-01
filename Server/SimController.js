import {execFile as exec} from 'child_process';
import UserManager from './UserManager.js';
import envConfig from './Sim/envConfig.js';
import Utils from './Utils.js';

class SimController {

	constructor(){

	}

	async simulate(data, cb){
		const simLibrary = this.getSimLibrary(data.env);
		const simArgument = this.getSimArgument(data.arguments);

		const parameter = `-cp ${simLibrary} com.use.CLILauncher --generator ${data.generator} --scheduler ${data.scheduler} --simulator ${data.simulator} --platform ${data.platform}`;

		const java = exec('java', parameter.split(' '), {encoding: 'utf-8'}, cb);

		java.stdin.write(simArgument);
		java.stdin.end();
	}

	compile(){

	}

	getSimArgument(arguments){
		let argvs = '';
		Object.keys(arguments).forEach(key => {
			const argv = arguments[key];

			argvs += `${key}=`;

			if(argv.constructor === Array)
				for(const v of argv)
					argvs += `${v},`;
			else
				argvs += argv;

			argvs += '\r\n';
		});
		return argvs;
	}

	getSimLibrary(env){

	}


}

module.exports = new SimController();
