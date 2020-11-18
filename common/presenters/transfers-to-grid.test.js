const transfersToGrid = require('./transfers-to-grid')

describe('Presenters', function () {
  describe('#populationToGrid', function () {
    it('should return an empty object with no population', function () {
      const result = transfersToGrid({})
      expect(result).to.be.defined
    })
  })
})
