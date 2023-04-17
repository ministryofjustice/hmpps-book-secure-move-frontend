import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'

import { Allocation } from '../../../../common/types/allocation'
import { BasmResponse } from '../../../../common/types/basm_response'
import { Location } from '../../../../common/types/location'
import { Move } from '../../../../common/types/move'

import AllocationDetailsController, {
  AllocationRequest,
} from './allocation-details'

const controller = new AllocationDetailsController({ route: '/' })

const locations: Location[] = [
  {
    id: 'a15957ec-c983-4d29-98e4-334060b16dca',
    key: 'AAA',
    location_type: 'prison',
    title: 'HMP Adelaide',
    type: 'locations',
  },
  {
    id: '2c3016af-e043-4600-a6da-de91520fc700',
    key: 'BBB',
    location_type: 'prison',
    title: 'HMP Brisbane',
    type: 'locations',
  },
]

const moves: Move[] = [
  {
    date: '',
    from_location: locations[0],
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
  },
  {
    date: '',
    from_location: locations[0],
    id: 'ae8bbcdb-9b70-49f0-bce2-c6f512a3f202',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
  },
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

const req: AllocationRequest = {
  allocation,
  canAccess: _string => true,
  flash: () => undefined,
  form: {
    options: formOptions,
    values: {},
  },
  services: {
    allocation: {
      update: () => {},
    },
  },
  session: {
    save: () => undefined,
  },
  sessionModel: {
    reset: () => undefined,
    set: () => undefined,
    toJSON: () => ({}),
  },
  t: (_keys, _options) => 'test',
}

const res: BasmResponse = {
  locals: {},
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
  const mockData = { 'csrf-secret': '123', errors: null }

  context('happy path', function () {
    beforeEach(async function () {
      allocationService = {
        update: sinon.stub().resolves({ ...allocation, date: '2023-01-02' }),
      }
      sessionModel = {
        toJSON: sinon.stub().returns(mockData),
        set: sinon.stub(),
      }
      next = sinon.stub()
      flash = sinon.stub()

      await controller.saveValues(
        {
          ...req,
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
        },
        res,
        next
      )
    })

    it('calls allocationService.update', function () {
      expect(allocationService.update).to.have.been.calledOnce
    })

    it('ignores the errors and csrf from session model', function () {
      expect(allocationService.update).to.have.been.calledWithExactly({
        id: 'f0a99b8e-18ab-454f-83ce-600237c46d7e',
        date: '2023-01-02',
      })
    })

    it('calls next', function () {
      expect(next).to.have.been.calledOnce
    })

    it('updates the sessionModel with the allocation', function () {
      expect(sessionModel.set).to.have.been.calledWithExactly('allocation', {
        ...allocation,
        date: '2023-01-02',
      })
    })

    it('sets the flash', function () {
      expect(flash).to.have.been.calledWithExactly('success', {
        title: 'test',
        content: 'test',
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
        {
          ...req,
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
        },
        res,
        next
      )
    })

    it('calls next with the error', function () {
      expect(next).to.be.calledOnceWithExactly(error)
    })
  })
})
