const i18n = require('../../../config/i18n').default

const {
  establishmentCellData,
  freeSpacesCellData,
  transfersInCellData,
  transfersOutCellData,
} = require('./cell-renderers')

describe('cell renderers', function () {
  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  afterEach(function () {
    i18n.t.restore()
  })

  describe('establishmentCellData', function () {
    it('should contain a url function', function () {
      expect(establishmentCellData.url).to.be.a('function')
    })

    it('should contain a content function', function () {
      expect(establishmentCellData.content).to.be.a('function')
    })

    describe('#url', function () {
      it('should set a weekly url', function () {
        expect(
          establishmentCellData.url({
            date: new Date(2020, 5, 1),
            data: {
              id: 'ABADCAFE',
            },
          })
        ).to.equal('/population/week/2020-06-01/ABADCAFE')
      })
    })

    describe('#content', function () {
      it('should use data.title', function () {
        expect(
          establishmentCellData.content({
            data: { title: 'Establishment' },
          })
        ).to.equal('Establishment')
      })
    })
  })

  describe('freeSpacesCellData', function () {
    it('should contain a url function', function () {
      expect(freeSpacesCellData.url).to.be.a('function')
    })

    it('should contain a content function', function () {
      expect(freeSpacesCellData.content).to.be.a('function')
    })

    describe('#url', function () {
      it('should set a edit url with no free_spaces data', function () {
        expect(
          freeSpacesCellData.url({
            population: {},
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('/population/day/2020-06-01/DEADBEEF/edit')
      })

      it('should set an view url with free_spaces data', function () {
        expect(
          freeSpacesCellData.url({
            population: { free_spaces: 0 },
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('/population/day/2020-06-01/DEADBEEF')
      })
    })

    describe('#content', function () {
      it('should use "add_space" with no free_spaces data', function () {
        expect(
          freeSpacesCellData.content({
            population: {},
          })
        ).to.equal('population::add_space')
      })
      it('should use "add_space" with  free_spaces = 0', function () {
        expect(
          freeSpacesCellData.content({
            population: { free_spaces: 0 },
          })
        ).to.equal('population::spaces_with_count')
      })
      it('should use "spaces_with_count" with free_spaces data', function () {
        expect(
          freeSpacesCellData.content({
            population: { free_spaces: 1 },
          })
        ).to.equal('population::spaces_with_count')
      })
    })
  })

  describe('transfersInCellData', function () {
    it('should contain a url function', function () {
      expect(transfersInCellData.url).to.be.a('function')
    })

    it('should contain a content function', function () {
      expect(transfersInCellData.content).to.be.a('function')
    })

    describe('#url', function () {
      it('should return an empty url when no transfers_in data', function () {
        expect(
          transfersInCellData.url({
            population: {},
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('')
      })

      it('should return an empty url when transfers_in data = 0', function () {
        expect(
          transfersInCellData.url({
            population: { transfers_in: 0 },
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('')
      })

      it('should return an transfersIn url when transfers_in data != 0', function () {
        expect(
          transfersInCellData.url({
            population: { transfers_in: 1 },
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal(
          '/moves/day/2020-06-01/DEADBEEF/incoming?status=active&group_by=location'
        )
      })
    })

    describe('#content', function () {
      it('should use "no_transfers" with no transfers_in data', function () {
        expect(
          transfersInCellData.content({
            population: {},
          })
        ).to.equal('population::no_transfers')
      })
      it('should use "no_transfers" with transfers_in = 0', function () {
        expect(
          transfersInCellData.content({
            population: { transfers_in: 0 },
          })
        ).to.equal('population::no_transfers')
      })
      it('should use "transfers_in_with_count" with transfers_in != 0', function () {
        expect(
          transfersInCellData.content({
            population: { transfers_in: 1 },
          })
        ).to.equal('population::transfers_in_with_count')
      })
    })
  })

  describe('transfersOutCellData', function () {
    it('should contain a url function', function () {
      expect(transfersOutCellData.url).to.be.a('function')
    })

    it('should contain a content function', function () {
      expect(transfersOutCellData.content).to.be.a('function')
    })

    describe('#url', function () {
      it('should return an empty url when no transfers_out data', function () {
        expect(
          transfersOutCellData.url({
            population: {},
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('')
      })

      it('should return an empty url when transfers_out data = 0', function () {
        expect(
          transfersOutCellData.url({
            population: { transfers_out: 0 },
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal('')
      })

      it('should return an transfersIn url when transfers_out data != 0', function () {
        expect(
          transfersOutCellData.url({
            population: { transfers_out: 1 },
            date: new Date(2020, 5, 1),
            locationId: 'DEADBEEF',
          })
        ).to.equal(
          '/moves/day/2020-06-01/DEADBEEF/outgoing?status=active&group_by=location'
        )
      })
    })

    describe('#content', function () {
      it('should use "no_transfers" with no transfers_out data', function () {
        expect(
          transfersOutCellData.content({
            population: {},
          })
        ).to.equal('population::no_transfers')
      })
      it('should use "no_transfers" with transfers_out = 0', function () {
        expect(
          transfersInCellData.content({
            population: { transfers_out: 0 },
          })
        ).to.equal('population::no_transfers')
      })
      it('should use "transfers_out_with_count" with transfers_out data', function () {
        expect(
          transfersOutCellData.content({
            population: { transfers_out: 1 },
          })
        ).to.equal('population::transfers_out_with_count')
      })
    })
  })
})
