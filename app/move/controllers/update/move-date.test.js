const moveService = require('../../../../common/services/move')
const CreateMoveDate = require('../create/move-date')

const UpdateBaseController = require('./base')
const MoveDateController = require('./move-date')

const MixinProto = CreateMoveDate.prototype

const controller = new MoveDateController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function() {
  describe('Update move details controller', function() {
    it('should extend UpdateBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function() {
      it('should copy middlewareSetup from CreateMoveDate', function() {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should copy setDateType from CreateMoveDate', function() {
        expect(controller.setDateType).to.exist.and.equal(
          MixinProto.setDateType
        )
      })

      it('should copy process from CreateMoveDate', function() {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should copy successHandler from CreateMoveDate', function() {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function() {
        const ownMethods = ['getUpdateValues', 'saveValues']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#getUpdateValues', function() {
      const today = '2019-10-02'
      const tomorrow = '2019-10-03'
      let req = {}
      const res = {
        locals: {
          TODAY: today,
          TOMORROW: tomorrow,
        },
      }
      beforeEach(function() {
        req = {
          form: {
            values: {
              date: '2019-10-04',
            },
          },
          getMove: sinon.stub(),
        }
      })

      context('When no move exists', function() {
        it('should return an empty object', function() {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a move type', function() {
        const move = { id: '#move', date: '2019-10-04' }
        beforeEach(function() {
          req.getMove.returns(move)
        })
        context('When not today or tomorrow', function() {
          it('should return just the move type', function() {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_custom: '4 Oct 2019',
              date_type: 'custom',
            })
          })
        })
        context('When a today', function() {
          beforeEach(function() {
            move.date = today
          })
          it('should return just the move type', function() {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_type: 'today',
            })
          })
        })
        context('When a tomorrow', function() {
          beforeEach(function() {
            move.date = tomorrow
          })
          it('should return just the move type', function() {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_type: 'tomorrow',
            })
          })
        })
      })
    })

    describe('#saveValues', function() {
      let req = {}
      const res = {}
      let nextSpy
      beforeEach(function() {
        nextSpy = sinon.spy()
        sinon.stub(moveService, 'update').resolves()
        req = {
          getMoveId: sinon.stub().returns('#moveId'),
          getMove: sinon.stub().returns({ date: '2019-10-03' }),
          form: {
            values: {
              date: '2019-10-02',
              date_type: 'custom',
              date_custom: '2019-10-02',
              another_prop: true,
            },
          },
        }
      })

      it('should call move API with correct values', async function() {
        await controller.saveValues(req, res, nextSpy)
        expect(moveService.update).to.be.calledOnceWithExactly({
          id: '#moveId',
          date: '2019-10-02',
          date_type: 'custom',
          date_custom: '2019-10-02',
        })
      })

      context('should not call move API if date unchanged', function() {
        beforeEach(function() {
          req.getMove = sinon.stub().returns({ date: '2019-10-02' })
        })
        it('should call move API with correct values', async function() {
          await controller.saveValues(req, res, nextSpy)
          expect(moveService.update).to.not.be.called
        })
      })

      it('should invoke the next method without error', async function() {
        await controller.saveValues(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      context('When the API throws an error', function() {
        const err = new Error()
        beforeEach(function() {
          moveService.update.throws(err)
        })

        it('should invoke the next method without error', async function() {
          try {
            await controller.saveValues(req, res, nextSpy)
          } catch (e) {}
          expect(nextSpy).to.be.calledOnceWithExactly(err)
        })
      })
    })
  })
})
