import { User, UserManager } from './'

const name = process.argv[2]

if (!name) {
  console.log("Create user but user name is not provided.")
  process.exit(-1)
}

const passwd = process.argv[3] | name

UserManager.init().then(async () => {
  // await UserManager.createUser(name, passwd)
  console.log(`Create user ${name}`)
})

process.exit(0)
