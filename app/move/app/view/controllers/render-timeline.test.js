const controller = require('./render-timeline')

describe('Move view app', function () {
  describe('Controllers', function () {
    describe('#renderTimeline()', function () {
      let req, res

      beforeEach(function () {
        req = {}
        res = {
          render: sinon.stub(),
        }

        controller(req, res)
      })

      it('should pass correct locals', function () {
        expect(res.render.args[0][1]).to.deep.equal({})
      })

      it('should render a template', function () {
        expect(res.render.args[0][0]).to.equal('move/app/view/views/timeline')
      })
    })
  })
})
