const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const assessmentCategoryToPanelListComponent = require('./assessment-category-to-panel-component')

describe('Presenters', function() {
  describe('#assessmentCategorytoPanelComponent()', function() {
    let transformedResponse
    const mockFormatDateWithDay = 'Mon 10 Aug'

    beforeEach(function() {
      sinon
        .stub(i18n, 't')
        .withArgs('created_on')
        .returns('Created on')
      sinon.stub(filters, 'formatDateWithDay').returns(mockFormatDateWithDay)
    })

    context('with default assessment answer', function() {
      const mockAssessmentCategory = {
        key: 'risk',
        sortOrder: 1,
        tagClass: 'risk-tag-class',
        answers: [
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
            comments:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            key: 'escape',
            title: 'Escape',
          },
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: null,
            key: 'violent',
            title: 'Violent',
          },
        ],
      }

      beforeEach(function() {
        transformedResponse = assessmentCategoryToPanelListComponent(
          mockAssessmentCategory
        )
      })

      it('should retain assessment category key', function() {
        expect(transformedResponse).to.contain.property('key')
        expect(transformedResponse.key).to.equal(mockAssessmentCategory.key)
      })

      it('correctly format panels', function() {
        expect(transformedResponse).to.contain.property('panels')
        expect(transformedResponse.panels).to.deep.equal([
          {
            attributes: {
              id: 'violent',
            },
            tag: {
              text: 'Violent',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html: 'Lorem ipsum dolor sit amet.',
                },
              },
              {
                value: {
                  html: '',
                },
              },
            ],
          },
          {
            attributes: {
              id: 'escape',
            },
            tag: {
              text: 'Escape',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
              },
            ],
          },
        ])
      })

      it('should contain correct number of properties', function() {
        expect(Object.keys(transformedResponse).length).to.equal(2)
      })
    })

    context(
      'with assessment answer that has NOMIS alert description',
      function() {
        const mockAssessmentCategory = {
          key: 'risk',
          sortOrder: 1,
          tagClass: 'risk-tag-class',
          answers: [
            {
              assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
              category: 'risk',
              comments: null,
              key: 'violent',
              nomis_alert_description: 'Risk to Public - Community',
              title: 'Violent',
            },
            {
              assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
              category: 'risk',
              comments:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              key: 'escape',
              nomis_alert_description: 'Governors Hold',
              title: 'Escape',
            },
            {
              assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
              category: 'risk',
              comments: null,
              nomis_alert_description: 'Custodial Violence Management',
              title: 'Violent',
            },
          ],
        }

        beforeEach(function() {
          transformedResponse = assessmentCategoryToPanelListComponent(
            mockAssessmentCategory
          )
        })

        it('should retain assessment category key', function() {
          expect(transformedResponse).to.contain.property('key')
          expect(transformedResponse.key).to.equal(mockAssessmentCategory.key)
        })

        it('correctly format panels', function() {
          expect(transformedResponse).to.contain.property('panels')
          expect(transformedResponse.panels).to.deep.equal([
            {
              attributes: {
                id: 'violent',
              },
              tag: {
                text: 'Violent',
                classes: mockAssessmentCategory.tagClass,
              },
              items: [
                {
                  value: {
                    html:
                      '<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Risk to Public - Community</h4>',
                  },
                },
                {
                  value: {
                    html:
                      '<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Custodial Violence Management</h4>',
                  },
                },
              ],
            },
            {
              attributes: {
                id: 'escape',
              },
              tag: {
                text: 'Escape',
                classes: mockAssessmentCategory.tagClass,
              },
              items: [
                {
                  value: {
                    html:
                      '<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Governors Hold</h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  },
                },
              ],
            },
          ])
        })

        it('should contain correct number of properties', function() {
          expect(Object.keys(transformedResponse).length).to.equal(2)
        })
      }
    )

    context('with assessment answer that has created at date', function() {
      const mockAssessmentCategory = {
        answers: [
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: null,
            created_at: '2019-08-08',
            title: 'Violent',
          },
          {
            assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
            category: 'risk',
            comments: undefined,
            key: 'escape',
            created_at: '2018-08-08',
            title: 'Escape',
          },
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            created_at: '2019-08-08',
            title: 'Violent',
          },
        ],
      }

      beforeEach(function() {
        transformedResponse = assessmentCategoryToPanelListComponent(
          mockAssessmentCategory
        )
      })

      it('should retain assessment category key', function() {
        expect(transformedResponse).to.contain.property('key')
        expect(transformedResponse.key).to.equal(mockAssessmentCategory.key)
      })

      it('correctly format panels', function() {
        expect(transformedResponse).to.contain.property('panels')
        expect(transformedResponse.panels).to.deep.equal([
          {
            attributes: {
              id: 'violent',
            },
            tag: {
              text: 'Violent',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html: `<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
              {
                value: {
                  html: `<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
            ],
          },
          {
            attributes: {
              id: 'escape',
            },
            tag: {
              text: 'Escape',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html: `<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
            ],
          },
        ])
      })

      it('should contain correct number of properties', function() {
        expect(Object.keys(transformedResponse).length).to.equal(2)
      })
    })

    context('with assessment answer that has all optional props', function() {
      const mockAssessmentCategory = {
        answers: [
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
            comments:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            key: 'escape',
            created_at: '2018-08-08',
            nomis_alert_description: 'Governors Hold',
            title: 'Escape',
          },
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: 'Sed ut perspiciatis unde omnis iste natus error sit',
            created_at: '2019-08-08',
            nomis_alert_description: 'Custodial Violence Management',
            title: 'Violent',
          },
        ],
      }

      beforeEach(function() {
        transformedResponse = assessmentCategoryToPanelListComponent(
          mockAssessmentCategory
        )
      })

      it('should retain assessment category key', function() {
        expect(transformedResponse).to.contain.property('key')
        expect(transformedResponse.key).to.equal(mockAssessmentCategory.key)
      })

      it('correctly format panels', function() {
        expect(transformedResponse).to.contain.property('panels')
        expect(transformedResponse.panels).to.deep.equal([
          {
            attributes: {
              id: 'violent',
            },
            tag: {
              text: 'Violent',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html: `<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Risk to Public - Community</h4>Lorem ipsum dolor sit amet.<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
              {
                value: {
                  html: `<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Custodial Violence Management</h4>Sed ut perspiciatis unde omnis iste natus error sit<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
            ],
          },
          {
            attributes: {
              id: 'escape',
            },
            tag: {
              text: 'Escape',
              classes: mockAssessmentCategory.tagClass,
            },
            items: [
              {
                value: {
                  html: `<h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-2">Governors Hold</h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<div class="govuk-!-margin-top-2 govuk-!-font-size-16">Created on ${mockFormatDateWithDay}</div>`,
                },
              },
            ],
          },
        ])
      })

      it('should contain correct number of properties', function() {
        expect(Object.keys(transformedResponse).length).to.equal(2)
      })
    })
  })
})
