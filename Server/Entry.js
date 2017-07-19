import Express from 'express'
import BodyParser from 'body-parser'
import Compression from 'compression'
import Passport from 'passport'
import Session from 'express-session'
import https from 'https'
import helmet from 'helmet'

import Secrets from './Secrets'
import { LocalStrategy } from './Passport'
import { SimController } from './Sim'
import { UserManager } from './User'
import { PewssAPI, isLogin, writeLog } from './MiddleWare.js'
import { fTypes } from './File'
import {
  JFileRead,
  JFileDelete,
  JFileStore,
  JUserMod,
  JCompile,
  JSimulation,
  JobManager
} from './Jobs'

require('./utils.js')()
const APP = Express()
const RTR = Express.Router()
const PORT = 8081

const Server = https.createServer(Secrets.TLS, APP).listen(PORT, () => {
  log(`Https server listening on port ${PORT}.`, 'info')
})
require('events').EventEmitter.prototype._maxListeners = 0
JobManager.register(
  JFileRead,
  JFileDelete,
  JFileStore,
  JUserMod,
  JCompile,
  JSimulation
)

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
  UserManager.restoreUsers()
  UserManager.getUsers().forEach(async u => {
    await u.scanHome()
    u.restore()
  })
  LocalStrategy(Passport)
})

APP.all('/*', writeLog)

APP.get('/index', isLogin, (req, res) => {
  res.status(200).sendFile(`${BaseDir}/Client/Index.html`)
})

APP.get('/', isLogin, (req, res) => {
  res.redirect('/index')
})

APP.get('/login', (req, res) => {
  res.status(200).sendFile(`${BaseDir}/Client/Login.html`)
})

APP.post('/login', Passport.authenticate('local'), (req, res) => {
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
    res.status(200).send(req.user.getName())
  })
  /* update user profile */
  .patch(async (req, res) => {
    const uid = req.user.getId()
    JobManager.add(new JUserMod(uid, {
      $setPasswd: req.body
    }), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

const getAllClassFiles = (type, env, uid) => {
  if (type === fTypes.Class) {
    return UserManager.getClassFiles(uid)
      .concat(SimController.getBuiltin(env))
  } else if (type === fTypes.Java) {
    return UserManager.getJavaFiles(uid)
  }
}

RTR.route('/users/:uname/files/:type')
  /* get file list */
  .get((req, res, next) => {
    const uid = req.user.getId()
    res.status(200).json(getAllClassFiles(req.params.type, req.query.env, uid))
  })
  /* create new file */
  .post(async (req, res) => {
    const User = req.user
    JobManager.add(new JFileStore(User.getId(), req.body), async (result) => {
      res.status(200).json(result)
      await User.scanHome()
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* delete file */
  .delete(async (req, res) => {
    const User = req.user
    JobManager.add(new JFileDelete(User.getId(), req.body), async (result) => {
      res.status(200).json(result)
      await User.scanHome()
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/users/:uname/files/source/:fname')
  /* get file content */
  .get(async (req, res) => {
    const uid = req.user.getId()
    JobManager.add(new JFileRead(uid, req.query), async (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(404).send(result)
    })
  })
  /* compile */
  .post(async (req, res) => {
    const User = req.user
    JobManager.add(new JCompile(req.body), async (result) => {
      res.status(200).json(result)
      await User.scanHome()
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* update file content */
  .patch(async (req, res) => {
    const uid = req.user.getId()
    JobManager.add(new JFileStore(uid, req.body), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

RTR.route('/users/:uname/files/public/:fname')
  /* add public file */
  .patch(async (req, res) => {
    const uid = req.user.getId()
    JobManager.add(new JUserMod(uid, {
      $addPub: req.body
    }), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* remove public file */
  .delete(async (req, res) => {
    const uid = req.user.getId()
    JobManager.add(new JUserMod(uid, {
      $removePub: req.body
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
    JobManager.add(new JSimulation(req.body), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })
  /* delete simulation job */
  .delete(async (req, res) => {
    JobManager.add(new JSimulation(req.body), (result) => {
      res.status(200).json(result)
    }, (result) => {
      res.status(500).send(result)
    })
  })

APP.use('/api', RTR)
