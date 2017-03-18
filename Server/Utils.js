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
import process from "process";
const BaseDir = process.cwd();
const ServerDir = `${BaseDir}/Server`;
const ClientDir = `${BaseDir}/Client`;
const HomeDir = `${ServerDir}/Home`;
const SimDir = `${ServerDir}/Sim`;

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
	ClientDir,
	SimDir,
	pErrHandler,
	eErrHandler,
	thErrHandler
};
