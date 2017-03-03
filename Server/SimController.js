import {spawn} from 'child_process';
import UserManager from './UserManager.js';
import {SimDir, HomeDir} from './Utils.js';
import envSettings from './Sim/envConfig.json';

module.exports = class SimController {

	static simulate(data){
		const envLibrary = this.getEnvLibrary(data.env);
		const envArgument = this.getEnvArgument(data.argums);
		const JavaArguments = `-cp ${envLibrary} com.use.CLILauncher --generator ${data.generator} --scheduler ${data.scheduler} --simulator ${data.simulator} --platform ${data.platform}`;
		console.log(`Simulate with [ library ] ${envLibrary} \n\t [ arguments ] ${envArgument}`);
		const javaProc = spawn('java', JavaArguments.split(' '));
		javaProc.stdin.write(envArgument);
		javaProc.stdin.end();

		return new Promise((res, rej) => {

			let _res = {status: null, msg: ''};

			javaProc.stdout.on("data", (chunk) => {
				_res.status = 'stdin';
				_res.msg += chunk;
			});

			javaProc.stderr.on("data", (chunk) => {
				_res.status = 'stderr';
				_res.msg += chunk;
			});

			javaProc.on('close', (code) => {
				res(_res);
			});

			javaProc.on('error', (code) => {
				rej(_res);
			});

		});
	}

	static compile(data){
		const envLibrary = this.getEnvLibrary(data.env);
		const JavaArguments = `-cp ${envLibrary} ${HomeDir}/${data.owner}/${data.category}/${data.name}.java`;
		console.log(JavaArguments);
		const javaProc = spawn('javac', JavaArguments.split(' '));
		return new Promise((res, rej) => {
			let _res = {status: null, msg: ''};

			javaProc.stdout.on("data", (chunk) => {
				_res.status = 'stdin';
				_res.msg += chunk;
			});

			javaProc.stderr.on("data", (chunk) => {
				_res.status = 'stderr';
				_res.msg += chunk;
			});

			javaProc.on('close', (code) => {
				res(_res);
			});

			javaProc.on('error', (code) => {
				rej(_res);
			});
		});
	}

	static getEnvArgument(argums){
		let argvs = '';
		Object.keys(argums).forEach(key => {
			const argv = argums[key];

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

	static getEnvLibrary(env){
		const _libs = envSettings[env].lib;
		let libs = '';
		for(const _lib of _libs)
			libs += `${SimDir}/env/${_lib}:`;
		libs += `${HomeDir}`;
		return libs;
	}

	static getEnvs(){
		return Object.keys(envSettings);
	}

	static getBuiltin(env){
		return envSettings[env].builtin;
	}
};
