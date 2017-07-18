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
import {
  JobManager,
  SimJob,
  CompJob,
  StoreJob,
  ReadJob,
  ModUserJob
} from './Jobs'

const APP = Express()
const RTR = Express.Router()
const PORT = 8081

const Server = https.createServer(Secrets.TLS, APP).listen(PORT, () => {
  log(`Https server listening on port ${PORT}.`, 'info')
})

JobManager.register(SimJob, CompJob, StoreJob, ReadJob, ModUserJob)

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

RTR.route('/users/:uname/profile')
  /* get user name */
  .get((req, res, next) => {
    res.status(200).send(req.user.Name)
  })
  /* update user profile */
  .patch(async (req, res) => {
    const uname = req.pewss.user.getName()
    JobManager.add(new ModUserJob(uname, {
      $setPasswd: req.body.passwd
    }), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

const getAllClassFiles = (type, env, uname) => {
  if (type === fTypes.Class) {
    return UserManager.getClassFiles(uname)
      .concat(SimController.getBuiltin(env))
  } else if (type === fTypes.Java) {
    return UserManager.getJavaFiles(uname)
  }
}

RTR.route('/users/:uname/files/:type')
  /* get file list */
  .get((req, res, next) => {
    const uname = req.pewss.user.getName()
    res.status(200).json(getAllClassFiles(req.params.type, req.query.env, uname))
  })
  /* create new file */
  .post(async (req, res) => {
    const User = req.pewss.user
    JobManager.add(new StoreJob(User.getName(), req.body), async (result) => {
      res.status(200).json(result)
      await User.scanHome()
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/users/:uname/files/source/:fname')
  /* get file content */
  .get(async (req, res) => {
    const uname = req.pewss.user.getName()
    JobManager.add(new ReadJob(uname, req.query), async (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(404).send(result)
    })
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
    const uname = req.pewss.user.getName()
    JobManager.add(new StoreJob(uname, req.body), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/users/:uname/files/public/:fname')
  /* add public file */
  .patch(async (req, res) => {
    const uname = req.pewss.user.getName()
    JobManager.add(new ModUserJob(uname, {
      $addPub: {
        type: req.body.fType,
        cate: req.body.fCate,
        name: req.body.fName
      }
    }), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* remove public file */
  .delete(async (req, res) => {
    const uname = req.pewss.user.getName()
    JobManager.add(new ModUserJob(uname, {
      $removePub: {
        type: req.body.fType,
        cate: req.body.fCate,
        name: req.body.fName
      }
    }), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
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
