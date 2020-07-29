const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const assessmentAnswersToMetaListComponent = require('./assessment-answers-to-meta-list-component')

describe('Presenters', function () {
  describe('#assessmentAnswersToMetaListComponent()', function () {
    let transformedResponse
    const mockFormatDateWithDay = 'Mon 10 Aug'

    beforeEach(function () {
      sinon
        .stub(i18n, 't')
        .withArgs('empty_details')
        .returns('No details')
        .withArgs('created_on')
        .returns('Created on')
      sinon.stub(filters, 'formatDateWithDay').returns(mockFormatDateWithDay)
    })

    context('with default assessment answer', function () {
      const mockAssessmentAnswers = [
        {
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          comments: 'Lorem ipsum dolor sit amet.',
          key: 'violent',
          title: 'Violent',
        },
        {
          assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
          category: 'risk',
          comments: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          key: 'escape',
          title: 'Escape',
        },
        {
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          comments: 'Comments',
          key: 'violent',
          title: 'Violent',
        },
      ]

      beforeEach(function () {
        transformedResponse = assessmentAnswersToMetaListComponent(
          mockAssessmentAnswers
        )
      })

      it('should contain correct keys', function () {
        expect(Object.keys(transformedResponse)).to.deep.equal([
          'classes',
          'items',
        ])
      })

      it('should set component classes', function () {
        expect(transformedResponse).to.contain.property('classes')
        expect(transformedResponse.classes).to.equal(
          'app-meta-list--divider govuk-!-font-size-16'
        )
      })

      it('correctly format items', function () {
        expect(transformedResponse).to.contain.property('items')
        expect(transformedResponse.items).to.deep.equal([
          {
            value: {
              html: '<div>Lorem ipsum dolor sit amet.</div>',
            },
          },
          {
            value: {
              html:
                '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>',
            },
          },
          {
            value: {
              html: '<div>Comments</div>',
            },
          },
        ])
      })
    })

    context('when answer has NOMIS alert description', function () {
      const mockAssessmentAnswers = [
        {
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          comments: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          key: 'violent',
          nomis_alert_description: 'Risk to Public - Community',
          title: 'Violent',
        },
      ]

      beforeEach(function () {
        transformedResponse = assessmentAnswersToMetaListComponent(
          mockAssessmentAnswers
        )
      })

      it('should include description', function () {
        expect(transformedResponse).to.contain.property('items')
        expect(transformedResponse.items).to.deep.equal([
          {
            value: {
              html:
                '<div>\n      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">\n        Risk to Public - Community\n      </h4>\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>',
            },
          },
        ])
      })
    })

    context(
      'when answer has created at date and NOMIS alert decription',
      function () {
        const mockAssessmentAnswers = [
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: 'Some details',
            nomis_alert_description: 'Risk to Public - Community',
            created_at: '2019-08-08',
            title: 'Violent',
          },
        ]

        beforeEach(function () {
          transformedResponse = assessmentAnswersToMetaListComponent(
            mockAssessmentAnswers
          )
        })

        it('should format date', function () {
          expect(filters.formatDateWithDay).to.have.been.calledOnceWithExactly(
            '2019-08-08'
          )
        })

        it('should include date', function () {
          expect(transformedResponse).to.contain.property('items')
          expect(transformedResponse.items).to.deep.equal([
            {
              value: {
                html: `<div>\n      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">\n        Risk to Public - Community\n      </h4>\n    Some details\n      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">\n        Created on ${mockFormatDateWithDay}\n      </div>\n    </div>`,
              },
            },
          ])
        })
      }
    )

    context('when answer has no comments', function () {
      const mockAssessmentAnswers = [
        {
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          comments: null,
          title: 'Violent',
        },
      ]

      beforeEach(function () {
        transformedResponse = assessmentAnswersToMetaListComponent(
          mockAssessmentAnswers
        )
      })

      it('should translate fallback text', function () {
        expect(i18n.t).to.have.been.calledOnceWithExactly('empty_details')
      })

      it('should include fallback text in place of comments', function () {
        expect(transformedResponse).to.contain.property('items')
        expect(transformedResponse.items).to.deep.equal([
          {
            value: {
              html:
                '<div><span class="app-secondary-text-colour">No details</span></div>',
            },
          },
        ])
      })
    })

    context('when answer has all optional props', function () {
      const mockAssessmentAnswers = [
        {
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          comments: 'Lorem ipsum dolor sit amet.',
          created_at: '2019-08-08',
          nomis_alert_description: 'Risk to Public - Community',
          title: 'Violent',
        },
        {
          assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
          category: 'risk',
          comments: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          key: 'escape',
          created_at: '2018-08-08',
          nomis_alert_description: 'Governors Hold',
          title: 'Escape',
        },
        {
          assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
          category: 'risk',
          comments: '',
          key: 'self-harm',
          created_at: '2018-08-08',
          nomis_alert_description: 'Risk to themselves',
          title: 'Self-harm',
        },
      ]

      beforeEach(function () {
        transformedResponse = assessmentAnswersToMetaListComponent(
          mockAssessmentAnswers
        )
      })

      it('should include all conditional data', function () {
        expect(transformedResponse).to.contain.property('items')
        expect(transformedResponse.items).to.deep.equal([
          {
            value: {
              html: `<div>\n      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">\n        Risk to Public - Community\n      </h4>\n    Lorem ipsum dolor sit amet.\n      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">\n        Created on ${mockFormatDateWithDay}\n      </div>\n    </div>`,
            },
          },
          {
            value: {
              html: `<div>\n      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">\n        Governors Hold\n      </h4>\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">\n        Created on ${mockFormatDateWithDay}\n      </div>\n    </div>`,
            },
          },
          {
            value: {
              html: `<div>\n      <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">\n        Risk to themselves\n      </h4>\n    <span class="app-secondary-text-colour">No details</span>\n      <div class="app-secondary-text-colour govuk-!-margin-top-2 govuk-!-font-size-14">\n        Created on ${mockFormatDateWithDay}\n      </div>\n    </div>`,
            },
          },
        ])
      })
    })
  })
})
