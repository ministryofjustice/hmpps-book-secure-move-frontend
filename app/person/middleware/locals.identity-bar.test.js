const middleware = require('./locals.identity-bar')

describe('Person app', function () {
  describe('Middleware', function () {
    describe('#localsIdentityBar()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          t: sinon.stub().returnsArg(0),
          person: {
            _fullname: 'DOE, JOHN',
          },
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        middleware(req, res, nextSpy)
      })

      describe('translations', function () {
        it('should translate caption', function () {
          expect(req.t).to.be.calledWithExactly('person::page_caption')
        })

        it('should translate heading', function () {
          expect(req.t).to.be.calledWithExactly('person::page_heading', {
            name: 'DOE, JOHN',
          })
        })
      })

      it('should set identity bar on locals', function () {
        expect(res.locals.identityBar).to.be.deep.equal({
          classes: 'sticky',
          caption: {
            text: 'person::page_caption',
          },
          heading: {
            html: 'person::page_heading',
          },
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
