const middleware = require('./locals.message-banner')

const mockEvents = {
  timeline_events: [
    {
      event_type: 'foo',
    },
    {
      event_type: 'bar',
    },
    {
      event_type: 'MoveReject',
      details: {
        rebook: true,
      },
    },
  ],
}

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsMessageBanner()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          move: {
            id: '_move_id_',
            status: 'requested',
            from_location: {
              location_type: 'police',
            },
          },
          services: {
            move: {
              getByIdWithEvents: sinon.stub(),
            },
          },
          t: sinon.stub().returnsArg(0),
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      context('without profile', function () {
        beforeEach(async function () {
          await middleware(req, res, nextSpy)
        })

        it('should not set message banner', function () {
          expect(res.locals).to.deep.equal({})
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with proposed moves', function () {
        beforeEach(async function () {
          req.move.status = 'proposed'
          await middleware(req, res, nextSpy)
        })

        it('should set hand over message banner', function () {
          expect(res.locals.messageBanner).to.deep.equal({
            title: {
              text: 'messages::pending_review.heading',
            },
            content: {
              html: 'messages::pending_review.content',
            },
            allowDismiss: false,
            classes: 'govuk-!-padding-right-3',
          })
        })

        describe('translations', function () {
          it('should translate title', function () {
            expect(req.t).to.be.calledWithExactly(
              'messages::pending_review.heading'
            )
          })

          it('should translate content', function () {
            expect(req.t).to.be.calledWithExactly(
              'messages::pending_review.content',
              {
                context: 'police',
              }
            )
          })
        })
      })

      context('with cancelled moves', function () {
        beforeEach(function () {
          req.move.status = 'cancelled'
        })

        context('with rejected single requests', function () {
          beforeEach(function () {
            req.move.cancellation_reason = 'rejected'
            req.move.cancellation_reason_comment = 'Some rejection comments'
            req.move.rejection_reason = 'rejection_reason'
          })

          context('when events call is successful', function () {
            beforeEach(async function () {
              req.services.move.getByIdWithEvents.resolves(mockEvents)

              await middleware(req, res, nextSpy)
            })

            it('should set hand over message banner', function () {
              expect(res.locals.messageBanner).to.deep.equal({
                title: {
                  text: `statuses::${req.move.status}`,
                },
                content: {
                  html: 'statuses::description',
                },
                allowDismiss: false,
                classes: 'govuk-!-padding-right-3',
              })
            })

            describe('translations', function () {
              it('should translate title', function () {
                expect(req.t).to.be.calledWithExactly(
                  `statuses::${req.move.status}`,
                  {
                    context: 'rejected',
                  }
                )
              })

              it('should translate content', function () {
                expect(req.t).to.be.calledWithExactly('statuses::description', {
                  context: 'rejection_reason',
                  comment: 'Some rejection comments',
                  cancellation_reason_comment: 'Some rejection comments',
                  rebook: true,
                })
              })
            })
          })

          context('when events call fails', function () {
            const mockError = new Error('Mock error')

            beforeEach(async function () {
              req.services.move.getByIdWithEvents.rejects(mockError)
              await middleware(req, res, nextSpy)
            })

            it('should not set hand over message banner', function () {
              expect(res.locals).to.deep.equal({})
            })

            it('should call next with error', function () {
              expect(nextSpy).to.be.calledOnceWithExactly(mockError)
            })
          })
        })

        context('with all other cancelled moves', function () {
          beforeEach(async function () {
            req.move.cancellation_reason = 'made_in_error'
            req.move.cancellation_reason_comment = 'Some cancellation comments'
            await middleware(req, res, nextSpy)
          })

          it('should set hand over message banner', function () {
            expect(res.locals.messageBanner).to.deep.equal({
              title: {
                text: `statuses::${req.move.status}`,
              },
              content: {
                html: 'statuses::description',
              },
              allowDismiss: false,
              classes: 'govuk-!-padding-right-3',
            })
          })

          describe('translations', function () {
            it('should translate title', function () {
              expect(req.t).to.be.calledWithExactly(
                `statuses::${req.move.status}`,
                {
                  context: 'made_in_error',
                }
              )
            })

            it('should translate content', function () {
              expect(req.t).to.be.calledWithExactly('statuses::description', {
                context: 'made_in_error',
                comment: 'Some cancellation comments',
                cancellation_reason_comment: 'Some cancellation comments',
                rebook: undefined,
              })
            })
          })
        })
      })

      context('with profile', function () {
        beforeEach(function () {
          req.move.profile = {
            id: '_profile_id_',
          }
        })

        context('with requested moves', function () {
          beforeEach(async function () {
            await middleware(req, res, nextSpy)
          })

          it('should not set message banner', function () {
            expect(res.locals).to.deep.equal({})
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with Person Escort Record', function () {
          beforeEach(function () {
            req.move.profile.person_escort_record = {
              id: '_per_',
            }
          })

          context('that has been handed over', function () {
            beforeEach(async function () {
              req.move.profile.person_escort_record.handover_occurred_at =
                '2020-10-10T14:00:00Z'
              await middleware(req, res, nextSpy)
            })

            it('should not set message banner', function () {
              expect(res.locals).to.deep.equal({})
            })
          })

          context('that has not been handed over', function () {
            beforeEach(async function () {
              await middleware(req, res, nextSpy)
            })

            it('should not set message banner', function () {
              expect(res.locals).to.deep.equal({})
            })
          })
        })
      })
    })
  })
})
