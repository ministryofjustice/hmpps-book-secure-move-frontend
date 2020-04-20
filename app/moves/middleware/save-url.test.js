const middleware = require('./save-url')

describe('Moves middleware', function() {
  describe('#saveUrl()', function() {
    let req, nextSpy
    beforeEach(function() {
      req = {
        originalUrl: '/moves/original/url',
        session: {},
      }
      nextSpy = sinon.spy()

      middleware(req, {}, nextSpy)
    })

    it('should save url to session', function() {
      expect(req.session).to.have.property('movesUrl')
      expect(req.session.movesUrl).to.equal(req.originalUrl)
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
