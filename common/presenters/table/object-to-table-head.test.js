const i18n = require('../../../config/i18n')

const objectToTableHead = require('./object-to-table-head')

describe('table head presenter', function() {
  let output

  beforeEach(function() {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  context('with no args', function() {
    beforeEach(function() {
      output = objectToTableHead()
    })

    it('should return undefined', function() {
      expect(output).to.be.undefined
    })

    it('should not translate anything', function() {
      expect(i18n.t).not.to.be.called
    })
  })

  context('with html', function() {
    beforeEach(function() {
      output = objectToTableHead({
        head: {
          html: 'move_type::label',
        },
      })
    })

    it('should return correct header', function() {
      expect(output).to.deep.equal({
        html: 'move_type::label',
      })
    })

    it('should translate label', function() {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with text', function() {
    beforeEach(function() {
      output = objectToTableHead({
        head: {
          text: 'move_type::label',
        },
      })
    })

    it('should return correct header', function() {
      expect(output).to.deep.equal({
        text: 'move_type::label',
      })
    })

    it('should translate label', function() {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with attributes', function() {
    beforeEach(function() {
      output = objectToTableHead({
        head: {
          html: 'move_type::label',
          attributes: {
            width: 1,
          },
        },
      })
    })

    it('should return correct header', function() {
      expect(output).to.deep.equal({
        html: 'move_type::label',
        attributes: {
          width: 1,
        },
      })
    })

    it('should translate label', function() {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with neither html nor test', function() {
    beforeEach(function() {
      output = objectToTableHead({})
    })

    it('should return undefined', function() {
      expect(output).to.be.undefined
    })

    it('should not translate anything', function() {
      expect(i18n.t).not.to.be.called
    })
  })

  context('with both html and text', function() {
    beforeEach(function() {
      output = objectToTableHead({
        head: {
          html: 'move_type::label-html',
          text: 'move_type::label-text',
        },
      })
    })

    it('should return correct header', function() {
      expect(output).to.deep.equal({
        html: 'move_type::label-html',
        text: 'move_type::label-text',
      })
    })

    it('should translate boths label', function() {
      expect(i18n.t).to.be.calledWithExactly('move_type::label-html')
      expect(i18n.t).to.be.calledWithExactly('move_type::label-text')
    })

    it('should translate correct number of times', function() {
      expect(i18n.t.callCount).to.equal(2)
    })
  })
})
