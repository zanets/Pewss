import jq from 'jquery'

class WebAPI {
  getEnvs (success, fail, always) {
    jq.get('/api/sim', success).fail(fail).always(always)
  }

  getClassList (env, success, fail, always) {
    jq.get(`/api/users/uname/files/class`, {
      env
    }, success).fail(fail).always(always)
  }

  getSourceList (success, fail, always) {
    jq.get(`/api/users/uname/files/java`, success).fail(fail).always(always)
  }

  simulate (id, env, gen, sche, sim, plat, argu, success, fail, always) {
    jq.post('/api/sim', {
      id, env, gen, sche, sim, plat, argu
    }, success).fail(fail).always(always)
  }

  getSourceCode (fCate, fName, fOwner, success, fail, always) {
    jq.get(`/api/users/${fName}/files/source/${fName}`, {
      fCate, fName, fOwner
    }, success).fail(fail).always(always)
  }

  setSourceCode (fName, fCate, fContent, fOwner, success, fail, always) {
    jq.ajax({
      url: `/api/users/${fName}/files/source/${fName}`,
      data: { fName, fCate, fContent, fOwner },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }

  newFile (fName, fCate, fContent, fOwner, success, fail, always) {
    jq.post(`/api/users/${fName}/files/source`, {
      fName, fCate, fContent, fOwner
    }, success).fail(fail).always(always)
  }

  deleteFile (fName, fCate, success, fail, always) {
    jq.ajax({
      url: `/api/users/${fName}/files/all`,
      data: { fName, fCate },
      type: 'delete'
    }).done(success).fail(fail).always(always)
  }

  compile (env, fName, fCate, fOwner, success, fail, always) {
    jq.post(`/api/users/${fName}/files/source/${fName}`, {
      env, fName, fCate, fOwner
    }, success).fail(fail).always(always)
  }

  addPublish (fName, fCate, fType, success, fail, always) {
    jq.ajax({
      url: `/api/users/${fName}/files/public/${fName}`,
      data: { fName, fCate, fType },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }

  deletePublish (fName, fCate, fType, success, fail, always) {
    jq.ajax({
      url: `/api/users/${fName}/files/public/${fName}`,
      data: { fName, fCate, fType },
      type: 'delete'
    }).done(success).fail(fail).always(always)
  }

  logout () {
    jq.get('/logout', (data) => {
      window.location = data
    })
  }

  login (name, passwd, success) {
    jq.post('/login', {name, passwd}, success)
  }

  updatePassword (name, passwd, success, fail, always) {
    jq.ajax({
      url: `/api/users/${name}/profile`,
      data: { passwd },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }
}

export default new WebAPI()
