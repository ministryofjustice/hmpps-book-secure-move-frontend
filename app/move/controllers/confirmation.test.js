const proxyquire = require('proxyquire')
const sendJourneyTimeStub = sinon.stub().resolves('GA hit sent')
const controller = require('./confirmation')

const mockMove = {
  move_type: 'court_appearance',
  to_location: {
    title: 'Axminster Crown Court',
  },
}
const mockTimestampKey = 'createMoveJourneyTimestamp'

describe('Move controllers', function() {
  describe('#confirmation()', function() {
    describe('with move_type "court_appearance"', function() {
      let req, res, nextSpy

      beforeEach(async function() {
        req = {}
        res = {
          render: sinon.spy(),
          locals: {
            move: mockMove,
          },
        }
        nextSpy = sinon.spy()

        await controller(req, res, nextSpy)
      })

      it('should render confirmation template', function() {
        const template = res.render.args[0][0]

        expect(res.render.calledOnce).to.be.true
        expect(template).to.equal('move/views/confirmation')
      })

      it('should contain a location param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('location')
        expect(params.location).to.equal(mockMove.to_location.title)
      })
    })

    describe('with move_type "prison_recall"', function() {
      let req, res, nextSpy

      beforeEach(async function() {
        req = {
          t: sinon.stub().returnsArg(0),
        }
        res = {
          render: sinon.spy(),
          locals: {
            move: {
              ...mockMove,
              move_type: 'prison_recall',
            },
          },
        }
        nextSpy = sinon.spy()

        await controller(req, res, nextSpy)
      })

      it('should render confirmation template', function() {
        const template = res.render.args[0][0]

        expect(res.render.calledOnce).to.be.true
        expect(template).to.equal('move/views/confirmation')
      })

      it('should pass correct values to location translation', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('location')
        expect(req.t.firstCall).to.have.been.calledWithExactly(
          'fields::move_type.items.prison_recall.label'
        )
      })
    })

    describe('with Create Move Journey Timestamp', function() {
      const controller = proxyquire('./confirmation', {
        '../../../common/lib/analytics': {
          sendJourneyTime: sendJourneyTimeStub,
        },
      })
      let req, res, nextSpy

      beforeEach(async function() {
        req = {}
        res = {
          render: sinon.spy(),
          locals: {
            move: mockMove,
          },
        }
        nextSpy = sinon.spy()

        await controller(req, res, nextSpy)
      })

      it('should call GA sendJourneyTime method', function() {
        expect(sendJourneyTimeStub).to.be.calledOnce
        expect(sendJourneyTimeStub).to.be.calledWithExactly(
          req,
          mockTimestampKey,
          {
            utv: 'Create a move',
          }
        )
      })

      it('should render confirmation template', function() {
        const template = res.render.args[0][0]

        expect(res.render.calledOnce).to.be.true
        expect(template).to.equal('move/views/confirmation')
      })

      it('should contain a location param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('location')
        expect(params.location).to.equal(mockMove.to_location.title)
      })
    })

    describe('when sendJourneyTime fails', function() {
      const errorMock = new Error('Problem')
      const controller = proxyquire('./confirmation', {
        '../../../common/lib/analytics': {
          sendJourneyTime: sinon.stub().throws(errorMock),
          '../../config': {
            ANALYTICS: {
              GA_ID: '11111',
            },
          },
        },
      })

      let req, res, nextSpy

      beforeEach(async function() {
        req = {}
        res = {
          render: sinon.spy(),
          locals: {
            move: mockMove,
          },
        }
        nextSpy = sinon.spy()

        await controller(req, res, nextSpy)
      })

      it('should call next with the error', function() {
        expect(nextSpy).to.be.calledWith(errorMock)
      })

      it('should call next once', function() {
        expect(nextSpy).to.be.calledOnce
      })
    })
  })
})
