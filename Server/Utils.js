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

const BaseDir = __dirname;

const HomeDir = `${BaseDir}/Home`;

const ignoreFiles = () => {
	['.DS_Store'].forEach(ignore => {
		files = files.filter(file => {
			ignore === file.name
		});
	});
	return files;
};

const getSimArgument = () => {
	let argvs = '';
	Object.keys(client).forEach(key => {
		const argv = client[key];

		argvs += `${key}=`;

		if(argv.constructor === Array)
			for(const v of argv)
				argvs += `${v},`;
		else
			argvs += argv;

		argvs += '\r\n';
	});
};

const pErrHandler = (err) => {
	console.error(err);
};

const eErrHandler = (err) => {
	console.error(err);
	process.exit(-1);
};

const thErrHandler = (err) => {
	throw err;
};

module.exports = {
	FT,
	FC,
	BaseDir,
	HomeDir,
	ignoreFiles,
	pErrHandler,
	eErrHandler,
	thErrHandler
};
