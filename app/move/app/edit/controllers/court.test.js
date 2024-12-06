const AssessmentController = require('./assessment')
const CourtController = require('./court')

const controller = new CourtController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  const res = {}
  let req
  let nextSpy

  beforeEach(function () {
    req = {}
    nextSpy = sinon.spy()
    sinon.stub(AssessmentController.prototype, 'configure')
  })

  describe('Update court info controller', function () {
    it('should extend AssessmentController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssessmentController.prototype
      )
    })

    context('#configure', function () {
      context('when the move is not to a court', function () {
        let args
        let error

        beforeEach(function () {
          args = []
          error = {}
          controller.configure(req, res, nextSpy)

          try {
            args = nextSpy.getCall(0).args
            error = args[0]
          } catch (e) {}
        })

        it('should call next once with an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(args.length).to.equal(1)
        })

        it('should set the correct error message', function () {
          expect(error.message).to.equal(
            'Updating court information is not possible for this move'
          )
        })

        it('should set the correct error statusCode', function () {
          expect(error.statusCode).to.equal(404)
        })
      })

      context('when the move is to a court', function () {
        beforeEach(function () {
          req = {
            move: {
              to_location: {
                location_type: 'court',
              },
            },
          }
          controller.configure(req, res, nextSpy)
        })

        it('should not call next', function () {
          expect(nextSpy).to.not.be.called
        })

        it('should invoke super’s configure', function () {
          expect(
            AssessmentController.prototype.configure
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })
    })

    describe('#processFields', function () {
      it('should process the fields correctly', function () {
        const fields = {
          court: {
            items: [
              {
                value: 'solicitor',
                text: 'Solicitor',
              },
            ],
          },
        }
        const expectedFields = {
          court: {
            items: [
              {
                value: 'solicitor',
                text: 'Solicitor',
              },
              {
                divider: 'or',
              },
              {
                behaviour: 'exclusive',
                text: 'No, there is no information for the court',
                value: 'none',
              },
            ],
            validate: [
              {
                message: 'Select if there is any information for the court',
                type: 'required',
              },
            ],
          },
        }

        const result = controller.processFields(fields)

        expect(result).to.deep.equal(expectedFields)
      })
    })
  })
})
