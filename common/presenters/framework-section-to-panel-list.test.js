const proxyquire = require('proxyquire')

const componentService = require('../services/component')

const mockTagList = [
  {
    text: 'Concealed items',
    section: 'risk-information',
    classes: 'app-tag--destructive',
    sortOrder: 1,
  },
  {
    text: 'Escape',
    section: 'risk-information',
    classes: 'app-tag--destructive',
    sortOrder: 1,
  },
  {
    text: 'Hold separately',
    section: 'risk-information',
    classes: 'app-tag--destructive',
    sortOrder: 1,
  },
]
const frameworkResponseToMetaListComponentStub = sinon
  .stub()
  .returns('__frameworkResponseToMetaListComponent__')
const frameworkFlagsToTagListStub = sinon.stub()
const presenter = proxyquire('./framework-section-to-panel-list', {
  './framework-responses-to-meta-list-component':
    frameworkResponseToMetaListComponentStub,
  './framework-flags-to-tag-list': frameworkFlagsToTagListStub,
})

const mockArgs = {
  baseUrl: '/move/0568d216-4e1c-4b06-bd22-13c221368384/person-escort-record',
}
const mockSection = {
  key: 'risk-information',
  name: 'Risk information',
  order: 4,
  progress: 'completed',
  responses: [
    {
      id: '1131f451-0434-4e55-833e-d0e269460406',
      type: 'framework_responses',
      value: 'Yes',
      value_type: 'string',
      flags: [
        {
          id: '541dc7de-a8ef-4970-aa80-53487a082f5c',
          title: 'Hold separately',
          question_value: 'Yes',
        },
      ],
      question: {
        id: 'ad3fcd7c-a249-4a53-ab05-b7152c858ec3',
        key: 'held-separately',
        section: 'risk-information',
      },
    },
    {
      id: '7c10a0db-fdbd-40aa-ba05-59dcc579548b',
      type: 'framework_responses',
      value: {
        option: 'Yes',
        details: 'Lorem',
      },
      value_type: 'object::followup_comment',
      flags: [
        {
          id: '2e7a4e98-ba44-4696-891d-b7e6ef021430',
          title: 'Escape',
          question_value: 'Yes',
        },
      ],
      question: {
        id: '7c8f6f25-96fe-453b-970e-fd8212093aa1',
        key: 'escape-risk',
        section: 'risk-information',
      },
    },
    {
      id: '5fc2fb04-f516-4798-bce9-70b03ce7c82a',
      type: 'framework_responses',
      value: [
        {
          option: 'Staff',
          details: 'Lorem',
        },
        {
          option: 'Lesbian, gay or bisexual people',
          details: 'Lorem',
        },
      ],
      value_type: 'collection::followup_comment',
      flags: [
        {
          id: 'cf197679-9b48-4b19-a141-996d6b27eb49',
          title: 'Hold separately',
          question_value: 'Staff',
        },
        {
          id: '94f3f854-9062-4d7d-bf90-5a313e106c9c',
          title: 'Hold separately',
          question_value: 'Lesbian, gay or bisexual people',
        },
      ],
      question: {
        id: '81eba694-cbc1-43f3-8c28-aeb3c7271074',
        key: 'risk-to-other-people',
        section: 'risk-information',
      },
    },
    {
      id: '88c041b1-4fb1-4279-9125-97829f075868',
      type: 'framework_responses',
      value: {
        option: 'Yes',
        details: 'Lorem',
      },
      value_type: 'object::followup_comment',
      flags: [
        {
          id: '0015ea23-9a37-469b-b7a6-62dd01bac08f',
          title: 'Hold separately',
          question_value: 'Yes',
        },
      ],
      question: {
        id: 'c12721ff-76f3-4127-917d-3fb5ec1aeb4d',
        key: 'risk-from-other-people',
        section: 'risk-information',
      },
    },
  ],
}
const expectedOutput = {
  key: 'risk-information',
  isCompleted: true,
  name: 'Risk information',
  count: 3,
  order: 4,
  context: 'framework',
  url: '/move/0568d216-4e1c-4b06-bd22-13c221368384/person-escort-record/risk-information',
  panels: [
    {
      tag: {
        text: 'Concealed items',
        section: 'risk-information',
        classes: 'app-tag--destructive',
        sortOrder: 1,
      },
      attributes: {
        id: 'concealed-items',
      },
      html: 'appMetaList',
      isFocusable: true,
    },
    {
      tag: {
        text: 'Escape',
        section: 'risk-information',
        classes: 'app-tag--destructive',
        sortOrder: 1,
      },
      attributes: {
        id: 'escape',
      },
      html: 'appMetaList',
      isFocusable: true,
    },
    {
      tag: {
        text: 'Hold separately',
        section: 'risk-information',
        classes: 'app-tag--destructive',
        sortOrder: 1,
      },
      attributes: {
        id: 'hold-separately',
      },
      html: 'appMetaList',
      isFocusable: true,
    },
  ],
}

