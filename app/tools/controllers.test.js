const proxyquire = require('proxyquire')

const permissionsStub = {
  permissionsByRole: {
    foo: ['one', 'two'],
    bar: ['one'],
    fizz: ['two'],
    buzz: ['two', 'three', 'one', 'four'],
  },
}

const controllers = proxyquire('./controllers', {
  '../../common/lib/permissions': permissionsStub,
})

describe('Development tools controllers', function () {
  let resMock, reqMock

  beforeEach(function () {
    resMock = {
      render: sinon.stub(),
      redirect: sinon.stub(),
    }
    reqMock = {
      session: {},
    }
  })

  describe('#renderPermissions()', function () {
    beforeEach(function () {
      reqMock.session.activeRoles = ['foo', 'bar']
      controllers.renderPermissions(reqMock, resMock)
    })

    it('should call template', function () {
      expect(resMock.render.args[0][0]).to.equal(
        '_development-tools/views/permissions'
      )
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
})
