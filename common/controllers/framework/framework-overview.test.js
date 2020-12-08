const presenters = require('../../../common/presenters')

const controller = require('./framework-overview')

const mockFramework = {
  status: 'complete',
  sections: {
    'section-one': {},
    'section-two': {},
  },
}

describe('Framework controllers', function () {
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
          expect(Object.keys(params)).to.have.length(4)
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

        it('should not set i18nContext', function () {
          expect(params).to.have.property('i18nContext')
          expect(params.i18nContext).to.equal('')
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

    context('with assessment', function () {
      beforeEach(function () {
        controller(
          {
            ...mockReq,
            assessment: {
              _framework: mockFramework,
              framework: {
                name: 'person-escort-record',
              },
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
                  _fullname: 'John Doe',
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

        it('should set i18nContext', function () {
          expect(params).to.have.property('i18nContext')
          expect(params.i18nContext).to.equal('person_escort_record')
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
                  _fullname: 'James Stevens',
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
