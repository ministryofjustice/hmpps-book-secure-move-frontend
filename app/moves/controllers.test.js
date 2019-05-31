const presenters = require('../../common/presenters')

const controllers = require('./controllers')

const mockMove = {
  person: {
    first_names: 'STEVE',
    last_name: 'Smith',
  },
}

describe('Moves controllers', function () {
  describe('#get()', function () {
    let req, res

    beforeEach(function () {
      sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)

      req = {}
      res = {
        render: sinon.spy(),
        locals: {
          move: mockMove,
        },
      }

      controllers.get(req, res)
    })

    it('should render a template', function () {
      expect(res.render.calledOnce).to.be.true
    })

    it('should contain fullname param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('fullname')
      expect(params.fullname).to.equal('Smith, STEVE')
    })

    it('should contain personal details summary param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('personalDetailsSummary')
      expect(params.personalDetailsSummary).to.equal(mockMove.person)
    })
  })
})
