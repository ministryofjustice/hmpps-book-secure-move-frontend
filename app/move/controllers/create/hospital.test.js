const timezoneMock = require('timezone-mock')

const filters = require('../../../../config/nunjucks/filters')

const CreateBaseController = require('./base')
const Controller = require('./hospital')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Hospital appointment controller', function () {
    describe('#process()', function () {
      let mockReq, nextSpy

      beforeEach(function () {
        timezoneMock.register('UTC')
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            values: {},
          },
          getMove: sinon.stub().returns({ date: '2020-10-10' }),
        }
      })

      afterEach(function () {
        timezoneMock.unregister()
      })

      context('with start time', function () {
        context('with valid time value', function () {
          beforeEach(function () {
            mockReq.form.values.time_due = '10:00'
            controller.process(mockReq, {}, nextSpy)
          })

          it('should format as ISO', function () {
            expect(mockReq.form.values.time_due).to.equal(
              '2020-10-10T10:00:00Z'
            )
          })

          it('should set time_due to hospital start time', function () {
            expect(mockReq.form.values.time_due).to.equal(
              '2020-10-10T10:00:00Z'
            )
          })
        })

        context('with invalid time value', function () {
          beforeEach(function () {
            mockReq.form.values.time_due = 'foo'
            controller.process(mockReq, {}, nextSpy)
          })

          it('should return start time', function () {
            expect(mockReq.form.values.time_due).to.equal('foo')
          })
        })
      })

      context('without start time', function () {
        beforeEach(function () {
          mockReq.form.values.time_due = 'foo'
          controller.process(mockReq, {}, nextSpy)
        })

        it('should not change value', function () {
          expect(mockReq.form.values.time_due).to.equal('foo')
        })
      })
    })

    describe('#getValues()', function () {
      let callback
      const mockUnformattedTime = '10:00'
      const mockFormattedTime = '10pm'

      beforeEach(function () {
        callback = sinon.spy()
        sinon.stub(filters, 'formatTime').returns(mockFormattedTime)
        sinon
          .stub(CreateBaseController.prototype, 'getValues')
          .callsFake((req, res, valuesCallback) => {
            valuesCallback(null, {
              foo: 'bar',
              time_due: mockUnformattedTime,
            })
          })
      })

      context('when parent method does not throw an error', function () {
        beforeEach(function () {
          controller.getValues({}, {}, callback)
        })

        it('should format time', function () {
          expect(filters.formatTime).to.be.calledOnceWithExactly(
            mockUnformattedTime
          )
        })

        it('should invoke the callback', function () {
          expect(callback).to.be.calledOnceWithExactly(null, {
            foo: 'bar',
            time_due: mockFormattedTime,
          })
        })
      })

      context('when controller has getUpdateValues method', function () {
        const req = {}
        const res = {}
        const mockMove = {}
        beforeEach(function () {
          controller.getUpdateValues = sinon.stub().returns(mockMove)
          controller.getValues(req, res, callback)
        })

        it('should format time', function () {
          expect(controller.getUpdateValues).to.be.calledOnceWithExactly(
            req,
            res,
            {
              foo: 'bar',
              time_due: mockUnformattedTime,
            }
          )
        })
      })

      context('when parent method throws an error', function () {
        const mockError = new Error()

        beforeEach(function () {
          CreateBaseController.prototype.getValues.callsFake(
            (req, res, valuesCallback) => {
              valuesCallback(mockError, {
                foo: 'bar',
              })
            }
          )
          controller.getValues({}, {}, callback)
        })

        it('should invoke the callback with the error', function () {
          expect(callback).to.be.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
