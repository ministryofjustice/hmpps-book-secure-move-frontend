const proxyquire = require('proxyquire')

describe('Analytics', function() {
  describe('#sendJourneyTime()', function() {
    context('without GA_ID', function() {
      let result, analytics

      beforeEach(async function() {
        analytics = proxyquire('./analytics', {
          '../../config': {
            ANALYTICS: {
              GA_ID: '',
            },
          },
        })

        result = await analytics.sendJourneyTime('111111', {})
      })

      it('should resolve with empty promise', function() {
        expect(result).to.equal('No GA ID!')
      })
    })

    context('with GA_ID', function() {
      const mockUUID = '3333'
      const mockGaID = '11111'
      let analytics, result, req

      beforeEach(async function() {
        req = {
          session: {
            user: {
              role: 'robocop',
            },
            createMoveJourneyTimestamp: 12233535,
            save: sinon.stub().callsFake(() => Promise.resolve('GA hit sent')),
          },
        }

        this.clock = sinon.useFakeTimers(new Date('2017-08-10').getTime())

        analytics = proxyquire('./analytics', {
          'uuid/v4': () => mockUUID,
          '../../config': {
            ANALYTICS: {
              GA_ID: mockGaID,
            },
          },
        })

        nock('https://www.google-analytics.com')
          .post(
            `/collect?v=1&t=timing&utl=Journey+duration&utt=1502310966465&utc=robocop&cid=${mockUUID}&tid=${mockGaID}`
          )
          .reply(200, {})

        result = await analytics.sendJourneyTime(
          req,
          'createMoveJourneyTimestamp',
          {}
        )
      })

      it('should send data to GA', function() {
        expect(result).to.equal('GA hit sent')
      })

      it('should post hit to GA', function() {
        expect(nock.isDone()).to.be.true
      })

      it('should reset the journey timer', function() {
        expect(req.session.createMoveJourneyTimestamp).to.be.undefined
      })
    })
  })
})
