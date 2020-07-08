const faker = require('faker')
const { get } = require('lodash')
const nock = require('nock')

const config = require('../../config')
const apiClient = require('../lib/api-client')()
const frameworksService = require('../services/frameworks')

const noIdMessage = 'No resource ID supplied'
const personEscortRecord = frameworksService.getPersonEscortFramework()

function getMockPersonEscortRecord() {
  const responses = []
  // const questions = []
  const included = []
  const frameworkId = faker.random.uuid()
  const profileId = faker.random.uuid()

  included.push({
    id: frameworkId,
    type: 'frameworks',
    attributes: {
      version: '1.1',
    },
  })

  included.push({
    id: profileId,
    type: 'profiles',
    attributes: {},
  })

  for (const [key, value] of Object.entries(personEscortRecord.questions)) {
    const responseId = faker.random.uuid()
    const questionId = faker.random.uuid()
    const items = (value.items || []).map(item => item.value)
    const fakeRadioWithComments = faker.random.arrayElement([
      { option: 'Yes', details: faker.lorem.sentence() },
      { option: 'No', details: '' },
      null,
    ])
    const fakeChecked = items
      .sort(() => Math.random() - Math.random())
      .slice(0, Math.floor(Math.random() * items.length))
    const fakeCheckedWithComments = fakeChecked.map(item => {
      return {
        option: item,
        details: faker.lorem.sentence(),
      }
    })
    const hasComments = get(value, 'items[0].conditional.component')
    /* eslint-disable */
    const fakeResponses = {
      govukRadios: hasComments ? {
        value: fakeRadioWithComments,
        value_type: 'object',
      } : {
        value: faker.random.arrayElement([...items, null]),
        value_type: 'string',
      },
      govukTextarea: {
        value: faker.random.arrayElement([faker.lorem.sentence(), null]),
        value_type: 'string',
      },
      govukCheckboxes: {
        value: hasComments ? fakeCheckedWithComments : fakeChecked,
        value_type: hasComments ? 'collection' : 'array',
      },
    }
    /* eslint-enable */

    responses.push({
      id: responseId,
      type: 'framework_responses',
    })
    included.push({
      id: responseId,
      type: 'framework_responses',
      attributes: fakeResponses[value.component],
      relationships: {
        question: {
          data: {
            id: questionId,
            type: 'framework_questions',
          },
        },
      },
    })

    // if (key === 'history-of-self-harm-method') {
    //   console.log(fakeResponses[value.component])
    // }

    // questions.push({
    //   id: questionId,
    //   type: 'framework_questions',
    // })
    included.push({
      id: questionId,
      type: 'framework_questions',
      attributes: {
        key,
        question_type: fakeResponses[value.component].value_type,
      },
    })
  }

  return {
    data: {
      id: faker.random.uuid(),
      type: 'person_escort_records',
      attributes: {
        status: 'not_started',
      },
      relationships: {
        profile: {
          data: {
            id: profileId,
            type: 'profiles',
          },
        },
        framework: {
          data: {
            id: frameworkId,
            type: 'frameworks',
          },
        },
        responses: {
          data: responses,
        },
      },
    },
    included,
  }
}

const fakeRecord = getMockPersonEscortRecord()
// console.log(fakeRecord)

const personEscortRecordService = {
  create(data) {
    return apiClient
      .create('person_escort_record', data)
      .then(response => response.data)
  },

  getById(id) {
    if (!id) {
      return Promise.reject(new Error(noIdMessage))
    }

    nock(config.API.AUTH_BASE_URL).post(config.API.AUTH_PATH).reply(200, {})
    nock(config.API.BASE_URL)
      .get(`/person_escort_records/${id}`)
      .query(true)
      .reply(200, fakeRecord)

    return apiClient
      .find('person_escort_record', id, { include: '' })
      .then(response => response.data)
  },
}

module.exports = personEscortRecordService
