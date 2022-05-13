const timezoneMock = require('timezone-mock')

const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')

const { HandoverController } = require('./controllers')

const controller = new HandoverController({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('HandoverController', function () {
    describe('#middlewareSetup', function () {
      beforeEach(function () {
        sinon.stub(ConfirmAssessmentController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setSupplier')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(ConfirmAssessmentController.prototype.middlewareSetup).to.have
          .been.calledOnce
      })

      it('should call set supplier', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setSupplier
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(ConfirmAssessmentController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setBreadcrumb')
        sinon.stub(controller, 'setMoveDetails')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(ConfirmAssessmentController.prototype.middlewareLocals).to.have
          .been.calledOnce
      })

      it('should call set breadcrumb', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setBreadcrumb
        )
      })

      it('should call set move details', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setMoveDetails
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#setSupplier', function () {
      let mockReq, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            options: {
              fields: {
                handover_receiving_organisation: {
                  items: [
                    {
                      text: 'foo',
                      value: 'foo',
                    },
                    {
                      text: 'bar',
                      value: 'bar',
                    },
                  ],
                },
              },
            },
          },
        }
      })

      context('without supplier name', function () {
        beforeEach(function () {
          controller.setSupplier(mockReq, {}, nextSpy)
        })

        it('should not update with supplier name', function () {
          expect(
            mockReq.form.options.fields.handover_receiving_organisation.items
          ).to.deep.equal([
            {
              text: 'foo',
              value: 'foo',
            },
            {
              text: 'bar',
              value: 'bar',
            },
          ])
        })
      })

      context('with supplier name', function () {
        beforeEach(function () {
          mockReq.move = {
            supplier: {
              name: 'Serco',
            },
          }
          controller.setSupplier(mockReq, {}, nextSpy)
        })

        it('should update with supplier name', function () {
          expect(
            mockReq.form.options.fields.handover_receiving_organisation.items
          ).to.deep.equal([
            {
              text: 'Serco',
              value: 'Serco',
            },
            {
              text: 'bar',
              value: 'bar',
            },
          ])
        })
      })
    })

    describe('#setBreadcrumb', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            options: {
              pageTitle: 'Step title',
            },
          },
          t: sinon.stub().returnsArg(0),
        }
        mockRes = {
          breadcrumb: sinon.stub().returnsThis(),
        }
        controller.setBreadcrumb(mockReq, mockRes, nextSpy)
      })

      it('should set breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledOnceWithExactly({
          text: 'Step title',
          href: '',
        })
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setMoveId', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
        }
        mockRes = {
          locals: {},
        }
        controller.setMoveDetails(mockReq, mockRes, nextSpy)
      })

      it('should set move ID', function () {
        expect(mockRes.locals).to.have.property('moveId')
        expect(mockRes.locals.moveId).to.equal('12345')
      })

      it('should set move is lockout', function () {
        expect(mockRes.locals).to.have.property('moveIsLockout')
        expect(mockRes.locals.moveIsLockout).to.equal(undefined)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#validateFields', function () {
      let clock
      let mockReq
      let callbackSpy
      let fieldErrors

      beforeEach(function () {
        timezoneMock.register('UTC')
        const now = new Date('2020-01-09T15:09:00Z')
        clock = sinon.useFakeTimers(now.getTime())

        sinon.stub(ConfirmAssessmentController.prototype, 'validateFields')

        callbackSpy = sinon.spy()

        mockReq = {
          form: {
            values: {
              handover_dispatching_officer_id: '123',
              handover_dispatching_officer_contact: '077777',
              handover_receiving_officer: 'Jane Doe',
              handover_receiving_officer_id: '456',
              handover_receiving_officer_contact: '088888',
              handover_receiving_organisation: 'Serco',
            },
          },
          assessment: {
            id: '12345',
          },
          services: {
            personEscortRecord: {
              confirm: sinon.stub().resolves({}),
            },
          },
        }

        const error = new Error('VALIDATION')
        error.key = 'handover_dispatching_officer'
        error.type = 'missing'
        fieldErrors = { handover_dispatching_officer: error }
      })

      afterEach(function () {
        clock.restore()
        timezoneMock.unregister()
      })

      describe('when callback is called', function () {
        context('when other_date and other_time are both missing', function () {
          beforeEach(async function () {
            ConfirmAssessmentController.prototype.validateFields.yields(
              fieldErrors
            )
            await controller.validateFields(mockReq, {}, callbackSpy)
          })

          it('should call parent method', function () {
            expect(
              ConfirmAssessmentController.prototype.validateFields
            ).to.have.been.calledOnce
          })

          it('should call callback with existing errors', function () {
            expect(callbackSpy).to.have.been.calledOnceWithExactly(fieldErrors)
          })
        })

        context(
          'when other_date is missing and other_time is present',
          function () {
            beforeEach(async function () {
              ConfirmAssessmentController.prototype.validateFields.yields(
                fieldErrors
              )
              mockReq.form.values.handover_other_time = '14:20:00'

              await controller.validateFields(mockReq, {}, callbackSpy)
            })

            it('should call parent method', function () {
              expect(ConfirmAssessmentController.prototype.validateFields).to
                .have.been.calledOnce
            })

            it('should call callback with existing errors', function () {
              expect(callbackSpy).to.have.been.calledOnceWithExactly(
                fieldErrors
              )
            })
          }
        )

        context(
          'when other_date is present and other_time is missing',
          function () {
            beforeEach(async function () {
              ConfirmAssessmentController.prototype.validateFields.yields(
                fieldErrors
              )
              mockReq.form.values.handover_other_date = '2020-01-07'

              await controller.validateFields(mockReq, {}, callbackSpy)
            })

            it('should call parent method', function () {
              expect(ConfirmAssessmentController.prototype.validateFields).to
                .have.been.calledOnce
            })

            it('should call callback with existing errors', function () {
              expect(callbackSpy).to.have.been.calledOnceWithExactly(
                fieldErrors
              )
            })
          }
        )

        context('when other_date in the future', function () {
          beforeEach(async function () {
            ConfirmAssessmentController.prototype.validateFields.yields(
              fieldErrors
            )
            mockReq.form.values.handover_other_date = '2020-01-10'
            mockReq.form.values.handover_other_time = '14:20:00'

            await controller.validateFields(mockReq, {}, callbackSpy)
          })

          it('should call parent method', function () {
            expect(
              ConfirmAssessmentController.prototype.validateFields
            ).to.have.been.calledOnce
          })

          it('should call callback with existing errors', function () {
            expect(callbackSpy).to.have.been.calledOnceWithExactly(fieldErrors)
          })
        })

        context(
          'when other_date is in the past and other_time is in the past',
          function () {
            beforeEach(async function () {
              ConfirmAssessmentController.prototype.validateFields.yields(
                fieldErrors
              )
              mockReq.form.values.handover_other_date = '2020-01-09'
              mockReq.form.values.handover_other_time = '15:08:00'

              await controller.validateFields(mockReq, {}, callbackSpy)
            })

            it('should call parent method', function () {
              expect(ConfirmAssessmentController.prototype.validateFields).to
                .have.been.calledOnce
            })

            it('should call callback with existing errors', function () {
              expect(callbackSpy).to.have.been.calledOnceWithExactly(
                fieldErrors
              )
            })
          }
        )

        context(
          'when other_date is in the past and other_time is in the future',
          function () {
            beforeEach(async function () {
              ConfirmAssessmentController.prototype.validateFields.yields(
                fieldErrors
              )
              mockReq.form.values.handover_other_date = '2020-01-09'
              mockReq.form.values.handover_other_time = '15:10:00'

              await controller.validateFields(mockReq, {}, callbackSpy)
            })

            it('should call parent method', function () {
              expect(ConfirmAssessmentController.prototype.validateFields).to
                .have.been.calledOnce
            })

            it('should call callback with addition before error errors', function () {
              expect(callbackSpy).to.have.been.calledOnce
              const callbackErrors = callbackSpy.getCall(0).args[0]

              expect(callbackErrors).to.have.keys([
                'handover_dispatching_officer',
                'handover_other_time',
              ])

              expect(callbackErrors.handover_other_time).to.deep.include({
                errorGroup: 'handoverOtherDateTime',
                type: 'before',
              })
            })
          }
        )
      })
    })

    describe('#saveValues', function () {
      let clock
      let mockReq
      let nextSpy

      beforeEach(function () {
        timezoneMock.register('UTC')
        const now = new Date('2014-11-05T15:09:00Z')
        clock = sinon.useFakeTimers(now.getTime())
        nextSpy = sinon.spy()

        mockReq = {
          form: {
            values: {
              handover_occurred_at: '2020-10-10T14:20:00Z',
              handover_dispatching_officer: 'John Smith',
              handover_dispatching_officer_id: '123',
              handover_dispatching_officer_contact: '077777',
              handover_receiving_officer: 'Jane Doe',
              handover_receiving_officer_id: '456',
              handover_receiving_officer_contact: '088888',
              handover_receiving_organisation: 'Serco',
            },
          },
          assessment: {
            id: '12345',
          },
          services: {
            personEscortRecord: {
              confirm: sinon.stub().resolves({}),
            },
          },
          session: {
            currentLocation: { id: 'abc' },
          },
        }
      })

      afterEach(function () {
        clock.restore()
        timezoneMock.unregister()
      })

      context('when promises resolve', function () {
        beforeEach(async function () {
          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call service method', function () {
          expect(
            mockReq.services.personEscortRecord.confirm
          ).to.be.calledOnceWithExactly(mockReq.assessment.id, {
            handoverOccurredAt: '2020-10-10T14:20:00Z',
            dispatchingOfficer: 'John Smith',
            dispatchingOfficerId: '123',
            dispatchingOfficerContact: '077777',
            receivingOfficer: 'Jane Doe',
            receivingOfficerId: '456',
            receivingOfficerContact: '088888',
            receivingOrganisation: 'Serco',
            locationId: 'abc',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when service rejects with error', function () {
        const error = new Error()

        beforeEach(async function () {
          mockReq.services.personEscortRecord.confirm = sinon
            .stub()
            .rejects(error)

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(error)
        })
      })

      describe('handover time', function () {
        context('with current timestamp', function () {
          beforeEach(async function () {
            mockReq.form.values.handover_occurred_at = 'now'
            await controller.saveValues(mockReq, {}, nextSpy)
          })

          it('should use current timestamp for handover time', function () {
            expect(
              mockReq.services.personEscortRecord.confirm.args[0][1]
                .handoverOccurredAt
            ).to.equal('2014-11-05T15:09:00Z')
          })
        })

        context('with custom timestamp', function () {
          beforeEach(async function () {
            mockReq.form.values.handover_occurred_at = 'other'
            mockReq.form.values.handover_other_time = '14:37'
            mockReq.form.values.handover_other_date = '2017-04-19'
            await controller.saveValues(mockReq, {}, nextSpy)
          })

          it('should use custom timestamp for handover time', function () {
            expect(
              mockReq.services.personEscortRecord.confirm.args[0][1]
                .handoverOccurredAt
            ).to.equal('2017-04-19T14:37:00+01:00')
          })
        })
      })

      describe('receiving organisation', function () {
        context('with standard option selected', function () {
          beforeEach(async function () {
            mockReq.form.values.handover_receiving_organisation = 'Serco'
            await controller.saveValues(mockReq, {}, nextSpy)
          })

          it('should use submitted value', function () {
            expect(
              mockReq.services.personEscortRecord.confirm.args[0][1]
                .receivingOrganisation
            ).to.equal('Serco')
          })
        })

        context('with custom organisation', function () {
          beforeEach(async function () {
            mockReq.form.values.handover_receiving_organisation = 'other'
            mockReq.form.values.handover_other_organisation =
              'Harry Blogs Haulage'
            await controller.saveValues(mockReq, {}, nextSpy)
          })

          it('should use custom value', function () {
            expect(
              mockReq.services.personEscortRecord.confirm.args[0][1]
                .receivingOrganisation
            ).to.equal('Harry Blogs Haulage')
          })
        })
      })
    })
  })
})
