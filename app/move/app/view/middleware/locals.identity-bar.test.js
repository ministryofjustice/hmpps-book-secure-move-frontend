const presenters = require('../../../../../common/presenters')
const filters = require('../../../../../config/nunjucks/filters')

const middleware = require('./locals.identity-bar')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsIdentityBar()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          t: sinon.stub().returnsArg(0),
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        sinon
          .stub(presenters, 'moveToIdentityBarActions')
          .returns('_moveToIdentityBarActions_')
        sinon.stub(filters, 'formatDate').returnsArg(0)
      })

      context('by default', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            reference: 'AB1234XY',
            date: '2020-10-07',
            profile: {
              person: {
                _fullname: 'DOE, JOHN',
              },
            },
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
            foo: 'bar',
          }

          middleware(req, res, nextSpy)
        })

        describe('translations', function () {
          it('should translate caption', function () {
            expect(req.t).to.be.calledWithExactly('moves::detail.page_caption')
          })

          it('should translate heading', function () {
            expect(req.t).to.be.calledWithExactly(
              'moves::detail.page_heading',
              {
                name: 'DOE, JOHN',
                reference: 'AB1234XY',
              }
            )
            expect(req.t).not.to.be.calledWithExactly('awaiting_person')
          })

          it('should translate summary', function () {
            expect(req.t).to.be.calledWithExactly(
              'moves::detail.page_heading_summary',
              {
                fromLocation: 'Guildford Custody Suite',
                toLocation: 'HMP Brixton',
                date: '2020-10-07',
              }
            )
          })
        })

        it('should format date', function () {
          expect(filters.formatDate).to.be.calledWithExactly('2020-10-07')
        })

        it('should call actions presenter', function () {
          expect(
            presenters.moveToIdentityBarActions
          ).to.be.calledOnceWithExactly(req.move, { canAccess: req.canAccess })
        })

        it('should set identity bar on locals', function () {
          expect(res.locals.identityBar).to.be.deep.equal({
            actions: '_moveToIdentityBarActions_',
            classes: 'sticky',
            caption: {
              text: 'moves::detail.page_caption',
            },
            heading: {
              html: 'moves::detail.page_heading',
            },
            summary: {
              html: 'moves::detail.page_heading_summary',
            },
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without profile', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            reference: 'AB1234XY',
            date: '2020-10-07',
            profile: null,
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
            foo: 'bar',
          }

          middleware(req, res, nextSpy)
        })

        describe('translations', function () {
          it('should translate caption', function () {
            expect(req.t).to.be.calledWithExactly('moves::detail.page_caption')
          })

          it('should translate heading', function () {
            expect(req.t).to.be.calledWithExactly(
              'moves::detail.page_heading',
              {
                name: 'awaiting_person',
                reference: 'AB1234XY',
              }
            )
            expect(req.t).to.be.calledWithExactly('awaiting_person')
          })

          it('should translate summary', function () {
            expect(req.t).to.be.calledWithExactly(
              'moves::detail.page_heading_summary',
              {
                fromLocation: 'Guildford Custody Suite',
                toLocation: 'HMP Brixton',
                date: '2020-10-07',
              }
            )
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with move', function () {
        beforeEach(function () {
          req.move = undefined

          middleware(req, res, nextSpy)
        })

        it('should not set identity bar on locals', function () {
          expect(res.locals).not.to.have.property('identityBar')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
