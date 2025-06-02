const nunjucks = require('nunjucks')
const proxyquire = require('proxyquire').noCallThru()

const markdownInitStub = sinon.stub().returns()
const mockFilters = {
  filterOne: () => {},
  filterTwo: () => {},
}
const mockGlobals = {
  FOO: 'Bar',
  FIZZ: 'Buzz',
}
const mockApp = {
  app: true,
}
const mockPaths = {
  root: '/root',
  templates: '_templates/',
  components: '_components/',
  app: '_app/',
  govukFrontend: '_govukFrontend/',
  mojFrontend: '_mojFrontend/',
  hmrcFrontend: '_hmrcFrontend/',
}

const nunjucksEnv = proxyquire('./', {
  './filters': mockFilters,
  './globals': mockGlobals,
  '../markdown': {
    init: markdownInitStub,
  },
})

describe('Nunjucks', function () {
  let env
  let addFilterStub
  let addGlobalStub
  let mockConfigure

  beforeEach(function () {
    addFilterStub = sinon.stub()
    addGlobalStub = sinon.stub()
    mockConfigure = {
      addFilter: addFilterStub,
      addGlobal: addGlobalStub,
    }

    sinon.stub(nunjucks, 'configure').returns(mockConfigure)
  })

  afterEach(function () {
    markdownInitStub.resetHistory()
  })

  describe('Configuration', function () {
    context('by default', function () {
      beforeEach(function () {
        env = nunjucksEnv(mockApp, {}, mockPaths)
      })

      it('should create a nunjucks instance', function () {
        expect(nunjucks.configure).to.be.calledOnce
      })

      it('should load views', function () {
        const views = nunjucks.configure.args[0][0]

        expect(views).to.deep.equal([
          '_govukFrontend/',
          '_mojFrontend/',
          '_hmrcFrontend/',
          '_templates/',
          '_components/',
          '_app/',
        ])
      })

      it('should load express app', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('express')
        expect(config.express).to.deep.equal(mockApp)
      })

      it('should set watch to false', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('watch')
        expect(config.watch).to.equal(false)
      })

      it('should set noCache to false', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('noCache')
        expect(config.noCache).to.equal(false)
      })

      it('should return a nunjucks instance', function () {
        expect(env).to.be.an('object')
        expect(env).to.deep.equal(mockConfigure)
      })
    })

    context('in development environment', function () {
      beforeEach(function () {
        env = nunjucksEnv(
          mockApp,
          {
            IS_DEV: true,
          },
          mockPaths
        )
      })

      it('should set watch to true', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('watch')
        expect(config.watch).to.equal(true)
      })

      it('should set noCache to true', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('noCache')
        expect(config.noCache).to.equal(true)
      })
    })

    context('in production environment', function () {
      beforeEach(function () {
        env = nunjucksEnv(
          mockApp,
          {
            IS_DEV: false,
          },
          mockPaths
        )
      })

      it('should set watch to false', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('watch')
        expect(config.watch).to.equal(false)
      })

      it('should set noCache to false', function () {
        const config = nunjucks.configure.args[0][1]

        expect(config).to.contain.property('noCache')
        expect(config.noCache).to.equal(false)
      })
    })
  })

  describe('Filters', function () {
    beforeEach(function () {
      env = nunjucksEnv(mockApp, {}, mockPaths)
    })

    it('should set correct number of filters', function () {
      expect(mockConfigure.addFilter).to.be.calledTwice
    })

    it('should set first filter', function () {
      expect(mockConfigure.addFilter.firstCall).to.be.calledWithExactly(
        'filterOne',
        mockFilters.filterOne
      )
    })

    it('should set second filter', function () {
      expect(mockConfigure.addFilter.secondCall).to.be.calledWithExactly(
        'filterTwo',
        mockFilters.filterTwo
      )
    })
  })

  describe('Globals', function () {
    beforeEach(function () {
      env = nunjucksEnv(mockApp, {}, mockPaths)
    })

    it('should set correct number of globals', function () {
      expect(mockConfigure.addGlobal).to.be.calledTwice
    })

    it('should set first global', function () {
      expect(mockConfigure.addGlobal.firstCall).to.be.calledWithExactly(
        'FOO',
        'Bar'
      )
    })

    it('should set second global', function () {
      expect(mockConfigure.addGlobal.secondCall).to.be.calledWithExactly(
        'FIZZ',
        'Buzz'
      )
    })
  })

  describe('Markdown', function () {
    beforeEach(function () {
      env = nunjucksEnv(mockApp, {}, mockPaths)
    })

    it('should compile markdown', function () {
      expect(markdownInitStub).to.be.calledOnceWithExactly(mockConfigure)
    })
  })
})
