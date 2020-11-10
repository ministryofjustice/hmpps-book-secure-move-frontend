const findUnpopulatedResources = require('./find-unpopulated-resources')

describe('findUnpopulatedResources', function () {
  context('when data contains an unpopulated resource', function () {
    it('should return unpopulated resource', function () {
      const unpopulated = findUnpopulatedResources({
        foo: { id: 'foo', type: 'foos' },
      })
      expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
    })
  })

  context('when data contains a nested unpopulated resource', function () {
    it('should return unpopulated resource', function () {
      const unpopulated = findUnpopulatedResources({
        bar: { foo: { id: 'foo', type: 'foos' } },
      })
      expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
    })
  })

  context(
    'when data contains an unpopulated resource in an array',
    function () {
      it('should return unpopulated resource', function () {
        const unpopulated = findUnpopulatedResources({
          foo: [{ id: 'foo', type: 'foos' }],
        })
        expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
      })
    }
  )

  context('when data contains a populated resource', function () {
    it('should return nothing', function () {
      const unpopulated = findUnpopulatedResources({
        foo: { id: 'foo', type: 'foos', foo: 'bars' },
      })
      expect(unpopulated).to.deep.equal([])
    })
  })

  context(
    'when data contains an unpopulated resource multiple times',
    function () {
      it('should return unpopulated resource', function () {
        const foo = { id: 'foo', type: 'foos' }
        const unpopulated = findUnpopulatedResources({
          foo,
          anotherFoo: foo,
        })
        expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
      })
    }
  )

  context(
    'when data contains an unpopulated resource that should be excluded',
    function () {
      it('should only return non-excluded unpopulated resources', function () {
        const unpopulated = findUnpopulatedResources(
          {
            foo: { id: 'foo', type: 'foos' },
            bar: { id: 'bar', type: 'bars' },
          },
          { exclude: ['bars'] }
        )
        expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
      })
    }
  )

  context(
    'when data contains an unpopulated resource that should be included',
    function () {
      it('should only return included unpopulated resources', function () {
        const unpopulated = findUnpopulatedResources(
          {
            foo: { id: 'foo', type: 'foos' },
            bar: { id: 'bar', type: 'bars' },
          },
          { include: ['foos'] }
        )
        expect(unpopulated).to.deep.equal([{ id: 'foo', type: 'foos' }])
      })
    }
  )
})
