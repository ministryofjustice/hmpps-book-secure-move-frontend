const personEscortRecordService = require('../../../../common/services/person-escort-record')

const { NewPersonEscortRecordController } = require('./controllers')

const controller = new NewPersonEscortRecordController({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('NewPersonEscortRecordController', function () {
    describe('#saveValues', function () {
      const mockMoveId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(personEscortRecordService, 'create')
        nextSpy = sinon.spy()
        req = {
          move: {
            id: mockMoveId,
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          personEscortRecordService.create.resolves({})
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should create person escort record', function () {
          expect(personEscortRecordService.create).to.be.calledOnceWithExactly(
            mockMoveId
          )
        })

        it('should set record to request', function () {
          expect(req).to.contain.property('record')
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when save fails', function () {
        context('with existing record error', function () {
          const errorMock = new Error('Existing record')

          beforeEach(async function () {
            errorMock.statusCode = 422
            errorMock.errors = [
              {
                code: 'taken',
              },
            ]

            sinon.stub(controller, 'successHandler')

            personEscortRecordService.create.throws(errorMock)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })

          it('should call success handler', function () {
            expect(controller.successHandler).to.be.calledOnceWithExactly(
              req,
              {}
            )
          })
        })

        context('with any other error', function () {
          const errorMock = new Error('Problem')

          beforeEach(async function () {
            personEscortRecordService.create.throws(errorMock)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should call next with the error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })
        })
      })
    })
  })
})
