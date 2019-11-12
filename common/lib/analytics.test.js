const proxyquire = require('proxyquire')
const mockHrTime = [44444, 55555]

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
            createMoveJourneyTime: mockHrTime,
            save: sinon.stub().callsFake(() => Promise.resolve('GA hit sent')),
          },
        }

        sinon.stub(process, 'hrtime').returns(mockHrTime)

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
            `/collect?v=1&t=timing&utl=Journey+duration&utt=44444000&utc=robocop&cid=${mockUUID}&tid=${mockGaID}`
          )
          .reply(200, {})

        result = await analytics.sendJourneyTime(
          req,
          'createMoveJourneyTime',
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
        expect(req.session.createMoveJourneyTime).to.be.undefined
      })
    })
  })
})
