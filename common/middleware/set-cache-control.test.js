const middleware = require('./set-cache-control')

describe('#setCacheControl', function () {
  let req, res, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = {}
    res = {
      set: sinon.spy(),
    }
    middleware(req, res, nextSpy)
  })

  it('should set cache control header', function () {
    expect(res.set).to.have.been.calledOnceWithExactly(
      'Cache-control',
      'no-store'
    )
  })

  it('should call next', function () {
    expect(nextSpy).to.be.calledOnceWithExactly()
  })
})
