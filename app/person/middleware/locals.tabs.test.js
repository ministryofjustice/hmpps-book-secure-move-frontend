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
            ],
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })

        context('when a move id is included in query', function () {
          beforeEach(function () {
            req.query = { move: 'move_id' }
            setTabs(req, res, nextSpy)
          })

          it('should append the url with the move param', function () {
            expect(res.locals).to.deep.equal({
              tabs: [
                {
                  text: 'person::tabs.personal_details',
                  url: '/base-url/personal-details?move=move_id',
                  isActive: true,
                },
              ],
            })
          })
        })
      })

      context('with a CDM user', function () {
        beforeEach(function () {
          req.session = {
            user: {
              permissions: ['locations:contract_delivery_manager'],
            },
          }
          setTabs(req, res, nextSpy)
        })

        it('should contain the moves tab', function () {
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

        context('when a move id is included in query', function () {
          beforeEach(function () {
            req.query = { move: 'move_id' }
            setTabs(req, res, nextSpy)
          })

          it('should append the urls with the move param', function () {
            expect(res.locals).to.deep.equal({
              tabs: [
                {
                  text: 'person::tabs.personal_details',
                  url: '/base-url/personal-details?move=move_id',
                  isActive: false,
                },
                {
                  text: 'person::tabs.moves',
                  url: '/base-url/moves?move=move_id',
                  isActive: false,
                },
              ],
            })
          })
        })
      })
    })
  })
})
