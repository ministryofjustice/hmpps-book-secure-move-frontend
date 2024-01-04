const proxyquire = require('proxyquire')

const { rolesToPermissions } = require('../../common/lib/permissions')

const permissionsStub = {
  permissionsByRole: {
    foo: ['one', 'two'],
    bar: ['one'],
    fizz: ['two'],
    buzz: ['two', 'three', 'one', 'four'],
  },
  rolesToPermissions: roles =>
    rolesToPermissions(roles, permissionsStub.permissionsByRole),
}
const mockDataStub = {
  generateAssessmentRespones: sinon.stub().returns(['fizz', 'buzz']),
}

const controllers = proxyquire('./controllers', {
  '../../common/lib/permissions': permissionsStub,
  '../../mocks/assessment': mockDataStub,
})

describe('Development tools controllers', function () {
  let resMock, reqMock, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    mockDataStub.generateAssessmentRespones.resetHistory()
    resMock = {
      render: sinon.stub(),
      redirect: sinon.stub(),
    }
    reqMock = {
      params: {},
      session: {},
    }
  })

  describe('#renderPermissions()', function () {
    beforeEach(function () {
      reqMock.session.activeRoles = ['foo', 'bar']
      controllers.renderPermissions(reqMock, resMock)
    })

    it('should call template', function () {
      expect(resMock.render.args[0][0]).to.equal('tools/views/permissions')
    })

    it('should set locals', function () {
      expect(resMock.render.args[0][1]).to.deep.equal({
        activeRoles: reqMock.session.activeRoles,
        roles: permissionsStub.permissionsByRole,
      })
    })
  })

  describe('#updatePermissions()', function () {
    context('with roles', function () {
      beforeEach(function () {
        reqMock.body = {
          roles: ['foo', 'bar', 'fizz', 'buzz'],
        }
      })

      context('when user exists', function () {
        beforeEach(function () {
          reqMock.user = {
            permissions: ['ace', 'deuce'],
          }
          controllers.updatePermissions(reqMock, resMock)
        })

        it('should set active roles to session', function () {
          expect(reqMock.session.activeRoles).to.deep.equal([
            'foo',
            'bar',
            'fizz',
            'buzz',
          ])
        })

        it('should override user permissions', function () {
          expect(reqMock.session.user.permissions).to.deep.equal([
            'one',
            'two',
            'three',
            'four',
          ])
        })

        it('should redirect', function () {
          expect(resMock.redirect).to.have.been.calledOnceWithExactly('/')
        })
      })

      context('when user does not exists', function () {
        beforeEach(function () {
          controllers.updatePermissions(reqMock, resMock)
        })

        it('should set active roles to session', function () {
          expect(reqMock.session.activeRoles).to.deep.equal([
            'foo',
            'bar',
            'fizz',
            'buzz',
          ])
        })

        it('should set user permissions', function () {
          expect(reqMock.session.user.permissions).to.deep.equal([
            'one',
            'two',
            'three',
            'four',
          ])
        })

        it('should redirect', function () {
          expect(resMock.redirect).to.have.been.calledOnceWithExactly('/')
        })
      })
    })

    context('without roles', function () {
      beforeEach(function () {
        reqMock.body = {}
        controllers.updatePermissions(reqMock, resMock)
      })

      it('should set active roles to session', function () {
        expect(reqMock.session.activeRoles).to.deep.equal([])
      })

      it('should set user permissions', function () {
        expect(reqMock.session.user.permissions).to.deep.equal([])
      })

      it('should redirect', function () {
        expect(resMock.redirect).to.have.been.calledOnceWithExactly('/')
      })
    })
  })

  describe('#updateMoveStatus()', function () {
    let nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      reqMock.params.moveId = '12345'
      reqMock.services = {
        move: {
          accept: sinon.stub().resolves(),
          start: sinon.stub().resolves(),
          complete: sinon.stub().resolves(),
        },
      }
    })

    context('without permitted action', function () {
      beforeEach(async function () {
        reqMock.params.currentStatus = 'missing_action'
        await controllers.updateMoveStatus(reqMock, resMock, nextSpy)
      })

      it('should not call service', function () {
        expect(reqMock.services.move.accept).not.to.have.been.called
        expect(reqMock.services.move.start).not.to.have.been.called
        expect(reqMock.services.move.complete).not.to.have.been.called
      })

      it('should redirect to move', function () {
        expect(resMock.redirect).to.have.been.calledOnceWithExactly(
          '/move/12345'
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('with permitted action', function () {
      const testCases = [
        {
          status: 'requested',
          method: 'accept',
        },
        {
          status: 'booked',
          method: 'start',
        },
        {
          status: 'in_transit',
          method: 'complete',
          data: {
            notes: 'Fake notes',
          },
        },
      ]

      testCases.forEach(testCase => {
        describe(testCase.status, function () {
          beforeEach(async function () {
            reqMock.params.currentStatus = testCase.status
            await controllers.updateMoveStatus(reqMock, resMock, nextSpy)
          })

          it('should call correct service', function () {
            expect(reqMock.services.move[testCase.method]).to.have.been
              .calledOnce
            expect(reqMock.services.move[testCase.method].args[0][0]).to.equal(
              '12345'
            )

            if (testCase.data) {
              expect(
                reqMock.services.move[testCase.method].args[0][1]
              ).to.have.keys(Object.keys(testCase.data))
            }
          })

          it('should redirect to move', function () {
            expect(resMock.redirect).to.have.been.calledOnceWithExactly(
              '/move/12345'
            )
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.have.been.called
          })
        })
      })

      context('when action fails', function () {
        const mockError = new Error('Error')

        beforeEach(async function () {
          reqMock.params.currentStatus = 'requested'
          reqMock.services.move.accept.rejects(mockError)
          await controllers.updateMoveStatus(reqMock, resMock, nextSpy)
        })

        it('should redirect to move', function () {
          expect(resMock.redirect).not.to.have.been.called
        })

        it('should call next with error', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })

  describe('#completeAssessment()', function () {
    context('without valid service', function () {
      beforeEach(async function () {
        await controllers.completeAssessment(reqMock, resMock, nextSpy)
      })

      it('should not generate mock responses', function () {
        expect(mockDataStub.generateAssessmentRespones).not.to.be.called
      })

      it('should redirect to root', function () {
        expect(resMock.redirect).to.be.calledOnceWithExactly('/')
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    context('with valid service', function () {
      const mockAssessment = {
        id: '12345',
        move: {
          id: 'move12345',
        },
        response: ['foo', 'bar'],
      }

      beforeEach(function () {
        reqMock.params = {
          assessmentId: '12345',
          type: 'assessment-type',
        }
        reqMock.services = {
          assessmentType: {
            getById: sinon.stub().resolves(mockAssessment),
            respond: sinon.stub().resolves({}),
          },
        }
      })

      context('with assessment', function () {
        beforeEach(async function () {
          await controllers.completeAssessment(reqMock, resMock, nextSpy)
        })

        it('should get assessment', function () {
          expect(
            reqMock.services.assessmentType.getById
          ).to.be.calledOnceWithExactly(reqMock.params.assessmentId)
        })

        it('should generate mock responses', function () {
          expect(
            mockDataStub.generateAssessmentRespones
          ).to.be.calledOnceWithExactly(mockAssessment.responses)
        })

        it('should respond to questions', function () {
          expect(
            reqMock.services.assessmentType.respond
          ).to.be.calledOnceWithExactly(reqMock.params.assessmentId, [
            'fizz',
            'buzz',
          ])
        })

        it('should redirect to move', function () {
          expect(resMock.redirect).to.be.calledOnceWithExactly(
            `/move/${mockAssessment.move.id}`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('without assessment', function () {
        const mockError = new Error('Missing')
        mockError.statusCode = 404

        beforeEach(async function () {
          reqMock.services.assessmentType.getById.rejects(mockError)
          await controllers.completeAssessment(reqMock, resMock, nextSpy)
        })

        it('should not redirect', function () {
          expect(resMock.redirect).not.to.be.called
        })

        it('should call next with error', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
