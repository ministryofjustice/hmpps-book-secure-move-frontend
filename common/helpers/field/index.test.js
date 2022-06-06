const { cloneDeep, set } = require('lodash')

const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

const fieldHelpers = require('./')
const {
  mapReferenceDataToOption,
  renderConditionalFields,
  setFieldValue,
  translateField,
  insertInitialOption,
  insertItemConditional,
  populateAssessmentFields,
} = fieldHelpers

const mockAssessmentQuestions = [
  {
    id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
    key: 'special_diet_or_allergy',
    category: 'health',
    title: 'Special diet or allergy',
  },
  {
    id: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
    key: 'medication',
    category: 'health',
    title: 'Medication',
  },
  {
    id: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
    key: 'special_vehicle',
    category: 'health',
    title: 'Requires special vehicle',
  },
]

describe('Form helpers', function () {
  describe('#mapReferenceDataToOption()', function () {
    context('by default', function () {
      it('should return correctly formatted option', function () {
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

    context('with conditional property', function () {
      it('should return correctly formatted option', function () {
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

    context('with key property', function () {
      it('should return correctly formatted option', function () {
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

  describe('#renderConditionalFields()', function () {
    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('when field doesn’t contain items', function () {
      it('should return the original field as object', function () {
        const field = ['court', { name: 'court' }]
        const response = renderConditionalFields(field)

        expect(response).to.deep.equal(['court', { name: 'court' }])
      })
    })

    context('when field contains items', function () {
      context('when conditional is a string', function () {
        context('when field exists', function () {
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

          beforeEach(function () {
            response = renderConditionalFields(field, 0, fields)
          })

          it('should call component service for each item', function () {
            expect(componentService.getComponent).to.be.calledTwice
          })

          it('should call component service with correct args', function () {
            expect(
              componentService.getComponent.firstCall
            ).to.be.calledWithExactly('govukInput', {
              component: 'govukInput',
              classes: 'input-classes',
            })
          })

          it('should call component service with correct args', function () {
            expect(
              componentService.getComponent.secondCall
            ).to.be.calledWithExactly('govukTextarea', {
              component: 'govukTextarea',
              classes: 'input-classes',
            })
          })

          it('should render conditional content', function () {
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

        context('when field doesn’t exist', function () {
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

          beforeEach(function () {
            response = renderConditionalFields(field)
          })

          it('should not call component service for each item', function () {
            expect(componentService.getComponent).not.to.be.called
          })

          it('should render original item', function () {
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

      context('when conditional is not a string ', function () {
        const field = [
          'field',
          {
            id: 'field',
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

        beforeEach(function () {
          response = renderConditionalFields(field)
        })

        it('should not call component service for each item', function () {
          expect(componentService.getComponent).not.to.be.called
        })

        it('should render conditional content', function () {
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

      context('when conditional is an array', function () {
        const field = [
          'field',
          {
            id: 'field',
            name: 'field',
            items: [
              {
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: [
                  'conditional_field_one',
                  'conditional_field_two',
                  'unknown_field',
                ],
              },
              {
                value: '31b90233-7043-4633-8055-f24854545eac',
                text: 'Item two',
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

        beforeEach(function () {
          response = renderConditionalFields(field, 0, fields)
        })

        it('should call component service for each item', function () {
          expect(componentService.getComponent).to.be.calledTwice
        })

        it('should call component service with correct args', function () {
          expect(
            componentService.getComponent.firstCall
          ).to.be.calledWithExactly('govukInput', {
            component: 'govukInput',
            classes: 'input-classes',
          })
        })

        it('should call component service with correct args', function () {
          expect(
            componentService.getComponent.secondCall
          ).to.be.calledWithExactly('govukTextarea', {
            component: 'govukTextarea',
            classes: 'input-classes',
          })
        })

        it('should render conditional content', function () {
          expect(response[1].items).to.deep.equal([
            {
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: 'govukInputgovukTextarea',
              },
            },
            {
              value: '31b90233-7043-4633-8055-f24854545eac',
              text: 'Item two',
            },
          ])
        })
      })
    })
  })

  describe('#setFieldValue()', function () {
    context('when field doesn’t contain items', function () {
      context('when value doesn’t exists', function () {
        it('should set empty value property', function () {
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

      context('when value exists', function () {
        it('should set value property', function () {
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

    context('when field contains items', function () {
      context('when value doesn’t exists', function () {
        it('should set return original items', function () {
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

      context('when value exists', function () {
        context('when item value is in array', function () {
          it('should correctly set selected/checked', function () {
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

        context('when item value is not in array', function () {
          it('should correctly set selected/checked', function () {
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

  describe('#translateField()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
    })

    context('when no translation properties exist', function () {
      let response
      const field = ['field', { name: 'field' }]

      beforeEach(function () {
        response = translateField(field)
      })

      it('should not call translation method', function () {
        expect(i18n.t).not.to.be.called
      })

      it('should return original field', function () {
        expect(response).to.deep.equal(field)
      })
    })

    context('when single translation property exists', function () {
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
        summaryHtml: {
          summaryHtml: 'summaryHtml',
        },
      }

      const fieldContexts = [undefined, 'foo']
      fieldContexts.forEach(fieldContext => {
        Object.entries(scenarios).forEach(function ([path, properties]) {
          describe(path, function () {
            let field, response
            const fieldProperties = {
              ...defaultProperties,
              ...cloneDeep(properties),
              context: fieldContext,
            }

            beforeEach(function () {
              field = ['field', fieldProperties]

              response = translateField(field)
            })

            it('should call translation with correct value', function () {
              expect(i18n.t).to.be.calledOnceWithExactly(path, {
                context: fieldContext,
              })
            })

            it('should return translated field', function () {
              const translated = cloneDeep(fieldProperties)
              set(translated, path, '__translated__')

              expect(response).to.deep.equal([
                'field',
                { ...fieldProperties, ...translated },
              ])
            })

            it('should not mutate original field', function () {
              expect(field).to.deep.equal(['field', fieldProperties])
            })
          })
        })
      })
    })

    context('when multiple translation properties exist', function () {
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

      beforeEach(function () {
        response = translateField(field)
      })

      it('should call translation correct amount of times', function () {
        expect(i18n.t).to.be.calledThrice
      })

      it('should return translated field', function () {
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

      it('should not mutate original field', function () {
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

    context('when field contains items', function () {
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

      beforeEach(function () {
        response = translateField(field)
      })

      it('should call translation correct amount of times', function () {
        expect(i18n.t).to.be.calledTwice
      })

      it('should return translated field with items', function () {
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

      it('should not mutate original field', function () {
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

  describe('#insertInitialOption()', function () {
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

    beforeEach(function () {
      sinon.stub(i18n, 't').returns('-- Label --')
    })

    context('with default label', function () {
      let items

      beforeEach(function () {
        items = insertInitialOption(mockItems)
      })

      it('should insert default option at the front', function () {
        expect(items).to.deep.equal([
          {
            text: '-- Label --',
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

      it('should translate label', function () {
        expect(i18n.t).to.be.called.calledOnceWithExactly('initial_option', {
          label: 'option',
        })
      })
    })

    context('with custom label', function () {
      let items

      beforeEach(function () {
        items = insertInitialOption(mockItems, 'gender')
      })

      it('should insert custom option at the front', function () {
        expect(items).to.deep.equal([
          {
            text: '-- Label --',
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

      it('should translate label', function () {
        expect(i18n.t).to.be.called.calledOnceWithExactly('initial_option', {
          label: 'gender',
        })
      })
    })
  })

  describe('#insertItemConditional()', function () {
    const conditionalField = 'conditional_field'
    let response

    context('when key matches item', function () {
      context('when conditional already exists', function () {
        const field = {
          name: 'match',
          key: 'match',
          conditional: 'original_conditional_field',
        }
        beforeEach(function () {
          response = insertItemConditional({
            key: 'match',
            field: conditionalField,
          })(field)
        })

        it('should overwrite conditional field', function () {
          expect(response).to.deep.equal({
            name: 'match',
            key: 'match',
            conditional: 'conditional_field',
          })
        })
      })

      context('when no conditional exists', function () {
        const field = { name: 'match', key: 'match' }

        beforeEach(function () {
          response = insertItemConditional({
            key: 'match',
            field: conditionalField,
          })(field)
        })

        it('should add conditional field', function () {
          expect(response).to.deep.equal({
            name: 'match',
            key: 'match',
            conditional: 'conditional_field',
          })
        })
      })
    })

    context('when key does not match item', function () {
      const field = { name: 'field', key: 'field' }

      beforeEach(function () {
        response = insertItemConditional({
          key: 'no_match',
          field: conditionalField,
        })(field)
      })

      it('should return original item', function () {
        expect(response).to.deep.equal({ name: 'field', key: 'field' })
      })
    })
  })

  describe('#populateAssessmentFields()', function () {
    let fields

    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(i18n, 'exists').returns(true)
    })

    context('with only implicit fields', function () {
      const mockFields = {
        special_diet_or_allergy: {},
        medication: {},
      }

      beforeEach(function () {
        fields = populateAssessmentFields(mockFields, mockAssessmentQuestions)
      })

      it('should create implicit field', function () {
        expect(fields).to.contain.property('health')
        expect(fields.health).to.deep.equal({
          name: 'health',
          component: 'govukCheckboxes',
          multiple: true,
          items: [
            {
              value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              text: 'fields::health.items.special_diet_or_allergy.label',
              hint: {
                text: 'fields::health.items.special_diet_or_allergy.hint',
              },
              key: 'special_diet_or_allergy',
              conditional: 'special_diet_or_allergy',
            },
            {
              value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
              text: 'fields::health.items.medication.label',
              hint: {
                text: 'fields::health.items.medication.hint',
              },
              key: 'medication',
              conditional: 'medication',
            },
          ],
          fieldset: {
            legend: {
              text: 'fields::health.label',
              classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
            },
          },
          hint: { text: 'fields::health.hint' },
        })
      })

      it('should append dependent field properties', function () {
        expect(fields.special_diet_or_allergy).to.deep.equal({
          dependent: {
            field: 'health',
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
          },
        })
        expect(fields.medication).to.deep.equal({
          dependent: {
            field: 'health',
            value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
          },
        })
      })

      it('should return the correct number of fields', function () {
        expect(Object.keys(fields).length).to.equal(3)
      })
    })

    context('with only explicit fields', function () {
      const mockFields = {
        special_diet_or_allergy: {
          explicit: true,
        },
        medication: {
          explicit: true,
        },
      }

      beforeEach(function () {
        fields = populateAssessmentFields(mockFields, mockAssessmentQuestions)
      })

      it('should not create impicit field', function () {
        expect(fields).not.to.contain.property('health')
      })

      it('should create medication explicit field', function () {
        expect(fields).to.contain.property('medication__explicit')
        expect(fields.medication__explicit).to.deep.equal({
          name: 'medication__explicit',
          validate: 'required',
          component: 'govukRadios',
          fieldset: {
            legend: {
              text: 'fields::medication__explicit.label',
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: { text: 'fields::medication__explicit.hint' },
          items: [
            {
              value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
              conditional: 'medication',
              text: 'Yes',
            },
            { value: 'false', text: 'No' },
          ],
        })
      })

      it('should create special diet explicit field', function () {
        expect(fields).to.contain.property('special_diet_or_allergy__explicit')
        expect(fields.special_diet_or_allergy__explicit).to.deep.equal({
          name: 'special_diet_or_allergy__explicit',
          validate: 'required',
          component: 'govukRadios',
          fieldset: {
            legend: {
              text: 'fields::special_diet_or_allergy__explicit.label',
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: { text: 'fields::special_diet_or_allergy__explicit.hint' },
          items: [
            {
              value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              conditional: 'special_diet_or_allergy',
              text: 'Yes',
            },
            { value: 'false', text: 'No' },
          ],
        })
      })

      it('should append dependent field properties', function () {
        expect(fields.special_diet_or_allergy).to.deep.equal({
          dependent: {
            field: 'special_diet_or_allergy__explicit',
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
          },
          explicit: true,
        })
        expect(fields.medication).to.deep.equal({
          dependent: {
            field: 'medication__explicit',
            value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
          },
          explicit: true,
        })
      })

      it('should return the correct number of fields', function () {
        expect(Object.keys(fields).length).to.equal(4)
      })
    })

    context('with both implicit and explicit fields', function () {
      const mockImplicitField = {
        skip: true,
        implicit: true,
      }
      const mockFields = {
        special_diet_or_allergy: mockImplicitField,
        special_vehicle: mockImplicitField,
        medication: {
          explicit: true,
        },
      }

      beforeEach(function () {
        fields = populateAssessmentFields(mockFields, mockAssessmentQuestions)
      })

      it('should create impicit field', function () {
        expect(fields).to.contain.property('health')
        expect(fields.health).to.deep.equal({
          name: 'health',
          component: 'govukCheckboxes',
          multiple: true,
          items: [
            {
              value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
              text: 'fields::health.items.special_diet_or_allergy.label',
              hint: {
                text: 'fields::health.items.special_diet_or_allergy.hint',
              },
              key: 'special_diet_or_allergy',
              conditional: 'special_diet_or_allergy',
            },
            {
              value: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
              text: 'fields::health.items.special_vehicle.label',
              hint: {
                text: 'fields::health.items.special_vehicle.hint',
              },
              key: 'special_vehicle',
              conditional: 'special_vehicle',
            },
          ],
          fieldset: {
            legend: {
              text: 'fields::health.label',
              classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
            },
          },
          hint: { text: 'fields::health.hint' },
        })
      })

      it('should create medication explicit field', function () {
        expect(fields).to.contain.property('medication__explicit')
        expect(fields.medication__explicit).to.deep.equal({
          name: 'medication__explicit',
          validate: 'required',
          component: 'govukRadios',
          fieldset: {
            legend: {
              text: 'fields::medication__explicit.label',
              classes: 'govuk-fieldset__legend--m',
            },
          },
          hint: { text: 'fields::medication__explicit.hint' },
          items: [
            {
              value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
              conditional: 'medication',
              text: 'Yes',
            },
            { value: 'false', text: 'No' },
          ],
        })
      })

      it('should append dependent field properties', function () {
        expect(fields.medication).to.deep.equal({
          dependent: {
            field: 'medication__explicit',
            value: '7ac3ffc9-57ac-4d0f-aa06-ad15b55c3cee',
          },
          explicit: true,
        })
        expect(fields.special_diet_or_allergy).to.deep.equal({
          skip: true,
          implicit: true,
          dependent: {
            field: 'health',
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
          },
        })
        expect(fields.special_vehicle).to.deep.equal({
          skip: true,
          implicit: true,
          dependent: {
            field: 'health',
            value: '1a73d31a-8dd4-47b6-90a0-15ce4e332539',
          },
        })
      })

      it('should return the correct number of fields', function () {
        expect(Object.keys(fields).length).to.equal(5)
      })
    })

    context('with missing translation keys', function () {
      const mockFields = {
        special_diet_or_allergy: {},
      }

      beforeEach(function () {
        i18n.exists.returns(false)
        fields = populateAssessmentFields(mockFields, mockAssessmentQuestions)
      })

      it('should not render translation keys', function () {
        expect(fields.health.items).to.deep.equal([
          {
            value: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
            text: 'Special diet or allergy',
            key: 'special_diet_or_allergy',
            conditional: 'special_diet_or_allergy',
          },
        ])
      })
    })

    context('with no implicit or explicit fields', function () {
      beforeEach(function () {
        fields = populateAssessmentFields({}, mockAssessmentQuestions)
      })

      it('should return original fields', function () {
        expect(fields).to.deep.equal({})
      })
    })
  })

  describe('#processFields()', function () {
    context('when method is called', function () {
      const fields = { foo: { component: 'foo' }, bar: { component: 'bar' } }
      const values = { foo: 'baz' }
      const errors = { foo: 'required' }
      let setFieldValueStub
      let setFieldErrorStub

      beforeEach(function () {
        setFieldValueStub = sinon.stub().returnsArg(0)
        setFieldErrorStub = sinon.stub().returnsArg(0)
        sinon.stub(fieldHelpers, 'setFieldValue').returns(setFieldValueStub)
        sinon.stub(fieldHelpers, 'setFieldError').returns(setFieldErrorStub)
        sinon.stub(fieldHelpers, 'translateField').returnsArg(0)
        sinon.stub(fieldHelpers, 'renderConditionalFields').returnsArg(0)

        fieldHelpers.processFields(fields, values, errors)
      })

      it('should create setFieldValue method with values', function () {
        expect(fieldHelpers.setFieldValue).to.be.calledOnceWithExactly(values)
      })
      it('should invoke the initialised setFieldValue method on the fields', function () {
        expect(setFieldValueStub).to.be.calledTwice
        expect(setFieldValueStub.firstCall.args[0]).to.deep.equal([
          'foo',
          { component: 'foo' },
        ])
        expect(setFieldValueStub.secondCall.args[0]).to.deep.equal([
          'bar',
          { component: 'bar' },
        ])
      })
      it('should create setFieldError method with errors', function () {
        expect(fieldHelpers.setFieldError).to.be.calledOnceWithExactly(errors)
      })
      it('should invoke the initialised setFieldError method on the fields', function () {
        expect(setFieldErrorStub).to.be.calledTwice
        expect(setFieldErrorStub.firstCall.args[0]).to.deep.equal([
          'foo',
          { component: 'foo' },
        ])
        expect(setFieldErrorStub.secondCall.args[0]).to.deep.equal([
          'bar',
          { component: 'bar' },
        ])
      })

      it('should invoke the translateField method on the fields', function () {
        expect(fieldHelpers.translateField).to.be.calledTwice
        expect(fieldHelpers.translateField.firstCall.args[0]).to.deep.equal([
          'foo',
          { component: 'foo' },
        ])
        expect(fieldHelpers.translateField.secondCall.args[0]).to.deep.equal([
          'bar',
          { component: 'bar' },
        ])
      })

      it('should invoke the renderConditionalFields method on the fields', function () {
        expect(fieldHelpers.renderConditionalFields).to.be.calledTwice
        expect(
          fieldHelpers.renderConditionalFields.firstCall.args[0]
        ).to.deep.equal(['foo', { component: 'foo' }])
        expect(
          fieldHelpers.renderConditionalFields.secondCall.args[0]
        ).to.deep.equal(['bar', { component: 'bar' }])
      })
    })
  })
})
