const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')

const helper = require('./render-previous-answer-to-field')

describe('#renderPreviousAnswerToField', function () {
  let output
  const mockField = [
    'mock-key',
    {
      foo: 'bar',
    },
  ]

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
    sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
    sinon.stub(filters, 'formatTime').returnsArg(0)
  })

  context('without response', function () {
    beforeEach(function () {
      output = helper()(mockField)
    })

    it('should return original field', function () {
      expect(output).to.deep.equal(mockField)
    })
  })

  context('with responded question', function () {
    const mockResponse = {
      responded: true,
      prefilled: true,
      question: {
        key: 'mock-key',
      },
    }

    beforeEach(function () {
      output = helper({ responses: [mockResponse] })(mockField)
    })

    it('should return original field', function () {
      expect(output).to.deep.equal(mockField)
    })
  })

  context('without prefilled response', function () {
    const mockResponse = {
      responded: false,
      prefilled: false,
      question: {
        key: 'mock-key',
      },
    }

    beforeEach(function () {
      output = helper({ responses: [mockResponse] })(mockField)
    })

    it('should return original field', function () {
      expect(output).to.deep.equal(mockField)
    })
  })

  context('with unresponded prefilled response', function () {
    const mockResponse = {
      responded: false,
      prefilled: true,
      question: {
        key: 'mock-key',
      },
    }

    context('without existing hint text', function () {
      beforeEach(function () {
        output = helper({
          responses: [mockResponse],
        })(mockField)
      })

      it('should append form group class', function () {
        expect(output[1].formGroup.classes).to.equal('app-form-group--message')
      })

      it('should append message to hint content', function () {
        expect(output[1].hint).to.deep.equal({
          html: '\n      <span class="app-form-group__message-text">\n        assessment::prefilled_message\n      </span>\n    ',
        })
      })

      it('should translate keys', function () {
        expect(i18n.t).to.be.calledWithExactly('assessment::prefilled_message')
      })
    })

    context('with existing hint text', function () {
      const mockFieldWithHint = [
        'mock-key',
        {
          foo: 'bar',
          hint: {
            html: 'EXISTING_HINT',
          },
        },
      ]

      beforeEach(function () {
        output = helper({
          responses: [mockResponse],
        })(mockFieldWithHint)
      })

      it('should append form group class', function () {
        expect(output[1].formGroup.classes).to.equal('app-form-group--message')
      })

      it('should append message to existing hint content', function () {
        expect(output[1].hint).to.deep.equal({
          html: 'EXISTING_HINT\n      <span class="app-form-group__message-text">\n        assessment::prefilled_message\n      </span>\n    ',
        })
      })
    })
  })
})
