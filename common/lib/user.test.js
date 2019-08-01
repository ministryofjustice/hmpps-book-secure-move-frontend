const User = require('./user')

describe('User class', function() {
  describe('when instantiated', function() {
    let user

    context('with username', function() {
      it('should set username', function() {
        user = new User({
          user_name: 'USERNAME',
        })

        expect(user.userName).to.equal('USERNAME')
      })
    })

    context('without username', function() {
      it('should not set username', function() {
        user = new User()

        expect(user.userName).to.equal(undefined)
      })
    })

    context('with authorities', function() {
      beforeEach(function() {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
      })

      it('should set permissions', function() {
        user = new User({
          authorities: ['ROLE_SUPPLIER'],
        })

        expect(user.permissions).to.deep.equal(['ROLE_SUPPLIER'])
      })
    })

    context('without authorities', function() {
      it('should not set permissions to empty array', function() {
        user = new User()

        expect(user.permissions).to.deep.equal([])
      })
    })

    context('with locations', function() {
      it('should set locations', function() {
        user = new User({
          locations: ['111', '222'],
        })

        expect(user.locations).to.deep.equal(['111', '222'])
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

    context('when user has no authorities', function() {
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
