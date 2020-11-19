const { cloneDeep } = require('lodash')

const transformResource = require('./transform-resource')

describe('API Client', function () {
  describe('Models', function () {
    describe('#transform', function () {
      let output, _this, item, included

      beforeEach(function () {
        _this = {
          models: {
            book: {
              options: {},
            },
          },
          pluralize: {
            singular: sinon.stub().returnsArg(0),
          },
          deserialize: {
            resource: sinon.stub().returnsArg(0),
          },
        }
        included = []
        item = {
          type: 'book',
          foo: 'bar',
        }
      })

      context('without transformer', function () {
        beforeEach(function () {
          output = transformResource().call(_this, item, included)
        })

        it('should not transform output', function () {
          expect(output).to.deep.equal({
            type: 'book',
            foo: 'bar',
          })
        })
      })

      context('with transformer', function () {
        let transformer

        beforeEach(function () {
          transformer = sinon.stub().returns({
            ...item,
            _fizz: 'buzz',
          })

          _this.models.book.options.deserializer = transformer

          output = transformResource(transformer).call(_this, item, included)
        })

        it('should call transformer', function () {
          expect(transformer).to.have.been.calledWithExactly(item)
        })

        it('should return transformed resource', function () {
          expect(output).to.deep.equal({
            type: 'book',
            foo: 'bar',
            _fizz: 'buzz',
          })
        })

        it('should not mutate original item', function () {
          expect(item).to.deep.equal({
            type: 'book',
            foo: 'bar',
          })
        })

        it('should deserialize model', function () {
          expect(_this.deserialize.resource).to.have.been.calledWithExactly(
            item,
            included
          )
        })

        it.skip('should delete model deserializer', function () {
          const _that = cloneDeep(_this)
          delete _that.models.book.options.deserializer

          expect(_this.deserialize.resource).to.have.been.calledOn(_that)
        })
      })
    })
  })
})
