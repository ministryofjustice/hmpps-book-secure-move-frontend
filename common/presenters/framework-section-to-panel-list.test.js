const proxyquire = require('proxyquire')

const frameworkResponseToMetaListComponentStub = sinon
  .stub()
  .returns('__frameworkResponseToMetaListComponent__')
const presenter = proxyquire('./framework-section-to-panel-list', {
  './framework-responses-to-meta-list-component': frameworkResponseToMetaListComponentStub,
})

const mockArgs = {
  personEscortRecordUrl:
    '/move/0568d216-4e1c-4b06-bd22-13c221368384/person-escort-record',
  tagList: [
    {
      text: 'Concealed items',
      section: 'risk-information',
      href: '#concealed-items',
      classes: 'app-tag--destructive',
      sortOrder: 1,
    },
    {
      text: 'Escape',
      section: 'risk-information',
      href: '#escape',
      classes: 'app-tag--destructive',
      sortOrder: 1,
    },
    {
      text: 'Hold separately',
      section: 'risk-information',
      href: '#hold-separately',
      classes: 'app-tag--destructive',
      sortOrder: 1,
    },
  ],
  questions: {
    'actions-of-self-harm-undertaken': {
      description: 'Actions taken to keep person safe',
    },
    'addiction-dependencies': {
      description: 'Addictions or dependencies',
    },
    'alcohol-withdrawal': {
      description: 'Alcohol withdrawal',
    },
    arsonist: {
      description: 'Arsonist',
    },
    'communication-needs': {
      description: 'Communication needs',
    },
    'concealed-items': {
      description: 'Items concealed, created or used',
    },
    'current-offences': {
      description: 'Current offences',
    },
    'current-or-previous-sex-offender': {
      description: 'Sex offender',
    },
    'escape-risk': {
      description: 'Escape risk',
    },
    'female-hygiene-kit': {
      description: 'Requires female hygiene kit',
    },
    'gang-member-or-organised-crime': {
      description: 'Gang member or involved in organised crime',
    },
    'has-concealed-items': {
      description: 'Concealed, created or used restricted items',
    },
    'health-contact-details': {
      description: 'Custody contact number for health',
    },
    'health-issues': {
      description: 'Health issues',
    },
    'held-separately': {
      description: 'Hold separately',
    },
    'help-with-personal-tasks': {
      description: 'Help with personal tasks',
    },
    'high-public-interest': {
      description: 'Of high public interest',
    },
    'history-of-self-harm-details': {
      description: 'Self-harm history details',
    },
    'history-of-self-harm-method': {
      description: 'Methods used to self-harm',
    },
    'history-of-self-harm-recency': {
      description: 'Recency of self-harm',
    },
    'history-of-self-harm': {
      description: 'History of self-harm',
    },
    'hostage-taker': {
      description: 'Hostage taker',
    },
    'indication-of-self-harm-or-suicide': {
      description: 'Risk of self-harm or suicide',
    },
    'medical-health-professional-referral': {
      description: 'Referred to a medical professional',
    },
    'medication-carrier-while-moving': {
      description: 'Medication carrier while moving',
    },
    'medication-while-moving-details': {
      description: 'Medication while moving details',
    },
    'medication-while-moving': {
      description: 'Medication while moving',
    },
    'mental-health-needs': {
      description: 'Mental health needs',
    },
    'nature-of-self-harm': {
      description: 'Nature of self-harm',
    },
    'observation-level': {
      description: 'Current observation level',
    },
    'other-health-information': {
      description: 'Other health information',
    },
    'other-risk-information': {
      description: 'Other risk information',
    },
    'physical-health-needs': {
      description: 'Physical health needs',
    },
    pregnant: {
      description: 'Pregnant',
    },
    'prescribed-medication-carrier': {
      description: 'Prescribed medication carrier',
    },
    'prescribed-medication-details': {
      description: 'Prescribed medication details',
    },
    'prescribed-medication': {
      description: 'Prescribed medication',
    },
    'release-status': {
      description: 'Release status',
    },
    'requires-special-vehicle': {
      description: 'May require special vehicle',
    },
    'risk-from-other-people': {
      description: 'Vulnerable — at risk from other people',
    },
    'risk-to-other-people': {
      description: 'Risk to other people',
    },
    'sensitive-medication': {
      description: 'Sensitive medical information',
    },
    'special-diet-or-allergies': {
      description: 'Special diet or allergies',
    },
    'stalker-harasser-or-intimidator': {
      description: 'Stalker, harasser or intimidator',
    },
    'terrorism-offences': {
      description: 'Terrorism related offences',
    },
    'violent-or-dangerous': {
      description: 'Violent or dangerous',
    },
    'wheelchair-user': {
      description: 'Wheelchair user',
    },
  },
  personEscortRecord: {
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
        value_type: 'object',
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
        value_type: 'collection',
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
        value_type: 'object',
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
    meta: {
      section_progress: [
        {
          key: 'risk-information',
          status: 'completed',
        },
        {
          key: 'health-information',
          status: 'not_started',
        },
      ],
    },
  },
}
const mockSection = {
  key: 'risk-information',
  name: 'Risk information',
}
const expectedOutput = {
  key: 'risk-information',
  isCompleted: true,
  name: 'Risk information',
  url:
    '/move/0568d216-4e1c-4b06-bd22-13c221368384/person-escort-record/risk-information/overview',
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
      metaList: '__frameworkResponseToMetaListComponent__',
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
      metaList: '__frameworkResponseToMetaListComponent__',
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
      metaList: '__frameworkResponseToMetaListComponent__',
    },
  ],
}

// TODO: Test this more logically to cover all scenarios
// Current test just uses a real input/output that contains number of scenarios
describe('Presenters', function () {
  describe('#frameworkSectionToPanelList', function () {
    let output

    beforeEach(function () {
      frameworkResponseToMetaListComponentStub.resetHistory()
    })

    context('with no args', function () {
      beforeEach(function () {
        output = presenter()(mockSection)
      })

      it('should return no output', function () {
        expect(output).to.deep.equal({
          key: 'risk-information',
          isCompleted: false,
          name: 'Risk information',
          panels: [],
          url: '/risk-information/overview',
        })
      })
    })

    context('with mock args', function () {
      beforeEach(function () {
        output = presenter(mockArgs)(mockSection)
      })

      it('should return no output', function () {
        expect(output).to.deep.equal(expectedOutput)
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
              description: 'Hold separately',
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
              description: 'Risk to other people',
              id: '81eba694-cbc1-43f3-8c28-aeb3c7271074',
              key: 'risk-to-other-people',
              section: 'risk-information',
            },
            type: 'framework_responses',
            value: [
              { details: 'Lorem', option: 'Staff' },
              { details: 'Lorem', option: 'Lesbian, gay or bisexual people' },
            ],
            value_type: 'collection',
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
              description: 'Vulnerable — at risk from other people',
              id: 'c12721ff-76f3-4127-917d-3fb5ec1aeb4d',
              key: 'risk-from-other-people',
              section: 'risk-information',
            },
            type: 'framework_responses',
            value: { details: 'Lorem', option: 'Yes' },
            value_type: 'object',
          },
        ])
      })
    })
  })
})
