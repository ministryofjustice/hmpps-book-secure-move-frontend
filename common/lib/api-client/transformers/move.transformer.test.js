const transformer = require('./move.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#moveTransformer', function () {
      let output, item

      beforeEach(function () {
        item = {
          foo: 'bar',
          move_type: '__original__',
          to_location: null,
        }
      })

      const tests = [
        {
          location_type: 'secure_childrens_home',
          expected_move_type: 'secure_childrens_home',
        },
        {
          location_type: 'secure_training_centre',
          expected_move_type: 'secure_training_centre',
        },
        {
          location_type: 'court',
          expected_move_type: '__original__',
        },
        {
          location_type: 'prison',
          expected_move_type: '__original__',
        },
      ]

      tests.forEach(test => {
        context(`with ${test.location_type} destination type`, function () {
          beforeEach(function () {
            item.to_location = {
              location_type: test.location_type,
            }

            output = transformer(item)
          })

          it('should set move type correctly', function () {
            expect(output).to.deep.equal({
              foo: 'bar',
              move_type: test.expected_move_type,
              to_location: {
                location_type: test.location_type,
              },
            })
          })
        })
      })

      context('without destination', function () {
        beforeEach(function () {
          output = transformer(item)
        })

        it('should not update move type', function () {
          expect(output).to.deep.equal({
            foo: 'bar',
            move_type: '__original__',
            to_location: null,
          })
        })
      })
    })
  })
})
