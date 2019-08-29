const moveService = require('../../../common/services/move')

const controller = require('./cancel')

const mockMove = {
  to_location: {
    title: 'To location',
  },
  person: {
    fullname: 'Full name',
  },
}

describe('Move controllers', function() {
  describe('#cancel.post()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      req = {
        flash: sinon.stub(),
        t: sinon.stub().returnsArg(0),
      }
      res = {
        redirect: sinon.stub(),
        locals: {
          MOVES_URL: '/moves',
          move: mockMove,
        },
      }
      nextSpy = sinon.spy()
    })

    context('when move cancel is successful', function() {
      beforeEach(async function() {
        sinon.stub(moveService, 'cancel').resolves(mockMove)
        await controller.post(req, res, nextSpy)
      })

      it('should set a success message', function() {
        expect(req.flash).to.have.been.calledOnceWith('success', {
          title: 'messages::cancel_move.success.title',
          content: 'messages::cancel_move.success.content',
        })
      })

      it('should pass correct values to success content translation', function() {
        expect(req.t.secondCall).to.have.been.calledWithExactly(
          'messages::cancel_move.success.content',
          {
            name: mockMove.person.fullname,
            location: mockMove.to_location.title,
          }
        )
      })

      it('should call move service cancel with move id', function() {
        expect(moveService.cancel).to.be.calledOnceWithExactly(
          res.locals.move.id
        )
      })

      it('should redirect correctly', function() {
        expect(res.redirect).to.be.calledOnceWithExactly('/moves')
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when update fails', function() {
      const errorMock = new Error('Problem')

      beforeEach(async function() {
        sinon.stub(moveService, 'cancel').throws(errorMock)
        await controller.post(req, res, nextSpy)
      })

      it('should call next with the error', function() {
        expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
      })

      it('should not set flash message', function() {
        expect(req.flash).not.to.called
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.called
      })
    })
  })

  describe('#cancel.get()', function() {
    let res

    beforeEach(function() {
      res = {
        render: sinon.stub(),
      }
      controller.get({}, res)
    })

    it('should render a template', function() {
      expect(res.render.calledOnce).to.be.true
    })
  })
})
