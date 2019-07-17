const personService = require('../../../common/services/person')
const presenters = require('../../../common/presenters')

const controller = require('./view')

const {
  data: mockMove,
} = require('../../../test/fixtures/api-client/move.get.deserialized.json')
const fullname = `${mockMove.person.last_name}, ${mockMove.person.first_names}`

describe('Move controllers', function () {
  describe('#view()', function () {
    let req, res

    beforeEach(function () {
      sinon.stub(personService, 'getFullname').returns(fullname)
      sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
      sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
      sinon.stub(presenters, 'assessmentToTagList').returnsArg(0)
      sinon.stub(presenters, 'assessmentByCategory').returnsArg(0)
      sinon.stub(presenters, 'assessmentToSummaryListComponent').returnsArg(0)

      req = {}
      res = {
        render: sinon.spy(),
        locals: {
          move: mockMove,
        },
      }

      controller(req, res)
    })

    it('should render a template', function () {
      expect(res.render.calledOnce).to.be.true
    })

    it('should contain fullname param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('fullname')
      expect(params.fullname).to.equal(fullname)
    })

    it('should call moveToMetaListComponent presenter with correct args', function () {
      expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
        mockMove
      )
    })

    it('should contain a move summary param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('moveSummary')
      expect(params.moveSummary).to.equal(mockMove)
    })

    it('should call personToSummaryListComponent presenter with correct args', function () {
      expect(
        presenters.personToSummaryListComponent
      ).to.be.calledOnceWithExactly(mockMove.person)
    })

    it('should contain personal details summary param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('personalDetailsSummary')
      expect(params.personalDetailsSummary).to.equal(mockMove.person)
    })

    it('should call assessmentToTagList presenter with correct args', function () {
      expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly(
        mockMove.person.assessment_answers
      )
    })

    it('should contain tag list param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('tagList')
      expect(params.tagList).to.equal(mockMove.person.assessment_answers)
    })

    it('should call assessmentByCategory presenter with correct args', function () {
      expect(presenters.assessmentByCategory).to.be.calledOnceWithExactly(
        mockMove.person.assessment_answers
      )
    })

    it('should contain assessment param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('assessment')
      expect(params.assessment).to.equal(mockMove.person.assessment_answers)
    })

    it('should call assessmentToSummaryListComponent presenter with correct args', function () {
      expect(
        presenters.assessmentToSummaryListComponent
      ).to.be.calledOnceWithExactly(mockMove.person.assessment_answers, 'court')
    })

    it('should contain court summary param', function () {
      const params = res.render.args[0][1]
      expect(params).to.have.property('courtSummary')
      expect(params.courtSummary).to.equal(mockMove.person.assessment_answers)
    })
  })
})
