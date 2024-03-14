import sinon from 'sinon'
import { LodgingFactory } from '../../factories/lodging'
import { Lodging } from '../types/lodging'
import { Move } from '../types/move'
import { MoveFactory } from '../../factories/move'
import { LodgingService } from './lodging'

// @ts-ignore // TODO: convert to TS
import ApiClient from '../lib/api-client'
import { expect } from 'chai'

const apiClient = new ApiClient()
const lodgingService = new LodgingService({ apiClient })

const lodging: Lodging = LodgingFactory.build()
const move: Move = MoveFactory.build()
const startDate = '2024-01-01'
const endDate = '2024-01-02'

describe('lodging service', function () {
  describe('#create', function () {
    context('when it is created successfully', function() {
      beforeEach(function () {
        sinon.stub(apiClient, 'post')
          .withArgs({
            start_date: '2024-01-01',
            end_date: '2024-01-02',
            location: { id: 'a15957ec-c983-4d29-98e4-334060b16dca' }
          })
          .resolves({ data: lodging })
      })
  
      it('creates the lodging via the API', async function() {
        const result = await lodgingService.create({
          moveId: move.id,
          locationId: lodging.location.id,
          startDate,
          endDate,
        })

        expect(result).to.equal(lodging)
      })
    })

    context('when there is an error', function() {
      const error = new Error('422')
      
      beforeEach(async function () {
        sinon.stub(apiClient, 'post').throws(error)
      })
  
      it('throws an error', function() {
        expect(() => {
          lodgingService.create({
            moveId: move.id,
            locationId: lodging.location.id,
            startDate,
            endDate,
          })
        }).to.throw(error)
      })
    })

    context('with blank move ID', function() {
      const error = new Error('yeah')
  
      it('rejects with an error', function() {
        expect(
          lodgingService.create({
            moveId: '',
            locationId: lodging.location.id,
            startDate,
            endDate,
          })
        // @ts-ignore
        ).to.be.rejectedWith(error)
      })
    })
  })

  describe('#cancelAll', function () {
    context('when moves are cancelled successfully', function() {
      beforeEach(function () {
        sinon.stub(apiClient, 'post').resolves({ data: lodging })
      })
  
      it('creates the lodging via the API', async function() {
        const result = await lodgingService.cancelAll({
          moveId: move.id,
          reason: 'other',
          comment: 'felt like a good idea',
        })

        expect(apiClient.post).to.have.been.calledWith({
          cancellation_reason: 'other',
          cancellation_reason_comment: 'felt like a good idea'
        })
      })
    })

    context('when there is an error', function() {
      const error = new Error('422')
      
      beforeEach(async function () {
        sinon.stub(apiClient, 'post').throws(error)
      })
  
      it('throws an error', function() {
        expect(() => {
          lodgingService.cancelAll({
            moveId: move.id,
            reason: 'other',
            comment: 'felt like a good idea',
          })
        }).to.throw(error)
      })
    })

    context('with blank move ID', function() {
      const error = new Error('yeah')
  
      it('rejects with an error', function() {
        expect(
          lodgingService.cancelAll({
            moveId: '',
            reason: 'other',
            comment: 'felt like a good idea',
          })
        // @ts-ignore
        ).to.be.rejectedWith(error)
      })
    })
  })
})
