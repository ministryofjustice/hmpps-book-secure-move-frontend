const path = require('path')

const config = require('../../../config')

const fixturePath = path.join(__dirname, '../../../test/fixtures/api-client')
const jsonApi = require('./')

describe('Back-end API client with requests', function () {
  describe('authentication', function () {
    context('with a multiple requests', function () {
      describe('with an auth failure', function () {
        let authScope
        let req

        beforeEach(function () {
          nock.cleanAll()

          // First auth request should fail
          authScope = nock(`${config.API.AUTH_URL}`)
            .post('', { grant_type: 'client_credentials' })
            .once()
            .replyWithError('something awful happened')

          req = {
            properties: {},
          }
        })

        afterEach(function () {
          expect(nock.isDone(), nock.pendingMocks()).to.be.true
        })

        it('should error on first batch of requests', function () {
          const client1 = jsonApi(req)

          return Promise.allSettled([
            client1.all('move').get(),
            client1.all('supplier').get({ cache: false }),
          ]).then(([movePromise, supplierPromise]) => {
            expect(movePromise.status).to.equal('rejected')
            expect(supplierPromise.status).to.equal('rejected')
          })
        })

        it('should succeed on subsequent batched requests', function () {
          authScope
            .post('', { grant_type: 'client_credentials' })
            .once()
            .reply(200, {
              access_token: 'abcdef',
              token_type: 'Bearer',
              expires_in: 7200,
              created_at: 1618328323,
            })

          nock(`${config.API.BASE_URL}`)
            .get('/moves')
            .matchHeader('Authorization', 'Bearer abcdef')
            .replyWithFile(200, path.join(fixturePath, 'move.findAll.json'))
            .get('/reference/suppliers')
            .query({ cache: false })
            .matchHeader('Authorization', 'Bearer abcdef')
            .replyWithFile(200, path.join(fixturePath, 'supplier.findAll.json'))

          const client1 = jsonApi(req)

          return Promise.allSettled([
            client1.all('move').get(),
            client1.all('supplier').get({ cache: false }),
          ]).then(() => {
            return Promise.all([
              client1.all('move').get(),
              client1.all('supplier').get({ cache: false }),
            ])
          })
        })
      })
    })
  })
})
