const transformer = require('./person.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#personTransformer', function () {
      let item

      beforeEach(function () {
        item = {
          id: '12345',
          first_names: 'Foo',
          last_name: 'Bar',
        }
        transformer(item)
      })

      it('should add custom properties', function () {
        expect(item).to.deep.equal({
          id: '12345',
          first_names: 'Foo',
          last_name: 'Bar',
          image_url: '/person/12345/image',
          fullname: 'Bar, Foo',
        })
      })
    })
  })
})
