const filters = require('../../../../config/nunjucks/filters')

const BaseController = require('./base')
const Controller = require('./move-date')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Move Date', function () {
    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setDateType')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should call setDateType middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setDateType
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#setDateType()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          t: sinon.stub().returns('__translated__'),
          form: {
            options: {
              fields: {
                date_type: {
                  items: [
                    {
                      text: 'fields::date_type.today',
                      value: 'today',
                    },
                    {
                      text: 'fields::date_type.tomorrow',
                      value: 'tomorrow',
                    },
                    {
                      text: 'fields::date_type.custom',
                      value: 'custom',
                    },
                  ],
                },
              },
            },
          },
        }
        res = {
          locals: {
            TODAY: 'today',
            TOMORROW: 'tomorrow',
          },
        }
        nextSpy = sinon.spy()
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)

        controller.setDateType(req, res, nextSpy)
      })

      it('should translate today', function () {
        expect(req.t.firstCall).to.be.calledWith('fields::date_type.today', {
          date: 'today',
        })
      })

      it('should translate tomorrow', function () {
        expect(req.t.secondCall).to.be.calledWith(
          'fields::date_type.tomorrow',
          {
            date: 'tomorrow',
          }
        )
      })

      it('should update today/tomorrow label', function () {
        expect(req.form.options.fields.date_type.items).to.deep.equal([
          { text: '__translated__', value: 'today' },
          { text: '__translated__', value: 'tomorrow' },
          { text: 'fields::date_type.custom', value: 'custom' },
        ])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
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

      context('when date type is custom', function () {
        beforeEach(function () {
          req.form.values = {
            date: '',
            date_type: 'custom',
            date_custom: '2019-10-17',
          }
        })

        context('with valid date', function () {
          beforeEach(function () {
            controller.process(req, {}, nextSpy)
          })

          it('should set the value of date field to the custom date', function () {
            expect(req.form.values.date).to.equal('2019-10-17')
          })

          it('should store the value of custom date', function () {
            expect(req.form.values.date_custom).to.equal('2019-10-17')
          })

          it('should set date type to custom', function () {
            expect(req.form.values.date_type).to.equal('custom')
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with invalid date', function () {
          beforeEach(function () {
            req.form.values.date_custom = 'foo'
            controller.process(req, {}, nextSpy)
          })

          it('should not set value for date field', function () {
            expect(req.form.values.date).to.be.undefined
          })

          it('should store the value of custom date', function () {
            expect(req.form.values.date_custom).to.equal('foo')
          })

          it('should set date type to custom', function () {
            expect(req.form.values.date_type).to.equal('custom')
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when date type is today', function () {
        // Specifically using a DST date to ensure correct date is returned
        const mockDate = '2017-08-10'

        beforeEach(function () {
          this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
          req.form.values = {
            date: '',
            date_type: 'today',
          }

          controller.process(req, {}, nextSpy)
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should set value of date to today', function () {
          expect(req.form.values.date).to.equal(mockDate)
        })

        it('should set date type to today', function () {
          expect(req.form.values.date_type).to.equal('today')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when date type is tomorrow', function () {
        // Specifically using a DST date to ensure correct date is returned
        const mockDate = '2017-08-10'

        beforeEach(function () {
          this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
          req.form.values = {
            date: '',
            date_type: 'tomorrow',
          }

          controller.process(req, {}, nextSpy)
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should set value of date to tomorrow', function () {
          expect(req.form.values.date).to.equal('2017-08-11')
        })

        it('should set date type to tomorrow', function () {
          expect(req.form.values.date_type).to.equal('tomorrow')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
