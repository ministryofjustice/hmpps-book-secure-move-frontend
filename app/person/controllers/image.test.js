const axios = require('axios')

const personService = {
  getImageUrl: sinon.stub(),
}
const nunjucksGlobals = require('../../../config/nunjucks/globals')

const image = require('./image')

const mockPersonId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
const placeholderImage = '/images/person-placeholder.png'
const manifestImagePath = '/images/person-placeholder.19s41n.png'

describe('Person app', function () {
  describe('Controllers', function () {
    describe('#image()', function () {
      let req, res

      beforeEach(function () {
        sinon.stub(nunjucksGlobals, 'getAssetPath').returns(manifestImagePath)
        sinon.stub(axios, 'get')
        req = {
          params: {
            personId: mockPersonId,
          },
          services: {
            person: personService,
          },
        }
        res = {
          writeHead: sinon.stub(),
          end: sinon.stub(),
          redirect: sinon.stub(),
        }
      })

      context('when person service errors', function () {
        beforeEach(async function () {
          personService.getImageUrl.rejects(new Error())
          await image(placeholderImage)(req, res)
        })

        it('should not call res.end', function () {
          expect(res.end).not.to.be.called
        })

        it('should get placeholder image from manifest', function () {
          expect(nunjucksGlobals.getAssetPath).to.be.calledOnceWithExactly(
            placeholderImage
          )
        })

        it('should redirect to placeholder images', function () {
          expect(res.redirect).to.be.calledOnceWithExactly(manifestImagePath)
        })
      })

      context('when person service resolves with value', function () {
        const mockImageUrl = 'http://mock/api/image/url'

        beforeEach(function () {
          personService.getImageUrl.resolves(mockImageUrl)
        })

        context('when axios errors', function () {
          beforeEach(async function () {
            axios.get.rejects(new Error())
            await image(placeholderImage)(req, res)
          })

          it('should not call res.end', function () {
            expect(res.end).not.to.be.called
          })

          it('should get placeholder image from manifest', function () {
            expect(nunjucksGlobals.getAssetPath).to.be.calledOnceWithExactly(
              placeholderImage
            )
          })

          it('should redirect to placeholder images', function () {
            expect(res.redirect).to.be.calledOnceWithExactly(manifestImagePath)
          })
        })

        context('when axios resolves', function () {
          const mockResponse = {
            headers: {
              'content-type': 'image/jpeg',
            },
            data: {
              mock: 'data',
            },
          }

          beforeEach(async function () {
            axios.get.resolves(mockResponse)
            await image(placeholderImage)(req, res)
          })

          it('should set headers', function () {
            expect(res.writeHead).to.be.calledOnceWithExactly(200, {
              'Content-Type': mockResponse.headers['content-type'],
            })
          })

          it('should send response data as binary', function () {
            expect(res.end).to.be.calledOnceWithExactly(
              mockResponse.data,
              'binary'
            )
          })

          it('should not redirect to placeholder images', function () {
            expect(res.redirect).not.to.be.called
          })
        })
      })
    })
  })
})
