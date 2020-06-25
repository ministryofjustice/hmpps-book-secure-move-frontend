const frameworksService = require('./frameworks')

describe('Frameworks service', function () {
  describe('#transformQuestion', function () {
    context('with no options', function () {})

    context('with options', function () {
      let mockQuestion

      beforeEach(function () {
        mockQuestion = {
          question: 'Question text',
        }
      })

      context('by default', function () {
        it('should format correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            mockQuestion
          )
          expect(transformed).to.deep.equal({
            component: 'govukInput',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            validate: [],
          })
        })
      })

      context('with hint text', function () {
        beforeEach(function () {
          mockQuestion = {
            ...mockQuestion,
            hint: 'Hint text',
          }
        })

        it('should format correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            mockQuestion
          )
          expect(transformed).to.deep.equal({
            component: 'govukInput',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            hint: {
              text: 'Hint text',
            },
            validate: [],
          })
        })
      })

      context('with validations', function () {
        beforeEach(function () {
          mockQuestion = {
            ...mockQuestion,
            validations: [
              {
                name: 'required',
              },
              {
                name: 'date',
              },
            ],
          }
        })

        it('should format correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            mockQuestion
          )
          expect(transformed).to.deep.equal({
            component: 'govukInput',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            validate: ['required', 'date'],
          })
        })
      })

      context('with options', function () {
        beforeEach(function () {
          mockQuestion = {
            ...mockQuestion,
            options: [
              {
                value: 'Yes',
                label: 'Yes',
                followup: 'conditional-field-1',
              },
              {
                value: 'No',
                label: 'No',
                followup: ['conditional-field-2'],
              },
            ],
          }
        })

        it('should format correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            mockQuestion
          )
          expect(transformed).to.deep.equal({
            component: 'govukInput',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            items: [
              {
                value: 'Yes',
                text: 'Yes',
                conditional: 'conditional-field-1',
              },
              {
                value: 'No',
                text: 'No',
                conditional: ['conditional-field-2'],
              },
            ],
            validate: [],
          })
        })
      })
    })

    describe('question types', function () {
      const mockQuestion = {
        question: 'Question text',
      }

      describe('radio', function () {
        it('should format type correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            { ...mockQuestion, type: 'radio' }
          )

          expect(transformed).to.deep.equal({
            component: 'govukRadios',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            fieldset: {
              legend: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
            },
            validate: [],
          })
        })
      })

      describe('checkbox', function () {
        it('should format type correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            { ...mockQuestion, type: 'checkbox' }
          )

          expect(transformed).to.deep.equal({
            component: 'govukCheckboxes',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            fieldset: {
              legend: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
            },
            validate: [],
          })
        })
      })

      describe('textarea', function () {
        it('should format type correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            { ...mockQuestion, type: 'textarea' }
          )

          expect(transformed).to.deep.equal({
            component: 'govukTextarea',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            validate: [],
          })
        })
      })

      describe('text', function () {
        it('should format type correctly', function () {
          const transformed = frameworksService.transformQuestion(
            'question-key',
            { ...mockQuestion, type: 'text' }
          )

          expect(transformed).to.deep.equal({
            component: 'govukInput',
            question: 'Question text',
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            validate: [],
          })
        })
      })
    })
  })

  describe('#transformManifest', function () {
    context('without manifest', function () {
      it('should return an empty object', function () {
        const transformed = frameworksService.transformManifest()
        expect(transformed).to.deep.equal({})
      })
    })

    context('with manifest', function () {
      context('without steps', function () {
        it('should return an empty steps object', function () {
          const transformed = frameworksService.transformManifest('key', {
            name: 'Manifest name',
          })

          expect(transformed).to.deep.equal({
            key: 'key',
            name: 'Manifest name',
            steps: {},
          })
        })
      })

      context('with steps', function () {
        let steps, transformed

        beforeEach(function () {
          steps = [
            {
              name: 'Step 1',
              slug: 'step-1',
              questions: ['question-1', 'question-2'],
            },
            {
              name: 'Step 2',
              slug: 'step-2',
              questions: ['question-3', 'question-4'],
            },
            {
              name: 'Step 3',
              slug: 'step-3',
              questions: ['question-5', 'question-6'],
            },
          ]

          transformed = frameworksService.transformManifest('key', {
            steps,
            name: 'Manifest name',
          })
        })

        it('should contain correct number of manifest keys', function () {
          expect(Object.keys(transformed)).to.have.length(3)
        })

        it('should contain correct manifest key', function () {
          expect(Object.keys(transformed)).to.deep.equal([
            'key',
            'name',
            'steps',
          ])
        })

        it('should set key', function () {
          expect(transformed.key).to.equal('key')
        })

        it('should set name', function () {
          expect(transformed.name).to.equal('Manifest name')
        })

        it('should transform steps correctly', function () {
          expect(transformed.steps).to.deep.equal({
            '/step-1': {
              slug: 'step-1',
              next: 'step-2',
              pageTitle: 'Step 1',
              key: '/step-1',
              fields: ['question-1', 'question-2'],
              pageCaption: 'Manifest name',
            },
            '/step-2': {
              slug: 'step-2',
              next: 'step-3',
              pageTitle: 'Step 2',
              key: '/step-2',
              fields: ['question-3', 'question-4'],
              pageCaption: 'Manifest name',
            },
            '/step-3': {
              slug: 'step-3',
              next: undefined,
              pageTitle: 'Step 3',
              key: '/step-3',
              fields: ['question-5', 'question-6'],
              pageCaption: 'Manifest name',
            },
          })
        })

        it('should set default `next` values correctly', function () {
          expect(transformed.steps['/step-1'].next).to.equal('step-2')
          expect(transformed.steps['/step-2'].next).to.equal('step-3')
          expect(transformed.steps['/step-3'].next).to.be.undefined
        })
      })

      context('with custom step next values', function () {
        let steps, transformed

        beforeEach(function () {
          steps = [
            {
              name: 'Step 1',
              slug: 'step-1',
              next_step: 'simple-override',
              questions: ['question-1', 'question-2'],
            },
            {
              name: 'Step 2',
              slug: 'step-2',
              next_step: [
                {
                  question: 'question-1',
                  value: 'Yes',
                  next_step: 'step-3',
                },
                'step-4',
              ],
              questions: ['question-3', 'question-4'],
            },
            {
              name: 'Step 3',
              slug: 'step-3',
              next_step: [
                {
                  question: 'question-1',
                  value: 'Yes',
                  next_step: [
                    {
                      question: 'question-2',
                      value: 'Yes',
                      next_step: [
                        {
                          question: 'question-1',
                          value: 'No',
                          next_step: 'step-3',
                        },
                        'step-4',
                      ],
                    },
                    'step-4',
                  ],
                },
                {
                  question: 'question-1',
                  value: 'No',
                  next_step: 'step-4',
                },
                'step-4',
              ],
              questions: ['question-5', 'question-6'],
            },
            {
              name: 'Step 4',
              slug: 'step-4',
              questions: [],
            },
          ]

          transformed = frameworksService.transformManifest('key', {
            steps,
            name: 'Manifest name',
          })
        })

        it('should set simple `next` override', function () {
          expect(transformed.steps['/step-1'].next).to.equal('simple-override')
        })

        it('should set nested `next` override', function () {
          expect(transformed.steps['/step-2'].next).to.deep.equal([
            {
              field: 'question-1',
              value: 'Yes',
              next: 'step-3',
            },
            'step-4',
          ])
        })

        it('should set complex `next` override', function () {
          expect(transformed.steps['/step-3'].next).to.deep.equal([
            {
              field: 'question-1',
              value: 'Yes',
              next: [
                {
                  field: 'question-2',
                  value: 'Yes',
                  next: [
                    {
                      field: 'question-1',
                      value: 'No',
                      next: 'step-3',
                    },
                    'step-4',
                  ],
                },
                'step-4',
              ],
            },
            {
              field: 'question-1',
              value: 'No',
              next: 'step-4',
            },
            'step-4',
          ])
        })
      })

      context('without step questions', function () {
        let steps, transformed

        beforeEach(function () {
          steps = [
            {
              name: 'Step 1',
              slug: 'step-1',
            },
            {
              name: 'Step 2',
              slug: 'step-2',
              questions: [],
            },
          ]

          transformed = frameworksService.transformManifest('key', {
            steps,
            name: 'Manifest name',
          })
        })

        it('should contain correct number of manifest keys', function () {
          expect(Object.keys(transformed)).to.have.length(3)
        })

        it('should contain correct manifest key', function () {
          expect(Object.keys(transformed)).to.deep.equal([
            'key',
            'name',
            'steps',
          ])
        })

        it('should set key', function () {
          expect(transformed.key).to.equal('key')
        })

        it('should set name', function () {
          expect(transformed.name).to.equal('Manifest name')
        })

        it('should transform steps correctly', function () {
          expect(transformed.steps).to.deep.equal({
            '/step-1': {
              slug: 'step-1',
              next: 'step-2',
              pageTitle: 'Step 1',
              key: '/step-1',
              fields: [],
              pageCaption: 'Manifest name',
            },
            '/step-2': {
              slug: 'step-2',
              next: undefined,
              pageTitle: 'Step 2',
              key: '/step-2',
              fields: [],
              pageCaption: 'Manifest name',
            },
          })
        })

        it('should set empty values for fields', function () {
          expect(transformed.steps['/step-1'].fields).to.deep.equal([])
          expect(transformed.steps['/step-2'].fields).to.deep.equal([])
        })
      })
    })
  })
})
