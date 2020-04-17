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
            row: 'name',
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            html: 'John',
          },
        ],
      ])
    })
    it('returns a nested path', function() {
      const output = dataExample.map(
        presenter([
          {
            row: 'details.risk',
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            html: 'violent',
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
              row: ['name', 'surname'],
            },
          ])
        )
        expect(output).to.deep.equal([
          [
            {
              html: 'John Doe',
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
              row: data => {
                return `<ul><li>${data.name}</li><li>${data.created_at}</li></ul>`
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
            row: 'name',
          },
          {
            row: 'details.risk',
          },
        ])
      )
      expect(output).to.deep.equal([
        [
          {
            html: 'John',
          },
          {
            html: 'violent',
          },
        ],
      ])
    })
  })
})
