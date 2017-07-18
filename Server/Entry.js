import Express from 'express'
import BodyParser from 'body-parser'
import Compression from 'compression'
import Passport from 'passport'
import Session from 'express-session'
import https from 'https'
import helmet from 'helmet'

import Secrets from './Secrets.js'
import SimController from './SimController.js'
import UserManager from './UserManager.js'
import { BaseDir, log } from './Utils.js'
import { PewssAPI, isLogin, writeLog } from './MiddleWare.js'
import LocalPass from './Passport/LocalPass.js'
import {fTypes} from './File.js'
import {JobManager} from './JobManager.js'
import {SimJob, CompJob} from './Job.js'

const APP = Express()
const RTR = Express.Router()
const PORT = 8081

const Server = https.createServer(Secrets.TLS, APP).listen(PORT, () => {
  log(`Https server listening on port ${PORT}.`, 'info')
})

JobManager.register(SimJob, CompJob)

APP.use(helmet())
APP.use(Session(Secrets.Session))
APP.use(BodyParser.json())
APP.use(BodyParser.urlencoded({ extended: true }))
APP.use(Compression())
APP.use(Passport.initialize())
APP.use(Passport.session())
APP.use('/build', Express.static(`${BaseDir}/Client/build`))
APP.use('/vs', Express.static(`${BaseDir}/node_modules/monaco-editor/min/vs`))
APP.use('/node_modules', Express.static(`${BaseDir}/node_modules`))
APP.use('/', Express.static(`${BaseDir}/Client/build`))
APP.use('/doc-kernel', Express.static(`${BaseDir}/Server/Sim/env/kernel.doc`))
APP.use('/doc-workflow', Express.static(`${BaseDir}/Server/Sim/env/workflow.doc`))

UserManager.init().then(async () => {
  await UserManager.loadUsers()
  UserManager.createUsers()
  const Users = UserManager.getUsers()
  for (const user in Users) {
    await Users[user].scanHome()
    Users[user].restore()
  }
  LocalPass(Passport, Users)
})

APP.all('/*', PewssAPI, writeLog)

APP.get('/index', isLogin, (req, res) => {
  res.status(200).sendFile(`${BaseDir}/Client/Index.html`)
})

APP.get('/', isLogin, (req, res) => {
  res.redirect('/index')
})

APP.get('/login', (req, res) => {
  res.status(200).sendFile(`${BaseDir}/Client/Login.html`)
})

APP.post('/login', Passport.authenticate('json'), (req, res) => {
  res.status(200).send('/index')
})

APP.get('/logout', isLogin, (req, res) => {
  req.logout()
  res.status(200).send('/login')
})

RTR.param(['uname', 'type', 'fname', 'info'], (req, res, next, id) => {
  next()
})

RTR.all('*', isLogin)

RTR.route('/users/:info')
  /* get user name */
  .get((req, res, next) => {
    res.status(200).send(req.user.Name)
  })
  /* update user profile */
  .post(async (req, res) => {
    const User = req.pewss.user
    await UserManager.modUser(User.getName(), {
      $updatePassword: req.body.passwd
    })
    res.sendStatus(200)
  })

RTR.route('/users/:uname/files/:type')
  /* get file list */
  .get((req, res, next) => {
    const User = req.pewss.user
    let resFiles = null
    if (req.params.type === fTypes.Class) {
      resFiles = UserManager.getClassFiles(User.getName())
      resFiles = resFiles.concat(SimController.getBuiltin(req.query.env))
    } else if (req.params.type === fTypes.Java) {
      resFiles = UserManager.getJavaFiles(User.getName())
    }
    res.status(200).json(resFiles)
  })
  /* create new file */
  .post(async (req, res) => {
    const User = req.pewss.user
    try {
      await User.newFile(
      req.body.fCate,
      req.body.fName,
      req.body.fContent
    )
      await User.scanHome()
      res.status(200).send('Save complete')
    } catch (err) { res.status(500).send(err.msg) }
  })

RTR.route('/users/:uname/files/source/:fname')
  /* get file content */
  .get(async (req, res) => {
    const User = req.pewss.user
    const content = await User.getFileContent(req.query.fCate, req.query.fName)
    const isPub = UserManager.isPub(
      req.query.fOwner,
      fTypes.Class,
      req.query.fCate,
      req.query.fName
    )
    if (content) {
      res.status(200).json({ data: content, isPub })
    } else { res.sendStatus(404) }
  })
  /* compile */
  .post(async (req, res) => {
    const User = req.pewss.user
    JobManager.add(new CompJob(req.body), async (result) => {
      res.status(200).json(result)
      await User.scanHome()
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* update file content */
  .patch(async (req, res) => {
    const User = req.pewss.user
    try {
      await User.setFileContent(
        req.body.fCate,
        req.body.fName,
        req.body.fContent
      )
      res.status(200).send('Save complete')
    } catch (err) { res.status(500).send(err.msg) }
  })

RTR.route('/users/:uname/files/public/:fname')
  /* add public file */
  .patch(async (req, res) => {
    const User = req.pewss.user
    try {
      await UserManager.modUser(User.getName(), {
        $addPub: {
          type: req.body.fType,
          cate: req.body.fCate,
          name: req.body.fName
        }
      })
      res.sendStatus(200)
    } catch (err) { res.status(500).send(err.msg) }
  })
  /* remove public file */
  .delete(async (req, res) => {
    const User = req.pewss.user
    await UserManager.modUser(User.getName(), {
      $removePub: {
        type: req.body.fType,
        cate: req.body.fCate,
        name: req.body.fName
      }
    })
    res.sendStatus(200)
  })

RTR.route('/sim')
  /* get supported env */
  .get((req, res, next) => {
    res.status(200).json(SimController.getEnvs())
  })
  /* simulate */
  .post(async (req, res) => {
    JobManager.add(new SimJob(req.body), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

APP.use('/api', RTR)
