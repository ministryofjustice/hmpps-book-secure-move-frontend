const assessmentAnswer = require('./common.assessment-answer')

describe('Move fields', function () {
  describe('#assessmentAnswer()', function () {
    let field

    context('with no arguments', function () {
      beforeEach(function () {
        field = assessmentAnswer()
      })

      it('should return default params', function () {
        expect(field).to.deep.equal({
          skip: true,
          rows: 3,
          component: 'govukTextarea',
          classes: 'govuk-input--width-20',
          label: {
            text: 'fields::assessment_comment.optional',
            classes: 'govuk-label--s',
          },
        })
      })
    })

    context('when field is required', function () {
      beforeEach(function () {
        field = assessmentAnswer({
          isRequired: true,
          name: 'test',
        })
      })

      it('should return default params', function () {
        expect(field).to.deep.equal({
          skip: true,
          rows: 3,
          component: 'govukTextarea',
          classes: 'govuk-input--width-20',
          id: 'test',
          label: {
            text: 'fields::assessment_comment.required',
            classes: 'govuk-label--s',
          },
          validate: 'required',
        })
      })
    })

    context('when field should be explicity asked', function () {
      beforeEach(function () {
        field = assessmentAnswer({
          isExplicit: true,
        })
      })

      it('should return default params', function () {
        expect(field).to.deep.equal({
          skip: true,
          rows: 3,
          component: 'govukTextarea',
          classes: 'govuk-input--width-20',
          label: {
            text: 'fields::assessment_comment.optional',
            classes: 'govuk-label--s',
          },
          explicit: true,
        })
      })
    })

    context(
      'when field is required and should be explicity asked',
      function () {
        beforeEach(function () {
          field = assessmentAnswer({
            isRequired: true,
            isExplicit: true,
            name: 'test',
          })
        })

        it('should return default params', function () {
          expect(field).to.deep.equal({
            skip: true,
            rows: 3,
            component: 'govukTextarea',
            classes: 'govuk-input--width-20',
            id: 'test',
            label: {
              text: 'fields::assessment_comment.required',
              classes: 'govuk-label--s',
            },
            validate: 'required',
            explicit: true,
          })
        })
      }
    )
  })
})
