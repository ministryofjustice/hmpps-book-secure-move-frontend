const assessmentCheckboxes = require('./common.assessment-checkboxes')

describe('Move fields', function () {
  describe('#assessmentCheckboxes()', function () {
    let field

    context('with name', function () {
      const mockName = 'foo'

      beforeEach(function () {
        field = assessmentCheckboxes(mockName)
      })

      it('should return correct object', function () {
        expect(field).to.deep.equal({
          id: 'foo',
          name: mockName,
          component: 'govukCheckboxes',
          multiple: true,
          items: [],
          fieldset: {
            legend: {
              text: `fields::${mockName}.label`,
              classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
            },
          },
          hint: {
            text: `fields::${mockName}.hint`,
          },
        })
      })
    })

    context('with no arguments', function () {
      beforeEach(function () {
        field = assessmentCheckboxes()
      })

      it('should return an empty object', function () {
        expect(field).to.deep.equal({})
      })
    })
  })
})
