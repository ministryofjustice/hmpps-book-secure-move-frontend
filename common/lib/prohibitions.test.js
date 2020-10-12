const { prohibitionsByLocationType } = require('./prohibitions')

describe('Prohibitions', function () {
  describe('When location type is court', function () {
    it('should prohibit creation of moves', function () {
      expect(prohibitionsByLocationType.court.includes('move:create')).to.be
        .true
    })
  })
})
