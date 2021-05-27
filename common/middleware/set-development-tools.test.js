const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')

const middleware = require('./set-development-tools')

describe('#setDevelopmentTools', function () {
  let req, res, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = {}
    res = {
      locals: {},
    }
    middleware(req, res, nextSpy)
  })

  it('should development tools on locals', function () {
    expect(res.locals).to.deep.equal({
      DEVELOPMENT_TOOLS: {
        items: [
          {
            href: `${toolsMountpath}${toolsRoutes.permissions}`,
            text: 'Set permissions',
          },
        ],
      },
    })
  })

  it('should call next', function () {
    expect(nextSpy).to.be.calledOnceWithExactly()
  })
})
