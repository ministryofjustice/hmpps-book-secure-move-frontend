const controllers = require('./controllers')

describe('Locations controllers', function() {
  let req, res
  const userLocations = [
    {
      id: 'test2',
      title: 'Test Police 2',
      location_type: 'police',
    },
    {
      id: 'testcourt',
      title: 'Test Court',
      location_type: 'court',
    },
    {
      id: 'test1',
      title: 'Test Police 1',
      location_type: 'police',
    },
    {
      id: 'testprison',
      title: 'Test Prison',
      location_type: 'prison',
    },
  ]

  describe('#locations', function() {
    beforeEach(function() {
      req = {
        session: {},
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('when no user exists on session', function() {
      beforeEach(function() {
        controllers.locations(req, res)
      })

      it('should render template', function() {
        expect(res.render).to.be.calledOnce
      })

      it('should return empty list for locations', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('locations')
        expect(params.locations).to.deep.equal([])
      })
    })

    context('when locations exists on user', function() {
      beforeEach(function() {
        req.session.user = {
          locations: userLocations,
        }

        controllers.locations(req, res)
      })

      it('should render template', function() {
        expect(res.render).to.be.calledOnce
      })

      it('should return locations sorted by title', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('locations')
        expect(params.locations).to.deep.equal([
          {
            id: 'testcourt',
            title: 'Test Court',
            location_type: 'court',
          },
          {
            id: 'test1',
            title: 'Test Police 1',
            location_type: 'police',
          },
          {
            id: 'test2',
            title: 'Test Police 2',
            location_type: 'police',
          },
          {
            id: 'testprison',
            title: 'Test Prison',
            location_type: 'prison',
          },
        ])
      })
    })
  })
})
