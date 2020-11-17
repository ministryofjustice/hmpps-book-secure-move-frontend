const proxyquire = require('proxyquire').noCallThru()

const getViewLocals = sinon.stub()

const controller = proxyquire('./view', {
  './view/view.locals': getViewLocals,
})

describe('Move controllers', function () {
  describe('#view()', function () {
    let req, res, params

    beforeEach(function () {
      getViewLocals.resetHistory()
      getViewLocals.returns({
        locals: 'view.locals',
      })

      req = {
        foo: 'bar',
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      it('should pass correct number of locals to template', function () {
        expect(params).to.deep.equal({
          locals: 'view.locals',
        })
      })

      it('should call moveToMetaListComponent presenter with correct args', function () {
        expect(getViewLocals).to.be.calledOnceWithExactly(req)
      })
    })
  })
})
