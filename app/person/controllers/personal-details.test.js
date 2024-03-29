const presenters = require('../../../common/presenters')

const personalDetails = require('./personal-details')

const mockPersonId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'

const mockPerson = {
  _fullname: 'DOE, JOHN',
  id: mockPersonId,
}

describe('Person app', function () {
  describe('Controllers', function () {
    describe('#personalDetails()', function () {
      let req, res

      beforeEach(async function () {
        sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
        req = {
          person: mockPerson,
          t: sinon.stub().returnsArg(0),
          query: { move: 'move id' },
          services: {
            move: {
              getById: sinon.stub(),
            },
          },
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }

        await personalDetails(req, res)
      })

      it('should render correct template', function () {
        expect(res.render.args[0][0]).to.equal('person/views/personal-details')
      })

      describe('locals', function () {
        let locals

        beforeEach(function () {
          locals = res.render.args[0][1]
        })

        it('should pass correct keys', function () {
          expect(locals).to.have.all.keys([
            'personalDetailsSummary',
            'moveId',
            'updateLink',
          ])
          expect(locals.moveId).to.equal('move id')
        })

        it('should set personal details summary', function () {
          expect(locals.personalDetailsSummary).to.deep.equal(mockPerson)
          expect(
            presenters.personToSummaryListComponent
          ).to.have.been.calledOnceWithExactly(mockPerson)
        })
      })
    })
  })
})
