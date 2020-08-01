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
        expect(moveToCardComponentStub).to.be.calledWithExactly({
          tagSource: undefined,
        })
      })
    })

    context('with cardTagSource', function () {
      beforeEach(function () {
        movesByLocation(mockMoves, undefined, 'tagSource')
      })

      it('should call card presenter with source', function () {
        expect(moveToCardComponentStub).to.be.calledWithExactly({
          tagSource: 'tagSource',
        })
      })
    })

    context('when to_location is missing', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = movesByLocation([
          {
            id: '1',
            move_type: 'court_appearance',
          },
          {
            id: '2',
            move_type: 'court_appearance',
            to_location: {
              id: '031818f0-3b69-4e7a-8b3f-9d51cc964dee',
              type: 'locations',
              key: 'barrow_in_furness_county_court',
              title: 'Barrow in Furness County Court',
              location_type: 'court',
            },
          },
          {
            id: '3',
            move_type: 'prison_recall',
          },
          {
            id: '4',
            move_type: 'court_appearance',
          },
          {
            id: '5',
            move_type: 'prison_recall',
            to_location: {
              id: 'a9760a3c-5bc0-47fb-8841-b5d8d991bd34',
              type: 'locations',
              key: 'hmp_long_lartin',
              title: 'HMP Long Lartin',
              location_type: 'prison',
            },
          },
          {
            id: '6',
            move_type: 'prison_recall',
          },
          {
            id: '7',
            move_type: 'prison_recall',
          },
          {
            id: '8',
            move_type: 'unknown_type',
          },
          {
            id: '9',
            move_type: 'video_remand',
            to_location: {
              id: 'a9760a3c-5bc0-47fb-8841-b5d8d991bd34',
              type: 'locations',
              key: 'hmp_long_lartin',
              title: 'HMP Long Lartin',
              location_type: 'prison',
            },
          },
          {
            id: '10',
            move_type: 'video_remand',
          },
        ])
      })

      it('should contain correct number of locations', function () {
        expect(transformedResponse.length).to.equal(6)
      })

      describe('location order', function () {
        it('should order correctly', function () {
          const keys = transformedResponse.map(group => group.location)
          expect(keys).to.deep.equal([
            'Barrow in Furness County Court',
            'HMP Long Lartin',
            'fields::move_type.items.prison_recall.label',
            'fields::move_type.items.unknown.label',
            'fields::move_type.items.unknown.label',
            'fields::move_type.items.video_remand.label',
          ])
        })
      })

      describe('location count', function () {
        it('should contain correct number of moves', function () {
          const keys = transformedResponse.map(group => group.items.length)
          expect(keys).to.deep.equal([1, 2, 3, 2, 1, 1])
        })
      })

      describe('labels', function () {
        it('should contain correct label', function () {
          const labels = transformedResponse.map(group => group.label)
          labels.forEach(label => {
            expect(label).to.equal('collections::labels.to_location')
          })
        })
      })

      describe('translations', function () {
        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(13)
        })

        it('should translate titles correctly', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.video_remand.label'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
        })
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
