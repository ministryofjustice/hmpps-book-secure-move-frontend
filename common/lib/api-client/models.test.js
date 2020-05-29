const { forEach, flatten, get, startCase } = require('lodash')
const pluralize = require('pluralize')
const proxyquire = require('proxyquire')

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
      statusCode: 200,
    },
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  person: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
  image: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
  ],
  court_case: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  court_hearing: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
  timetable_entry: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  gender: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  ethnicity: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  assessment_question: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  location: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
  ],
  supplier: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
  ],
  allocation: [
    {
      method: 'findAll',
      httpMock: 'get',
      statusCode: 200,
    },
  ],
  event: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
  redirect: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 204,
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

const getResponse = ({ modelName, model, testCase } = {}) => {
  const { statusCode } = testCase

  const apiPath = get(model, 'options.collectionPath') || pluralize(modelName)
  const fixture = require(`${fixturesPath}/${modelName}.${testCase.method}.json`)

  const nockedResponse =
    fixture.response !== undefined ? fixture.response : fixture

  nock(mockConfig.API.BASE_URL)
    .intercept(`/${apiPath}${testCase.mockPath || ''}`, testCase.httpMock)
    .reply(statusCode, nockedResponse)

  return client[testCase.method](modelName, testCase.args)
}

const getStatusMethods = (modelName, statusCode) => {
  const testCaseMethods = (testCases[modelName] || []).filter(
    method => method.statusCode === statusCode
  )
  return testCaseMethods
}

const expectProperties = ({ model, response }) => {
  flatten([response.data]).forEach(item =>
    checkProperties(item, model.attributes)
  )
}

const expectNoData = ({ response }) => {
  expect(response.data).to.be.null
}

describe('API client models', function() {
  forEach(models, (model, modelName) => {
    describe(`${startCase(modelName)} model`, function() {
      // ensure all methods have a statusCode defined
      const noStatusMethods = getStatusMethods(modelName, undefined)
      if (noStatusMethods[0]) {
        throw new Error(
          `${modelName}.${noStatusMethods[0].method} has no statusCode`
        )
      }
      const runStatusMethodTests = (
        statusCode,
        expectFn = expectProperties,
        expectStr = 'should contain correct attributes'
      ) => {
        describe(`${statusCode} status code`, function() {
          forEach(getStatusMethods(modelName, statusCode), testCase => {
            describe(`#${testCase.method}()`, function() {
              let response

              beforeEach(async function() {
                response = await getResponse({ modelName, model, testCase })
              })

              it(expectStr, function() {
                expectFn({ model, response })
              })
            })
          })
        })
      }

      runStatusMethodTests(200)
      runStatusMethodTests(201)
      runStatusMethodTests(204, expectNoData, 'should return no data')
    })
  })
})
