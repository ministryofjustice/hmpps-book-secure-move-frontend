const transformer = require('./person.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#personTransformer', function () {
      let output, item

      beforeEach(function () {
        item = {
          id: '12345',
          first_names: 'Foo',
          last_name: 'Bar',
        }
        output = transformer(item)
      })

      it('should add custom properties', function () {
        expect(output).to.deep.equal({
          ...item,
          image_url: '/person/12345/image',
          fullname: 'Bar, Foo',
        })
      })
    })
  })
})
