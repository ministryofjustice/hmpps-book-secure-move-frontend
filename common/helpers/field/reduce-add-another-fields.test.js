const reduceAddAnotherFields = require('./reduce-add-another-fields')

const fields = {
  foo: {
    itemName: 'Foo',
    // NB. the nonsuch descendant does not exist and should cause
    // a) no fields to be output
    // b) no errors to occur
    descendants: ['bar', 'baz', 'nonsuch'],
    name: 'foo',
  },
  bar: {
    items: [{ attributes: { attr: 'value' } }, {}],
  },
  baz: {},
}

describe('Field helpers', function () {
  describe('#reduceAddAnotherFields', function () {
    let response

    context('when field has no values', function () {
      beforeEach(function () {
        response = reduceAddAnotherFields(fields, {})({}, ['foo', fields.foo])
      })

      it('should return no fields', function () {
        expect(response).to.deep.equal({})
      })
    })

    context('when field has a single value', function () {
      beforeEach(function () {
        response = reduceAddAnotherFields(fields, {
          foo: [{}],
        })({}, ['foo', fields.foo])
      })

      it('should have the expected number of fields', function () {
        expect(Object.keys(response).length).to.equal(2)
      })

      it('should set the properties on a descendant field without items', function () {
        expect(response['foo[0][baz]']).to.deep.equal({
          skip: true,
          prefix: 'foo[0]',
          name: 'foo[0][baz]',
          id: 'foo-0--baz',
          attributes: {
            'data-name': 'foo[%index%][baz]',
            'data-id': 'foo-%index%--baz',
          },
        })
      })

      it('should set the properties on a descendant field with items', function () {
        expect(response['foo[0][bar]']).to.deep.equal({
          items: [
            {
              attributes: {
                'data-name': 'foo[%index%][bar]',
                'data-id': 'foo-%index%--bar',
                attr: 'value',
              },
            },
            {
              attributes: {
                'data-name': 'foo[%index%][bar]',
                'data-id': 'foo-%index%--bar-2',
              },
            },
          ],
          skip: true,
          prefix: 'foo[0]',
          name: 'foo[0][bar]',
          id: 'foo-0--bar',
          idPrefix: 'foo-0--bar',
        })
      })
    })

    context('when field has multiple values', function () {
      beforeEach(function () {
        response = reduceAddAnotherFields(fields, {
          foo: [{}, {}],
        })({}, ['foo', fields.foo])
      })

      it('should have the expected number of fields', function () {
        expect(Object.keys(response).length).to.equal(4)
      })

      // just check the additional fields added
      it('should set the properties on a descendant field without items', function () {
        expect(response['foo[1][baz]']).to.deep.equal({
          skip: true,
          prefix: 'foo[1]',
          name: 'foo[1][baz]',
          id: 'foo-1--baz',
          attributes: {
            'data-name': 'foo[%index%][baz]',
            'data-id': 'foo-%index%--baz',
          },
        })
      })

      it('should set the properties on a descendant field with items', function () {
        expect(response['foo[1][bar]']).to.deep.equal({
          items: [
            {
              attributes: {
                'data-name': 'foo[%index%][bar]',
                'data-id': 'foo-%index%--bar',
                attr: 'value',
              },
            },
            {
              attributes: {
                'data-name': 'foo[%index%][bar]',
                'data-id': 'foo-%index%--bar-2',
              },
            },
          ],
          skip: true,
          prefix: 'foo[1]',
          name: 'foo[1][bar]',
          id: 'foo-1--bar',
          idPrefix: 'foo-1--bar',
        })
      })
    })
  })
})
