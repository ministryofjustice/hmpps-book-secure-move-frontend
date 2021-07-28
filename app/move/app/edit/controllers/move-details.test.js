const CreateMoveDetails = require('../../new/controllers/move-details')

const UpdateBaseController = require('./base')
const MoveDetailsController = require('./move-details')

const MixinProto = CreateMoveDetails.prototype

const controller = new MoveDetailsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update move details controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy configure from CreateMoveDetails', function () {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy setMoveTypes from CreateMoveDetails', function () {
        expect(controller.setMoveTypes).to.exist.and.equal(
          MixinProto.setMoveTypes
        )
      })

      it('should copy successHandler from CreateMoveDetails', function () {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = [
          'middlewareSetup',
          'getUpdateValues',
          'filterMoveTypes',
          'process',
          'saveValues',
        ]
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#middlewareSetup', function () {
      beforeEach(function () {
        sinon.stub(MixinProto, 'middlewareSetup')
        sinon.stub(controller, 'use')
        controller.middlewareSetup()
      })

      context('When middlewareSetup is called', function () {
        it('should invoke the mixin controller’s middlewareSetup with the correct context', function () {
          expect(MixinProto.middlewareSetup).to.be.calledOnceWithExactly()
          expect(MixinProto.middlewareSetup.getCall(0).thisValue).to.equal(
            controller
          )
        })

        it('should use the filterMoveTypes middleware', function () {
          expect(controller.use).to.be.calledOnceWithExactly(
            controller.filterMoveTypes
          )
        })
      })
    })

    describe('#getUpdateValues', function () {
      let req = {}
      const res = {}
      beforeEach(function () {
        req = {
          getMove: sinon.stub(),
        }
      })

      context('When no move exists', function () {
        it('should return an empty object', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a location id', function () {
        const move = { move_type: '#move_type' }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return just the move type', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
          })
        })
      })

      context('When a move exists with a location id', function () {
        const move = {
          move_type: '#move_type',
          to_location: {
            id: '#to_location_id',
          },
        }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return the move type and to_location', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
            'to_location_#move_type': '#to_location_id',
          })
        })
      })

      context('When a move exists with additonal information', function () {
        const move = {
          move_type: '#move_type',
          additional_information: '#additionalInfo',
        }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return the move type and the comments for that move type', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
            additional_information: '#additionalInfo',
            '#move_type_comments': '#additionalInfo',
          })
        })
      })
    })

    describe('#filterMoveTypes', function () {
      let req = {}
      const res = {}
      let nextSpy
      beforeEach(function () {
        req = {
          getMove: sinon.stub().returns({ move_type: '#moveType' }),
          form: {
            options: {
              fields: {
                move_type: {
                  items: [
                    {
                      value: 'foo',
                    },
                    {
                      value: 'bar',
                    },
                    {
                      value: '#moveType',
                    },
                  ],
                },
                to_location_foo: {},
                to_location_bar: {},
                'to_location_#moveType': {},
                '#moveType_comments': {},
                foo_comments: {},
                bar_comments: {},
                baz: {},
              },
            },
          },
        }
        nextSpy = sinon.spy()
        controller.filterMoveTypes(req, res, nextSpy)
      })

      context('When filterMoveTypes is called', function () {
        it('should remove the irrelevant options from move type', function () {
          expect(req.form.options.fields.move_type.items).to.deep.equal([
            {
              value: '#moveType',
            },
          ])
        })

        it('should remove the irrelevant fields', function () {
          expect(req.form.options.fields).to.have.all.keys([
            'move_type',
            'to_location_#moveType',
            '#moveType_comments',
            'baz',
          ])
        })

        it('should call the next method', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#process()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
        }
      })

      context('with only `to_location`', function () {
        beforeEach(function () {
          req.form.values = {
            move_type: 'court_appearance',
            to_location: '',
            to_location_court_appearance: '12345',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('12345')
        })

        it('should not set additional_information', function () {
          expect(req.form.values.additional_information).to.be.undefined
        })
      })

      context('with only `additional_information`', function () {
        const mockComments = 'Some prison recall specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_recall',
            prison_recall_comments: mockComments,
            to_location: '',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should not set to_location', function () {
          expect(req.form.values.to_location).to.be.undefined
        })

        it('should set additional_information', function () {
          expect(req.form.values.additional_information).to.equal(mockComments)
        })
      })

      context('with `to_location` and `additional_information`', function () {
        const mockComments = 'Some prison recall specific information'

        beforeEach(function () {
          req.form.values = {
            move_type: 'prison_recall',
            prison_recall_comments: mockComments,
            to_location_prison_recall: '12345',
            to_location: '',
          }

          controller.process(req, {}, nextSpy)
        })

        it('should set to_location based on location type', function () {
          expect(req.form.values.to_location).to.equal('12345')
        })

        it('should set additional_information', function () {
          expect(req.form.values.additional_information).to.equal(mockComments)
        })
      })

      it('should call the next method', function () {
        controller.process(req, {}, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#saveValues', function () {
      let req = {}
      const res = {}
      let nextSpy, moveService

      beforeEach(function () {
        moveService = {
          redirect: sinon.stub(),
          update: sinon.stub(),
        }
        req = {
          session: {
            user: {
              fullname: 'Bob Bobbins',
              username: '#username',
              userId: '#userId',
            },
          },
          getMoveId: () => '#moveId',
          getMove: sinon.stub().returns({
            move_type: 'faraway',
          }),
          form: {
            values: {},
          },
          t: sinon.stub().returnsArg(0),
          services: {
            move: moveService,
          },
        }
        nextSpy = sinon.spy()
      })

      it('should call the next method', async function () {
        await controller.saveValues(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      context('without values', function () {
        beforeEach(async function () {
          await controller.saveValues(req, res, nextSpy)
        })

        it('should not call move service’s redirect method', function () {
          expect(moveService.redirect).to.not.be.called
        })

        it('should not call move service’s update method', function () {
          expect(moveService.update).to.not.be.called
        })
      })

      context('with to location value', function () {
        beforeEach(function () {
          req.form.values.to_location = '#toLocation'
        })

        context('if the information has not changed', function () {
          beforeEach(async function () {
            req.getMove.returns({
              move_type: 'move-type',
              to_location: {
                id: '#toLocation',
              },
            })
            await controller.saveValues(req, res, nextSpy)
          })

          it('should not call move service’s redirect method', function () {
            expect(moveService.redirect).to.not.be.called
          })

          it('should not call move service’s update method', function () {
            expect(moveService.update).to.not.be.called
          })
        })

        context('if the information has changed', function () {
          context('with existing information', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'move-type',
                to_location: {
                  id: '#oldId',
                },
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should call set the notes property', function () {
              expect(req.t).to.be.calledOnceWithExactly(
                'moves::redirect_notes',
                req.session.user
              )
            })

            it('should call move service’s redirect method', function () {
              expect(moveService.redirect).to.be.calledOnceWithExactly({
                id: '#moveId',
                notes: 'moves::redirect_notes',
                to_location: {
                  id: '#toLocation',
                },
              })
            })

            it('should not call move service’s update method', function () {
              expect(moveService.update).to.not.be.called
            })
          })

          context('without existing information', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'move-type',
                to_location: null,
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should call set the notes property', function () {
              expect(req.t).to.be.calledOnceWithExactly(
                'moves::redirect_notes',
                req.session.user
              )
            })

            it('should call move service’s redirect method', function () {
              expect(moveService.redirect).to.be.calledOnceWithExactly({
                id: '#moveId',
                notes: 'moves::redirect_notes',
                to_location: {
                  id: '#toLocation',
                },
              })
            })

            it('should not call move service’s update method', function () {
              expect(moveService.update).to.not.be.called
            })
          })
        })
      })

      context('with additional information value', function () {
        beforeEach(function () {
          req.form.values.additional_information = '#additionalInformation'
        })

        context('if the information has not changed', function () {
          beforeEach(async function () {
            req.getMove.returns({
              move_type: 'move-type',
              additional_information: '#additionalInformation',
            })
            await controller.saveValues(req, res, nextSpy)
          })

          it('should not call move service’s redirect method', function () {
            expect(moveService.redirect).to.not.be.called
          })

          it('should not call move service’s update method', function () {
            expect(moveService.update).to.not.be.called
          })
        })

        context('if the information has changed', function () {
          context('with existing information', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'move-type',
                additional_information: 'Existing information',
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should not call move service’s redirect method', function () {
              expect(moveService.redirect).to.not.be.called
            })

            it('should call move service’s update method', function () {
              expect(moveService.update).to.be.calledOnceWithExactly({
                id: '#moveId',
                additional_information: '#additionalInformation',
              })
            })
          })

          context('without existing information', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'move-type',
                additional_information: null,
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should not call move service’s redirect method', function () {
              expect(moveService.redirect).to.not.be.called
            })

            it('should call move service’s update method', function () {
              expect(moveService.update).to.be.calledOnceWithExactly({
                id: '#moveId',
                additional_information: '#additionalInformation',
              })
            })
          })
        })
      })

      context(
        'with both additional information and to location value',
        function () {
          beforeEach(function () {
            req.form.values.to_location = '#toLocation'
            req.form.values.additional_information = '#additionalInformation'
          })

          context('if the information has changed', function () {
            context('with existing information', function () {
              beforeEach(async function () {
                req.getMove.returns({
                  move_type: 'move-type',
                  to_location: {
                    id: '#oldId',
                  },
                  additional_information: 'Existing information',
                })
                await controller.saveValues(req, res, nextSpy)
              })

              it('should call set the notes property', function () {
                expect(req.t).to.be.calledOnceWithExactly(
                  'moves::redirect_notes',
                  req.session.user
                )
              })

              it('should call move service’s redirect method', function () {
                expect(moveService.redirect).to.be.calledOnceWithExactly({
                  id: '#moveId',
                  notes: 'moves::redirect_notes',
                  to_location: {
                    id: '#toLocation',
                  },
                })
              })

              it('should call move service’s update method', function () {
                expect(moveService.update).to.be.calledOnceWithExactly({
                  id: '#moveId',
                  additional_information: '#additionalInformation',
                })
              })
            })
          })
        }
      )

      context('when async calls fail', function () {
        const mockError = new Error('Failure')

        beforeEach(async function () {
          req.form.values.additional_information = '#additionalInformation'
          moveService.update.rejects(mockError)

          await controller.saveValues(req, res, nextSpy)
        })

        it('should call with error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
