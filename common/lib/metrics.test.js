const proxyquire = require('proxyquire')

describe('Monitoring', function () {
  describe('Prometheus metrics', function () {
    let metrics
    let promster

    beforeEach(function () {
      promster = {
        createMiddleware: sinon.stub(),
        getContentType: sinon.stub(),
        getSummary: sinon.stub(),
      }
      metrics = proxyquire('./metrics', {
        '@promster/express': promster,
      })
    })

    // test that client noop methods exist and return nothing
    describe('#getClient', function () {
      let client
      let instrument

      beforeEach(function () {
        client = metrics.getClient()
      })

      context(
        'When the client is got before init method has been run',
        function () {
          describe('client.Counter', function () {
            beforeEach(function () {
              instrument = new client.Counter()
            })

            it('should have a working inc method', function () {
              expect(instrument.inc()).to.be.undefined
            })
          })

          describe('client.Gauge', function () {
            beforeEach(function () {
              instrument = new client.Gauge()
            })

            it('should have a working inc method', function () {
              expect(instrument.inc()).to.be.undefined
            })

            it('should have a working dec method', function () {
              expect(instrument.dec()).to.be.undefined
            })

            it('should have a working set method', function () {
              expect(instrument.set()).to.be.undefined
            })

            it('should have a working setToCurrentTime method', function () {
              expect(instrument.setToCurrentTime()).to.be.undefined
            })

            it('should have a working startTimer method', function () {
              expect(instrument.startTimer()()).to.be.undefined
            })
          })

          describe('client.Histogram', function () {
            beforeEach(function () {
              instrument = new client.Histogram()
            })

            it('should have a working observe method', function () {
              expect(instrument.observe()).to.be.undefined
            })

            it('should have a working startTimer method', function () {
              expect(instrument.startTimer()()).to.be.undefined
            })
          })

          describe('client.Summary', function () {
            beforeEach(function () {
              instrument = new client.Summary()
            })

            it('should have a working observe method', function () {
              expect(instrument.observe()).to.be.undefined
            })

            it('should have a working startTimer method', function () {
              expect(instrument.startTimer()()).to.be.undefined
            })
          })
        }
      )
    })

    describe('#init', function () {
      let config
      let app
      const prometheusClient = {
        register: {},
      }

      beforeEach(function () {
        config = {
          PROMETHEUS: {},
          SENTRY: {
            ENVIRONMENT: 'metrics-environment',
          },
          SERVER_HOST: 'metrics-host',
          API: {
            VERSION: 'metrics-api-version',
          },
          APP_GIT_SHA: 'metrics-sha',
          APP_VERSION: 'metrics-app-version',
          FEATURE_FLAGS: {
            FEATURE_1: 'true',
          },
        }

        app = {
          locals: {},
          use: sinon.stub(),
        }
        promster.createMiddleware.callsFake(({ app, options }) => {
          app.locals.Prometheus = prometheusClient
          return 'promsterMiddleware'
        })
        prometheusClient.register.setDefaultLabels = sinon.stub()
      })
      describe('When metrics are not enabled', function () {
        beforeEach(function () {
          // invoke the init method
          metrics.init(app, config)
        })
        it('should not create promster middleware', function () {
          expect(promster.createMiddleware).to.not.be.called
        })

        it('should not invoke the app’s use method', function () {
          expect(app.use).to.not.be.called
        })

        it('should not set the client', function () {
          expect(metrics.getClient()).to.not.equal(prometheusClient)
        })

        it('should not register the default labels on the client', function () {
          expect(prometheusClient.register.setDefaultLabels).to.not.be.called
        })
      })

      describe('When metrics are enabled', function () {
        let options

        beforeEach(function () {
          config.PROMETHEUS.MOUNTPATH = '/foo'

          options = {
            accuracies: ['ms', 's'],
            defaultLabels: {
              ENVIRONMENT: 'metrics-environment',
              SERVER_HOST: 'metrics-host',
              API_VERSION: 'metrics-api-version',
              APP_GIT_SHA: 'metrics-sha',
              APP_VERSION: 'metrics-app-version',
              FEATURE_FLAG_FEATURE_1: 'true',
            },
            normalizePath: metrics.normalizePath,
          }
          // invoke the init method
          metrics.init(app, config)
        })

        it('should create promster middleware', function () {
          expect(promster.createMiddleware).to.be.calledOnceWithExactly({
            app,
            options,
          })
        })

        it('should invoke the app’s use method the expected number of times', function () {
          expect(app.use).to.be.calledTwice
        })

        it('should use the promster middleware', function () {
          expect(app.use.firstCall).to.be.calledWithExactly(
            'promsterMiddleware'
          )
        })

        it('should set the client as the instantiated prometheus instance', function () {
          expect(metrics.getClient()).to.equal(prometheusClient)
        })

        it('should register the default labels on the client', function () {
          expect(
            prometheusClient.register.setDefaultLabels
          ).to.be.calledOnceWithExactly(options.defaultLabels)
        })

        it('should use the summary route middleware', function () {
          expect(app.use.secondCall).to.be.calledWithExactly(
            '/foo',
            metrics.summaryRoute
          )
        })
      })
    })

    describe('#summaryRoute', function () {
      let req
      let res
      let next

      beforeEach(function () {
        promster.getContentType.returns('metrics-content-type')
        promster.getSummary.resolves('metrics-summary')
        req = {
          get: sinon.stub(),
        }
        res = {
          setHeader: sinon.stub(),
          end: sinon.stub(),
        }
        next = sinon.stub()
      })

      describe('When accessing the metrics endpoint', function () {
        beforeEach(async function () {
          // invoke the summary route
          await metrics.summaryRoute(req, res, next)
        })

        it('should set the metrics content type', function () {
          expect(res.setHeader).to.be.calledOnceWithExactly(
            'Content-Type',
            'metrics-content-type'
          )
        })

        it('should send the metrics data', function () {
          expect(res.end).to.be.calledOnceWithExactly('metrics-summary')
        })
      })

      describe('When attempting to access the metrics endpoint from an external client', function () {
        beforeEach(async function () {
          req.get.returns('external-ip')
          await metrics.summaryRoute(req, res, next)
        })

        it('should return page not found', function () {
          expect(next).to.be.calledOnce
          const error = next.firstCall.args[0]
          expect(error.message).to.equal('External metrics access')
          expect(error.statusCode).to.equal(404)
        })
      })

      describe('When summary', function () {
        const mockError = new Error('Summary error')
        mockError.statusCode = 500

        beforeEach(async function () {
          promster.getSummary.rejects(mockError)
          await metrics.summaryRoute(req, res, next)
        })

        it('should return error to next', function () {
          expect(next).to.be.calledOnce
          const error = next.firstCall.args[0]
          expect(error.message).to.equal('Summary error')
          expect(error.statusCode).to.equal(500)
        })
      })
    })

    describe('#normalizePath', function () {
      it('should obfuscate path ending with a uuid', function () {
        const path = metrics.normalizePath(
          '/foo/0ee995d1-9390-4e85-9f5a-c6a436716234'
        )
        expect(path).to.equal('/foo/:uuid')
      })

      it('should obfuscate path containing a uuid', function () {
        const path = metrics.normalizePath(
          '/foo/0ee995d1-9390-4e85-9f5a-c6a436716234/bar'
        )
        expect(path).to.equal('/foo/:uuid/bar')
      })

      it('should obfuscate path containing multiple uuids', function () {
        const path = metrics.normalizePath(
          '/ff59bf52-5e16-48c8-a154-616ad4ff247c/0ee995d1-9390-4e85-9f5a-c6a436716234'
        )
        expect(path).to.equal('/:uuid/:uuid')
      })

      it('should obfuscate path ending with a date', function () {
        const path = metrics.normalizePath('/foo/2020-09-23')
        expect(path).to.equal('/foo/:date')
      })

      it('should obfuscate path containing a date', function () {
        const path = metrics.normalizePath('/foo/2020-09-23/bar')
        expect(path).to.equal('/foo/:date/bar')
      })

      it('should obfuscate path containing multiple dates', function () {
        const path = metrics.normalizePath('/2019-09-24/2020-09-23')
        expect(path).to.equal('/:date/:date')
      })

      it('should obfuscate lookup values', function () {
        const pathPolice = metrics.normalizePath(
          '/foo?bar=baz&filter[police_national_computer]=PNC&something=else'
        )
        const pathPrison = metrics.normalizePath(
          '/foo?filter[prison_number]=PRISON'
        )
        expect(pathPolice).to.equal(
          '/foo?bar=baz&filter[police_national_computer]=:lookup&something=else'
        )

        expect(pathPrison).to.equal('/foo?filter[prison_number]=:lookup')
      })

      it('should obfuscate auth callback path', function () {
        const path = metrics.normalizePath('/foo/callback?code=SOOPERSEKRIT!99')
        expect(path).to.equal('/foo/callback?code=:code')
      })

      context('when asset paths contain build sha', function () {
        it('should normalise .js', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.js')
          expect(path).to.equal('/foo/bar.:sha.js')
        })

        it('should normalise .css', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.css')
          expect(path).to.equal('/foo/bar.:sha.css')
        })

        it('should normalise .woff', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.woff2')
          expect(path).to.equal('/foo/bar.:sha.woff2')
        })

        it('should normalise .svg', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.svg')
          expect(path).to.equal('/foo/bar.:sha.svg')
        })

        it('should normalise .png', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.png')
          expect(path).to.equal('/foo/bar.:sha.png')
        })

        it('should normalise .jpg', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.jpg')
          expect(path).to.equal('/foo/bar.:sha.jpg')
        })

        it('should normalise .gif', function () {
          const path = metrics.normalizePath('/foo/bar.62f6496e.gif')
          expect(path).to.equal('/foo/bar.:sha.gif')
        })
      })

      it('should not obfuscate other path', function () {
        const path = metrics.normalizePath('/foo/bar')
        expect(path).to.equal('/foo/bar')
      })
    })

    describe('#normalizeUrlPath', function () {
      it('should normalize urls to path', function () {
        expect(
          metrics.normalizeUrlToPath(
            'http://foo.com/bar/ff59bf52-5e16-48c8-a154-616ad4ff247c'
          )
        ).to.equal('/bar/:uuid')
      })
    })
  })
})
