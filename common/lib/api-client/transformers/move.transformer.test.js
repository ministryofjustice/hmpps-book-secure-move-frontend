const transformer = require('./move.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#moveTransformer', function () {
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

      describe('when move has has both important and timeline events', function () {
        let move
        beforeEach(function () {
          move = {
            timeline_events: [
              {
                id: 'medical',
                classification: 'medical',
              },
            ],
            important_events: [
              {
                id: 'foo',
                classification: 'foo',
              },
            ],
          }
          transformer(move)
        })

        it('should leave original important events untouched', function () {
          expect(move.important_events).to.deep.equal([
            {
              id: 'foo',
              classification: 'foo',
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
              _index: 1,
            },
            {
              id: 'foo2',
              event_type: 'foo',
              _index: 2,
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
