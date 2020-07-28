const User = require('./user')

describe('User class', function () {
  describe('when instantiated', function () {
    let user
    let roles
    let locations
    let fullname

    context('with fullname', function () {
      it('should set fullname', function () {
        fullname = 'Mr Benn'
        user = new User({ fullname })

        expect(user.fullname).to.equal(fullname)
      })
    })

    context('without fullname', function () {
      it('should not set fullname', function () {
        user = new User()

        expect(user.fullname).to.be.undefined
      })
    })

    context('with roles', function () {
      beforeEach(function () {
        sinon.stub(User.prototype, 'getPermissions').returnsArg(0)
        roles = ['ROLE_PECS_SUPPLIER']
      })

      it('should set permissions', function () {
        user = new User({ name: 'USERNAME', roles })
        expect(Array.isArray(user.permissions)).to.be.true
      })
    })

    context('without roles', function () {
      it('should set permissions to empty array', function () {
        user = new User()

        expect(user.permissions).to.deep.equal([])
      })
    })

    context("with a role that isn't expected", function () {
      it('should set permissions to an empty array for unknown roles', function () {
        user = new User({
          roles: ['ROLE_PECS_UNKNOWN'],
        })

        expect(user.permissions).to.deep.equal([])
      })
    })

    context('with locations', function () {
      beforeEach(function () {
        locations = ['PECS_TEST']
      })

      it('should set locations', function () {
        user = new User({ name: 'USERNAME', roles: [], locations })
        expect(user.locations).to.deep.equal(locations)
      })
    })

    context('without locations', function () {
      it('should set locations to empty array', function () {
        user = new User()

        expect(user.locations).to.deep.equal([])
      })
    })

    context('with username', function () {
      const username = 'user1'

      it('should set username', function () {
        user = new User({ name: 'USERNAME', username })
        expect(user.username).to.deep.equal(username)
      })
    })

    context('with userId', function () {
      const userId = 'uuid'

      it('should set userId', function () {
        user = new User({ name: 'USERNAME', userId })
        expect(user.userId).to.deep.equal(userId)
      })
    })
  })

  describe('#getPermissions()', function () {
    let user, permissions

    beforeEach(function () {
      user = new User()
    })

    context('when user has no roles', function () {
      beforeEach(function () {
        permissions = user.getPermissions()
      })

      it('should contain empty permissions', function () {
        expect(permissions).to.deep.equal([])
      })
    })

    context('when user has ROLE_PECS_POLICE', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_POLICE'])
      })

      it('should contain correct permission', function () {
        const policePermissions = [
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:prison_recall',
          'move:create:police_transfer',
          'move:create:video_remand',
          'move:cancel',
          'move:update',
        ]

        expect(permissions).to.deep.equal(policePermissions)
      })
    })

    context('when user has ROLE_PECS_HMYOI', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_HMYOI'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:cancel',
        ])
      })
    })

    context('when user has ROLE_PECS_STC', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_STC'])
      })

      it('should contain correct permission', function () {
        const stcPermissions = [
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:cancel',
          'move:update',
        ]

        expect(permissions).to.deep.equal(stcPermissions)
      })
    })

    context('when user has ROLE_PECS_SCH', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_SCH'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:cancel',
          'move:update',
        ])
      })
    })

    context('when user has ROLE_PECS_PRISON', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_PRISON'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:cancel',
        ])
      })
    })

    context('when user has ROLE_PECS_OCA', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_OCA'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'dashboard:view',
          'allocations:view',
          'allocation:person:assign',
          'moves:view:proposed',
          'moves:download',
          'move:cancel:proposed',
          'move:view',
          'move:create',
          'move:create:prison_transfer',
        ])
      })
    })

    context('when user has ROLE_PECS_PMU', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_PMU'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'allocations:view',
          'allocation:create',
          'allocation:cancel',
          'dashboard:view',
          'locations:all',
          'moves:view:proposed',
          'move:review',
          'move:view',
        ])
      })
    })

    context('when user has ROLE_PECS_SUPPLIER role', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_SUPPLIER'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'locations:all',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
        ])
      })
    })

    context('when user has ROLE_PECS_COURT role', function () {
      beforeEach(function () {
        permissions = user.getPermissions(['ROLE_PECS_COURT'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.deep.equal([
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
        ])
      })
    })

    context('when user has all roles', function () {
      beforeEach(function () {
        permissions = user.getPermissions([
          'ROLE_PECS_POLICE',
          'ROLE_PECS_PRISON',
          'ROLE_PECS_SUPPLIER',
          'ROLE_PECS_STC',
          'ROLE_PECS_SCH',
          'ROLE_PECS_OCA',
          'ROLE_PECS_PMU',
          'ROLE_PECS_HMYOI',
          'ROLE_PECS_COURT',
        ])
      })

      it('should contain correct permission', function () {
        const allPermissions = [
          'allocations:view',
          'allocation:create',
          'allocation:person:assign',
          'allocation:cancel',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:review',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:prison_recall',
          'move:create:police_transfer',
          'move:create:video_remand',
          'move:cancel',
          'move:update',
          'locations:all',
          'dashboard:view',
          'move:cancel:proposed',
          'moves:view:proposed',
          'move:create:prison_transfer',
        ]

        expect(permissions.sort()).to.deep.equal(allPermissions.sort())
      })
    })
  })
})
