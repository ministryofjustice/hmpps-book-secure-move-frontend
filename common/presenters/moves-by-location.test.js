const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')
const moveToCardComponentStub = sinon
  .stub()
  .callsFake(() => sinon.stub().returnsArg(0))
const movesByLocation = proxyquire('./moves-by-location', {
  './move-to-card-component': moveToCardComponentStub,
})
const mockMoves = require('../../test/fixtures/moves.json')

describe('Presenters', function () {
  describe('#movesByLocation()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      moveToCardComponentStub.resetHistory()
    })

    context('when provided with mock moves response', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = movesByLocation(mockMoves)
      })

      it('should contain correct number of locations', function () {
        expect(transformedResponse.length).to.equal(3)
      })

      describe('location order', function () {
        it('should order correctly', function () {
          const keys = transformedResponse.map(group => group.location)
          expect(keys).to.deep.equal([
            'Axminster Crown Court',
            'Barnstaple Magistrates Court',
            'Barrow in Furness County Court',
          ])
        })
      })

      describe('location count', function () {
        it('should contain correct number of moves', function () {
          const keys = transformedResponse.map(group => group.items.length)
          expect(keys).to.deep.equal([10, 5, 5])
        })
      })

      describe('labels', function () {
        it('should translate correct amount of times', function () {
          expect(i18n.t).to.be.callCount(transformedResponse.length)
        })

        it('should contain correct label', function () {
          const labels = transformedResponse.map(group => group.label)
          labels.forEach(label => {
            expect(label).to.equal('collections::labels.to_location')
          })
        })
      })

      it('should call card presenter', function () {
        expect(moveToCardComponentStub).to.be.calledWithExactly()
      })
    })

    context('when grouped by `from_location`', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = movesByLocation(mockMoves, 'from_location')
      })

      it('should contain correct number of locations', function () {
        expect(transformedResponse.length).to.equal(19)
      })

      describe('location order', function () {
        it('should order correctly', function () {
          const keys = transformedResponse.map(group => group.location)
          expect(keys).to.deep.equal([
            'HMIRC The Verne',
            'HMP Brockhill',
            'HMP Camp Hill',
            'HMP Coldingley',
            'HMP Dartmoor',
            'HMP Kirkham',
            'HMP Lindholme',
            'HMP Long Lartin',
            'HMP Reading',
            'HMP The Mount',
            'HMP/YOI Altcourse',
            'HMP/YOI Belmarsh',
            'HMP/YOI Bronzefield',
            'HMP/YOI Eastwood Park',
            'HMP/YOI Glen Parva',
            'HMP/YOI Hewell',
            'HMP/YOI Portland',
            'HMP/YOI Sudbury',
            'HMP/YOI Warren Hill',
          ])
        })
      })

      describe('location count', function () {
        it('should contain correct number of moves', function () {
          const keys = transformedResponse.map(group => group.items.length)
          expect(keys).to.deep.equal([
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
          ])
        })
      })

      describe('labels', function () {
        it('should translate correct amount of times', function () {
          expect(i18n.t).to.be.callCount(transformedResponse.length)
        })

        it('should contain correct label', function () {
          const labels = transformedResponse.map(group => group.label)
          labels.forEach(label => {
            expect(label).to.equal('collections::labels.from_location')
          })
        })
      })
    })
  })
})