// TODO: Test this more logically to cover all scenarios
// Current test just uses a real input/output that contains number of scenarios
describe('Presenters', function () {
  describe('#frameworkSectionToPanelList', function () {
    let output

    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      frameworkResponseToMetaListComponentStub.resetHistory()
      frameworkFlagsToTagListStub.resetHistory().returns(mockTagList)
    })

    context('with no args', function () {
      beforeEach(function () {
        frameworkFlagsToTagListStub.returns([])
        output = presenter()({
          ...mockSection,
          responses: [],
        })
      })

      it('should return no output', function () {
        expect(output).to.deep.equal({
          key: 'risk-information',
          isCompleted: true,
          name: 'Risk information',
          panels: [],
          count: 0,
          order: 4,
          context: 'framework',
          url: '/risk-information',
        })
      })
    })

    context('with mock args', function () {
      beforeEach(function () {
        output = presenter(mockArgs)(mockSection)
      })

      it('should return output', function () {
        expect(output).to.deep.equal(expectedOutput)
      })

      it('should call component service', function () {
        expect(componentService.getComponent).to.have.been.calledWithExactly(
          'appMetaList',
          '__frameworkResponseToMetaListComponent__'
        )
        expect(componentService.getComponent).to.have.been.calledThrice
      })

      it('should call meta list presenter', function () {
        expect(
          frameworkResponseToMetaListComponentStub
        ).to.have.been.calledWith([
          {
            flags: [
              {
                id: '541dc7de-a8ef-4970-aa80-53487a082f5c',
                question_value: 'Yes',
                title: 'Hold separately',
              },
            ],
            id: '1131f451-0434-4e55-833e-d0e269460406',
            question: {
              id: 'ad3fcd7c-a249-4a53-ab05-b7152c858ec3',
              key: 'held-separately',
              section: 'risk-information',
            },
            type: 'framework_responses',
            value: 'Yes',
            value_type: 'string',
          },
          {
            flags: [
              {
                id: 'cf197679-9b48-4b19-a141-996d6b27eb49',
                question_value: 'Staff',
                title: 'Hold separately',
              },
              {
                id: '94f3f854-9062-4d7d-bf90-5a313e106c9c',
                question_value: 'Lesbian, gay or bisexual people',
                title: 'Hold separately',
              },
            ],
            id: '5fc2fb04-f516-4798-bce9-70b03ce7c82a',
            question: {
              id: '81eba694-cbc1-43f3-8c28-aeb3c7271074',
              key: 'risk-to-other-people',
              section: 'risk-information',
            },
            type: 'framework_responses',
            value: [
              { details: 'Lorem', option: 'Staff' },
              { details: 'Lorem', option: 'Lesbian, gay or bisexual people' },
            ],
            value_type: 'collection::followup_comment',
          },
          {
            flags: [
              {
                id: '0015ea23-9a37-469b-b7a6-62dd01bac08f',
                question_value: 'Yes',
                title: 'Hold separately',
              },
            ],
            id: '88c041b1-4fb1-4279-9125-97829f075868',
            question: {
              id: 'c12721ff-76f3-4127-917d-3fb5ec1aeb4d',
              key: 'risk-from-other-people',
              section: 'risk-information',
            },
            type: 'framework_responses',
            value: { details: 'Lorem', option: 'Yes' },
            value_type: 'object::followup_comment',
          },
        ])
      })

      it('should call flags presenter', function () {
        expect(frameworkFlagsToTagListStub).to.have.been.calledWith({
          flags: [
            {
              id: '541dc7de-a8ef-4970-aa80-53487a082f5c',
              question_value: 'Yes',
              title: 'Hold separately',
            },
            {
              id: '2e7a4e98-ba44-4696-891d-b7e6ef021430',
              title: 'Escape',
              question_value: 'Yes',
            },
            {
              id: 'cf197679-9b48-4b19-a141-996d6b27eb49',
              question_value: 'Staff',
              title: 'Hold separately',
            },
            {
              id: '94f3f854-9062-4d7d-bf90-5a313e106c9c',
              question_value: 'Lesbian, gay or bisexual people',
              title: 'Hold separately',
            },
            {
              id: '0015ea23-9a37-469b-b7a6-62dd01bac08f',
              question_value: 'Yes',
              title: 'Hold separately',
            },
          ],
        })
      })
    })
  })
})
