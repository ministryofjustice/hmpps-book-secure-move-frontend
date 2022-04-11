const path = require('path')

const mockFs = require('mock-fs')
const proxyquire = require('proxyquire')

const markdown = require('../../config/markdown')

const mockFrameworksFolder = '/dummy/framework/path'
const mockFrameworksVersion = '2.5.3'

describe('Services', function () {
  describe('Frameworks service', function () {
    let frameworksService

    beforeEach(function () {
      frameworksService = proxyquire('./frameworks', {
        '../../config': {
          FRAMEWORKS: {
            CURRENT_VERSION: mockFrameworksVersion,
          },
        },
        '../../config/paths': {
          frameworks: {
            output: mockFrameworksFolder,
          },
        },
      })
    })

    describe('#transformQuestion', function () {
      beforeEach(function () {
        sinon.stub(markdown, 'render').returnsArg(0)
      })

      context('with no options', function () {
        it('should return an empty object', function () {
          const transformed = frameworksService.transformQuestion()
          expect(transformed).to.deep.equal({})
        })
      })

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
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with hint text', function () {
          let transformed
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              hint: 'Hint text',
            }

            transformed = frameworksService.transformQuestion(
              'question-key',
              mockQuestion
            )
          })

          it('should render markdown for hint text', function () {
            expect(markdown.render).to.be.calledOnceWithExactly('Hint text')
          })

          it('should format correctly', function () {
            expect(transformed).to.deep.equal({
              component: 'govukInput',
              question: 'Question text',
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              hint: {
                html: 'Hint text',
                classes: 'markdown',
              },
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with prefix', function () {
          let transformed
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              display: {
                prefix: '£',
              },
            }

            transformed = frameworksService.transformQuestion(
              'question-key',
              mockQuestion
            )
          })

          it('should format correctly', function () {
            expect(transformed).to.have.property('prefix')
            expect(transformed.prefix).to.deep.equal({
              text: '£',
            })
          })
        })

        context('with suffix', function () {
          let transformed
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              display: {
                suffix: 'per item',
              },
            }

            transformed = frameworksService.transformQuestion(
              'question-key',
              mockQuestion
            )
          })

          it('should format correctly', function () {
            expect(transformed).to.have.property('suffix')
            expect(transformed.suffix).to.deep.equal({
              text: 'per item',
            })
          })
        })

        context('with description', function () {
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              description: 'Short field description',
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
              description: 'Short field description',
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with display properties', function () {
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              display: {
                rows: 3,
                character_width: 4,
              },
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
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [],
              classes: 'govuk-input--width-4',
              rows: 3,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with validations', function () {
          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              validations: [
                {
                  type: 'required',
                  message: 'This field is required',
                },
                {
                  type: 'date',
                  message: 'This must be a date',
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
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [
                {
                  type: 'required',
                  message: 'This field is required',
                },
                {
                  type: 'date',
                  message: 'This must be a date',
                },
              ],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with followup', function () {
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
                  followup: ['conditional-field-2', 'conditional-field-3'],
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
              description: undefined,
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
                  followup: ['conditional-field-1'],
                  conditional: ['conditional-field-1'],
                },
                {
                  value: 'No',
                  text: 'No',
                  followup: ['conditional-field-2', 'conditional-field-3'],
                  conditional: ['conditional-field-2', 'conditional-field-3'],
                },
              ],
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        context('with follow up comment', function () {
          let transformed

          beforeEach(function () {
            mockQuestion = {
              ...mockQuestion,
              options: [
                {
                  value: 'Yes, I agree',
                  label: 'Yes, I agree',
                  followup_comment: {
                    label: 'Give details',
                    hint: 'Some hint information',
                    display: {
                      rows: 2,
                      character_width: 5,
                      prefix: '£',
                      suffix: 'per item',
                    },
                    validations: [
                      {
                        type: 'required',
                        message: 'This field is required',
                      },
                    ],
                  },
                },
                {
                  value: 'No, I do not agree',
                  label: 'No, I do not agree',
                  followup_comment: {
                    label: 'Give details',
                    type: 'text',
                  },
                },
              ],
            }

            transformed = frameworksService.transformQuestion(
              'question-key',
              mockQuestion
            )
          })

          it('should render markdown for hint text', function () {
            expect(markdown.render).to.be.calledOnceWithExactly(
              'Some hint information'
            )
          })

          it('should format correctly', function () {
            expect(transformed).to.deep.equal({
              component: 'govukInput',
              question: 'Question text',
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              items: [
                {
                  value: 'Yes, I agree',
                  text: 'Yes, I agree',
                  conditional: {
                    rows: 2,
                    dependentQuestionKey: 'question-key',
                    name: 'question-key--yes-i-agree',
                    id: 'question-key--yes-i-agree',
                    component: 'govukTextarea',
                    classes: 'govuk-input--width-5',
                    label: {
                      text: 'Give details',
                      classes: 'govuk-label--s',
                    },
                    hint: {
                      html: 'Some hint information',
                      classes: 'markdown',
                    },
                    prefix: {
                      text: '£',
                    },
                    suffix: {
                      text: 'per item',
                    },
                    validate: [
                      {
                        type: 'required',
                        message: 'This field is required',
                      },
                    ],
                  },
                },
                {
                  value: 'No, I do not agree',
                  text: 'No, I do not agree',
                  conditional: {
                    rows: 4,
                    dependentQuestionKey: 'question-key',
                    name: 'question-key--no-i-do-not-agree',
                    id: 'question-key--no-i-do-not-agree',
                    component: 'govukInput',
                    classes: 'govuk-input--width-20',
                    label: {
                      text: 'Give details',
                      classes: 'govuk-label--s',
                    },
                    validate: undefined,
                  },
                },
              ],
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })
      })

      describe('question types', function () {
        const mockQuestion = {
          question: 'Question text',
        }

        describe('radio', function () {
          let transformed
          beforeEach(function () {
            transformed = frameworksService.transformQuestion('question-key', {
              ...mockQuestion,
              type: 'radio',
              options: [
                {
                  label: 'Option one',
                  hint: 'Hint text for option one',
                  value: 'Option one',
                },
                {
                  label: 'Option two',
                  value: 'Option two',
                },
                {
                  label: 'Option three',
                  value: 'Option three',
                },
              ],
            })
          })

          it('should render markdown for hint text', function () {
            expect(markdown.render).to.be.calledOnceWithExactly(
              'Hint text for option one'
            )
          })

          it('should format type correctly', function () {
            expect(transformed).to.deep.equal({
              component: 'govukRadios',
              question: 'Question text',
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              fieldset: {
                legend: {
                  text: 'Question text',
                  classes: 'govuk-label--s',
                },
              },
              items: [
                {
                  text: 'Option one',
                  value: 'Option one',
                  hint: {
                    html: 'Hint text for option one',
                    classes: 'markdown',
                  },
                  conditional: [undefined],
                },
                {
                  text: 'Option two',
                  value: 'Option two',
                  conditional: [undefined],
                },
                {
                  text: 'Option three',
                  value: 'Option three',
                  conditional: [undefined],
                },
              ],
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
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
              description: undefined,
              multiple: true,
              id: 'question-key',
              name: 'question-key',
              fieldset: {
                legend: {
                  text: 'Question text',
                  classes: 'govuk-label--s',
                },
              },
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
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
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [],
              classes: '',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
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
              description: undefined,
              id: 'question-key',
              name: 'question-key',
              label: {
                text: 'Question text',
                classes: 'govuk-label--s',
              },
              validate: [],
              classes: 'govuk-input--width-20',
              rows: undefined,
              descendants: undefined,
              itemName: undefined,
            })
          })
        })

        describe('add_multiple_items', function () {
          const addAnotherMockQuestion = {
            ...mockQuestion,
            type: 'add_multiple_items',
            list_item_name: 'Bag',
            questions: ['one', 'two', 'three'],
          }
          const addAnotherMockResult = {
            component: 'appAddAnother',
            question: 'Question text',
            description: undefined,
            id: 'question-key',
            name: 'question-key',
            label: {
              text: 'Question text',
              classes: 'govuk-label--s',
            },
            validate: [],
            classes: '',
            rows: undefined,
            descendants: ['one', 'two', 'three'],
            itemName: 'Bag',
            'ignore-defaults': true,
            multiple: true,
            default: [{}],
            minItems: 0,
          }

          it('should set default minItems to 0 when not required', function () {
            const transformed = frameworksService.transformQuestion(
              'question-key',
              addAnotherMockQuestion
            )

            expect(transformed).to.deep.equal(addAnotherMockResult)
          })

          it('should set default minItems to 1 when required', function () {
            const transformed = frameworksService.transformQuestion(
              'question-key',
              { ...addAnotherMockQuestion, validations: [{ type: 'required' }] }
            )

            expect(transformed).to.deep.equal({
              ...addAnotherMockResult,
              validate: [{ type: 'required' }],
              minItems: 1,
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
              order: undefined,
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
            expect(Object.keys(transformed)).to.have.length(4)
          })

          it('should contain correct manifest key', function () {
            expect(Object.keys(transformed)).to.deep.equal([
              'key',
              'name',
              'order',
              'steps',
            ])
          })

          it('should set key', function () {
            expect(transformed.key).to.equal('key')
          })

          it('should set name', function () {
            expect(transformed.name).to.equal('Manifest name')
          })

          it('should not set order', function () {
            expect(transformed.order).to.equal(undefined)
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
                stepType: undefined,
                afterFieldsContent: undefined,
                beforeFieldsContent: undefined,
              },
              '/step-2': {
                slug: 'step-2',
                next: 'step-3',
                pageTitle: 'Step 2',
                key: '/step-2',
                fields: ['question-3', 'question-4'],
                pageCaption: 'Manifest name',
                stepType: undefined,
                afterFieldsContent: undefined,
                beforeFieldsContent: undefined,
              },
              '/step-3': {
                slug: 'step-3',
                next: undefined,
                pageTitle: 'Step 3',
                key: '/step-3',
                fields: ['question-5', 'question-6'],
                pageCaption: 'Manifest name',
                stepType: undefined,
                afterFieldsContent: undefined,
                beforeFieldsContent: undefined,
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
            expect(transformed.steps['/step-1'].next).to.equal(
              'simple-override'
            )
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
            expect(Object.keys(transformed)).to.have.length(4)
          })

          it('should contain correct manifest key', function () {
            expect(Object.keys(transformed)).to.deep.equal([
              'key',
              'name',
              'order',
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
                stepType: undefined,
                afterFieldsContent: undefined,
                beforeFieldsContent: undefined,
              },
              '/step-2': {
                slug: 'step-2',
                next: undefined,
                pageTitle: 'Step 2',
                key: '/step-2',
                fields: [],
                pageCaption: 'Manifest name',
                stepType: undefined,
                afterFieldsContent: undefined,
                beforeFieldsContent: undefined,
              },
            })
          })

          it('should set empty values for fields', function () {
            expect(transformed.steps['/step-1'].fields).to.deep.equal([])
            expect(transformed.steps['/step-2'].fields).to.deep.equal([])
          })
        })

        context('with content', function () {
          let steps, transformed

          beforeEach(function () {
            steps = [
              {
                name: 'Step 1',
                slug: 'step-1',
                content_before_questions:
                  '# Some before content\nContent paragraph',
              },
              {
                name: 'Step 2',
                slug: 'step-2',
                content_after_questions:
                  '# Some after content\nContent paragraph',
              },
            ]

            transformed = frameworksService.transformManifest('key', {
              steps,
              name: 'Manifest name',
            })
          })

          it('should contain correct number of manifest keys', function () {
            expect(Object.keys(transformed)).to.have.length(4)
          })

          it('should contain correct manifest key', function () {
            expect(Object.keys(transformed)).to.deep.equal([
              'key',
              'name',
              'order',
              'steps',
            ])
          })

          it('should set key', function () {
            expect(transformed.key).to.equal('key')
          })

          it('should set name', function () {
            expect(transformed.name).to.equal('Manifest name')
          })

          it('should transform content correctly', function () {
            expect(transformed.steps).to.deep.equal({
              '/step-1': {
                slug: 'step-1',
                next: 'step-2',
                pageTitle: 'Step 1',
                key: '/step-1',
                fields: [],
                pageCaption: 'Manifest name',
                stepType: undefined,
                beforeFieldsContent: '# Some before content\nContent paragraph',
                afterFieldsContent: undefined,
              },
              '/step-2': {
                slug: 'step-2',
                next: undefined,
                pageTitle: 'Step 2',
                key: '/step-2',
                fields: [],
                pageCaption: 'Manifest name',
                stepType: undefined,
                beforeFieldsContent: undefined,
                afterFieldsContent: '# Some after content\nContent paragraph',
              },
            })
          })

          it('should set empty values for fields', function () {
            expect(transformed.steps['/step-1'].fields).to.deep.equal([])
            expect(transformed.steps['/step-2'].fields).to.deep.equal([])
          })
        })

        context('with step type', function () {
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
                type: 'interruption-card',
              },
            ]

            transformed = frameworksService.transformManifest('key', {
              steps,
              name: 'Manifest name',
            })
          })

          it('should contain correct number of manifest keys', function () {
            expect(Object.keys(transformed)).to.have.length(4)
          })

          it('should contain correct manifest key', function () {
            expect(Object.keys(transformed)).to.deep.equal([
              'key',
              'name',
              'order',
              'steps',
            ])
          })

          it('should set key', function () {
            expect(transformed.key).to.equal('key')
          })

          it('should set name', function () {
            expect(transformed.name).to.equal('Manifest name')
          })

          it('should transform content correctly', function () {
            expect(transformed.steps).to.deep.equal({
              '/step-1': {
                slug: 'step-1',
                next: 'step-2',
                pageTitle: 'Step 1',
                key: '/step-1',
                fields: [],
                pageCaption: 'Manifest name',
                stepType: undefined,
                beforeFieldsContent: undefined,
                afterFieldsContent: undefined,
              },
              '/step-2': {
                slug: 'step-2',
                next: undefined,
                pageTitle: 'Step 2',
                key: '/step-2',
                fields: [],
                pageCaption: 'Manifest name',
                stepType: 'interruption-card',
                beforeFieldsContent: undefined,
                afterFieldsContent: undefined,
              },
            })
          })

          it('should set empty values for fields', function () {
            expect(transformed.steps['/step-1'].fields).to.deep.equal([])
            expect(transformed.steps['/step-2'].fields).to.deep.equal([])
          })
        })

        context('with order', function () {
          let transformed

          beforeEach(function () {
            transformed = frameworksService.transformManifest('key', {
              name: 'Manifest name',
              order: 2,
            })
          })

          it('should contain correct number of manifest keys', function () {
            expect(Object.keys(transformed)).to.have.length(4)
          })

          it('should set order', function () {
            expect(transformed.order).to.equal(2)
          })
        })
      })
    })

    describe('#getFramework', function () {
      let framework

      context('with files', function () {
        afterEach(function () {
          mockFs.restore()
        })

        context('without framework', function () {
          it('should throw an error', function () {
            expect(() => frameworksService.getFramework({ version: '0.1.0' }))
              .to.throw(Error, 'You must specify a framework name')
              .with.property('code', 'MISSING_FRAMEWORK')
          })
        })

        context('without framework version', function () {
          it('should throw an error', function () {
            expect(() =>
              frameworksService.getFramework({ framework: 'framework-name' })
            )
              .to.throw(Error, 'You must specify a framework version')
              .with.property('code', 'MISSING_FRAMEWORK_VERSION')
          })
        })

        context('with framework and version', function () {
          const mockFrameworkName = 'framework-name'
          const mockVersion = '2.0.1'
          const expectedOutput = {
            sections: {
              'section-one': {
                key: 'section-one',
              },
              'section-two': {
                key: 'section-two',
              },
            },
            questions: {
              'question-one': {
                name: 'question-one',
              },
              'question-two': {
                name: 'question-two',
              },
            },
          }

          beforeEach(function () {
            const sectionsFolder = path.resolve(
              mockFrameworksFolder,
              mockVersion,
              'frameworks',
              mockFrameworkName,
              'manifests'
            )
            const questionsFolder = path.resolve(
              mockFrameworksFolder,
              mockVersion,
              'frameworks',
              mockFrameworkName,
              'questions'
            )

            mockFs({
              [sectionsFolder]: {
                'section-one': '{"key": "section-one"}',
                'section-two': '{"key": "section-two"}',
              },
              [questionsFolder]: {
                'question-one': '{"name": "question-one"}',
                'question-two': '{"name": "question-two"}',
              },
            })

            framework = frameworksService.getFramework({
              framework: mockFrameworkName,
              version: mockVersion,
            })
          })

          describe('on first call', function () {
            it('should return the framework from files', function () {
              expect(framework).to.deep.equal(expectedOutput)
            })
          })

          describe('on subsequent call', function () {
            it('should have set framework to cache', function () {
              expect(frameworksService.cache).to.deep.equal({
                'framework-name:v2.0.1': expectedOutput,
              })
            })

            it('should return the framework from cache', function () {
              framework = frameworksService.getFramework({
                framework: mockFrameworkName,
                version: mockVersion,
              })

              expect(framework).to.deep.equal(expectedOutput)
            })
          })
        })
      })

      context('without files', function () {
        it('should throw an error', function () {
          expect(() =>
            frameworksService.getFramework({
              framework: 'framework-name',
              version: '0.1.0',
            })
          )
            .to.throw(Error, 'Version 0.1.0 of the framework is not supported')
            .with.property('code', 'UNSUPPORTED_FRAMEWORK')
        })
      })
    })

    describe('#getPersonEscortRecord', function () {
      let framework
      const mockFramework = {
        sections: ['a', 'b'],
        questions: ['1', '2'],
      }

      beforeEach(function () {
        sinon.stub(frameworksService, 'getFramework').returns(mockFramework)
      })

      context('with version', function () {
        const mockVersion = '0.1.2'

        beforeEach(function () {
          framework = frameworksService.getPersonEscortRecord(mockVersion)
        })

        it('should call getFramework method with version argument', function () {
          expect(
            frameworksService.getFramework
          ).to.have.been.calledOnceWithExactly({
            framework: 'person-escort-record',
            version: mockVersion,
          })
        })

        it('should return a framework', function () {
          expect(framework).to.deep.equal(mockFramework)
        })
      })

      context('without version', function () {
        beforeEach(function () {
          frameworksService.getPersonEscortRecord()
        })

        it('should call getFramework method with config version', function () {
          expect(
            frameworksService.getFramework
          ).to.have.been.calledOnceWithExactly({
            framework: 'person-escort-record',
            version: mockFrameworksVersion,
          })
        })

        it('should return a framework', function () {
          expect(framework).to.deep.equal(mockFramework)
        })
      })
    })
  })
})
