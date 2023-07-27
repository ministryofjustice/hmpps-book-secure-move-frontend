const { forEach, flatten, get, startCase } = require('lodash')
const pluralize = require('pluralize')
const proxyquire = require('proxyquire')

const frameworksService = require('../../../services/frameworks')

const models = require('./index')

function checkProperties(data, properties) {
  forEach(properties, (type, attribute) => {
    expect(data).to.have.property(attribute)
  })
}

const fixturesPath = '../../../../test/fixtures/api-client'
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
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
  profile: [
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
  category: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
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
  locations_free_spaces: [
    {
      method: 'findAll',
      httpMock: 'get',
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
  redirect: [
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 204,
    },
  ],
  person_escort_record: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
  youth_risk_assessment: [
    {
      method: 'find',
      httpMock: 'get',
      mockPath: '/1',
      args: '1',
      statusCode: 200,
    },
    {
      method: 'create',
      httpMock: 'post',
      args: {},
      statusCode: 201,
    },
  ],
}

const client = proxyquire('../index', {
  '../../../config': mockConfig,
  './middleware': {
    auth: sinon.stub(),
  },
})()

const getResponse = ({ modelName, model, testCase } = {}) => {
  const { statusCode } = testCase

  const apiPath = get(model, 'options.collectionPath') || pluralize(modelName)
  const fixture = require(`${fixturesPath}/${modelName}.${testCase.method}.json`)

  const nockedResponse =
    fixture.response !== undefined ? fixture.response : fixture
  const defaultInclude = get(model, 'options.defaultInclude')
  const include = defaultInclude
    ? `?include=${defaultInclude.sort().join(',')}`
    : ''

  nock(mockConfig.API.BASE_URL)
    .intercept(
      `/${apiPath}${testCase.mockPath || ''}${include}`,
      testCase.httpMock
    )
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
  flatten([response.data]).forEach(item => checkProperties(item, model.fields))
}

const expectNoData = ({ response }) => {
  expect(response.data).to.be.null
}

describe('API client models', function () {
  beforeEach(function () {
    sinon.stub(frameworksService, 'getFramework').returnsArg(0)
  })

  forEach(models, (model, modelName) => {
    describe(`${startCase(modelName)} model`, function () {
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
        expectStr = 'should contain correct fields'
      ) => {
        describe(`${statusCode} status code`, function () {
          forEach(getStatusMethods(modelName, statusCode), testCase => {
            describe(`${modelName}#${testCase.method}()`, function () {
              let response

              beforeEach(async function () {
                response = await getResponse({ modelName, model, testCase })
              })

              it(expectStr, function () {
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
