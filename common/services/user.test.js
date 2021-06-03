const axios = require('axios')
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
const supplierStub = {
  id: '3ef88a47-6f1f-5b9b-b2fc-c0fe42cb0c92',
  key: 'serco',
  name: 'Serco',
}
const notFoundStub = new Error('Not found')
notFoundStub.statusCode = 404
const errorStub = new Error('Error')
errorStub.statusCode = 500
const referenceDataStub = {
  getLocationsByNomisAgencyId: sinon.stub().resolves(locationsStub),
  getLocationsBySupplierId: sinon.stub().resolves(locationsStub),
  getSupplierByKey: sinon.stub(),
}
referenceDataStub.getSupplierByKey
  .withArgs('serco')
  .resolves(supplierStub)
  .withArgs('404')
  .rejects(notFoundStub)
  .withArgs('error')
  .rejects(errorStub)

const mockFullNameResponse = { name: 'mr benn' }

const authGroups = [
  {
    groupCode: 'SERCO',
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

const axiosInstanceStub = sinon.spy(axios.create())
const axiosStub = { create: () => axiosInstanceStub }
const { getLocations, getFullname, getSupplierId } = proxyquire('./user', {
  axios: axiosStub,
  './reference-data': function () {
    return referenceDataStub
  },
  '../../config': configStub,
})

describe('User service', function () {
  it('sets the retry-axios config to retry once', function () {
    expect(axiosInstanceStub.defaults.raxConfig.retry).to.eq(1)
  })

  describe('#getFullname()', function () {
    let result

    context('with valid bearer token', function () {
      context('User authenticated from HMPPS SSO', function () {
        beforeEach(async function () {
          const mockToken = '12345678910'

          nock('http://test.com')
            .get('/user/me')
            .reply(200, JSON.stringify(mockFullNameResponse))

          result = await getFullname(mockToken)
        })

        it('requests the user’s details from HMPPS SSO', function () {
          expect(nock.isDone()).to.be.true
        })

        it('returns an object of user details', function () {
          expect(result).to.deep.equal(mockFullNameResponse.name)
        })
      })
    })
  })

  describe('#getSupplierId()', function () {
    let tokenData, result

    context('when supplier exists', function () {
      beforeEach(async function () {
        nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
          .get('/')
          .reply(200, JSON.stringify(authGroups))

        tokenData = { authorities: ['ROLE_PECS_SUPPLIER'] }

        result = await getSupplierId(encodeToken(tokenData))
      })

      it('requests the user’s groups from HMPPS SSO', function () {
        expect(nock.isDone()).to.be.true
      })

      it('calls reference with supplier key', function () {
        expect(referenceDataStub.getSupplierByKey).to.be.calledWithExactly(
          supplierStub.key
        )
      })

      it('returns an Array of location objects', function () {
        expect(result).to.deep.equal(supplierStub.id)
      })
    })

    context('when no supplier role', function () {
      beforeEach(async function () {
        nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
          .get('/')
          .reply(200, JSON.stringify(authGroups))

        tokenData = { authorities: ['ANOTHER_ROLE'] }

        result = await getSupplierId(encodeToken(tokenData))
      })

      it('should not request the user’s groups from HMPPS SSO', function () {
        expect(nock.isDone()).to.not.be.true
      })

      it('returns undefined', function () {
        expect(result).to.be.undefined
      })
    })

    context('when no authorities', function () {
      beforeEach(async function () {
        nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
          .get('/')
          .reply(200, [])

        tokenData = { authorities: ['ROLE_PECS_SUPPLIER'] }

        result = await getSupplierId(encodeToken(tokenData))
      })

      it('requests the user’s groups from HMPPS SSO', function () {
        expect(nock.isDone()).to.be.true
      })

      it('returns undefined', function () {
        expect(result).to.be.undefined
      })
    })

    context('when supplier does not exist', function () {
      beforeEach(async function () {
        nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
          .get('/')
          .reply(
            200,
            JSON.stringify([
              {
                groupCode: '404',
              },
            ])
          )

        tokenData = { authorities: ['ROLE_PECS_SUPPLIER'] }

        result = await getSupplierId(encodeToken(tokenData))
      })

      it('requests the user’s groups from HMPPS SSO', function () {
        expect(nock.isDone()).to.be.true
      })

      it('returns undefined', function () {
        expect(result).to.be.undefined
      })
    })

    context('when supplier call errors', function () {
      beforeEach(async function () {
        nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
          .get('/')
          .reply(
            200,
            JSON.stringify([
              {
                groupCode: 'error',
              },
            ])
          )

        tokenData = { authorities: ['ROLE_PECS_SUPPLIER'] }
      })

      it('returns an error', function () {
        return expect(getSupplierId(encodeToken(tokenData))).to.be.rejectedWith(
          'Error'
        )
      })
    })
  })

  describe('#getLocations()', function () {
    let tokenData, token, result

    context('with valid bearer token', function () {
      context('User authenticated from HMPPS SSO', function () {
        beforeEach(function () {
          tokenData = {
            user_name: 'test',
            auth_source: 'auth',
          }
        })

        context('with supplier role', function () {
          beforeEach(async function () {
            tokenData.authorities = ['ROLE_PECS_SUPPLIER']

            result = await getLocations(encodeToken(tokenData))
          })

          it('returns an empty Array', function () {
            expect(result).to.deep.equal([])
          })
        })

        context('with other roles', function () {
          beforeEach(async function () {
            nock(configStub.AUTH_PROVIDERS.hmpps.groups_url('test'))
              .get('/')
              .reply(200, JSON.stringify(authGroups))

            result = await getLocations(encodeToken(tokenData))
          })

          it('requests the user’s groups from HMPPS SSO', function () {
            expect(nock.isDone()).to.be.true
          })

          it('returns an Array of location objects', function () {
            expect(result).to.deep.equal([{ id: 'test' }])
          })
        })
      })

      context('User authenticated from NOMIS', function () {
        beforeEach(async function () {
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

        it('requests the user’s caseloads from the NOMIS Elite 2 API', function () {
          expect(nock.isDone()).to.be.true
        })

        it('returns an Array of location objects', function () {
          expect(result).to.deep.equal([{ id: 'test' }])
        })
      })

      context('User authentication source indeterminate', function () {
        beforeEach(async function () {
          tokenData = {
            user_name: 'test',
          }

          token = encodeToken(tokenData)

          result = await getLocations(token)
        })

        it('defaults to an empty list of locations', function () {
          expect(result).to.be.an('array').that.is.empty
        })
      })
    })
  })
})
