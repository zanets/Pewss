import Express from 'express';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import Https from 'https';

import SSLManager from './SSLManager.js';
import SimController from './SimController.js';
import UserManager from './UserManager.js';
import HomeManager from './HomeManager.js';
import {FT, BaseDir} from './Utils.js';
import JSON_strategy from './Passport/Json.js';
import Logger from  './Logger.js';
// initialize modules and variables

const APP = Express();
const PORT = 8081;


UserManager.init().then(async () => {
	const Users  = UserManager.getUsers();

	for(const user in Users)
		await HomeManager.scan(user);
	JSON_strategy(Passport, Users);
});

// current express not support https.
Https.createServer(SSLManager, APP).listen(PORT, () => {
	Logger.info(`Https server listening on port ${PORT}.`);
});

// use middleware
APP.use(Session({
	secret: 'dknfbfndmdkefnj',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: true }
}));

APP.use(BodyParser.json());
APP.use(BodyParser.urlencoded({ extended: true }));
APP.use(Compression());
APP.use(Passport.initialize());
APP.use(Passport.session());

APP.use('/build', Express.static(`${BaseDir}/Client/build`));
APP.use('/vs', Express.static(`${BaseDir}/node_modules/monaco-editor/min/vs`));
APP.use('/node_modules', Express.static(`${BaseDir}/node_modules`));
APP.use('/', Express.static(`${BaseDir}/Client/build`));
APP.use('/doc-kernel', Express.static(`${BaseDir}/Server/Sim/env/kernel.doc`));
APP.use('/doc-workflow', Express.static(`${BaseDir}/Server/Sim/env/workflow.doc`));

// ======================
// html request
//

/*
    => ( / -> /index ) --isLoggin-- true  => /index
                       --isLoggin-- false => /login

    => /login => --authenticate-- success => /index
                 --authenticate-- fail    => /login
*/

const isLogin = (req, res, next) => {
	if(req.isAuthenticated())
		return next();
	else
		res.redirect('/login');
};

const getJPath = (env, meta) => {
	if(meta.owner === 'admin')	{
		return SimController.getBultinJPath(env, meta);
	}	else 	{
		return HomeManager.getJPath(meta);
	}
};

const isUser = (req) => {
	return UserManager.isUserExist(req.user.name)
		? req.user.name
		: false;
};

const log = (req, level, msg, code) => {
	const name = req.user ? req.user.name : 'unknown';
	msg = `${name} - ${req.connection.remoteAddress} - ${msg} - ${code}`;
	
	if(level === 'info')		{
		Logger.info(msg);
	}	else if(level === 'warn')		{
		Logger.warn(msg);
	}	else if(level === 'error')		{
		Logger.error(msg);
	}	else if(level === 'fatal')		{
		Logger.fatal(msg);
	}
};

APP.get('/index', isLogin, (req, res) => {
	log(req, 'info', 'get /index', 200);
	res.status(200).sendFile(`${BaseDir}/Client/Index.html`);
});

APP.get('/', isLogin, (req, res) => {
	log(req, 'info', 'get /', 200);
	res.redirect('/index');
});

APP.get('/login', (req, res) => {
	log(req, 'info', 'get /login', 200);
	res.status(200).sendFile(`${BaseDir}/Client/Login.html`);
});

APP.get('/api/uses/username', (req, res) => {
	log(req, 'info', 'get /api/uses/username', 200);
	res.status(200).send({name: req.user.name});
});

// ======================
// authentication api
//

APP.post('/login', Passport.authenticate('json'), (req, res) => {
	log(req, 'info', 'post /login', 200);
	res.status(200).send({
		redirect: '/index'
	});
});

APP.get('/logout', isLogin, (req, res) => {
	log(req, 'info', 'get /logout', 200);
	req.logout();
	res.status(200).send({
		redirect: '/login'
	});
});

// ======================
// api for uses
//
// always check user first

/* no request data */
APP.get('/api/uses/envs', isLogin, (req, res) => {

	const usrName = isUser(req);

	if(usrName){
		log(req, 'info', 'get /api/uses/envs', 200);
		res.status(200).json(SimController.getEnvs());
	}	else{
		log(req, 'warning', 'get /api/uses/envs', 200);
		res.sendStatus(401);
	}
});

/* no request data */
APP.get('/api/uses/class', isLogin, (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		log(req, 'warning', 'get /api/uses/class', 401);
		res.sendStatus(401);
		return;
	}

	let resFiles = HomeManager.getClassFiles(
		usrName,
		UserManager.getClassPublishes()
	);

	resFiles = resFiles.concat(SimController.getBuiltin(req.query.env));
	log(req, 'warning', 'get /api/uses/class', 200);
	res.status(200).json(resFiles);

});

