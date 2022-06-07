const proxyquire = require('proxyquire')

const assessmentAnswersToMetaListComponentStub = sinon.stub().returnsArg(0)
const frameworkNomisMappingsToPanel = proxyquire(
  './framework-nomis-mappings-to-panel',
  {
    './assessment-answers-to-meta-list-component':
      assessmentAnswersToMetaListComponentStub,
  }
)

const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

describe('#frameworkNomisMappingsToPanel', function () {
  let output

  beforeEach(function () {
    assessmentAnswersToMetaListComponentStub.resetHistory()

    sinon.stub(componentService, 'getComponent').returnsArg(0)
    sinon.stub(i18n, 't').returnsArg(0)
    sinon.stub(filters, 'formatDateWithRelativeDay').returns('10 Oct 2020')
    sinon.stub(filters, 'formatTime').returns('11am')
  })

  context('with no props', function () {
    beforeEach(function () {
      output = frameworkNomisMappingsToPanel()
    })

    it('should return empty string', function () {
      expect(output).to.equal('')
    })
  })

  context('with all props', function () {
    const mockArgs = {
      heading: 'Sample heading',
      updatedAt: '2020-10-10T14:00:00Z',
      mappings: [{ foo: 'bar' }, { fizz: 'buzz' }],
    }

    beforeEach(function () {
      output = frameworkNomisMappingsToPanel(mockArgs)
    })

    it('should format dates', function () {
      expect(filters.formatDateWithRelativeDay).to.be.calledOnceWithExactly(
        mockArgs.updatedAt
      )
      expect(filters.formatTime).to.be.calledOnceWithExactly(mockArgs.updatedAt)
    })

    it('should transform mappings', function () {
      expect(
        assessmentAnswersToMetaListComponentStub
      ).to.be.calledOnceWithExactly(mockArgs.mappings)

      expect(componentService.getComponent).to.be.calledWithExactly(
        'appPanel',
        {
          classes: 'govuk-!-margin-bottom-4',
          html: 'appMetaList',
        }
      )

      expect(componentService.getComponent).to.be.calledWithExactly(
        'appMetaList',
        mockArgs.mappings
      )
    })

    it('should return HTML', function () {
      expect(output).to.equal(
        '\n      <h4 class="govuk-!-font-size-19 govuk-!-font-weight-regular govuk-!-margin-top-3 govuk-!-padding-top-0 govuk-!-margin-bottom-1">\n        Sample heading\n      </h4>\n    \n      <div class="govuk-caption-s govuk-!-margin-top-0 govuk-!-margin-bottom-2 govuk-!-font-size-16">\n        last_updated_at\n      </div>\n    appPanel'
      )
    })
  })
})
