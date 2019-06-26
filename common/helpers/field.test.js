const {
  mapReferenceDataToOption,
  mapAssessmentQuestionToConditionalField,
  renderConditionalFields,
  insertInitialOption,
} = require('./field')

const componentService = require('../services/component')

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

  describe('#mapAssessmentQuestionToConditionalField()', function () {
    context('by default', function () {
      let item, response

      beforeEach(function () {
        item = {
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          category: 'risk',
          key: 'violent',
        }

        response = mapAssessmentQuestionToConditionalField(item)
      })

      it('should add conditional property', function () {
        expect(response).to.have.property('conditional')
        expect(response.conditional).to.equal('risk__violent')
      })

      it('should keep original properties', function () {
        expect(response).to.deep.equal({
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          category: 'risk',
          key: 'violent',
          conditional: 'risk__violent',
        })
      })

      it('should not mutate original item', function () {
        expect(item).to.deep.equal({
          id: '416badc8-e3ac-47d7-b116-ae3f5b2e4697',
          category: 'risk',
          key: 'violent',
        })
      })
    })
  })

  describe('#renderConditionalFields()', function () {
    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('when field doesn\'t contain items', function () {
      it('should return the original field as object', function () {
        const field = [
          'court',
          { name: 'court' },
        ]
        const response = renderConditionalFields(field)

        expect(response).to.deep.equal({
          court: { name: 'court' },
        })
      })
    })

    context('when field contains items', function () {
      context('when conditional is a string', function () {
        context('when field exists', function () {
          const field = [
            'field',
            {
              name: 'field',
              items: [{
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: 'conditional_field_one',
              }, {
                value: '31b90233-7043-4633-8055-f24854545eac',
                text: 'Item two',
                conditional: 'conditional_field_two',
              }],
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
            expect(componentService.getComponent.firstCall).to.be.calledWithExactly('govukInput', {
              component: 'govukInput',
              classes: 'input-classes',
              id: 'conditional_field_one',
              name: 'conditional_field_one',
            })
          })

          it('should call component service with correct args', function () {
            expect(componentService.getComponent.secondCall).to.be.calledWithExactly('govukTextarea', {
              component: 'govukTextarea',
              classes: 'input-classes',
              id: 'conditional_field_two',
              name: 'conditional_field_two',
            })
          })

          it('should render conditional content', function () {
            expect(response.field.items).to.deep.equal([{
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: 'govukInput',
              },
            }, {
              value: '31b90233-7043-4633-8055-f24854545eac',
              text: 'Item two',
              conditional: {
                html: 'govukTextarea',
              },
            }])
          })
        })

        context('when field doesn\'t exist', function () {
          const field = [
            'field',
            {
              name: 'field',
              items: [{
                value: '31b90233-7043-4633-8055-f24854545ead',
                text: 'Item one',
                conditional: 'doesnotexist',
              }],
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
            expect(response.field.items).to.deep.equal([{
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: 'doesnotexist',
            }])
          })
        })
      })

      context('when conditional is not a string ', function () {
        const field = [
          'field',
          {
            name: 'field',
            items: [{
              value: '31b90233-7043-4633-8055-f24854545ead',
              text: 'Item one',
              conditional: {
                html: '<strong>HTML</strong> content',
              },
            }],
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
          expect(response.field.items).to.deep.equal([{
            value: '31b90233-7043-4633-8055-f24854545ead',
            text: 'Item one',
            conditional: {
              html: '<strong>HTML</strong> content',
            },
          }])
        })
      })
    })
  })

  describe('#insertInitialOption()', function () {
    const mockItems = [{
      value: 'foo',
      text: 'Foo',
    }, {
      value: 'bar',
      text: 'Bar',
    }]

    context('with default label', function () {
      it('should insert default option at the front', function () {
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

    context('with custom label', function () {
      it('should insert custom option at the front', function () {
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
})
