const controller = require('./render-warnings')

describe('Move view app', function () {
  describe('Controllers', function () {
    describe('#renderWarnings()', function () {
      let req, res

      beforeEach(function () {
        req = {
          t: sinon.stub().returnsArg(0),
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }

        controller(req, res)
      })

      it('should pass correct locals', function () {
        expect(res.render.args[0][1]).to.deep.equal({})
      })

      it('should render a template', function () {
        expect(res.render.args[0][0]).to.equal('move/app/view/views/warnings')
      })
    })
  })
})
