const controllers = require('./controllers')

describe('Moves controllers', function () {
  describe('#get()', function () {
    it('should render a template', function () {
      const req = {}
      const res = {
        render: sinon.spy(),
        locals: {
          move: {
            person: {},
          },
        },
      }

      controllers.get(req, res)
      expect(res.render.calledOnce).to.be.true
    })
  })
})
