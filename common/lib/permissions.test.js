const { rolesToPermissions } = require('./permissions')

describe('Permissions', function () {
  describe('#rolesToPermissions', function () {
    let permissions

    context('when there are no roles', function () {
      beforeEach(function () {
        permissions = rolesToPermissions([])
      })

      it('should contain empty permissions', function () {
        expect(permissions).to.have.members([])
      })
    })

    context('when user has ROLE_PECS_POLICE', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_POLICE'])
      })

      it('should contain correct permission', function () {
        const policePermissions = [
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:hospital',
          'move:create:prison_recall',
          'move:create:police_transfer',
          'move:create:video_remand',
          'move:cancel',
          'move:update',
          'move:update:court_appearance',
          'move:update:hospital',
          'move:update:prison_transfer',
          'move:update:secure_childrens_home',
          'move:update:secure_training_centre',
          'move:update:prison_recall',
          'move:update:police_transfer',
          'move:update:video_remand',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
        ]

        expect(permissions).to.have.members(policePermissions)
      })
    })

    context('when user has ROLE_PECS_HMYOI', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_HMYOI'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:hospital',
          'move:cancel',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:create',
          'youth_risk_assessment:update',
          'youth_risk_assessment:confirm',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_STC', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_STC'])
      })

      it('should contain correct permission', function () {
        const stcPermissions = [
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:view:proposed',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:hospital',
          'move:create:prison_transfer',
          'move:create:secure_childrens_home',
          'move:create:secure_training_centre',
          'move:update',
          'move:update:court_appearance',
          'move:update:hospital',
          'move:cancel',
          'move:cancel:proposed',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:create',
          'youth_risk_assessment:update',
          'youth_risk_assessment:confirm',
          'youth_risk_assessment:print',
        ]

        expect(permissions).to.have.members(stcPermissions)
      })
    })

    context('when user has ROLE_PECS_SCH', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_SCH'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:view:proposed',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:hospital',
          'move:create:prison_transfer',
          'move:create:secure_childrens_home',
          'move:create:secure_training_centre',
          'move:update',
          'move:update:court_appearance',
          'move:update:hospital',
          'move:cancel',
          'move:cancel:proposed',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:create',
          'youth_risk_assessment:update',
          'youth_risk_assessment:confirm',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_PRISON', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_PRISON'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'move:create',
          'move:create:court_appearance',
          'move:create:hospital',
          'move:cancel',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:create',
          'youth_risk_assessment:update',
          'youth_risk_assessment:confirm',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_OCA', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_OCA'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'allocations:view',
          'allocation:person:assign',
          'moves:view:proposed',
          'moves:download',
          'move:cancel:proposed',
          'move:view',
          'move:create',
          'move:create:prison_transfer',
          'move:create:secure_childrens_home',
          'move:create:secure_training_centre',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
        ])
      })
    })

    context('when user has ROLE_PECS_PMU', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_PMU'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'allocations:view',
          'allocation:create',
          'allocation:cancel',
          'dashboard:view',
          'dashboard:view:population',
          'locations:all',
          'moves:view:proposed',
          'move:review',
          'move:view',
          'person_escort_record:view',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_SUPPLIER role', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_SUPPLIER'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'locations:all',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'person_escort_record:view',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_COURT role', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_COURT'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:download',
          'move:view',
          'person_escort_record:view',
          'youth_risk_assessment:view',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_PER_AUTHOR role', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_PER_AUTHOR'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'dashboard:view',
          'moves:view:outgoing',
          'moves:view:incoming',
          'move:view',
        ])
      })
    })

    context('when user has ROLE_PECS_CDM role', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_CDM'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'allocations:view',
          'locations:contract_delivery_manager',
          'locations:all',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:view:proposed',
          'move:view',
          'move:view:journeys',
          'person_escort_record:view',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has ROLE_PECS_READ_ONLY role', function () {
      beforeEach(function () {
        permissions = rolesToPermissions(['ROLE_PECS_READ_ONLY'])
      })

      it('should contain correct permission', function () {
        expect(permissions).to.have.members([
          'dashboard:view',
          'allocations:view',
          'locations:contract_delivery_manager',
          'locations:all',
          'moves:view:outgoing',
          'moves:view:incoming',
          'moves:view:proposed',
          'move:view',
          'person_escort_record:view',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:print',
        ])
      })
    })

    context('when user has all roles', function () {
      beforeEach(function () {
        permissions = rolesToPermissions([
          'ROLE_PECS_POLICE',
          'ROLE_PECS_PRISON',
          'ROLE_PECS_SUPPLIER',
          'ROLE_PECS_STC',
          'ROLE_PECS_SCH',
          'ROLE_PECS_OCA',
          'ROLE_PECS_PMU',
          'ROLE_PECS_HMYOI',
          'ROLE_PECS_COURT',
          'ROLE_PECS_PER_AUTHOR',
          'ROLE_PECS_CDM',
          'ROLE_PECS_READ_ONLY',
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
          'move:create:hospital',
          'move:create:secure_childrens_home',
          'move:create:secure_training_centre',
          'move:create:video_remand',
          'move:cancel',
          'move:update',
          'move:update:court_appearance',
          'move:update:hospital',
          'move:update:prison_transfer',
          'move:update:secure_childrens_home',
          'move:update:secure_training_centre',
          'move:update:prison_recall',
          'move:update:police_transfer',
          'move:update:video_remand',
          'move:view:journeys',
          'locations:all',
          'locations:contract_delivery_manager',
          'dashboard:view',
          'dashboard:view:population',
          'move:cancel:proposed',
          'moves:view:proposed',
          'move:create:prison_transfer',
          'person_escort_record:view',
          'person_escort_record:create',
          'person_escort_record:update',
          'person_escort_record:confirm',
          'person_escort_record:print',
          'youth_risk_assessment:view',
          'youth_risk_assessment:create',
          'youth_risk_assessment:update',
          'youth_risk_assessment:confirm',
          'youth_risk_assessment:print',
        ]

        expect(permissions).to.have.members(allPermissions)
      })
    })
  })
})
