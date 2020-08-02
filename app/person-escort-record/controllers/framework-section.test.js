const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

const Controller = require('./framework-section')

const controller = new Controller({
  route: '/',
})

describe('Person Escort Record controllers', function () {
  describe('FrameworkSectionController', function () {
    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set section summary method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setSectionSummary
        )
      })

      it('should call set move ID method', function () {
        expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
          controller.setMoveId
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(2)
      })
    })

    describe('#setMoveId', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {}
        mockRes = {
          locals: {},
        }
      })

      context('without a move', function () {
        beforeEach(function () {
          controller.setMoveId(mockReq, mockRes, nextSpy)
        })

        it('should not set move ID', function () {
          expect(mockRes.locals.moveId).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with a move', function () {
        beforeEach(function () {
          mockReq.move = {
            id: '12345',
          }

          controller.setMoveId(mockReq, mockRes, nextSpy)
        })

        it('should set move ID', function () {
          expect(mockRes.locals.moveId).to.equal('12345')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setSectionSummary', function () {
      let mockReq, mockRes, nextSpy, mapStub

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          baseUrl: '/base-url',
          form: {
            options: {
              allFields: {
                fieldOne: { name: 'field-one' },
                fieldTwo: { name: 'field-two' },
              },
            },
          },
          frameworkSection: {
            name: 'Foo',
            steps: {
              '/step-1': {},
              '/step-2': {},
              '/step-3': {},
            },
          },
          personEscortRecord: {
            responses: [{ id: '1' }, { id: '2' }, { id: '3' }],
          },
        }
        mockRes = {
          locals: {},
        }
        mapStub = sinon
          .stub()
          .onCall(0)
          .returns(['/step-1', { url: '/step-one' }])
          .onCall(1)
          .returns(undefined)
          .onCall(2)
          .returns(['/step-3', { url: '/step-three' }])
        sinon.stub(presenters, 'frameworkStepToSummary').returns(mapStub)

        controller.setSectionSummary(mockReq, mockRes, nextSpy)
      })

      it('should set section title', function () {
        expect(mockRes.locals.sectionTitle).to.equal('Foo')
      })

      it('should call presenter', function () {
        expect(presenters.frameworkStepToSummary).to.be.calledOnceWithExactly(
          mockReq.form.options.allFields,
          mockReq.personEscortRecord.responses,
          `${mockReq.baseUrl}/`
        )
      })

      it('should map each item', function () {
        expect(mapStub.callCount).to.equal(3)
      })

      it('should set summary steps filtering any falsy values', function () {
        expect(mockRes.locals.summarySteps).to.deep.equal([
          [
            '/step-1',
            {
              url: '/step-one',
            },
          ],
          [
            '/step-3',
            {
              url: '/step-three',
            },
          ],
        ])
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
