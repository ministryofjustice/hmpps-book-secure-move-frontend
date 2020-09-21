const setUser = require('./set-user')

describe('#setUser', function () {
  let req, res, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = {
      session: {},
    }
    res = {}
  })

  context('without user', function () {
    beforeEach(function () {
      setUser(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not set user', function () {
      expect(req.user).to.be.undefined
    })
  })

  context('with user', function () {
    beforeEach(function () {
      req.session.user = {
        id: '12345',
        username: '__username__',
        permissions: ['edit', 'create', 'delete'],
      }
      setUser(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set user on request object', function () {
      expect(req.user).to.deep.equal({
        id: '12345',
        username: '__username__',
        permissions: ['edit', 'create', 'delete'],
      })
    })
  })
})
