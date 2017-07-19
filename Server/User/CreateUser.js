import UserManager from './UserManager.js'
/*
const Users = [
'ACS102119',
'ACS102121',
'BCS105101',
'BCS105104',
'BCS105105',
'BCS105106',
'BCS105108',
'BCS105111',
'BCS105112',
'BCS105113',
'BCS106101'
];
*/
const Users = [
  'test',
  'darg'
]

UserManager.init().then(async () => {
  for (const name of Users) {
    await UserManager.createUser(name, name)
    console.log(`Create user ${name}`)
  }
})

process.exit(0)
