const Controller = require('./final')

const controller = new Controller({ route: '/' })

const mockPerson = {
  id: '3333',
  fullname: 'Full name',
}
const mockMove = {
  id: '4444',
  date: '2019-10-10',
  to_location: {
    title: 'To location',
  },
  person: mockPerson,
}

describe('Move controllers', function() {
  describe('Final', function() {
    describe('#successHandler()', function() {
      let req, res

      beforeEach(function() {
        req = {
          sessionModel: {
            get: sinon.stub(),
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('by default', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('move').returns(mockMove)
          controller.successHandler(req, res)
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
            `/move/${mockMove.id}/confirmation`
          )
        })
      })
    })
  })
})
