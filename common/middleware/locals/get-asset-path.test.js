const path = require('path')
const configPaths = require('../../../config/paths')
const logger = require('../../../config/logger')

const getAssetPath = require('./get-asset-path')
const existingManifestPath = path.join(configPaths.fixtures, 'manifest.json')
const missingManifestPath = path.join(configPaths.fixtures, 'MISSING.json')

describe('getAssetPath', function () {
  context('when manifest file exists', function () {
    context('when key exists', function () {
      it('should find path', function () {
        const assetPath = getAssetPath('styles.css', existingManifestPath)
        expect(assetPath).to.equal('/stylesheets/styles.123.css')
      })
    })

    context('when key does not exist', function () {
      it('should return the key', function () {
        const assetPath = getAssetPath('foo.css', existingManifestPath)
        expect(assetPath).to.equal('/foo.css')
      })
    })
  })

  context('when manifest does not exist', function () {
    let assetPath

    beforeEach(function () {
      sinon.spy(logger, 'error')
      assetPath = getAssetPath('styles.css', missingManifestPath)
    })

    it('should log an error', function () {
      expect(logger.error).to.have.been.calledOnce
    })

    it('should return the key', function () {
      expect(assetPath).to.equal('/styles.css')
    })
  })
})
