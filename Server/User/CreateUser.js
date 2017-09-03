import { User, UserManager } from './'

const name = process.argv[2]

if (!name) {
  console.log("Create user but user name is not provided.")
  process.exit(-1)
}

const passwd = process.argv.length >= 4
  ? process.argv[3]
  : name

UserManager.init().then(async () => {
  await UserManager.createUser(name, passwd)
  console.log(`Create user ${name} with passwd ${passwd}`)
  process.exit(0)
})

