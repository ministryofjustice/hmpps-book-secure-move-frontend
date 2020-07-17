const presenters = require('../../../common/presenters')

const Controller = require('./framework-section')
const FrameworksController = require('./frameworks')

const controller = new Controller({
  route: '/',
})

describe('Person Escort Record controllers', function () {
  describe('FrameworkSectionController', function () {
    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FrameworksController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FrameworksController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setSectionSummary
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
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
