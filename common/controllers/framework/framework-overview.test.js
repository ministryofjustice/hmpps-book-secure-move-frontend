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
    let mockReq, mockRes

    beforeEach(function () {
      sinon
        .stub(presenters, 'frameworkToTaskListComponent')
        .returns('_taskListCmpt_')

      mockReq = {
        originalUrl: '/person-escort-record/1',
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
        expect(template).to.equal('framework-overview')
      })

      describe('params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should pass correct number of params to template', function () {
          expect(Object.keys(params)).to.have.length(3)
        })

        it('should set moveId', function () {
          expect(params).to.have.property('moveId')
          expect(params.moveId).to.be.undefined
        })

        it('should set taskList', function () {
          expect(params).to.have.property('taskList')
          expect(params.taskList).to.equal('_taskListCmpt_')
        })

        it('should not set fullname', function () {
          expect(params).to.have.property('fullname')
          expect(params.fullname).to.be.undefined
        })
      })

      it('should call task list presenter', function () {
        expect(
          presenters.frameworkToTaskListComponent
        ).to.have.been.calledOnceWithExactly({
          baseUrl: '/person-escort-record/1/',
          sectionProgress: undefined,
          frameworkSections: undefined,
        })
      })
    })

    context('with person escort record', function () {
      beforeEach(function () {
        controller(
          {
            ...mockReq,
            personEscortRecord: {
              _framework: mockFramework,
              meta: {
                section_progress: [
                  {
                    key: 'risk-information',
                    status: 'in_progress',
                  },
                  {
                    key: 'health-information',
                    status: 'completed',
                  },
                ],
              },
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

        it('should call task list presenter with progress', function () {
          expect(
            presenters.frameworkToTaskListComponent
          ).to.have.been.calledOnceWithExactly({
            baseUrl: '/person-escort-record/1/',
            frameworkSections: mockFramework.sections,
            sectionProgress: [
              {
                key: 'risk-information',
                status: 'in_progress',
              },
              {
                key: 'health-information',
                status: 'completed',
              },
            ],
          })
        })

        it('should set fullname', function () {
          expect(params).to.have.property('fullname')
          expect(params.fullname).to.equal('John Doe')
        })
      })
    })

    context('with move record', function () {
      beforeEach(function () {
        controller(
          {
            ...mockReq,
            move: {
              id: '12345',
              profile: {
                person: {
                  fullname: 'James Stevens',
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

        it('should set moveId', function () {
          expect(params).to.have.property('moveId')
          expect(params.moveId).to.equal('12345')
        })

        it('should set fullname', function () {
          expect(params).to.have.property('fullname')
          expect(params.fullname).to.equal('James Stevens')
        })
      })
    })
  })
})
