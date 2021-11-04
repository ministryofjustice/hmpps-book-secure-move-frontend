const controller = require('./moves')

describe('Person app', function () {
  describe('Controllers', function () {
    describe('#moves()', function () {
      let req, res

      beforeEach(function () {
        req = {
          person: { _fullname: 'DOE, JOHN' },
          resultsAsTable: {},
          t: sinon.stub().returnsArg(0),
          query: { move: 'move id' },
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }

        controller(req, res)
      })

      it('should render correct template', function () {
        expect(res.render.args[0][0]).to.equal('person/views/moves')
      })

      describe('locals', function () {
        let locals

        beforeEach(function () {
          locals = res.render.args[0][1]
        })

        it('should pass correct keys', function () {
          expect(locals).to.have.all.keys(['resultsAsTable', 'moveId'])
          expect(locals.moveId).to.equal('move id')
        })
      })
    })
  })
})
