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

describe('the presenter for the table rows', function () {
  context('when the property passed to it is described by a path', function () {
    it('returns a non nested path', function () {
      const output = dataExample.map(
        presenter([
          {
            head: {
              text: 'string',
            },
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

    it('returns a nested path', function () {
      const output = dataExample.map(
        presenter([
          {
            head: {
              text: 'nested',
            },
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
    function () {
      it('concatenates the various elements', function () {
        const output = dataExample.map(
          presenter([
            {
              head: {
                text: 'array',
              },
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
    function () {
      it('returns the output of the function', function () {
        const output = dataExample.map(
          presenter([
            {
              head: {
                text: 'function',
              },
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

  context('with multiple cells', function () {
    it('returns an object with all the data for the cells', function () {
      const output = dataExample.map(
        presenter([
          {
            head: {
              text: 'multiple1',
            },
            row: {
              text: 'name',
            },
          },
          {
            head: {
              text: 'multiple2',
            },
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

  context('with attributes', function () {
    it('returns an object with attributes', function () {
      const output = dataExample.map(
        presenter([
          {
            head: {
              text: 'attributes',
            },
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

  context('with falsy `head` values', function () {
    let output

    beforeEach(function () {
      output = dataExample.map(
        presenter([
          {
            head: {
              text: 'truthy',
            },
            row: {
              text: 'name',
            },
          },
          {
            head: false,
            row: {
              text: 'false',
            },
          },
          {
            head: undefined,
            row: {
              text: 'undefined',
            },
          },
          {
            head: null,
            row: {
              text: 'null',
            },
          },
          {
            head: '',
            row: {
              text: '(empty string)',
            },
          },
        ])
      )
    })

    it('should return correct row count', function () {
      expect(output.length).to.equal(1)
    })

    it('should remove rows', function () {
      expect(output).to.deep.equal([
        [
          {
            text: 'John',
          },
        ],
      ])
    })
  })
})
