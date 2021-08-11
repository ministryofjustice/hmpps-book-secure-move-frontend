const setTabs = require('./locals.tabs')

describe('Person app', function () {
  describe('Middleware', function () {
    describe('#setTabs()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          baseUrl: '/base-url',
          originalUrl: '/',
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      context('with other URL', function () {
        beforeEach(function () {
          setTabs(req, res, nextSpy)
        })

        it('should contain no active tabs', function () {
          expect(res.locals).to.deep.equal({
            tabs: [
              {
                text: 'person::tabs.personal_details',
                url: '/base-url/personal-details',
                isActive: false,
              },
              {
                text: 'person::tabs.moves',
                url: '/base-url/moves',
                isActive: false,
              },
            ],
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with URL from tabs', function () {
        beforeEach(function () {
          req.originalUrl = '/base-url/personal-details'
          setTabs(req, res, nextSpy)
        })

        it('should contain correct active tab', function () {
          expect(res.locals).to.deep.equal({
            tabs: [
              {
                text: 'person::tabs.personal_details',
                url: '/base-url/personal-details',
                isActive: true,
              },
              {
                text: 'person::tabs.moves',
                url: '/base-url/moves',
                isActive: false,
              },
            ],
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})