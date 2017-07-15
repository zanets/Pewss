import bcrypt from 'bcrypt'

class Encrypt {
  constructor () {
    this.salt = bcrypt.genSaltSync(10)
  }

  enc (pwd) {
    return bcrypt.hashSync(pwd, this.salt)
  }

  compare (pwd, hash) {
    return bcrypt.compare(pwd, hash)
  }
}

module.exports = new Encrypt()
