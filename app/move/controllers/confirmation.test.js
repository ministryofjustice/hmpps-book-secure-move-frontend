const controller = require('./confirmation')

const mockMove = {
  move_type: 'court_appearance',
  to_location: {
    title: 'Axminster Crown Court',
  },
}

describe('Move controllers', function () {
  describe('#confirmation()', function () {
    let req, res

    beforeEach(function () {
      req = {
        t: sinon.stub().returnsArg(0),
        move: mockMove,
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        controller(req, res)
      })

      it('should render confirmation template', function () {
        const template = res.render.args[0][0]

        expect(res.render.calledOnce).to.be.true
        expect(template).to.equal('move/views/confirmation')
      })

      it('should pass move to template locals', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('move')
        expect(params.move).to.deep.equal(mockMove)
      })

      it('should use to location title as location', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('location')
        expect(params.location).to.equal(mockMove.to_location.title)
      })

      it('should use supplier fallback as supplier name', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('supplierNames')
        expect(params.supplierNames).to.deep.equal(['supplier_fallback'])
      })

      it('should translate supplier fallback key', function () {
        expect(req.t).to.have.been.calledOnceWithExactly('supplier_fallback')
      })

      it('should use empty array for saved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('savedHearings')
        expect(params.savedHearings).to.deep.equal([])
      })

      it('should use empty array for unsaved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('unsavedHearings')
        expect(params.unsavedHearings).to.deep.equal([])
      })

      it('should have undefined unassignedMoveId', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('unassignedMoveId')
        expect(params.unassignedMoveId).to.be.undefined
      })

      it('should contain correct number of locals', function () {
        const locals = res.render.args[0][1]
        expect(Object.keys(locals)).to.have.length(6)
      })
    })

    describe('with move_type "prison_recall"', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          move_type: 'prison_recall',
        }

        controller(req, res)
      })

      it('should use translation key as location', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('location')
        expect(params.location).to.equal(
          'fields::move_type.items.prison_recall.label'
        )
        expect(req.t.secondCall).to.have.been.calledWithExactly(
          'fields::move_type.items.prison_recall.label'
        )
      })
    })

    describe('with empty supplier', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          from_location: {
            suppliers: [],
          },
        }

        controller(req, res)
      })

      it('should use supplier fallback as supplier name', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('supplierNames')
        expect(params.supplierNames).to.deep.equal(['supplier_fallback'])
      })

      it('should translate supplier fallback key', function () {
        expect(req.t).to.have.been.calledOnceWithExactly('supplier_fallback')
      })
    })

    describe('with one supplier', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          from_location: {
            suppliers: [
              {
                name: 'Supplier one',
              },
            ],
          },
        }

        controller(req, res)
      })

      it('should only contain first supplier in supplier param', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('supplierNames')
        expect(params.supplierNames).to.deep.equal(['Supplier one'])
      })
    })

    describe('with multiple suppliers', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          from_location: {
            suppliers: [
              {
                name: 'Supplier one',
              },
              {
                name: 'Supplier two',
              },
            ],
          },
        }

        controller(req, res)
      })

      it('should contain all supplier names as supplier param', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('supplierNames')
        expect(params.supplierNames).to.deep.equal([
          'Supplier one',
          'Supplier two',
        ])
      })
    })

    describe('with hearings', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          court_hearings: [
            {
              case_number: 'S72525',
              saved_to_nomis: true,
            },
            {
              case_number: 'T43406',
              saved_to_nomis: false,
            },
            {
              case_number: 'S67301',
              saved_to_nomis: false,
            },
            {
              case_number: 'T15222',
              saved_to_nomis: true,
            },
            {
              case_number: 'T45483',
              saved_to_nomis: false,
            },
            {
              case_number: 'T30532',
              saved_to_nomis: false,
            },
          ],
        }

        controller(req, res)
      })

      it('should contain correct number of saved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('savedHearings')
        expect(params.savedHearings.length).to.equal(2)
      })

      it('should contain correct case numbers in saved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('savedHearings')
        expect(params.savedHearings).to.deep.equal(['S72525', 'T15222'])
      })

      it('should contain correct number of unsaved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('unsavedHearings')
        expect(params.unsavedHearings.length).to.equal(4)
      })

      it('should contain correct case numbers in unsaved hearings', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('unsavedHearings')
        expect(params.unsavedHearings).to.deep.equal([
          'T43406',
          'S67301',
          'T45483',
          'T30532',
        ])
      })
    })

    describe('with allocation', function () {
      beforeEach(function () {
        req.allocation = {
          moves: [
            {
              id: '1',
              profile: {},
            },
            {
              id: '2',
              profile: {},
            },
            {
              id: '__unassigned__',
            },
            {
              id: '4',
              profile: {},
            },
          ],
        }

        controller(req, res)
      })

      it('should set unassignedMoveId to next move without a person', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('unassignedMoveId')
        expect(params.unassignedMoveId).to.equal('__unassigned__')
      })
    })
  })
})
