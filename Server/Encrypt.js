import bcrypt from 'bcrypt-nodejs'

class Encrypt {
  enc (pwd) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10))
  }

  async compare (pwd, hash) {
    const res = await bcrypt.compare(pwd, hash)
    return res
  }
}

module.exports = new Encrypt()
