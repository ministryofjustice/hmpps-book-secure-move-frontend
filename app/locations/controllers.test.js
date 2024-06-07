const { locations: locationsController } = require('./controllers')

const mockLocations = [
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'D location',
  },
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'b location',
  },
  {
    id: 'd8e9cf86-55cd-4412-83b7-3562b7d1f8b6',
    title: 'A location',
  },
  {
    id: '10923762-bc17-4ea1-bae3-68ea709ee23e',
    title: 'C location',
    disabled_at: '123',
  },
]

describe('Locations controllers', function () {
  let req, res, nextSpy
  const mockReferenceData = {
    getRegions: sinon.fake.returns(Promise.resolve([])),
  }

  describe('#locations', function () {
    beforeEach(function () {
      req = {
        session: {
          user: {
            permissions: [],
            locations: mockLocations,
          },
        },
        services: {
          referenceData: mockReferenceData,
        },
      }
      res = {
        render: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context(
      'when the user is assigned a `allocation:create` permission',
      function () {
        beforeEach(function () {
          req.session.user.permissions = ['allocation:create']
        })

        context('when the region API is available', function () {
          it('should retrieve all regions', async function () {
            mockReferenceData.getRegions = sinon.fake.returns(
              Promise.resolve([])
            )
            await locationsController(req, res, nextSpy)
            expect(res.render).to.be.calledOnce
          })
        })
      }
    )

    context(
      'when the user is not assigned a `allocation:create` permission',
      function () {
        beforeEach(async function () {
          await locationsController(req, res)
        })

        it('should render template', function () {
          expect(res.render).to.be.calledOnce
        })

        it('should return locations', function () {
          const params = res.render.args[0][1]
          expect(params).to.have.property('activeLocations')
          expect(params.activeLocations).to.deep.equal(
            mockLocations.filter(l => l.disabled_at === null)
          )
        })
      }
    )

    context('when there is an API error', function () {
      it('should fail gracefully for regions API', async function () {
        req.session.user.permissions = ['allocation:create']
        req.services.referenceData.getRegions = sinon.fake.returns(
          Promise.reject(new Error())
        )
        await locationsController(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnce
      })
    })
  })
})
