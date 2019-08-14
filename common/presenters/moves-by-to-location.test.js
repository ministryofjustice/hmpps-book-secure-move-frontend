const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')
const movesByToLocation = proxyquire('./moves-by-to-location', {
  './move-to-card-component': sinon.stub().returnsArg(0),
})

const {
  data,
} = require('../../test/fixtures/api-client/moves.get.deserialized.json')

describe('Presenters', function() {
  describe('#movesByToLocation()', function() {
    beforeEach(function() {
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('when provided with mock moves response', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = movesByToLocation(data)
      })

      it('should contain correct number of locations', function() {
        expect(transformedResponse.length).to.equal(3)
      })

      describe('location order', function() {
        it('should order correctly', function() {
          expect(transformedResponse[0].location).to.equal(
            'Axminster Crown Court'
          )
        })

        it('should order correctly', function() {
          expect(transformedResponse[1].location).to.equal(
            'Barnstaple Magistrates Court'
          )
        })

        it('should order correctly', function() {
          expect(transformedResponse[2].location).to.equal(
            'Barrow in Furness County Court'
          )
        })
      })

      describe('location count', function() {
        it('should contain correct number of moves', function() {
          expect(transformedResponse[0].items.length).to.equal(10)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[1].items.length).to.equal(5)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[2].items.length).to.equal(5)
        })
      })
    })

    context('when to_location is missing', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = movesByToLocation([
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
        ])
      })

      it('should contain correct number of locations', function() {
        expect(transformedResponse.length).to.equal(5)
      })

      describe('location order', function() {
        it('should order court correctly', function() {
          expect(transformedResponse[0].location).to.equal(
            'Barrow in Furness County Court'
          )
        })

        it('should order prison correctly', function() {
          expect(transformedResponse[1].location).to.equal('HMP Long Lartin')
        })

        it('should order prison recall correctly', function() {
          expect(transformedResponse[2].location).to.equal(
            'fields::move_type.items.prison_recall.label'
          )
        })

        it('should order unknown location correctly', function() {
          expect(transformedResponse[3].location).to.equal(
            'fields::move_type.items.unknown.label'
          )
        })

        it('should order unknown location correctly', function() {
          expect(transformedResponse[4].location).to.equal(
            'fields::move_type.items.unknown.label'
          )
        })
      })

      describe('location count', function() {
        it('should contain correct number of moves', function() {
          expect(transformedResponse[0].items.length).to.equal(1)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[1].items.length).to.equal(1)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[2].items.length).to.equal(3)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[3].items.length).to.equal(2)
        })

        it('should contain correct number of moves', function() {
          expect(transformedResponse[4].items.length).to.equal(1)
        })
      })

      describe('translations', function() {
        it('should translate correct number of times', function() {
          expect(i18n.t).to.be.callCount(6)
        })

        it('should translate titles correctly', function() {
          expect(i18n.t.firstCall).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
          expect(i18n.t.secondCall).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t.thirdCall).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
          expect(i18n.t.getCall(3)).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t.getCall(4)).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
          expect(i18n.t.getCall(5)).to.be.calledWithExactly(
            'fields::move_type.items.unknown.label'
          )
        })
      })
    })

    context('when location contains no moves (unknown)', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = movesByToLocation([
          {
            id: '1',
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
            id: '2',
            move_type: 'prison_recall',
          },
        ])
      })

      it('should contain correct number of locations', function() {
        expect(transformedResponse.length).to.equal(2)
      })
    })
  })
})
