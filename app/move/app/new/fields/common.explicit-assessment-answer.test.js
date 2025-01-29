const explicitAssessmentAnswer = require('./common.explicit-assessment-answer')

describe('Move fields', function () {
  describe('#explicitAssessmentAnswer()', function () {
    let field

    context('with all arguments', function () {
      const mockName = 'foo'
      const mockValue = 'bar'
      const mockConditional = 'baz'

      beforeEach(function () {
        field = explicitAssessmentAnswer({
          name: mockName,
          value: mockValue,
          conditional: mockConditional,
        })
      })

      it('should return correct object', function () {
        expect(field).to.deep.equal({
          id: 'foo',
          name: mockName,
          validate: 'required',
          component: 'govukRadios',
          fieldset: {
            legend: {
              text: `fields::${mockName}.label`,
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: {
            text: `fields::${mockName}.hint`,
          },
          items: [
            {
              value: mockValue,
              conditional: mockConditional,
              text: 'Yes',
            },
            {
              value: 'false',
              text: 'No',
            },
          ],
        })
      })
    })

    context('with no arguments', function () {
      beforeEach(function () {
        field = explicitAssessmentAnswer()
      })

      it('should return an empty object', function () {
        expect(field).to.deep.equal({})
      })
    })

    context('with missing arguments', function () {
      beforeEach(function () {
        field = explicitAssessmentAnswer()
      })

      it('should return an empty object', function () {
        expect(field).to.deep.equal({})
      })
    })
  })
})
