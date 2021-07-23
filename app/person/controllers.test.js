const axios = require('axios')

const personService = {
  getImageUrl: sinon.stub(),
}
const presenters = require('../../common/presenters')
const nunjucksGlobals = require('../../config/nunjucks/globals')

const controllers = require('./controllers')

const mockPersonId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
const placeholderImage = '/images/person-placeholder.png'
const manifestImagePath = '/images/person-placeholder.19s41n.png'

const mockPerson = {
  _fullname: 'DOE, JOHN',
  id: mockPersonId,
}

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
          await controllers.image(placeholderImage)(req, res)
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
            await controllers.image(placeholderImage)(req, res)
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
            await controllers.image(placeholderImage)(req, res)
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

    describe('#renderPerson()', function () {
      let req, res

      beforeEach(function () {
        sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
        req = {
          person: mockPerson,
          t: sinon.stub().returnsArg(0),
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }

        controllers.renderPerson(req, res)
      })

      it('should set breadcrumb', function () {
        expect(res.breadcrumb).to.have.been.calledOnceWithExactly({
          text: 'DOE, JOHN',
        })
      })

      it('should render correct template', function () {
        expect(res.render.args[0][0]).to.equal('person/views/render-person')
      })

      describe('locals', function () {
        let locals

        beforeEach(function () {
          locals = res.render.args[0][1]
        })

        it('should pass correct keys', function () {
          expect(locals).to.have.all.keys([
            'fullname',
            'identityBar',
            'personalDetailsSummary',
          ])
        })

        it('should set fullname', function () {
          expect(locals.fullname).to.equal('DOE, JOHN')
        })

        it('should set identityBar', function () {
          expect(locals.identityBar).to.deep.equal({
            classes: 'sticky',
            caption: {
              text: 'person::page_caption',
            },
            heading: {
              html: 'person::page_heading',
            },
          })

          expect(req.t).to.have.been.calledWithExactly('person::page_caption')
          expect(req.t).to.have.been.calledWithExactly('person::page_heading', {
            name: 'DOE, JOHN',
          })
        })

        it('should set personal details summary', function () {
          expect(locals.personalDetailsSummary).to.deep.equal(mockPerson)
          expect(
            presenters.personToSummaryListComponent
          ).to.have.been.calledOnceWithExactly(mockPerson)
        })
      })
    })
  })
})
