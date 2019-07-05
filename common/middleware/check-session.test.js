const checkSession = require('./check-session')

describe('Check session middleware', function () {
  let nextSpy

  beforeEach(function () {
    nextSpy = sinon.stub()
  })

  context('when session exists', function () {
    beforeEach(function () {
      const req = {
        session: {},
      }
      checkSession(req, {}, nextSpy)
    })

    it('should call next with no error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  context('when session doesn\'t exist', function () {
    beforeEach(function () {
      checkSession({}, {}, nextSpy)
    })

    it('should call next with error', function () {
      expect(nextSpy).to.be.calledOnce
      expect(nextSpy.args[0][0]).to.be.an.instanceOf(Error)
      expect(nextSpy.args[0][0].message).to.equal('No session available. Check Redis connection.')
    })
  })
})
