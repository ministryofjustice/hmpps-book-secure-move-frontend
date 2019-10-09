const proxyquire = require('proxyquire')

const encodeToken = data =>
  `test.${Buffer.from(JSON.stringify(data), 'utf8').toString('base64')}.test`

const configStub = {
  AUTH_PROVIDERS: {
    hmpps: {
      user_url: 'http://test.com/user/me',
      groups_url: () => 'http://test.com/',
    },
  },
  NOMIS_ELITE2_API: {
    user_caseloads_url: 'http://test.com/',
  },
}

const locationsStub = [{ id: 'test' }]
const referenceDataStub = {
  getLocationsByNomisAgencyId: sinon.stub().resolves(locationsStub),
  getLocationsBySupplierId: sinon.stub().resolves(locationsStub),
}

const mockFullNameResponse = { name: 'mr benn' }

const authGroups = [
  {
    groupCode: 'SUPPLIER',
    groupName: 'Supplier Group',
  },
  {
    groupCode: 'PECS_TEST',
    groupName: 'Test Group',
  },
]

const mockUserCaseloads = [
  {
    currentlyActive: false,
    caseLoadId: 'TEST',
    description: 'Test',
    type: 'INST',
    caseloadFunction: 'GENERAL',
  },
]

const { getLocations, getFullname } = proxyquire('./user', {
  './reference-data': referenceDataStub,
  '../../config': configStub,
})

describe('User service', function() {
  describe('#getFullname()', function() {
    let result

    context('with valid bearer token', function() {
      context('User authenticated from HMPPS SSO', function() {
        beforeEach(async function() {
          const mockToken = '12345678910'

          nock('http://test.com')
            .get('/user/me')
            .reply(200, JSON.stringify(mockFullNameResponse))

          result = await getFullname(mockToken)
        })

        it('requests the user’s details from HMPPS SSO', function() {
          expect(nock.isDone()).to.be.true
        })

        it('returns an object of user details', function() {
          expect(result).to.deep.equal(mockFullNameResponse.name)
        })
      })
    })
  })

  describe('#getLocations()', function() {
    let tokenData, token, result

    context('with valid bearer token', function() {
      context('User authenticated from HMPPS SSO', function() {
        beforeEach(function() {
          tokenData = {
            user_name: 'test',
            auth_source: 'auth',
          }

          nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
            .get('/')
            .reply(200, JSON.stringify(authGroups))
        })

        context('with supplier role', function() {
          beforeEach(async function() {
            tokenData.authorities = ['ROLE_PECS_SUPPLIER']
            result = await getLocations(encodeToken(tokenData))
          })

          it('requests the user’s groups from HMPPS SSO', function() {
            expect(nock.isDone()).to.be.true
          })

          it('calls reference with supplier key', function() {
            expect(
              referenceDataStub.getLocationsBySupplierId
            ).to.be.calledWithExactly('SUPPLIER')
          })

          it('returns an Array of location objects', function() {
            expect(result).to.deep.equal([{ id: 'test' }])
          })
        })

        context('with other role', function() {
          beforeEach(async function() {
            result = await getLocations(encodeToken(tokenData))
          })

          it('requests the user’s groups from HMPPS SSO', function() {
            expect(nock.isDone()).to.be.true
          })

          it('returns an Array of location objects', function() {
            expect(result).to.deep.equal([{ id: 'test' }])
          })
        })
      })

      context('User authenticated from NOMIS', function() {
        beforeEach(async function() {
          tokenData = {
            user_name: 'test',
            auth_source: 'nomis',
          }

          token = encodeToken(tokenData)

          nock(configStub.NOMIS_ELITE2_API.user_caseloads_url)
            .get('/')
            .reply(200, JSON.stringify(mockUserCaseloads))

          result = await getLocations(token)
        })

        it('requests the user’s caseloads from the NOMIS Elite 2 API', function() {
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

          token = encodeToken(tokenData)

          result = await getLocations(token)
        })

        it('defaults to an empty list of locations', function() {
          expect(result).to.be.an('array').that.is.empty
        })
      })
    })
  })
})
