const proxyquire = require('proxyquire')

const moveService = {
  getById: sinon.stub().resolves({ id: 'move', type: 'moves', foo: 'bar' }),
}
const personEscortRecordService = {
  getById: sinon
    .stub()
    .resolves({ id: 'per', type: 'person_escort_records', foo: 'bar' }),
}
const referenceDataService = {
  getLocationById: sinon
    .stub()
    .resolves({ id: 'loc', type: 'locations', foo: 'bar' }),
}
const findUnpopulatedResources = require('./find-unpopulated-resources')
const findUnpopulatedResourcesStub = sinon
  .stub()
  .callsFake(findUnpopulatedResources)

const req = {
  services: {
    move: moveService,
    personEscortRecord: personEscortRecordService,
    referenceData: referenceDataService,
  },
}

const populateResources = proxyquire('./populate-resources', {
  './find-unpopulated-resources': findUnpopulatedResourcesStub,
})

describe('populateResources', function () {
  beforeEach(function () {
    moveService.getById.resetHistory()
    personEscortRecordService.getById.resetHistory()
    referenceDataService.getLocationById.resetHistory()
  })

  context('when data contains a populated resource', function () {
    let data
    beforeEach(async function () {
      data = {
        move: { id: 'move', type: 'moves', foo: 'baz' },
      }
      await populateResources(data, req)
    })
    it('should not lookup the resource', function () {
      expect(moveService.getById).to.not.be.called
    })
    it('should leave the move untouched', function () {
      expect(data).to.deep.equal({
        move: { id: 'move', type: 'moves', foo: 'baz' },
      })
    })
  })

  context(
    'when data contains an unpopulated resource for which no lookup exists',
    function () {
      let data
      beforeEach(async function () {
        data = {
          x: { id: 'x', type: 'xs' },
        }
        await populateResources(data, req)
      })

      it('should leave the resource untouched', function () {
        expect(data).to.deep.equal({
          x: { id: 'x', type: 'xs' },
        })
      })
    }
  )

  context('when data contains an unpopulated move', function () {
    let data
    beforeEach(async function () {
      data = {
        move: { id: 'move', type: 'moves' },
      }
      await populateResources(data, req)
    })
    it('should lookup the move', function () {
      expect(moveService.getById).to.be.calledOnceWithExactly('move')
    })
    it('should populate with resolved move', function () {
      expect(data).to.deep.equal({
        move: { id: 'move', type: 'moves', foo: 'bar' },
      })
    })
  })

  context('when data contains an unpopulated PER', function () {
    let data
    beforeEach(async function () {
      data = {
        per: { id: 'per', type: 'person_escort_records' },
      }
      await populateResources(data, req)
    })
    it('should lookup the PER', function () {
      expect(personEscortRecordService.getById).to.be.calledOnceWithExactly(
        'per'
      )
    })
    it('should populate with resolved PER', function () {
      expect(data).to.deep.equal({
        per: { id: 'per', type: 'person_escort_records', foo: 'bar' },
      })
    })
  })

  context('when data contains an unpopulated location', function () {
    let data
    beforeEach(async function () {
      data = {
        location: { id: 'loc', type: 'locations' },
      }
      await populateResources(data, req)
    })
    it('should lookup the location', function () {
      expect(referenceDataService.getLocationById).to.be.calledOnceWithExactly(
        'loc'
      )
    })
    it('should populate with resolved location', function () {
      expect(data).to.deep.equal({
        location: { id: 'loc', type: 'locations', foo: 'bar' },
      })
    })
  })

  context('when data contains different unpopulated resources', function () {
    let data
    beforeEach(async function () {
      data = {
        move: { id: 'move', type: 'moves' },
        per: { id: 'per', type: 'person_escort_records' },
        location: { id: 'loc', type: 'locations' },
      }
      await populateResources(data, req)
    })

    it('should populate with resolved location', function () {
      expect(data).to.deep.equal({
        move: { id: 'move', type: 'moves', foo: 'bar' },
        per: { id: 'per', type: 'person_escort_records', foo: 'bar' },
        location: { id: 'loc', type: 'locations', foo: 'bar' },
      })
    })
  })
})

context('when data contains multiple refs to unpopulated move', function () {
  let data
  beforeEach(async function () {
    data = {
      move: { id: 'move', type: 'moves' },
      anuthaMove: { id: 'move', type: 'moves' },
    }
    await populateResources(data, req)
  })

  it('should populate all refs with resolved move', function () {
    expect(data).to.deep.equal({
      move: { id: 'move', type: 'moves', foo: 'bar' },
      anuthaMove: { id: 'move', type: 'moves', foo: 'bar' },
    })
  })

  context('when passed options', function () {
    let data
    beforeEach(async function () {
      data = {
        move: { id: 'move', type: 'moves' },
      }
      await populateResources(data, req, { exclude: ['moves'] })
    })

    it('should pass those options to findUnpopulatedResources', function () {
      expect(data).to.deep.equal({
        move: { id: 'move', type: 'moves' },
      })
    })
  })
})
