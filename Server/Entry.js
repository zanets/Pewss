import Express from 'express';
import Colors from 'colors';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import Https from 'https';

import SSLManager from './SSLManager.js';
import SimController from './SimController.js';
import UserManager from './UserManager.js';
import {FT, FC, BaseDir} from './Utils.js';

import JSON_strategy from './Passport/Json.js';

// initialize modules and variables
const APP = Express();
const PORT = 8083;

JSON_strategy(Passport, UserManager.getUsers());

// current express not support https.
Https.createServer(SSLManager, APP).listen(PORT, () => {
    console.log(`\n[Server] Https server listening on port ${PORT}.`.green);
});

// use middleware
APP.use(Session({
  secret: 'dknfbfndmdkefnj',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))

APP.use(BodyParser.json());
APP.use(BodyParser.urlencoded({ extended: true }));
APP.use(Compression());
APP.use(Passport.initialize());
APP.use(Passport.session());

APP.use('/build', Express.static(`${BaseDir}/Client/build`));
APP.use('/vs', Express.static(`${BaseDir}/node_modules/monaco-editor/min/vs`));
APP.use('/node_modules', Express.static(`${BaseDir}/node_modules`));
APP.use('/', Express.static(`${BaseDir}/Client/build`));

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

APP.get('/index', isLogin, (req, res) => {
    res.status(200).sendFile(`${BaseDir}/Client/Index.html`);
});

APP.get('/', isLogin, (req, res) => {
    res.redirect('/index');
});

APP.get('/login', (req, res) => {
    res.status(200).sendFile(`${BaseDir}/Client/Login.html`);
});

// ======================
// authentication api
//

APP.post('/login', Passport.authenticate('json'), (req, res) => {
    res.status(200).send({
        redirect: '/index'
    });
});

APP.get('/logout', isLogin, (req, res) => {
    req.logout();
    res.redirect('/login');
});

// ======================
// api for uses
//
// always check user first

const isUser = (req) => {
    return UserManager.isUserExist(req.user.name) ?
        req.user.name :
        false;
};


/* no request data */
APP.get('/api/uses/class', isLogin, (req, res) => {

	const _u = isUser(req);

    if(_u)
        res.status(200).json(UserManager.getClassFiles(_u));
    else
        res.sendStatus(401);
});

/* no request data */
APP.get('/api/uses/source', isLogin, (req, res) => {

	const _u = isUser(req);

    if(_u)
        res.status(200).json(UserManager.getJavaFiles(_u));
    else
        res.sendStatus(401);
});

/* request data: { env, generator, scheduler, simulator, platform, argums } */
APP.post('/api/uses/simulate', isLogin, async (req, res) => {

	const _u = isUser(req);

    await SimController.simulate({
        env: req.body.env
        generator: req.body.generator,
        scheduler: req.body.scheduler,
        simulator: req.body.simulator,
        platform: req.body.platform,
        argums: req.body.argums
    }, (err, stdout, stderr) => {
        if (err){
            console.log(`${err},${stdout},${stderr}`);
            res.status(500).json({
                err, stdout, stderr
            });
        } else {
            res.status(200).json({stdout,stderr});
        }
    });
});

/* request data: { filename, category, owner } */
APP.get('/api/uses/source_content', isLogin, (req, res) => {
    SimController.getSrcContent({
        name: req.query.name,
        category: req.query.category,
        owner: req.query.owner
    }, (err, data) => {
        if(err){
            console.trace(err.message);
            res.status(500).json({err});
        } else {
            res.status(200).json({data});
        }
    });
});

APP.param('file_name', (req, res, next, id) => {
  next();
});

// update source file
/* request data: {filename, category, content, owner} */
APP.patch("/api/uses/source_content/:file_name", isLogin, (req, res) => {
    SimController.setSrcContent({
        name: req.body.name,
        category: req.body.category,
        content: req.body.content,
        owner: req.body.owner
    }, (err, data) => {
        if(err){
            console.trace(err.message);
            res.status(500).json({err});
        } else {
            res.sendStatus(200);
        }
    });
});

// create new source file
/* request data: {filename, category, content, owner} */
APP.post("/api/uses/source_content/:file_name", isLogin, (req, res) => {
    SimController.newFile({
        name: req.body.name,
        category: req.body.category,
        content: req.body.content,
        owner: req.body.owner
    }, (err, data) => {
        if(err){
            console.trace(err.message);
            res.status(500).json({err});
        } else {
            res.sendStatus(200);
        }
    });
});

// compile source file
/* request data: {filename, category, owner} */
APP.post("/api/uses/compile", isLogin, (req, res) => {
    SimController.compile({
        name: req.body.name,
        category: req.body.category,
        owner: req.body.owner
    }, (err, stdout, stderr) => {
        if (err){
            res.status(500).json({err, stdout, stderr});
        } else{
            res.sendStatus(200);
        }
    });
});

// ======================
// api for database
//

APP.param('public_target', (req, res, next, id) => {
  next();
});


APP.patch("/api/users/public/:public_target", (req, res) => {

    const _u = isUser(req);

    if(_u){
        await UserManager.modUser(testUsers[0],
            {$addPublicFile:
                {type: FT.class, category: 'a', name:'a-name'}
            }
        );
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

});

APP.delete("/api/users/public/:public_target", (req, res) => {

    const _u = isUser(req);

    if(_u){
        await UserManager.modUser(testUsers[0],
            {$removePublicFile:
                {type: FT.class, category: 'a', name:'a-name'}
            }
        );
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

});
