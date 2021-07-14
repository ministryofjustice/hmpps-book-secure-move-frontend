const proxyquire = require('proxyquire')

const userServicesStub = {
  getLocations: () => Promise.resolve(['location']),
  getFullname: () => Promise.resolve('Mr Benn'),
  getSupplierId: () => Promise.resolve('undefined'),
}

const permissionsLibStub = {
  rolesToPermissions: () => ['permission'],
}

const accessTokenPayload = {
  user_name: 'test',
  user_id: 'id',
  authorities: ['test'],
}

const encodedAccessTokenPayload = Buffer.from(
  JSON.stringify(accessTokenPayload)
).toString('base64')

const accessToken = `test.${encodedAccessTokenPayload}.test`

describe('User', function () {
  describe('#loadUser', function () {
    let user

    beforeEach(async function () {
      const { loadUser } = proxyquire('./user', {
        '../../common/services/user': userServicesStub,
        './permissions': permissionsLibStub,
      })

      user = await loadUser(accessToken)
    })

    it('sets the userId', function () {
      expect(user.userId).to.equal('id')
    })

    it('sets the username', function () {
      expect(user.username).to.equal('test')
    })

    it('sets the fullname', function () {
      expect(user.fullname).to.equal('Mr Benn')
    })

    it('sets the supplierId', function () {
      expect(user.supplierId).to.equal('undefined')
    })

    it('sets the displayName', function () {
      expect(user.displayName).to.equal('M. Benn')
    })

    it('sets the permissions', function () {
      expect(user.permissions).to.deep.equal(['permission'])
    })

    it('sets the locations', function () {
      expect(user.locations).to.deep.equal(['location'])
    })
  })
})
