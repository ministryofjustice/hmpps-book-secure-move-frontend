const {
  mapReferenceDataToOption,
  mapAssessmentConditionalFields,
  insertInitialOption,
} = require('./field')

const componentService = require('../services/component')

describe('Form helpers', function () {
  describe('#mapReferenceDataToOption()', function () {
    context('be default', function () {
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

  describe('#mapAssessmentConditionalFields()', function () {
    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('when no field exists in the step', function () {
      it('should return the original item', function () {
        const item = {
          category: 'risk',
          key: 'violent',
        }
        const response = mapAssessmentConditionalFields({})(item)

        expect(response).to.deep.equal(item)
      })
    })

    context('when field exists in step', function () {
      const fields = {
        'risk__violent': {
          component: 'govukInput',
          classes: 'input-classes',
        },
      }
      const item = {
        category: 'risk',
        key: 'violent',
      }
      let response

      beforeEach(function () {
        response = mapAssessmentConditionalFields(fields)(item)
      })

      it('should return extra conditional content', function () {
        expect(componentService.getComponent).to.be.calledOnceWithExactly('govukInput', {
          component: 'govukInput',
          classes: 'input-classes',
          id: 'risk__violent',
          name: 'risk__violent',
        })
      })

      it('should return extra conditional content', function () {
        expect(response).to.deep.equal({
          category: 'risk',
          key: 'violent',
          conditional: {
            html: 'govukInput',
          },
        })
      })

      it('should not mutate original item', function () {
        expect(item).to.deep.equal({
          category: 'risk',
          key: 'violent',
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
