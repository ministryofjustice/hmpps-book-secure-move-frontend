const User = require('./user')

describe('User class', function() {
  describe('when instantiated', function() {
    let user
    let roles
    let locations
    let fullname

    context('with fullname', function() {
      it('should set fullname', function() {
        fullname = 'Mr Benn'
        user = new User({ fullname })

        expect(user.fullname).to.equal(fullname)
      })
    })

    context('without fullname', function() {
      it('should not set fullname', function() {
        user = new User()

        expect(user.fullname).to.be.undefined
      })
    })

    context('with roles', function() {
      beforeEach(function() {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
        roles = ['ROLE_PECS_SUPPLIER']
      })

      it('should set permissions', function() {
        user = new User({ name: 'USERNAME', roles })
        expect(Array.isArray(user.permissions)).to.be.true
      })
    })

    context('with police role', function() {
      beforeEach(function() {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
        roles = ['ROLE_PECS_POLICE']
      })

      it('should set police role', function() {
        user = new User({ name: 'USERNAME', roles })
        expect(user.role).to.equal('Police')
      })
    })

    context('with prison role', function() {
      beforeEach(function() {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
        roles = ['ROLE_PECS_PRISON']
      })

      it('should set prison role', function() {
        user = new User({ name: 'USERNAME', roles })
        expect(user.role).to.equal('Prison')
      })
    })

    context('without roles', function() {
      it('should set permissions to empty array', function() {
        user = new User()

        expect(user.permissions).to.deep.equal([])
      })
    })

    context('with locations', function() {
      beforeEach(function() {
        locations = ['PECS_TEST']
      })

      it('should set locations', function() {
        user = new User({ name: 'USERNAME', roles: [], locations })
        expect(user.locations).to.deep.equal(locations)
      })
    })

    context('without locations', function() {
      it('should set locations to empty array', function() {
        user = new User()

        expect(user.locations).to.deep.equal([])
      })
    })
  })

  describe('#getPermissions()', function() {
    let user, permissions

    beforeEach(function() {
      user = new User()
    })

    context('when user has no roles', function() {
      beforeEach(function() {
        permissions = user.getPermissions()
      })

      it('should contain empty permissions', function() {
        expect(permissions).to.deep.equal([])
      })
    })

    context('when user has ROLE_PECS_POLICE', function() {
      beforeEach(function() {
        permissions = user.getPermissions(['ROLE_PECS_POLICE'])
      })

      it('should contain correct permission', function() {
        expect(permissions).to.deep.equal([
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
          'move:create',
          'move:cancel',
          'move:delete',
        ])
      })
    })

    context('when user has ROLE_PECS_PRISON', function() {
      beforeEach(function() {
        permissions = user.getPermissions(['ROLE_PECS_PRISON'])
      })

      it('should contain correct permission', function() {
        expect(permissions).to.deep.equal([
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
        ])
      })
    })

    context('when user has ROLE_PECS_SUPPLIER role', function() {
      beforeEach(function() {
        permissions = user.getPermissions(['ROLE_PECS_SUPPLIER'])
      })

      it('should contain correct permission', function() {
        expect(permissions).to.deep.equal([
          'moves:view:all',
          'moves:download:all',
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
        ])
      })
    })

    context('when user has all roles', function() {
      beforeEach(function() {
        permissions = user.getPermissions([
          'ROLE_PECS_POLICE',
          'ROLE_PECS_PRISON',
          'ROLE_PECS_SUPPLIER',
        ])
      })

      it('should contain correct permission', function() {
        expect(permissions).to.deep.equal([
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
          'move:create',
          'move:cancel',
          'move:delete',
          'moves:view:all',
          'moves:download:all',
        ])
      })
    })
  })
})
