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
    })
  })
})
