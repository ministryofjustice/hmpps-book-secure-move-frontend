const presenters = require('../../../common/presenters')

const controller = require('./framework-overview')

const mockFramework = {
  status: 'complete',
  sections: {
    'section-one': {},
    'section-two': {},
  },
}

describe('Person Escort Record controllers', function () {
  describe('#frameworkOverview()', function () {
    let mockReq, mockRes, frameworkToTaskListComponentStub

    beforeEach(function () {
      frameworkToTaskListComponentStub = sinon.stub().returnsArg(0)
      sinon
        .stub(presenters, 'frameworkToTaskListComponent')
        .returns(frameworkToTaskListComponentStub)

      mockReq = {
        originalUrl: '/person-escort-record/1',
        framework: mockFramework,
      }
      mockRes = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        controller(mockReq, mockRes)
      })

      it('should render template', function () {
        const template = mockRes.render.args[0][0]

        expect(mockRes.render.calledOnce).to.be.true
        expect(template).to.equal(
          'person-escort-record/views/framework-overview'
        )
      })

      describe('params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should pass correct number of params to template', function () {
          expect(Object.keys(params)).to.have.length(2)
        })

        it('should set taskList', function () {
          expect(params).to.have.property('taskList')
          expect(params.taskList).to.deep.equal(mockFramework)
        })

        it('should not set fullname', function () {
          expect(params).to.have.property('fullname')
          expect(params.fullname).to.be.undefined
        })
      })

      it('should call task list presenter', function () {
        expect(
          presenters.frameworkToTaskListComponent
        ).to.have.been.calledOnceWithExactly('/person-escort-record/1/')
        expect(
          frameworkToTaskListComponentStub
        ).to.have.been.calledOnceWithExactly(mockFramework)
      })
    })

    context('with profile', function () {
      beforeEach(function () {
        controller(
          {
            ...mockReq,
            personEscortRecord: {
              profile: {
                person: {
                  fullname: 'John Doe',
                },
              },
            },
          },
          mockRes
        )
      })

      describe('params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should set fullname', function () {
          expect(params).to.have.property('fullname')
          expect(params.fullname).to.equal('John Doe')
        })
      })
    })
  })
})
