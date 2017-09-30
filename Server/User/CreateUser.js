import { UserManager } from './'
require('../Utils.js')()
const name = process.argv[2]

if (!name) {
  console.log('Create user but user name is not provided.')
  process.exit(-1)
}

const passwd = process.argv[3]

UserManager.init().then(async () => {
  await UserManager.loadUsers()
  UserManager.restoreUsers()
  await UserManager.createUser(name, passwd)
  console.log(`Create user ${name} with passwd ${passwd}`)
  process.exit(0)
})
