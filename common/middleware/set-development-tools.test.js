const {
  mountpath: toolsMountpath,
  routes: toolsRoutes,
} = require('../../app/tools')

const middleware = require('./set-development-tools')

describe('#setDevelopmentTools', function () {
  let req, res, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = {
      url: 'http://example.com/some-path',
    }
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
            dataModule: 'app-set-permissions',
            href: `${toolsMountpath}${toolsRoutes.permissions}?r=http://example.com/some-path`,
            id: 'set-permissions',
            text: 'Set permissions',
          },
          {
            dataModule: 'app-toggle-banner',
            href: '#',
            id: 'toggle-banner',
            text: 'Toggle banner',
          },
        ],
      },
    })
  })

  it('should call next', function () {
    expect(nextSpy).to.be.calledOnceWithExactly()
  })
})
