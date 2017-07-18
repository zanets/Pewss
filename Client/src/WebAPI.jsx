import jq from 'jquery'
class WebAPI {
  getClassList (env, success, fail, always) {
    jq.get(`/api/users/uname/files/class`, {
      env: env
    }, success).fail(fail).always(always)
  }

  getSourceList (success, fail, always) {
    jq.get(`/api/users/uname/files/java`, success).fail(fail).always(always)
  }

  simulate (env, gen, sche, sim, plat, arg, success, fail, always) {
    jq.post('/api/sim', {
      env: env,
      generator: gen,
      scheduler: sche,
      simulator: sim,
      platform: plat,
      argums: arg
    }, success).fail(fail).always(always)
  }

  getSourceCode (cate, name, owner, success, fail, always) {
    jq.get(`/api/users/${name}/files/source/${name}`, {
      fCate: cate,
      fName: name,
      fOwner: owner
    }, success).fail(fail).always(always)
  }

  setSourceCode (name, cate, content, owner, success, fail, always) {
    jq.ajax({
      url: `/api/users/${name}/files/source/${name}`,
      data: {
        fName: name,
        fCate: cate,
        fContent: content,
        fOwner: owner
      },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }

  newFile (name, cate, content, owner, success, fail, always) {
    jq.post(`/api/users/${name}/files/source`, {
      fName: name,
      fCate: cate,
      fContent: content,
      fOwner: owner
    }, success).fail(fail).always(always)
  }

  compile (env, name, cate, owner, success, fail, always) {
    jq.post(`/api/users/${name}/files/source/${name}`, {
      env: env,
      fName: name,
      fCate: cate,
      fOwner: owner
    }, success).fail(fail).always(always)
  }

  addPublish (name, cate, type, success, fail, always) {
    jq.ajax({
      url: `/api/users/${name}/files/public/${name}`,
      data: {
        fName: name,
        fCate: cate,
        fType: type
      },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }

  deletePublish (name, cate, type, success, fail, always) {
    jq.ajax({
      url: `/api/users/${name}/files/public/${name}`,
      data: {
        fName: name,
        fCate: cate,
        fType: type
      },
      type: 'delete'
    }).done(success).fail(fail).always(always)
  }

  logout () {
    jq.get('/logout', (data) => {
      window.location = data
    })
  }

  getUserName (success, fail, always) {
    jq.get('/api/users/name/profile', success).fail(fail).always(always)
  }

  updatePassword (name, password, success, fail, always) {
    jq.ajax({
      url: `/api/users/${name}/profile`,
      data: {
        passwd: password
      },
      type: 'patch'
    }).done(success).fail(fail).always(always)
  }
}

export default new WebAPI()
