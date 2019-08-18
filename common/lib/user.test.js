const User = require('./user')

describe('User class', function() {
  describe('when instantiated', function() {
    let user, userName, roles, locations

    context('with username', function() {
      it('should set username', function() {
        userName = 'USERNAME'
        user = new User({ name: userName })

        expect(user.userName).to.equal(userName)
      })
    })

    context('without username', function() {
      it('should not set username', function() {
        user = new User()

        expect(user.userName).to.equal(undefined)
      })
    })

    context('with roles', function() {
      beforeEach(function() {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
        roles = ['ROLE_PECS_SUPPLIER']
      })

      it('should set roles', function() {
        user = new User({ name: 'USERNAME', roles })
        expect(user.roles).to.deep.equal(roles)
      })

      it('should set permissions', function() {
        user = new User({ name: 'USERNAME', roles })
        expect(Array.isArray(user.permissions)).to.be.true
      })
    })

    context('without roles', function() {
      it('should set permissions to empty array', function() {
        user = new User()

        expect(user.permissions).to.deep.equal([])
      })

      it('should set roles to empty array', function() {
        user = new User()

        expect(user.roles).to.deep.equal([])
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
        ])
      })
    })

    context(
      'when user has both ROLE_PECS_POLICE and ROLE_PECS_SUPPLIER roles',
      function() {
        beforeEach(function() {
          permissions = user.getPermissions([
            'ROLE_PECS_POLICE',
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
            'moves:view:all',
            'moves:download:all',
          ])
        })
      }
    )
  })
})