/* no request data */
APP.get('/api/uses/source', isLogin, (req, res) => {

	const usrName = isUser(req);

	if(usrName){
		log(req, 'info', 'get /api/uses/source', 200);
		res.status(200).json(HomeManager.getJavaFiles(usrName));
	}	else {
		log(req, 'warning', 'get /api/uses/source', 401);
		res.sendStatus(401);
	}

});

/* request data: { env, generator, scheduler, simulator, platform, argums } */
APP.post('/api/uses/simulate', isLogin, async (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		log(req, 'info', 'post /api/uses/simulate', 401);
		res.sendStatus(401);
		return;
	}

	await SimController.simulate({
		env: req.body.env,
		generator: getJPath(req.body.env, req.body.generator),
		scheduler: getJPath(req.body.env, req.body.scheduler),
		simulator: getJPath(req.body.env, req.body.simulator),
		platform: getJPath(req.body.env, req.body.platform),
		argums: req.body.argums
	}).then(_res => {
		log(req, 'info', `post /api/uses/simulate ${JSON.stringify(req.body)}`, 200);
		res.status(200).json(_res);
	}).catch(err => {
		log(req, 'error', `post /api/uses/simulate ${JSON.stringify(req.body)}`, 500);
		res.status(500).json(err);
	});
});

// compile source file
/* request data: {filename, category, owner} */
APP.post("/api/uses/compile", isLogin, async (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		res.sendStatus(401);
		return;
	}
	await SimController.compile({
		env: req.body.env,
		name: req.body.name,
		category: req.body.category,
		owner: req.body.owner
	}).then(async (_res) => {
		log(req, 'info', `post /api/uses/simulate ${JSON.stringify(req.body)}`, 200);
		res.status(200).json(_res);
		await HomeManager.scan(usrName);
	}).catch(err => {
		log(req, 'error', `post /api/uses/simulate ${JSON.stringify(req.body)}`, 500);
		res.status(500).json(err);
	});
});

/* request data: { filename, category, owner } */
APP.get('/api/uses/source_content', isLogin, async (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		res.sendStatus(401);
		return;
	}

	const content = await HomeManager.getFileContent({
		name: req.query.name,
		category: req.query.category,
		owner: req.query.owner,
		type: FT.java
	});
	const isPublish = UserManager.isPublish(
		req.query.owner,
		req.query.category,
		FT.class,
		req.query.name
	);
	if(content){
		res.status(200).json({data: content, isPub: isPublish});
	}	else {
		res.sendStatus(404);
	}
});

APP.param('file_name', (req, res, next, id) => {
	next();
});

// update source file
/* request data: {filename, category, content, owner} */
APP.patch("/api/uses/source_content/:file_name", isLogin, async (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		res.sendStatus(401);
		return;
	}

	await HomeManager.setFileContent({
		name: req.body.name,
		category: req.body.category,
		content: req.body.content,
		owner: req.body.owner,
		type: FT.java
	}).then(_res => {
		res.status(200).send('Save complete');
	}).catch(err => {
		res.status(500).send(err.msg);
	});
});

// create new source file
/* request data: {filename, category, content, owner} */
APP.post("/api/uses/source_content/:file_name", isLogin, async (req, res) => {

	const usrName = isUser(req);
	if(!usrName){
		res.sendStatus(401);
		return;
	}

	await HomeManager.newFile({
		name: req.body.name,
		category: req.body.category,
		content: req.body.content,
		owner: req.body.owner,
		type: FT.java
	}).then(async (_res) => {
		res.status(200).send('Save complete');
		await HomeManager.scan(usrName);
	}).catch(err => {
		res.status(500).send(err.msg);
	});
});

// ======================
// api for database
//

APP.param('target', (req, res, next, id) => {
	next();
});


APP.patch("/api/users/public/:target", async (req, res) => {

	const usrName = isUser(req);

	if(usrName){
		await UserManager.modUser(usrName,
			{$addPublish:
                {type: req.body.type, category: req.body.category, name:req.body.name}
			}
        );
		res.sendStatus(200);
	}	else {
		res.sendStatus(401);
	}

});

APP.delete("/api/users/public/:target", async (req, res) => {

	const usrName = isUser(req);

	if(usrName){
		await UserManager.modUser(usrName,
			{$removePublish:
                {type: req.body.type, category: req.body.category, name:req.body.name}
			}
        );
		res.sendStatus(200);
	}	else {
		res.sendStatus(401);
	}

});

APP.patch("/api/users/password/:target", async (req, res) => {
	const usrName = isUser(req);
	if(usrName){
		await UserManager.modUser(usrName,
            {$updatePassword: req.body.password}
        );
		res.sendStatus(200);
	}	else {
		res.sendStatus(401);
	}
});
