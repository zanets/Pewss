import bcrypt from 'bcrypt-nodejs'

class Encrypt {
  enc (pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10))
  }

  compare (pwd, hash) {
    return bcrypt.compareSync(pwd, hash)
  }
}

module.exports = new Encrypt()
