const dataExample = [
  {
    name: 'John',
    surname: 'Doe',
    created_at: '2020-10-10',
    details: {
      risk: 'violent',
    },
  },
]
const presenter = require('./object-to-table-row')
describe('the presenter for the table rows', function() {
  context('when the property passed to it is described by a path', function() {
    it('returns a non nested path', function() {
      const output = dataExample.map(
        presenter([
          {
            row: {
              text: 'name',
            },
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            text: 'John',
          },
        ],
      ])
    })

    it('returns a nested path', function() {
      const output = dataExample.map(
        presenter([
          {
            row: {
              text: 'details.risk',
            },
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            text: 'violent',
          },
        ],
      ])
    })
  })

  context(
    'when the property passed to it is described by an array',
    function() {
      it('concatenates the various elements', function() {
        const output = dataExample.map(
          presenter([
            {
              row: {
                text: ['name', 'surname'],
              },
            },
          ])
        )
        expect(output).to.deep.equal([
          [
            {
              text: 'John Doe',
            },
          ],
        ])
      })
    }
  )

  context(
    'when the property passed to it is described by a function',
    function() {
      it('returns the output of the function', function() {
        const output = dataExample.map(
          presenter([
            {
              row: {
                html: data => {
                  return `<ul><li>${data.name}</li><li>${data.created_at}</li></ul>`
                },
              },
            },
          ])
        )
        expect(output).to.deep.equal([
          [
            {
              html: '<ul><li>John</li><li>2020-10-10</li></ul>',
            },
          ],
        ])
      })
    }
  )

  context('with multiple cells', function() {
    it('returns an object with all the data for the cells', function() {
      const output = dataExample.map(
        presenter([
          {
            row: {
              text: 'name',
            },
          },
          {
            row: {
              html: 'details.risk',
            },
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            text: 'John',
          },
          {
            html: 'violent',
          },
        ],
      ])
    })
  })

  context('with attributes', function() {
    it('returns an object with attributes', function() {
      const output = dataExample.map(
        presenter([
          {
            row: {
              attributes: {
                scope: 'row',
              },
              text: 'name',
            },
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            attributes: {
              scope: 'row',
            },
            text: 'John',
          },
        ],
      ])
    })
  })
})
