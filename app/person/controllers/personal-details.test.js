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

      beforeEach(function () {
        sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
        req = {
          person: mockPerson,
          t: sinon.stub().returnsArg(0),
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }

        personalDetails(req, res)
      })

      it('should set breadcrumb', function () {
        expect(req.t).to.be.called
        expect(res.breadcrumb).to.be.calledOnceWithExactly({
          text: 'person::personal_details.heading',
        })
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
            'fullname',
            'identityBar',
            'personalDetailsSummary',
          ])
        })

        it('should set fullname', function () {
          expect(locals.fullname).to.equal('DOE, JOHN')
        })

        it('should set identityBar', function () {
          expect(locals.identityBar).to.deep.equal({
            classes: 'sticky',
            caption: {
              text: 'person::page_caption',
            },
            heading: {
              html: 'person::page_heading',
            },
          })

          expect(req.t).to.have.been.calledWithExactly('person::page_caption')
          expect(req.t).to.have.been.calledWithExactly('person::page_heading', {
            name: 'DOE, JOHN',
          })
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
