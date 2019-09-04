const controller = require('./confirmation')

const mockMove = {
  move_type: 'court_appearance',
  to_location: {
    title: 'Axminster Crown Court',
  },
}

describe('Move controllers', function() {
  describe('#confirmation()', function() {
    describe('with move_type "court_appearance"', function() {
      let req, res

      beforeEach(function() {
        req = {}
        res = {
          render: sinon.spy(),
          locals: {
            move: mockMove,
          },
        }

        controller(req, res)
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
      let req, res

      beforeEach(function() {
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

        controller(req, res)
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
  })
})
