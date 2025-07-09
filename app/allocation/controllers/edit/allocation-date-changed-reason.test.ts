import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'

import { Allocation } from '../../../../common/types/allocation'
import { BasmResponse } from '../../../../common/types/basm_response'
import { Location } from '../../../../common/types/location'
import { Move } from '../../../../common/types/move'
import { AllocationRequestFactory } from '../../../../factories/allocation_request'
import { MoveFactory } from '../../../../factories/move'

import AllocationDateController from './allocation-date'
import AllocationDateChangedReasonController from './allocation-date-changed-reason'

const controller = new AllocationDateChangedReasonController({ route: '/' })

const locations: Location[] = [
  {
    id: 'a15957ec-c983-4d29-98e4-334060b16dca',
    key: 'AAA',
    location_type: 'prison',
    title: 'HMP Adelaide',
    type: 'locations',
    extradition_capable: false,
  },
  {
    id: '2c3016af-e043-4600-a6da-de91520fc700',
    key: 'BBB',
    location_type: 'prison',
    title: 'HMP Brisbane',
    type: 'locations',
    extradition_capable: false,
  },
]

const moves: Move[] = [
  MoveFactory.build({
    date: '',
    from_location: locations[0],
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
  }),
  MoveFactory.build({
    date: '',
    from_location: locations[0],
    id: 'ae8bbcdb-9b70-49f0-bce2-c6f512a3f202',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
  }),
]

const allocation: Allocation = {
  date: '2023-01-01',
  from_location: locations[0],
  id: 'f0a99b8e-18ab-454f-83ce-600237c46d7e',
  moves,
  moves_count: 2,
  to_location: locations[1],
}

const formOptions = {
  fields: {},
  next: '/',
}

const req = AllocationRequestFactory.build({ allocation })

const res: BasmResponse = {
  locals: {},
  render: () => {},
  redirect: () => {},
}

describe('#configure', function () {
  let callback: SinonStub

  beforeEach(function () {
    callback = sinon.stub()
    controller.configure(req, res, callback)
  })

  it('updates the next URL in the form config', function () {
    expect(req.form.options.next).to.equal(
      '/allocation/f0a99b8e-18ab-454f-83ce-600237c46d7e'
    )
  })

  it('calls next()', function () {
    expect(callback).to.have.been.calledOnce
  })
})

describe('#locals', function () {
  let callback: SinonStub

  beforeEach(function () {
    callback = sinon.stub()
    controller.locals(req, res, callback)
  })

  it('calls back with the correct cancel URL', function () {
    const call = callback.firstCall
    const { cancelUrl } = call.args[1]

    expect(cancelUrl).to.equal(
      '/allocation/f0a99b8e-18ab-454f-83ce-600237c46d7e'
    )
  })

  it('calls back with the correct summary', function () {
    const call = callback.firstCall
    const { summary } = call.args[1]

    const summaryHtml = JSON.stringify(summary)

    expect(summaryHtml).to.include('2')
    expect(summaryHtml).to.include('Adelaide')
    expect(summaryHtml).to.include('Brisbane')
    expect(summaryHtml).to.include('Sunday 1 Jan 2023')
  })
})

describe('#saveValues', function () {
  let allocationService: any
  let sessionModel: any
  let next: any
  let flash: any
  const mockData = {
    'csrf-secret': '123',
    errors: null,
  }

  context('happy path', function () {
    beforeEach(async function () {
      allocationService = {
        update: sinon.stub().resolves({
          ...allocation,
          date: '2023-01-02',
          date_changed_reason: 'prisoner_refusal',
        }),
      }
      sessionModel = {
        toJSON: sinon.stub().returns(mockData),
        set: sinon.stub(),
        get: sinon.stub().returns('2023-01-02')
      }
      next = sinon.stub()
      flash = sinon.stub()

      await controller.saveValues(
        AllocationRequestFactory.build({
          allocation,
          flash,
          form: {
            options: formOptions,
            values: {
              date_changed_reason: 'prisoner_refusal',
            },
          },
          sessionModel,
          services: {
            allocation: allocationService,
          },
        }),
        res,
        next
      )
    })

    it('calls allocationService.update', function () {
      expect(allocationService.update).to.have.been.calledOnce
    })

    it('ignores the errors and csrf from session model', function () {
      expect(allocationService.update).to.have.been.calledWithExactly({
        id: allocation.id,
        date: '2023-01-02',
        date_changed_reason: 'prisoner_refusal',
      })
    })

    it('calls next', function () {
      expect(next).to.have.been.calledOnce
    })

    it('updates the sessionModel with the proposed date', function () {
      expect(sessionModel.get).to.have.been.calledWithExactly('proposedDate')
    })

    it('sets the flash', function () {
      expect(flash).to.have.been.calledWithExactly('success', {
        title: 'Allocation updated',
        content: 'This move has been updated with the supplier',
      })
    })
  })

  context('when count is zero (all moves cancelled)', function () {
    const emptyAllocation = {
      ...allocation,
      moves: [],
      moves_count: 0,
    }

    beforeEach(async function () {
      allocationService = {
        update: sinon.stub().resolves({
          ...emptyAllocation,
          date: '2023-01-02',
          date_changed_reason: 'prisoner_refusal',
        }),
      }
      sessionModel = {
        toJSON: sinon.stub().returns(mockData),
        set: sinon.stub(),
        get: sinon.stub().returns('2023-02-01')
      }
      next = sinon.stub()
      flash = sinon.stub()

      await controller.saveValues(
        AllocationRequestFactory.build({
          allocation: emptyAllocation,
          flash,
          form: {
            options: formOptions,
            values: {
              date_changed_reason: 'prisoner_refusal',
            },
          },
          sessionModel,
          services: {
            allocation: allocationService,
          },
        }),
        res,
        next
      )
    })

    it('sets the flash without error', function () {
      expect(flash).to.have.been.calledWithExactly('success', {
        title: 'Allocation updated',
        content: 'This move has been updated with the supplier',
      })
    })
  })

  context('unhappy path', function () {
    const error = new Error('bad!')

    beforeEach(async function () {
      sessionModel = {
        toJSON: sinon.stub().returns(mockData),
      }

      allocationService.update = sinon.stub().throws(error)
      next = sinon.stub()

      await controller.saveValues(
        AllocationRequestFactory.build({
          form: {
            options: formOptions,
            values: {
              date_changed_reason: 'prisoner_refusal',
            },
          },
          sessionModel,
          services: {
            allocation: allocationService,
          },
        }),
        res,
        next
      )
    })

    it('calls next with the error', function () {
      expect(next).to.be.calledOnceWithExactly(error)
    })
  })
})
