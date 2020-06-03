const { addDays, format } = require('date-fns')
const { cloneDeep } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')
const filters = require('../../../config/nunjucks/filters')

const ReviewController = require('./review')

const controller = new ReviewController({ route: '/' })

const mockMove = {
  id: '123456789',
  person: {
    fullname: 'Full name',
  },
}

describe('Move controllers', function () {
  describe('Review controller', function () {
    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'updateDateHint')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call setRebookOptions middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setRebookOptions
        )
      })

      it('should call updateDateHint middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.updateDateHint
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveSummary')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setMoveSummary middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveSummary
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkStatus')
        sinon.stub(controller, 'canAccess')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkStatus middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkStatus
        )
      })

      it('should call canAccess middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.canAccess
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#setRebookOptions', function () {
      let req
      let next
      const mockReq = {
        form: {
          options: {
            fields: {
              rebook: {
                items: [
                  {
                    value: 'false',
                    label: 'Do not rebook',
                  },
                  {
                    value: 'true',
                    label: 'Rebook in 7 days',
                  },
                ],
              },
            },
          },
        },
      }

      beforeEach(function () {
        req = cloneDeep(mockReq)
        next = sinon.stub()
      })

      context('without a date_to', function () {
        beforeEach(function () {
          req.move = {
            date_to: null,
          }
          controller.setRebookOptions(req, {}, next)
        })

        it('leaves the existing options untouched', function () {
          expect(req.form.options.fields.rebook.items).to.deep.equal([
            {
              label: 'Do not rebook',
              value: 'false',
            },
            {
              label: 'Rebook in 7 days',
              value: 'true',
            },
          ])
        })

        it('calls next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('with a date_to farther away than one week', function () {
        beforeEach(function () {
          req.move = {
            date_to: format(addDays(new Date(), 28), 'yyyy-MM-dd'),
          }
          controller.setRebookOptions(req, {}, next)
        })

        it('leaves the existing options untouched', function () {
          expect(req.form.options.fields.rebook.items).to.deep.equal([
            {
              label: 'Do not rebook',
              value: 'false',
            },
            {
              label: 'Rebook in 7 days',
              value: 'true',
            },
          ])
        })

        it('calls next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('with a date_to closer than one week', function () {
        beforeEach(function () {
          req.move = {
            date_to: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
          }
          controller.setRebookOptions(req, {}, next)
        })

        it('keeps only the "false" options', function () {
          expect(req.form.options.fields.rebook.items).to.deep.equal([
            {
              label: 'Do not rebook',
              value: 'false',
            },
          ])
        })

        it('calls next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })
    })

    describe('#checkStatus()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('with proposed status', function () {
        beforeEach(function () {
          mockReq.move.status = 'proposed'
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      const statuses = ['requested', 'cancelled', 'accepted']
      statuses.forEach(status => {
        context(`with ${status} status`, function () {
          beforeEach(function () {
            mockReq.move.status = status
            controller.checkStatus(mockReq, mockRes, nextSpy)
          })

          it('should redirect to move', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })
        })
      })
    })

    describe('#canAccess()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          session: {
            user: {
              permissions: ['move:view'],
            },
          },
          move: {
            id: '12345',
          },
        }
        mockRes = {
          locals: {
            canAccess: sinon.stub().returns(false),
          },
          redirect: sinon.spy(),
        }

        mockRes.locals.canAccess
          .withArgs('move:review', ['move:review', 'move:view'])
          .returns(true)
      })

      context('with correct permission', function () {
        beforeEach(function () {
          mockReq.session.user.permissions = ['move:review', 'move:view']
          controller.canAccess(mockReq, mockRes, nextSpy)
        })

        it('should check permissions', function () {
          expect(
            mockRes.locals.canAccess
          ).to.be.calledOnceWithExactly('move:review', [
            'move:review',
            'move:view',
          ])
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with incorrect permission', function () {
        beforeEach(function () {
          controller.canAccess(mockReq, mockRes, nextSpy)
        })

        it('should check permissions', function () {
          expect(
            mockRes.locals.canAccess
          ).to.be.calledOnceWithExactly('move:review', ['move:view'])
        })

        it('should redirect', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    describe('#updateDateHint()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        sinon.stub(filters, 'formatDateRange')
        nextSpy = sinon.spy()

        mockReq = {
          t: sinon.stub().returns('new.translation.key'),
          form: {
            options: {
              fields: {
                move_date: {
                  hint: {
                    text: 'original.translation.key',
                  },
                },
              },
            },
          },
          move: {
            date_from: '1 Jan',
          },
        }
        mockRes = {}
      })

      context('with only from date', function () {
        beforeEach(function () {
          filters.formatDateRange
            .withArgs(['1 Jan', undefined], 'and')
            .returns('1 Jan')
          controller.updateDateHint(mockReq, mockRes, nextSpy)
        })

        it('should translate new hint text', function () {
          expect(mockReq.t).to.be.calledOnceWithExactly(
            'original.translation.key',
            {
              context: 'with_date',
              date: '1 Jan',
            }
          )
        })

        it('should update field hint', function () {
          expect(mockReq.form.options.fields.move_date).to.deep.equal({
            hint: {
              text: 'new.translation.key',
            },
          })
        })
      })

      context('with from and to date', function () {
        beforeEach(function () {
          filters.formatDateRange
            .withArgs(['1 Jan', '2 Feb'], 'and')
            .returns('1 Jan and 2 Feb')
          mockReq.move.date_to = '2 Feb'

          controller.updateDateHint(mockReq, mockRes, nextSpy)
        })

        it('should translate new hint text', function () {
          expect(mockReq.t).to.be.calledOnceWithExactly(
            'original.translation.key',
            {
              context: 'with_date_range',
              date: '1 Jan and 2 Feb',
            }
          )
        })

        it('should update field hint', function () {
          expect(mockReq.form.options.fields.move_date).to.deep.equal({
            hint: {
              text: 'new.translation.key',
            },
          })
        })
      })

      it('should call next', function () {
        controller.updateDateHint(mockReq, mockRes, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setMoveSummary()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        sinon
          .stub(presenters, 'moveToMetaListComponent')
          .returns('__moveToMetaListComponent__')
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            profile: {
              person: {
                id: '1',
              },
            },
            foo: 'bar',
          },
        }
        mockRes = {
          locals: {},
        }

        controller.setMoveSummary(mockReq, mockRes, nextSpy)
      })

      it('should call presenter', function () {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          mockRes.locals.move
        )
      })

      it('should set person object on locals', function () {
        expect(mockRes.locals.person).to.deep.equal({
          id: '1',
        })
      })

      it('should set move on locals', function () {
        expect(mockRes.locals.move).to.deep.equal({
          profile: {
            person: {
              id: '1',
            },
          },
          foo: 'bar',
        })
      })

      it('should set move summary on locals', function () {
        expect(mockRes.locals.moveSummary).to.equal(
          '__moveToMetaListComponent__'
        )
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#successHandler()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        sinon.stub(singleRequestService, 'approve')
        sinon.stub(singleRequestService, 'reject')
        nextSpy = sinon.spy()
        req = {
          form: {
            options: {
              allFields: {
                move_date: {},
                rebook: {},
                review_decision: {},
                rejection_reason: {},
                cancellation_reason_comment: {},
              },
            },
          },
          sessionModel: {
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
          move: mockMove,
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('with approval', function () {
        const mockValues = {
          move_date: '2020-10-10',
          review_decision: 'approve',
        }

        beforeEach(function () {
          req.sessionModel.toJSON = () => mockValues
        })

        context('when service resolves', function () {
          beforeEach(async function () {
            singleRequestService.approve.resolves({})
            await controller.successHandler(req, res, nextSpy)
          })

          it('should approve move', function () {
            expect(singleRequestService.approve).to.be.calledOnceWithExactly(
              mockMove.id,
              {
                date: mockValues.move_date,
              }
            )
          })

          it('should not reject move', function () {
            expect(singleRequestService.reject).not.to.be.called
          })

          it('should reset the journey', function () {
            expect(req.journeyModel.reset).to.have.been.calledOnce
          })

          it('should reset the session', function () {
            expect(req.sessionModel.reset).to.have.been.calledOnce
          })

          it('should redirect correctly', function () {
            expect(res.redirect).to.have.been.calledOnce
            expect(res.redirect).to.have.been.calledWith(
              '/move/123456789/confirmation'
            )
          })
        })

        context('when service rejects', function () {
          const errorMock = new Error('Problem')

          beforeEach(async function () {
            singleRequestService.approve.throws(errorMock)
            await controller.successHandler(req, res, nextSpy)
          })

          it('should call next with the error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })

          it('should not redirect', function () {
            expect(res.redirect).not.to.have.been.called
          })
        })
      })

      context('with rejection', function () {
        const mockValues = {
          review_decision: 'reject',
          rejection_reason: 'no_space_at_receiving_prison',
          cancellation_reason_comment: 'No further comments',
          rebook: 'false',
        }

        beforeEach(function () {
          req.sessionModel.toJSON = () => mockValues
        })

        context('when service resolves', function () {
          beforeEach(async function () {
            singleRequestService.reject.resolves({})
            await controller.successHandler(req, res, nextSpy)
          })

          it('should approve move', function () {
            expect(
              singleRequestService.reject
            ).to.have.been.calledOnceWithExactly(mockMove.id, {
              review_decision: 'reject',
              rejection_reason: 'no_space_at_receiving_prison',
              cancellation_reason_comment: 'No further comments',
              rebook: 'false',
            })
          })

          it('should not reject move', function () {
            expect(singleRequestService.approve).not.to.be.called
          })

          it('should reset the journey', function () {
            expect(req.journeyModel.reset).to.have.been.calledOnce
          })

          it('should reset the session', function () {
            expect(req.sessionModel.reset).to.have.been.calledOnce
          })

          it('should redirect correctly', function () {
            expect(res.redirect).to.have.been.calledOnce
            expect(res.redirect).to.have.been.calledWith('/move/123456789')
          })
        })

        context('when service rejects', function () {
          const errorMock = new Error('Problem')

          beforeEach(async function () {
            singleRequestService.reject.throws(errorMock)
            await controller.successHandler(req, res, nextSpy)
          })

          it('should call next with the error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })

          it('should not redirect', function () {
            expect(res.redirect).not.to.have.been.called
          })
        })
      })
    })
  })
})
