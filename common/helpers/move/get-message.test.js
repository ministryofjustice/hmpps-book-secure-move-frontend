const proxyquire = require('proxyquire')

const t = sinon.stub().returnsArg(0)

const getMessage = proxyquire('./get-message', {
  '../../../config/i18n': {
    default: {
      t,
    },
  },
})

describe('Move helpers', function () {
  const mockMove = {
    id: 'moveId',
  }

  describe('#getMessage', function () {
    let message
    let move
    beforeEach(function () {
      t.resetHistory()
      move = {
        ...mockMove,
        status: 'cancelled',
      }
    })

    context('when move is rejected', function () {
      beforeEach(function () {
        move = {
          ...mockMove,
          status: 'rejected',
          rebook: false,
          rejection_reason: 'no_spaces',
          cancellation_reason_comment: 'Reason for cancelling comments',
        }
        message = getMessage(move)
      })

      it('should set the message title', function () {
        expect(message.messageTitle).to.be.undefined
      })

      it('should get the message content', function () {
        expect(t).to.be.calledOnceWithExactly('statuses::description', {
          context: 'no_spaces',
          comment: 'Reason for cancelling comments',
          cancellation_reason_comment: 'Reason for cancelling comments',
          rebook: false,
        })
      })
      it('should set the message content', function () {
        expect(message.messageContent).to.equal('statuses::description')
      })
    })

    context('when move is not cancelled', function () {
      beforeEach(function () {
        move = {
          ...mockMove,
          status: 'requested',
        }
        message = getMessage(move)
      })

      it('should set the message title', function () {
        expect(message.messageTitle).to.be.undefined
      })

      it('should get the message content', function () {
        expect(t).to.be.calledOnceWithExactly('statuses::description', {
          context: undefined,
          comment: undefined,
          rebook: undefined,
          cancellation_reason_comment: undefined,
        })
      })
      it('should set the message content', function () {
        expect(message.messageContent).to.equal('statuses::description')
      })
    })

    context('when move is cancelled', function () {
      beforeEach(function () {
        move = {
          ...mockMove,
          status: 'cancelled',
          cancellation_reason: 'made_in_error',
          cancellation_reason_comment: 'Reason for cancelling comments',
          rebook: true,
        }
        message = getMessage(move)
      })

      it('should call get the message title', function () {
        expect(t.firstCall).to.be.calledWithExactly('statuses::cancelled', {
          context: 'made_in_error',
        })
      })
      it('should set the message title', function () {
        expect(message.messageTitle).to.equal('statuses::cancelled')
      })

      it('should call correct translation', function () {
        expect(t.secondCall).to.be.calledWithExactly('statuses::description', {
          context: 'made_in_error',
          comment: 'Reason for cancelling comments',
          rebook: true,
          cancellation_reason_comment: 'Reason for cancelling comments',
        })
      })
      it('should set the message content', function () {
        expect(message.messageContent).to.equal('statuses::description')
      })
    })
  })
})
