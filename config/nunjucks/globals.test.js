const proxyquire = require('proxyquire').noCallThru()

const logger = require('../logger')

const mockThis = { ctx: {} }

describe('Nunjucks globals', function () {
  describe('#callAsMacro()', function () {
    const { callAsMacro } = require('./globals')
    let macroName, macro

    beforeEach(function () {
      sinon.stub(logger, 'warn')
    })

    context('if macro doesn’t exist', function () {
      beforeEach(function () {
        macroName = 'nonExistent'
        macro = callAsMacro.bind(mockThis)(macroName)
      })

      it('should log warning', function () {
        expect(logger.warn).to.be.calledOnceWithExactly(
          `'${macroName}' macro does not exist`
        )
      })

      it('should return a function', function () {
        expect(macro).to.be.a('function')
      })

      it('should return empty string when function is called', function () {
        expect(macro()).to.equal('')
      })
    })

    context('if macro exists', function () {
      beforeEach(function () {
        macroName = 'macro'
        mockThis.ctx.macro = sinon.stub().returns('is a macro')
        macro = callAsMacro.bind(mockThis)(macroName)
      })

      it('should return a function', function () {
        expect(macro).to.be.a('function')
      })

      it('should return macro', function () {
        expect(macro()).to.equal('is a macro')
      })

      it('should not log warning', function () {
        expect(logger.warn).not.to.be.called
      })
    })
  })

  describe('#getAssetPath()', function () {
    const mockAssetHost = 'host.com'
    let globals, assetPath

    context('when manifest file exists', function () {
      beforeEach(function () {
        globals = proxyquire('./globals', {
          '../': {
            ASSETS_HOST: mockAssetHost,
            ANALYTICS: {},
          },
          '../paths': {
            manifest: 'path/to/manifest.json',
          },
          'path/to/manifest.json': {
            'foo.js': 'foo.123456.min.js',
          },
        })
      })

      context('when asset exists in manifest', function () {
        beforeEach(function () {
          assetPath = globals.getAssetPath('foo.js')
        })

        it('should return manifest path', function () {
          expect(assetPath).to.equal(`${mockAssetHost}/foo.123456.min.js`)
        })
      })

      context('when asset doesn’t exists in manifest', function () {
        beforeEach(function () {
          assetPath = globals.getAssetPath('bar.js')
        })

        it('should return original path', function () {
          expect(assetPath).to.equal(`${mockAssetHost}/bar.js`)
        })
      })
    })

    context('when manifest file doesn’t exist', function () {
      beforeEach(function () {
        sinon.stub(logger, 'error')
        globals = proxyquire('./globals', {
          '../paths': {
            manifest: 'path/to/missing/manifest.json',
          },
        })
      })

      it('should logger an error', function () {
        expect(logger.error).to.be.calledTwice
      })

      it('should log friendly message', function () {
        expect(logger.error.args[0][0]).to.be.an('error')
        expect(logger.error.args[0][0].message).to.equal(
          'Manifest file is not found. Ensure assets are built.'
        )
      })

      it('should log full error', function () {
        expect(logger.error.args[1][0]).to.be.an('error')
        expect(logger.error.args[1][0].message)
          .to.be.a('string')
          .and.match(/^Cannot find module 'path\/to\/missing\/manifest.json'/)
      })
    })
  })
})
