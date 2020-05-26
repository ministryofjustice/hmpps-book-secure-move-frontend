const i18n = require('../../../config/i18n')

const objectToTableHead = require('./object-to-table-head')

describe('table head presenter', function() {
  beforeEach(function() {
    sinon.stub(i18n, 't').returnsArg(0)
  })
  context('with html', function() {
    const schema = [
      {
        head: {
          html: 'move_type::label',
        },
      },
      {
        head: { html: 'fields::age' },
      },
    ]
    it('returns the correct header', function() {
      const output = schema.map(objectToTableHead)
      expect(output).to.deep.equal([
        {
          html: 'move_type::label',
        },
        {
          html: 'fields::age',
        },
      ])
    })
  })
  context('with text', function() {
    const schema = [
      {
        head: {
          text: 'move_type::label',
        },
      },
      {
        head: { text: 'fields::age' },
      },
    ]
    it('returns the correct header', function() {
      const output = schema.map(objectToTableHead)
      expect(output).to.deep.equal([
        {
          text: 'move_type::label',
        },
        {
          text: 'fields::age',
        },
      ])
    })
  })
  context('with attributes', function() {
    const schema = [
      {
        head: {
          html: 'move_type::label',
          attributes: {
            width: 1,
          },
        },
      },
      {
        head: { html: 'fields::age' },
      },
    ]
    it('returns the correct header', function() {
      const output = schema.map(objectToTableHead)
      expect(output).to.deep.equal([
        {
          attributes: {
            width: 1,
          },
          html: 'move_type::label',
        },
        {
          html: 'fields::age',
        },
      ])
    })
  })
  context('with neither html nor test', function() {
    const schema = [
      {
        head: {},
      },
      {
        head: {},
      },
    ]
    it('returns the correct header', function() {
      const output = schema.map(objectToTableHead)
      expect(output).to.deep.equal([{}, {}])
    })
  })
  context('with both html and text', function() {
    const schema = [
      {
        head: {
          html: 'move_type::label-html',
          text: 'move_type::label-text',
        },
      },
      {
        head: {
          html: 'fields::age-html',
          text: 'fields::age-text',
        },
      },
    ]
    it('returns the correct headers', function() {
      const output = schema.map(objectToTableHead)
      expect(output).to.deep.equal([
        {
          html: 'move_type::label-html',
          text: 'move_type::label-text',
        },
        {
          html: 'fields::age-html',
          text: 'fields::age-text',
        },
      ])
    })
  })
})
