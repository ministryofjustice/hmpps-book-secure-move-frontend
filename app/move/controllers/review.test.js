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

describe('Move controllers', function() {
  describe('Review controller', function() {
    describe('#middlewareSetup()', function() {
      beforeEach(function() {
        sinon.stub(FormWizardController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'updateDateHint')

        controller.middlewareSetup()
      })

      it('should call parent method', function() {
        expect(FormWizardController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call setCourtCaseItems middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.updateDateHint
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveSummary')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setCourtCaseItems middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveSummary
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#updateDateHint()', function() {
      let mockReq, mockRes, nextSpy

      beforeEach(function() {
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
        }
        mockRes = {
          locals: {
            move: {
              date_from: '1 Jan',
            },
          },
        }
      })

      context('with only from date', function() {
        beforeEach(function() {
          filters.formatDateRange
            .withArgs(['1 Jan', undefined], 'and')
            .returns('1 Jan')
          controller.updateDateHint(mockReq, mockRes, nextSpy)
        })

        it('should translate new hint text', function() {
          expect(mockReq.t).to.be.calledOnceWithExactly(
            'original.translation.key',
            {
              context: 'with_date',
              date: '1 Jan',
            }
          )
        })

        it('should update field hint', function() {
          expect(mockReq.form.options.fields.move_date).to.deep.equal({
            hint: {
              text: 'new.translation.key',
            },
          })
        })
      })

      context('with from and to date', function() {
        beforeEach(function() {
          filters.formatDateRange
            .withArgs(['1 Jan', '2 Feb'], 'and')
            .returns('1 Jan and 2 Feb')
          mockRes.locals.move.date_to = '2 Feb'

          controller.updateDateHint(mockReq, mockRes, nextSpy)
        })

        it('should translate new hint text', function() {
          expect(mockReq.t).to.be.calledOnceWithExactly(
            'original.translation.key',
            {
              context: 'with_date_range',
              date: '1 Jan and 2 Feb',
            }
          )
        })

        it('should update field hint', function() {
          expect(mockReq.form.options.fields.move_date).to.deep.equal({
            hint: {
              text: 'new.translation.key',
            },
          })
        })
      })

      it('should call next', function() {
        controller.updateDateHint(mockReq, mockRes, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setMoveSummary()', function() {
      let mockRes, nextSpy

      beforeEach(function() {
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        nextSpy = sinon.spy()
        mockRes = {
          locals: {
            move: {
              person: {
                id: '1',
              },
              foo: 'bar',
            },
          },
        }

        controller.setMoveSummary({}, mockRes, nextSpy)
      })

      it('should call presenter', function() {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          mockRes.locals.move
        )
      })

      it('should update locals', function() {
        expect(mockRes.locals).to.deep.equal({
          ...mockRes.locals,
          person: mockRes.locals.move.person,
          moveSummary: mockRes.locals.move,
        })
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        sinon.stub(singleRequestService, 'approve')
        sinon.stub(singleRequestService, 'reject')
        nextSpy = sinon.spy()
        req = {
          form: {
            options: {
              allFields: {
                move_date: {},
                review_decision: {},
                rejection_reason_comment: {},
              },
            },
          },
          sessionModel: {
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
          locals: {
            move: mockMove,
          },
        }
      })

      context('with approval', function() {
        const mockValues = {
          move_date: '2020-10-10',
          review_decision: 'approve',
        }

        beforeEach(function() {
          req.sessionModel.toJSON = () => mockValues
        })

        context('when service resolves', function() {
          beforeEach(async function() {
            singleRequestService.approve.resolves({})
            await controller.successHandler(req, res, nextSpy)
          })

          it('should approve move', function() {
            expect(singleRequestService.approve).to.be.calledOnceWithExactly(
              mockMove.id,
              {
                date: mockValues.move_date,
              }
            )
          })

          it('should not reject move', function() {
            expect(singleRequestService.reject).not.to.be.called
          })

          it('should reset the journey', function() {
            expect(req.journeyModel.reset).to.have.been.calledOnce
          })

          it('should reset the session', function() {
            expect(req.sessionModel.reset).to.have.been.calledOnce
          })

          it('should redirect correctly', function() {
            expect(res.redirect).to.have.been.calledOnce
            expect(res.redirect).to.have.been.calledWith(
              '/move/123456789/confirmation'
            )
          })
        })

        context('when service rejects', function() {
          const errorMock = new Error('Problem')

          beforeEach(async function() {
            singleRequestService.approve.throws(errorMock)
            await controller.successHandler(req, res, nextSpy)
          })

          it('should call next with the error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })

          it('should not redirect', function() {
            expect(res.redirect).not.to.have.been.called
          })
        })
      })

      context('with rejection', function() {
        const mockValues = {
          review_decision: 'reject',
          rejection_reason_comment: 'No space at prison',
        }

        beforeEach(function() {
          req.sessionModel.toJSON = () => mockValues
        })

        context('when service resolves', function() {
          beforeEach(async function() {
            singleRequestService.reject.resolves({})
            await controller.successHandler(req, res, nextSpy)
          })

          it('should approve move', function() {
            expect(singleRequestService.reject).to.be.calledOnceWithExactly(
              mockMove.id,
              {
                comment: mockValues.rejection_reason_comment,
              }
            )
          })

          it('should not reject move', function() {
            expect(singleRequestService.approve).not.to.be.called
          })

          it('should reset the journey', function() {
            expect(req.journeyModel.reset).to.have.been.calledOnce
          })

          it('should reset the session', function() {
            expect(req.sessionModel.reset).to.have.been.calledOnce
          })

          it('should redirect correctly', function() {
            expect(res.redirect).to.have.been.calledOnce
            expect(res.redirect).to.have.been.calledWith('/move/123456789')
          })
        })

        context('when service rejects', function() {
          const errorMock = new Error('Problem')

          beforeEach(async function() {
            singleRequestService.reject.throws(errorMock)
            await controller.successHandler(req, res, nextSpy)
          })

          it('should call next with the error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })

          it('should not redirect', function() {
            expect(res.redirect).not.to.have.been.called
          })
        })
      })
    })
  })
})
