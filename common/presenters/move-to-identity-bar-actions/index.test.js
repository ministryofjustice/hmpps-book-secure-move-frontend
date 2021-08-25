const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n')
const componentService = require('../../services/component')

const assessmentActionsStub = sinon.stub().returns('_assessmentActions_')

const presenter = proxyquire('./index', {
  './assessment-actions': assessmentActionsStub,
})

describe('Presenters', function () {
  describe('Move identity bar actions', function () {
    describe('#moveToIdentityBarActions', function () {
      let output, mockMove, canAccessStub

      beforeEach(function () {
        assessmentActionsStub.resetHistory()
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(componentService, 'getComponent').callsFake((name, args) => {
          const obj = {}

          obj[name] = args

          return obj
        })
        canAccessStub = sinon.stub().returns(true)

        mockMove = {
          id: '12345',
          status: 'requested',
        }
      })

      context('without args', function () {
        it('should return empty object', function () {
          output = presenter()
          expect(output).to.deep.equal([])
        })
      })

      context('without profile', function () {
        context('with access to assign', function () {
          beforeEach(function () {
            output = presenter(mockMove, { canAccess: canAccessStub })
          })

          it('should return empty object', function () {
            expect(output).to.deep.equal([
              {
                html: {
                  govukButton: {
                    href: `/move/${mockMove.id}/assign`,
                    preventDoubleClick: true,
                    text: 'actions::add_person_to_move',
                  },
                },
              },
            ])
          })
        })

        context('without access to assign', function () {
          beforeEach(function () {
            canAccessStub.withArgs('allocation:person:assign').returns(false)
            output = presenter(mockMove, { canAccess: canAccessStub })
          })

          it('should return empty object', function () {
            expect(output).to.deep.equal([])
          })
        })
      })

      context('with proposed move', function () {
        beforeEach(function () {
          mockMove.profile = {
            id: '12345',
          }
          mockMove.status = 'proposed'
        })

        context('with access to review', function () {
          beforeEach(function () {
            output = presenter(mockMove, { canAccess: canAccessStub })
          })

          it('should return empty object', function () {
            expect(output).to.deep.equal([
              {
                html: {
                  govukButton: {
                    href: `/move/${mockMove.id}/review`,
                    preventDoubleClick: true,
                    text: 'actions::review',
                  },
                },
              },
            ])
          })
        })

        context('without access to review', function () {
          beforeEach(function () {
            canAccessStub.withArgs('move:review').returns(false)
            output = presenter(mockMove, { canAccess: canAccessStub })
          })

          it('should return assessment actions', function () {
            expect(output).to.deep.equal('_assessmentActions_')
          })
        })
      })

      context('with all other scenarios', function () {
        beforeEach(function () {
          mockMove.profile = {
            id: '12345',
          }
          mockMove.status = 'requested'

          output = presenter(mockMove, { canAccess: canAccessStub })
        })

        it('should return assessment actions', function () {
          expect(output).to.deep.equal('_assessmentActions_')
        })
      })
    })
  })
})
