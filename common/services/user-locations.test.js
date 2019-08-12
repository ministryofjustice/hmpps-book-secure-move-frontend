const proxyquire = require('proxyquire')

const referenceDataStub = {
  getLocationsByNomisAgencyId: sinon.spy(args => {
    return Promise.resolve([{ id: 'test' }])
  }),
}

const configStub = {
  AUTH_PROVIDERS: {
    hmpps: { groups_url: () => 'http://test/' },
  },
  NOMIS_ELITE2_API: {
    user_caseloads_url: 'http://test/',
  },
}

const userLocationsService = proxyquire('./user-locations', {
  './reference-data': referenceDataStub,
  '../../config': configStub,
})

function _encodeToken(data) {
  return `test.${Buffer.from(JSON.stringify(data), 'utf8').toString(
    'base64'
  )}.test`
}

const authGroups = [
  {
    groupCode: 'PECS_TEST',
    groupName: 'Test Group',
  },
]

const userCaseloads = [
  {
    currentlyActive: false,
    caseLoadId: 'TEST',
    description: 'Test',
    type: 'INST',
    caseloadFunction: 'GENERAL',
  },
]

describe('User locations service', function() {
  describe('#getUserLocations()', function() {
    let tokenData, token, result

    context('with valid bearer token', function() {
      context('User authenticated from HMPPS SSO', function() {
        beforeEach(async function() {
          tokenData = {
            user_name: 'test',
            auth_source: 'auth',
          }

          token = _encodeToken(tokenData)

          nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
            .get('/')
            .reply(200, JSON.stringify(authGroups))

          result = await userLocationsService.getUserLocations(token)
        })

        it("requests the user's groups from HMPPS SSO", function() {
          expect(nock.isDone()).to.be.true
        })

        it('returns an Array of location objects', function() {
          expect(result).to.deep.equal([{ id: 'test' }])
        })
      })

      context('User authenticated from NOMIS', function() {
        beforeEach(async function() {
          tokenData = {
            user_name: 'test',
            auth_source: 'nomis',
          }

          token = _encodeToken(tokenData)

          nock(configStub.NOMIS_ELITE2_API.user_caseloads_url)
            .get('/')
            .reply(200, JSON.stringify(userCaseloads))

          result = await userLocationsService.getUserLocations(token)
        })

        it("requests the user's caseloads from the NOMIS Elite 2 API", function() {
          expect(nock.isDone()).to.be.true
        })

        it('returns an Array of location objects', function() {
          expect(result).to.deep.equal([{ id: 'test' }])
        })
      })

      context('User authentication source indeterminate', function() {
        beforeEach(async function() {
          tokenData = {
            user_name: 'test',
          }

          token = _encodeToken(tokenData)

          result = await userLocationsService.getUserLocations(token)
        })

        it('defaults to an empty list of locations', function() {
          expect(
            referenceDataStub.getLocationsByNomisAgencyId
          ).to.be.calledWith([])
        })
      })
    })
  })
})
