const { cloneDeep, set } = require('lodash')
const componentService = require('../services/component')

const {
  mapReferenceDataToOption,
  renderConditionalFields,
  setFieldValue,
  setFieldError,
  translateField,
  insertInitialOption,
  insertItemConditional,
  mapPersonToOption,
  appendDependent,
  decorateWithExplicitFields,
  mapDependentFields,
} = require('./field')

const personMock = {
  id: '7777',
  first_names: 'Baz',
  last_name: 'Boo',
  fullname: 'Baz, Boo',
  date_of_birth: '1948-04-24',
  gender: {
    id: '9999',
    title: 'Trans',
  },
  ethnicity: {
    id: '8888',
    title: 'Foo',
  },
  identifiers: [
    {
      identifier_type: 'police_national_computer',
      value: '2222',
    },
  ],
}

describe('Form helpers', function() {
  describe('#mapReferenceDataToOption()', function() {
    context('by default', function() {
      it('should return correctly formatted option', function() {
        const option = mapReferenceDataToOption({
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          title: 'Foo',
        })

        expect(option).to.deep.equal({
          value: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          text: 'Foo',
        })
      })
    })

    context('with conditional property', function() {
      it('should return correctly formatted option', function() {
        const option = mapReferenceDataToOption({
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          title: 'Foo',
          conditional: 'Some conditional content',
        })

        expect(option).to.deep.equal({
          value: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          text: 'Foo',
          conditional: 'Some conditional content',
        })
      })
    })

    context('with key property', function() {
      it('should return correctly formatted option', function() {
        const option = mapReferenceDataToOption({
          key: 'unique_key',
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          title: 'Foo',
        })

        expect(option).to.deep.equal({
          key: 'unique_key',
          value: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          text: 'Foo',
        })
      })
    })
  })

  describe('#renderConditionalFields()', function() {
    beforeEach(function() {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('when field doesn’t contain items', function() {
      it('should return the original field as object', function() {
        const field = ['court', { name: 'court' }]
        const response = renderConditionalFields(field)

        expect(response).to.deep.equal(['court', { name: 'court' }])
      })
    })

    context('when field contains items', function() {
      context('when conditional is a string', function() {
        context('when field exists', function() {
          const field = [
            'field',
            {
              name: 'field',
              items: [
                {
                  value: '31b90233-7043-4633-8055-f24854545ead',
                  text: 'Item one',
                  conditional: 'conditional_field_one',
                },
                {
                  value: '31b90233-7043-4633-8055-f24854545eac',
                  text: 'Item two',
                  conditional: 'conditional_field_two',
                },
              ],
            },
          ]
          const fields = [
            ...field,
            [
              'conditional_field_one',
              {
                component: 'govukInput',
                classes: 'input-classes',
              },
            ],
            [
              'conditional_field_two',
              {
                component: 'govukTextarea',
                classes: 'input-classes',
              },
            ],
          ]
          let response

          beforeEach(function() {
            response = renderConditionalFields(field, 0, fields)
          })

          it('should call component service for each item', function() {
            expect(componentService.getComponent).to.be.calledTwice
          })

          it('should call component service with correct args', function() {
            expect(
              componentService.getComponent.firstCall
            ).to.be.calledWithExactly('govukInput', {
              component: 'govukInput',
              classes: 'input-classes',
              id: 'conditional_field_one',
              name: 'conditional_field_one',
            })
          })

          it('should call component service with correct args', function() {
            expect(
              componentService.getComponent.secondCall
            ).to.be.calledWithExactly('govukTextarea', {
              component: 'govukTextarea',
              classes: 'input-classes',
              id: 'conditional_field_two',
              name: 'conditional_field_two',
            })
          })

          it('should render conditional content', function() {
            expect(response[1].items).to.deep.equal([
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: {
                  html: 'govukInput',
                },
              },
              {
                value: '31b90233-7043-4633-8055-f24854545eac',
                text: 'Item two',
                conditional: {
                  html: 'govukTextarea',
                },
              },
            ])
          })
        })

        context('when field doesn’t exist', function() {
          const field = [
            'field',
            {
              name: 'field',
              items: [
                {
                  value: '31b90233-7043-4633-8055-f24854545ead',
                  text: 'Item one',
                  conditional: 'doesnotexist',
                },
              ],
            },
          ]
          let response

          beforeEach(function() {
            response = renderConditionalFields(field)
          })

          it('should not call component service for each item', function() {
            expect(componentService.getComponent).not.to.be.called
          })

          it('should render original item', function() {
            expect(response[1].items).to.deep.equal([
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: 'doesnotexist',
              },
            ])
          })
        })
      })

      context('when conditional is not a string ', function() {
        const field = [
          'field',
          {
            name: 'field',
            items: [
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: {
                  html: '<strong>HTML</strong> content',
                },
              },
            ],
          },
        ]
        let response

        beforeEach(function() {
          response = renderConditionalFields(field)
        })

        it('should not call component service for each item', function() {
          expect(componentService.getComponent).not.to.be.called
        })

        it('should render conditional content', function() {
          expect(response[1].items).to.deep.equal([
            {
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: '<strong>HTML</strong> content',
              },
            },
          ])
        })
      })
    })
  })

  describe('#setFieldValue()', function() {
    context('when field doesn’t contain items', function() {
      context('when value doesn’t exists', function() {
        it('should set empty value property', function() {
          const field = ['court', { name: 'court' }]
          const response = setFieldValue({})(field)

          expect(response).to.deep.equal([
            'court',
            {
              name: 'court',
              value: undefined,
            },
          ])
        })
      })

      context('when value exists', function() {
        it('should set value property', function() {
          const values = {
            court: 'court val',
          }
          const field = ['court', { name: 'court' }]
          const response = setFieldValue(values)(field)

          expect(response).to.deep.equal([
            'court',
            {
              name: 'court',
              value: 'court val',
            },
          ])
        })
      })
    })

    context('when field contains items', function() {
      context('when value doesn’t exists', function() {
        it('should set return original items', function() {
          const field = [
            'court',
            {
              name: 'court',
              items: [
                {
                  value: 'one',
                  text: 'Item one',
                },
                {
                  value: 'two',
                  text: 'Item two',
                },
              ],
            },
          ]
          const response = setFieldValue({})(field)

          expect(response).to.deep.equal(field)
        })
      })

      context('when value exists', function() {
        context('when item value is in array', function() {
          it('should correctly set selected/checked', function() {
            const values = {
              court: ['one', 'three'],
            }
            const field = [
              'court',
              {
                name: 'court',
                items: [
                  {
                    value: 'one',
                    text: 'Item one',
                  },
                  {
                    value: 'two',
                    text: 'Item two',
                  },
                ],
              },
            ]
            const response = setFieldValue(values)(field)

            expect(response[1].items).to.deep.equal([
              {
                value: 'one',
                text: 'Item one',
                selected: true,
                checked: true,
              },
              {
                value: 'two',
                text: 'Item two',
                selected: false,
                checked: false,
              },
            ])
          })
        })

        context('when item value is not in array', function() {
          it('should correctly set selected/checked', function() {
            const values = {
              court: 'two',
            }
            const field = [
              'court',
              {
                name: 'court',
                items: [
                  {
                    value: 'one',
                    text: 'Item one',
                  },
                  {
                    value: 'two',
                    text: 'Item two',
                  },
                ],
              },
            ]
            const response = setFieldValue(values)(field)

            expect(response[1].items).to.deep.equal([
              {
                value: 'one',
                text: 'Item one',
                selected: false,
                checked: false,
              },
              {
                value: 'two',
                text: 'Item two',
                selected: true,
                checked: true,
              },
            ])
          })
        })
      })
    })
  })

  describe('#setFieldError()', function() {
    let translateStub

    beforeEach(function() {
      translateStub = sinon.stub().returnsArg(0)
    })

    context('when no error exists', function() {
      let response
      const field = ['field', { name: 'field' }]

      beforeEach(function() {
        response = setFieldError({}, translateStub)(field)
      })

      it('should not call translation method', function() {
        expect(translateStub).not.to.be.called
      })

      it('should return original field', function() {
        expect(response).to.deep.equal(field)
      })
    })

    context('when error exists', function() {
      const errors = {
        error_field: {
          type: 'required',
          key: 'error_field',
        },
      }
      let field, response

      beforeEach(function() {
        field = ['error_field', { name: 'error_field' }]

        response = setFieldError(errors, translateStub)(field)
      })

      it('should call translation correct amount of times', function() {
        expect(translateStub).to.be.calledTwice
      })

      it('should call translation with correct values', function() {
        expect(translateStub.firstCall).to.be.calledWithExactly(
          'fields::error_field.label'
        )
        expect(translateStub.secondCall).to.be.calledWithExactly(
          'validation::required'
        )
      })

      it('should return field with error message', function() {
        expect(response).to.deep.equal([
          'error_field',
          {
            name: 'error_field',
            errorMessage: {
              html: 'fields::error_field.label validation::required',
            },
          },
        ])
      })

      it('should not mutate original field', function() {
        expect(field).to.deep.equal(['error_field', { name: 'error_field' }])
      })
    })
  })

  describe('#translateField()', function() {
    let translateStub

    beforeEach(function() {
      translateStub = sinon.stub().returns('__translated__')
    })

    context('when no translation properties exist', function() {
      let response
      const field = ['field', { name: 'field' }]

      beforeEach(function() {
        response = translateField(translateStub)(field)
      })

      it('should not call translation method', function() {
        expect(translateStub).not.to.be.called
      })

      it('should return original field', function() {
        expect(response).to.deep.equal(field)
      })
    })

    context('when single translation property exists', function() {
      const defaultProperties = { name: 'field' }
      const scenarios = {
        'label.text': {
          label: {
            text: 'label.text',
          },
        },
        'label.html': {
          label: {
            html: 'label.html',
          },
        },
        'hint.text': {
          hint: {
            text: 'hint.text',
          },
        },
        'hint.html': {
          hint: {
            html: 'hint.html',
          },
        },
        'fieldset.legend.text': {
          fieldset: {
            legend: {
              text: 'fieldset.legend.text',
            },
          },
        },
        'fieldset.legend.html': {
          fieldset: {
            legend: {
              html: 'fieldset.legend.html',
            },
          },
        },
        'heading.text': {
          heading: {
            text: 'heading.text',
          },
        },
        'heading.html': {
          heading: {
            html: 'heading.html',
          },
        },
      }

      Object.entries(scenarios).forEach(function([path, properties]) {
        describe(path, function() {
          let field, response

          beforeEach(function() {
            field = [
              'field',
              { ...defaultProperties, ...cloneDeep(properties) },
            ]

            response = translateField(translateStub)(field)
          })

          it('should call translation with correct value', function() {
            expect(translateStub).to.be.calledOnceWithExactly(path)
          })

          it('should return translated field', function() {
            const translated = cloneDeep(properties)
            set(translated, path, '__translated__')

            expect(response).to.deep.equal([
              'field',
              { ...defaultProperties, ...translated },
            ])
          })

          it('should not mutate original field', function() {
            expect(field).to.deep.equal([
              'field',
              { ...defaultProperties, ...cloneDeep(properties) },
            ])
          })
        })
      })
    })

    context('when multiple translation properties exist', function() {
      const field = [
        'field',
        {
          name: 'field',
          label: {
            text: 'label.text',
          },
          hint: {
            html: 'hint.html',
          },
          fieldset: {
            legend: {
              text: 'fieldset.legend.text',
            },
          },
        },
      ]
      let response

      beforeEach(function() {
        response = translateField(translateStub)(field)
      })

      it('should call translation correct amount of times', function() {
        expect(translateStub).to.be.calledThrice
      })

      it('should return translated field', function() {
        expect(response).to.deep.equal([
          'field',
          {
            name: 'field',
            label: {
              text: '__translated__',
            },
            hint: {
              html: '__translated__',
            },
            fieldset: {
              legend: {
                text: '__translated__',
              },
            },
          },
        ])
      })

      it('should not mutate original field', function() {
        expect(field).to.deep.equal([
          'field',
          {
            name: 'field',
            label: {
              text: 'label.text',
            },
            hint: {
              html: 'hint.html',
            },
            fieldset: {
              legend: {
                text: 'fieldset.legend.text',
              },
            },
          },
        ])
      })
    })

    context('when field contains items', function() {
      const field = [
        'field',
        {
          name: 'field',
          items: [
            {
              text: 'items.text',
              value: 'Text item',
            },
            {
              html: 'items.html',
              value: 'HTML item',
            },
          ],
        },
      ]
      let response

      beforeEach(function() {
        response = translateField(translateStub)(field)
      })

      it('should call translation correct amount of times', function() {
        expect(translateStub).to.be.calledTwice
      })

      it('should return translated field with items', function() {
        expect(response).to.deep.equal([
          'field',
          {
            name: 'field',
            items: [
              {
                text: '__translated__',
                value: 'Text item',
              },
              {
                html: '__translated__',
                value: 'HTML item',
              },
            ],
          },
        ])
      })

      it('should not mutate original field', function() {
        expect(field).to.deep.equal([
          'field',
          {
            name: 'field',
            items: [
              {
                text: 'items.text',
                value: 'Text item',
              },
              {
                html: 'items.html',
                value: 'HTML item',
              },
            ],
          },
        ])
      })
    })
  })

  describe('#insertInitialOption()', function() {
    const mockItems = [
      {
        value: 'foo',
        text: 'Foo',
      },
      {
        value: 'bar',
        text: 'Bar',
      },
    ]

    context('with default label', function() {
      it('should insert default option at the front', function() {
        const items = insertInitialOption(mockItems)

        expect(items).to.deep.equal([
          {
            text: '--- Choose option ---',
          },
          {
            value: 'foo',
            text: 'Foo',
          },
          {
            value: 'bar',
            text: 'Bar',
          },
        ])
      })
    })

    context('with custom label', function() {
      it('should insert custom option at the front', function() {
        const items = insertInitialOption(mockItems, 'gender')

        expect(items).to.deep.equal([
          {
            text: '--- Choose gender ---',
          },
          {
            value: 'foo',
            text: 'Foo',
          },
          {
            value: 'bar',
            text: 'Bar',
          },
        ])
      })
    })
  })

  describe('#insertItemConditional()', function() {
    const conditionalField = 'conditional_field'
    let response

    context('when key matches item', function() {
      context('when conditional already exists', function() {
        const field = {
          name: 'match',
          key: 'match',
          conditional: 'original_conditional_field',
        }
        beforeEach(function() {
          response = insertItemConditional({
            key: 'match',
            field: conditionalField,
          })(field)
        })

        it('should overwrite conditional field', function() {
          expect(response).to.deep.equal({
            name: 'match',
            key: 'match',
            conditional: 'conditional_field',
          })
        })
      })

      context('when no conditional exists', function() {
        const field = { name: 'match', key: 'match' }

        beforeEach(function() {
          response = insertItemConditional({
            key: 'match',
            field: conditionalField,
          })(field)
        })

        it('should add conditional field', function() {
          expect(response).to.deep.equal({
            name: 'match',
            key: 'match',
            conditional: 'conditional_field',
          })
        })
      })
    })

    context('when key does not match item', function() {
      const field = { name: 'field', key: 'field' }

      beforeEach(function() {
        response = insertItemConditional({
          key: 'no_match',
          field: conditionalField,
        })(field)
      })

      it('should return original item', function() {
        expect(response).to.deep.equal({ name: 'field', key: 'field' })
      })
    })
  })

  describe('#mapPersonToOption()', function() {
    let response

    beforeEach(function() {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('with person object', function() {
      beforeEach(function() {
        response = mapPersonToOption(personMock)
      })

      it('should call component correctly', function() {
        expect(componentService.getComponent).to.be.calledOnceWithExactly(
          'appResults',
          {
            items: [
              { label: 'Date of Birth', text: '24 Apr 1948' },
              { label: 'Gender', text: personMock.gender.title },
            ],
          }
        )
      })

      it('should return option', function() {
        expect(response).to.deep.equal({
          text: 'BAZ, BOO',
          label: {
            classes: 'govuk-label--s',
          },
          value: '7777',
          hint: {
            html: 'appResults',
          },
        })
      })
    })

    context('with empty object', function() {
      beforeEach(function() {
        response = mapPersonToOption()
      })

      it('should call component correctly', function() {
        expect(componentService.getComponent).to.be.calledOnceWithExactly(
          'appResults',
          {
            items: [
              { label: 'Date of Birth', text: '' },
              { label: 'Gender', text: '' },
            ],
          }
        )
      })

      it('should return option', function() {
        expect(response).to.deep.equal({
          text: '',
          label: {
            classes: 'govuk-label--s',
          },
          value: '',
          hint: {
            html: 'appResults',
          },
        })
      })
    })
  })

  describe('appendDependent', function() {
    const questions = [
      {
        id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
        type: 'assessment_questions',
        key: 'special_diet_or_allergy',
        category: 'health',
        title: 'Special diet or allergy',
        disabled_at: null,
      },
      {
        id: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
        type: 'assessment_questions',
        key: 'special_vehicle',
        category: 'health',
        title: 'Special vehicle',
        disabled_at: null,
      },
    ]
    const assessmentCategory = 'health'
    const field = {
      explicit: true,
    }
    const key = 'special_vehicle'
    it('for explicit fields', function() {
      const output = appendDependent(questions, assessmentCategory, field, key)
      expect(output).to.deep.equal({
        explicit: true,
        dependent: {
          field: 'special_vehicle__yesno',
          value: 'yes',
        },
      })
    })
    it('for implicit (normal) fields', function() {
      const output = appendDependent(questions, assessmentCategory, {}, key)
      expect(output).to.deep.equal({
        dependent: {
          field: 'health',
          value: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
        },
      })
    })
  })
  describe('decorateWithExplicitFields', function() {
    const questions = [
      {
        id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
        type: 'assessment_questions',
        key: 'special_diet_or_allergy',
        category: 'health',
        title: 'Special diet or allergy',
        disabled_at: null,
      },
      {
        id: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
        type: 'assessment_questions',
        key: 'special_vehicle',
        category: 'health',
        title: 'Special vehicle',
        disabled_at: null,
      },
    ]
    const field = {
      explicit: true,
    }
    const key = 'special_vehicle'
    let fieldsCollection
    beforeEach(function() {
      fieldsCollection = {}
    })
    it('fields remain untouched for implicit (normal) fields', function() {
      decorateWithExplicitFields(questions, fieldsCollection, {}, key)
      expect(fieldsCollection).to.deep.equal({})
    })
    it('creates an additional field for explicit fields', function() {
      decorateWithExplicitFields(questions, fieldsCollection, field, key)
      expect(fieldsCollection).to.deep.equal({
        special_vehicle__yesno: {
          validate: 'required',
          component: 'govukRadios',
          name: 'special_vehicle__yesno',
          fieldset: {
            legend: {
              text: 'fields::special_vehicle__yesno.label',
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: {
            text: 'fields::special_vehicle__yesno.hint',
          },
          items: [
            {
              value: 'yes',
              text: 'Yes',
              conditional: 'special_vehicle',
            },
            {
              value: 'no',
              text: 'No',
            },
          ],
        },
      })
    })
  })

  describe('mapDependentFields', function() {
    const fields = {
      special_diet_or_allergy: {
        skip: true,
      },
      special_vehicle: {
        skip: true,
        validate: 'required',
        explicit: true,
      },
      health: {
        multiple: true,
        items: [
          {
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
            text: 'Special diet or allergy',
            key: 'special_diet_or_allergy',
            conditional: 'special_diet_or_allergy',
          },
        ],
        name: 'health',
      },
    }
    const questions = [
      {
        id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
        type: 'assessment_questions',
        key: 'special_diet_or_allergy',
        category: 'health',
      },
      {
        id: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
        type: 'assessment_questions',
        key: 'special_vehicle',
        category: 'health',
      },
    ]

    it('returns an object', function() {
      expect(mapDependentFields(fields, questions, 'health')).to.be.an('object')
    })

    it('appends the explicit fields and their dependents', async function() {
      expect(mapDependentFields(fields, questions, 'health')).to.deep.equal({
        special_diet_or_allergy: {
          skip: true,
          dependent: {
            field: 'health',
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
          },
        },
        special_vehicle: {
          skip: true,
          validate: 'required',
          explicit: true,
          dependent: {
            field: 'special_vehicle__yesno',
            value: 'yes',
          },
        },
        health: {
          multiple: true,
          items: [
            {
              value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              text: 'Special diet or allergy',
              key: 'special_diet_or_allergy',
              conditional: 'special_diet_or_allergy',
            },
          ],
          name: 'health',
        },
        special_vehicle__yesno: {
          validate: 'required',
          name: 'special_vehicle__yesno',
          component: 'govukRadios',
          fieldset: {
            legend: {
              text: 'fields::special_vehicle__yesno.label',
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: {
            text: 'fields::special_vehicle__yesno.hint',
          },
          items: [
            {
              value: 'yes',
              text: 'Yes',
              conditional: 'special_vehicle',
            },
            {
              value: 'no',
              text: 'No',
            },
          ],
        },
      })
    })
  })
})
