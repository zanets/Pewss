import Express from 'express';
import Colors from 'colors';
import BodyParser from 'body-parser';
import Compression from 'compression';
import Passport from 'passport';
import Session from 'express-session';
import Https from 'https';

import SSLController from './SSLController.js';
import SimController from './SimController.js';
import UserManager from './UserManager.js';

import JSON_strategy from './Passport/Json.js';

// initialize modules and variables
const CWD = require('process').cwd();
const APP = Express();
const PORT = 8083;

JSON_strategy(Passport, UserManager.getUsers());

// current express not support https.
Https.createServer(SSLController, APP).listen(PORT, () => {
    console.log(`\n[Server] Https server listening on port ${PORT}.`.green);
});

// insert middleware
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

APP.use('/build', Express.static(`${CWD}/Client/build`));
APP.use('/vs', Express.static(`${CWD}/node_modules/monaco-editor/min/vs`));
APP.use('/node_modules', Express.static(`${CWD}/node_modules`));
APP.use('/', Express.static(`${CWD}/Client/build`));

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
    res.status(200).sendFile(`${CWD}/Client/Index.html`);
});

APP.get('/', isLogin, (req, res) => {
    res.redirect('/index');
});

APP.get('/login', (req, res) => {
    res.status(200).sendFile(`${CWD}/Client/Login.html`);
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

const getUser = (req) => {
    return UserManager.getUser(req.user.name);
};

APP.get('/api/uses/class', isLogin, (req, res) => {
    const user = getUser(req);
    if(user === null)
        res.sendStatus(401);

    const files = user.getClassFiles();
    res.status(200).json(files);
});

APP.get('/api/uses/source', isLogin, (req, res) => {
    const user = getUser(req);
    if(user === null)
        res.sendStatus(401);

    const files = user.getSourceFiles();
    res.status(200).json(files);
});

APP.post('/api/uses/simulate', isLogin, (req, res) => {
    SimController.simulate({
        generator: req.body.generator,
        scheduler: req.body.scheduler,
        simulator: req.body.simulator,
        platform: req.body.platform,
        settings: req.body.settings
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

// get source code
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

/*
APP.patch("/api/users/public/:public_target", (req, res) => {
    UserManager.add_public(req.body.path, req.body.owner, req.body.category);
    UserManager.load_users();
    res.sendStatus(200);
});

APP.delete("/api/users/public/:public_target", (req, res) => {
    UserManager.del_public(req.body);
    res.sendStatus(200);
});
*/
