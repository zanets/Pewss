import {spawn} from 'child_process';
import {SimDir, HomeDir} from './Utils.js';
import envConf from './Sim/envConfig.json';

module.exports = class SimController 
{
	static simulate(data)	
	{
		const JavaArguments = `-cp ${ this.getEnvLibrary(data.env) } ` +
			'com.use.CLILauncher ' +
			`--generator ${data.generator} ` +
			`--scheduler ${data.scheduler} ` +
			`--simulator ${data.simulator} ` +
			`--platform ${data.platform}`;

		const javaProc = spawn('java', JavaArguments.split(' '));
		javaProc.stdin.write( this.getEnvArgument(data.argums) );
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

	static compile(data)	
	{
		const JavaArguments = '-Xlint:unchecked ' +
			`-cp ${ this.getEnvLibrary(data.env) } ` + 
			`${HomeDir}/${data.owner}/${data.category}/${data.name}.java`;
		
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

	static getEnvArgument(argums)	
	{
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

	static getEnvLibrary(env)	
	{

		const _libs = envConf[env].lib;
		
		let libs = '';
		
		for(const _lib of _libs)
			libs += `${SimDir}/env/${_lib}:`;
		
		libs += `${HomeDir}`;
		
		return libs;
	}

	static getEnvs()	
	{
		return Object.keys(envConf);
	}

	static getBuiltin(env)	
	{
		let resFiles = [];
		envConf[env].builtin.forEach(f => {
			resFiles.push({
				name: f.name,
				owner: f.owner,
				type: f.type,
				category: f.category
			});
		});
		return resFiles;
	}

	static getBultinJPath(env, meta)	
	{
		const target = envConf[env].builtin.find(f =>
			meta.name === f.name 
			&& meta.category === f.category
			&& meta.type === f.type
		);
	
		return (target === undefined) 
			? null 
			: target.jpath;
	}
};
