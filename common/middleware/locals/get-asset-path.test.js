const path = require('path')
const configPaths = require('../../../config/paths')
const logger = require('../../../config/logger')

const getAssetPath = require('./get-asset-path')
const existingManifestPath = path.join(configPaths.fixtures, 'manifest.json')
const missingManifestPath = path.join(configPaths.fixtures, 'MISSING.json')

describe('getAssetPath', () => {
  context('when manifest file exists', () => {
    context('when key exists', () => {
      it('should find path', () => {
        const assetPath = getAssetPath('styles.css', existingManifestPath)
        expect(assetPath).to.equal('/stylesheets/styles.123.css')
      })
    })

    context('when key does not exist', () => {
      it('should return the key', () => {
        const assetPath = getAssetPath('foo.css', existingManifestPath)
        expect(assetPath).to.equal('/foo.css')
      })
    })
  })

  context('when manifest does not exist', () => {
    let assetPath

    beforeEach(() => {
      sinon.spy(logger, 'error')
      assetPath = getAssetPath('styles.css', missingManifestPath)
    })

    it('should log an error', () => {
      expect(logger.error).to.have.been.calledOnce
    })

    it('should return the key', () => {
      expect(assetPath).to.equal('/styles.css')
    })
  })
})
