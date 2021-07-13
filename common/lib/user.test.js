const User = require('./user')

describe('User class', function () {
  describe('when instantiated', function () {
    let user
    let fullname

    context('with fullname', function () {
      it('should set fullname', function () {
        fullname = 'Mr Benn'
        user = new User({ fullname })

        expect(user.fullname).to.equal(fullname)
      })
    })

    context('without fullname', function () {
      it('should not set fullname', function () {
        user = new User()

        expect(user.fullname).to.be.undefined
      })
    })

    context('with roles', function () {
      beforeEach(function () {
        user = new User({
          roles: ['ROLE_PECS_SUPPLIER'],
        })
      })

      it('should set permissions', function () {
        expect(user.permissions).to.not.be.empty
      })
    })

    context('without roles', function () {
      beforeEach(function () {
        user = new User({ roles: [] })
      })

      it('should set permissions to empty array', function () {
        expect(user.permissions).to.be.an('array').that.is.empty
      })
    })

    context("with a role that isn't expected", function () {
      beforeEach(function () {
        user = new User({
          roles: ['ROLE_PECS_UNKNOWN'],
        })
      })

      it('should set permissions to an empty array for unknown roles', function () {
        expect(user.permissions).to.be.an('array').that.is.empty
      })
    })

    it('should set locations to empty array', function () {
      expect(new User().locations).to.be.an('array').that.is.empty
    })

    context('with username', function () {
      const username = 'user1'

      it('should set username', function () {
        user = new User({ name: 'USERNAME', username })
        expect(user.username).to.deep.equal(username)
      })
    })

    context('with userId', function () {
      const userId = 'uuid'

      it('should set userId', function () {
        user = new User({ name: 'USERNAME', userId })
        expect(user.id).to.deep.equal(userId)
      })
    })

    context('with supplierId', function () {
      const supplierId = 'uuid'

      it('should set supplierId', function () {
        user = new User({ name: 'USERNAME', supplierId })
        expect(user.supplierId).to.deep.equal(supplierId)
      })
    })
  })
})
