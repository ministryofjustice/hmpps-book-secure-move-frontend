const proxyquire = require('proxyquire').noCallThru()

describe('Analytics', function () {
  describe('#sendEvent', function () {
    let response, analytics

    context('without GA_ID', function () {
      beforeEach(async function () {
        analytics = proxyquire('./analytics', {
          '../../config': {},
        })

        response = await analytics.sendEvent({})
      })

      it('should resolve with empty promise', function () {
        expect(response).to.equal()
      })
    })

    context('with GA_ID', function () {
      const mockUUID = '3333'
      const mockGaID = '11111'
      const mockResponse = {
        success: true,
      }

      beforeEach(async function () {
        analytics = proxyquire('./analytics', {
          uuid: {
            v4: () => mockUUID,
          },
          '../../config': {
            ANALYTICS: {
              GA_ID: mockGaID,
            },
          },
        })

        nock('https://www.google-analytics.com')
          .post(
            '/collect',
            `v=1&t=event&ec=category&ea=action&el=label&ev=value&cid=${mockUUID}&tid=${mockGaID}`
          )
          .reply(200, mockResponse)

        response = await analytics.sendEvent({
          category: 'category',
          action: 'action',
          label: 'label',
          value: 'value',
        })
      })

      it('should send data to GA', function () {
        expect(response).to.deep.equal(mockResponse)
      })

      it('should post hit to GA', function () {
        expect(nock.isDone()).to.be.true
      })
    })
  })

  describe('#sendJourneyTime()', function () {
    let response, analytics

    context('without GA_ID', function () {
      beforeEach(async function () {
        analytics = proxyquire('./analytics', {
          '../../config': {},
        })

        response = await analytics.sendJourneyTime()
      })

      it('should resolve with empty promise', function () {
        expect(response).to.equal()
      })
    })

    context('with GA_ID', function () {
      const mockUUID = '3333'
      const mockGaID = '11111'
      const mockResponse = {
        success: true,
      }

      beforeEach(function () {
        analytics = proxyquire('./analytics', {
          uuid: {
            v4: () => mockUUID,
          },
          '../../config': {
            ANALYTICS: {
              GA_ID: mockGaID,
            },
          },
        })
      })

      context('without params', function () {
        beforeEach(async function () {
          nock('https://www.google-analytics.com')
            .post(
              '/collect',
              `v=1&t=timing&utl=Journey%20duration&cid=${mockUUID}&tid=${mockGaID}`
            )
            .reply(200, mockResponse)

          response = await analytics.sendJourneyTime()
        })

        it('should send data to GA', function () {
          expect(response).to.deep.equal(mockResponse)
        })

        it('should post hit to GA', function () {
          expect(nock.isDone()).to.be.true
        })
      })

      context('with params', function () {
        beforeEach(async function () {
          nock('https://www.google-analytics.com')
            .post(
              '/collect',
              `v=1&t=timing&utl=Journey%20duration&utv=Journey%20name&utt=10000&utc=Type&cid=${mockUUID}&tid=${mockGaID}`
            )
            .reply(200, mockResponse)

          response = await analytics.sendJourneyTime({
            utv: 'Journey name',
            utt: 10000,
            utc: 'Type',
          })
        })

        it('should send data to GA', function () {
          expect(response).to.deep.equal(mockResponse)
        })

        it('should post hit to GA', function () {
          expect(nock.isDone()).to.be.true
        })
      })
    })
  })
})
