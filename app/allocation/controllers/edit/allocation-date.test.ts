import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'

import { Allocation } from '../../../../common/types/allocation'
import { BasmResponse } from '../../../../common/types/basm_response'
import { Location } from '../../../../common/types/location'
import { Move } from '../../../../common/types/move'
import { AllocationRequestFactory } from '../../../../factories/allocation_request'
import { MoveFactory } from '../../../../factories/move'

import AllocationDateController from './allocation-date'

const controller = new AllocationDateController({ route: '/' })

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

describe('#getValues', function () {
  let callback: SinonStub

  beforeEach(function () {
    callback = sinon.stub()
    controller.getValues(req, res, callback)
  })

  it('calls back with the formatted date from the allocation', function () {
    expect(callback).to.have.been.calledWithExactly(null, {
      date: 'Sunday 1 Jan 2023',
    })
  })
})

describe('#configure', function () {
  let callback: SinonStub

  beforeEach(function () {
    callback = sinon.stub()
    controller.configure(req, res, callback)
  })

  it('updates the next URL in the form config', function () {
    expect(req.form.options.next).to.equal(
      '/allocation/f0a99b8e-18ab-454f-83ce-600237c46d7e/edit/date-changed-reason'
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

      sessionModel = {
        toJSON: sinon.stub().returns(mockData),
        set: sinon.stub(),
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
              date: '2023-01-02',
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

    it('does not call allocationService.update', function () {
      expect(allocationService.update).to.not.have.been.called
    })


    it('calls next', function () {
      expect(next).to.have.been.calledOnce
    })

    it('updates the sessionModel with the propsedDate', function () {
      expect(sessionModel.set).to.have.been.calledWithExactly('proposedDate', '2023-01-02')
    })

    it(`doesn't set the flash`, function () {
      expect(flash).to.not.have.been.called
    })
  })

})
