const presenters = require('../../../../../common/presenters')

const middleware = require('./locals.person-summary')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsPersonSummary()', function () {
      const mockMetaListComponent = { fizz: 'buzz' }
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          move: {
            id: '__move1__',
            profile: {
              person: {
                _fullname: 'DOE, JOHN',
                _image_url: '/person/image/__profile12345__',
                id: '__profile12345__',
                foo: 'bar',
              },
            },
          },
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        sinon
          .stub(presenters, 'personToMetaListComponent')
          .returns(mockMetaListComponent)
      })

      context('with profile', function () {
        beforeEach(function () {
          middleware(req, res, nextSpy)
        })

        it('should call presenter', function () {
          expect(
            presenters.personToMetaListComponent
          ).to.be.calledOnceWithExactly(req.move.profile.person)
        })

        it('should set locals correctly', function () {
          expect(res.locals).to.be.deep.equal({
            personSummary: {
              metaList: mockMetaListComponent,
              image: {
                url: '/person/image/__profile12345__',
                alt: 'DOE, JOHN',
              },
              profileLink: '/person/__profile12345__',
            },
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without profile', function () {
        beforeEach(function () {
          req.move.profile = null
          middleware(req, res, nextSpy)
        })

        it('should not call presenter', function () {
          expect(presenters.personToMetaListComponent).not.to.be.called
        })

        it('should not set locals', function () {
          expect(res.locals).to.deep.equal({})
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without move', function () {
        beforeEach(function () {
          req.move = null
          middleware(req, res, nextSpy)
        })

        it('should not call presenter', function () {
          expect(presenters.personToMetaListComponent).not.to.be.called
        })

        it('should not set locals', function () {
          expect(res.locals).to.deep.equal({})
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
