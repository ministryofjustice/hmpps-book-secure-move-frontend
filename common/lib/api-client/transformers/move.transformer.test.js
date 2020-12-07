const { expect } = require('chai')

const transformer = require('./move.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#moveTransformer', function () {
      let item

      beforeEach(function () {
        item = {
          id: '12345',
        }
      })

      describe('youth moves', function () {
        const inputs = ['secure_training_centre', 'secure_childrens_home']

        inputs.forEach(i => {
          describe(`test for: "${i}"`, function () {
            beforeEach(function () {
              item = {
                ...item,
                from_location: {
                  location_type: i,
                },
              }
              transformer(item)
            })

            it('should contain correct number of keys', function () {
              expect(Object.keys(item)).to.have.length(3)
            })

            it('should set youth to false', function () {
              expect(item._is_youth_move).to.be.true
            })
          })
        })
      })

      describe('non-youth moves', function () {
        const inputs = ['police', 'prison']

        inputs.forEach(i => {
          describe(`test for: "${i}"`, function () {
            beforeEach(function () {
              item = {
                ...item,
                from_location: {
                  location_type: i,
                },
              }
              transformer(item)
            })

            it('should contain correct number of keys', function () {
              expect(Object.keys(item)).to.have.length(3)
            })

            it('should set youth to false', function () {
              expect(item._is_youth_move).to.be.false
            })
          })
        })
      })

      context('without location', function () {
        beforeEach(function () {
          transformer(item)
        })

        it('should contain correct number of keys', function () {
          expect(Object.keys(item)).to.have.length(2)
        })

        it('should set youth to false', function () {
          expect(item._is_youth_move).to.be.false
        })
      })

      describe('when move has timeline events', function () {
        let move
        beforeEach(function () {
          move = {
            timeline_events: [
              {
                id: 'none',
              },
              {
                id: 'default',
                classification: 'default',
              },
              {
                id: 'medical',
                classification: 'medical',
              },
              {
                id: 'incident',
                classification: 'incident',
              },
            ],
          }
          transformer(move)
        })

        it('should copy and filter those events by classification to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'medical',
              classification: 'medical',
            },
            {
              id: 'incident',
              classification: 'incident',
            },
          ])
        })
      })

      describe('when move has important events', function () {
        let move
        beforeEach(function () {
          move = {
            important_events: [
              {
                id: 'foo1',
                event_type: 'foo',
              },
              {
                id: 'foo2',
                event_type: 'foo',
              },
              {
                id: 'bar',
                event_type: 'bar',
              },
            ],
          }
          transformer(move)
        })

        it('should add a count to important events', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'foo1',
              event_type: 'foo',
              _eventCount: 1,
            },
            {
              id: 'foo2',
              event_type: 'foo',
              _eventCount: 2,
            },
            {
              id: 'bar',
              event_type: 'bar',
            },
          ])
        })
      })
    })
  })
})
