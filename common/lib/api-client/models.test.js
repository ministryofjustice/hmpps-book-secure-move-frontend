const proxyquire = require('proxyquire')
const pluralize = require('pluralize')
const { forEach, flatten, get, startCase } = require('lodash')

const models = require('./models')

function checkProperties(data, properties) {
  forEach(properties, (type, attribute) => {
    expect(data).to.have.property(attribute)
  })
}

const fixturesPath = '../../../test/fixtures/api-client'
const mockConfig = {
  IS_DEV: false,
  API: {
    BASE_URL: 'http://api.com/v1',
    TIMEOUT: 1000,
  },
}
const testCases = {
  move: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
    },
    {
      method: 'findAll',
      httpMock: 'get',
    },
  ],
  person: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
    },
  ],
  image: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
    },
  ],
  gender: [
    {
      method: 'findAll',
      httpMock: 'get',
    },
  ],
  ethnicity: [
    {
      method: 'findAll',
      httpMock: 'get',
    },
  ],
  assessment_question: [
    {
      method: 'findAll',
      httpMock: 'get',
    },
  ],
  location: [
    {
      method: 'findAll',
      httpMock: 'get',
    },
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
    },
  ],
  supplier: [
    {
      method: 'findAll',
      httpMock: 'get',
    },
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
    },
  ],
}

const client = proxyquire('./', {
  '../../../config': mockConfig,
  './middleware': {
    auth: sinon.stub(),
    request: sinon.stub().returns({}),
  },
})()

describe('API client models', function() {
  forEach(models, (model, modelName) => {
    describe(`${startCase(modelName)} model`, function() {
      forEach(testCases[modelName], testCase => {
        describe(`#${testCase.method}()`, function() {
          beforeEach(function() {
            const apiPath =
              get(model, 'options.collectionPath') || pluralize(modelName)
            const fixture = require(`${fixturesPath}/${modelName}.${testCase.method}.json`)

            nock(mockConfig.API.BASE_URL)
              .intercept(
                `/${apiPath}${testCase.mockPath || ''}`,
                testCase.httpMock
              )
              .reply(200, fixture)
          })

          it('should contain correct attributes', async function() {
            const response = await client[testCase.method](
              modelName,
              testCase.args
            )

            flatten([response.data]).forEach(item =>
              checkProperties(item, model.attributes)
            )
          })
        })
      })
    })
  })
})
