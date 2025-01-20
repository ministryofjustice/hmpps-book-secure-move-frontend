import { get } from 'lodash'

// @ts-ignore
import presenters from '../../../../../common/presenters'

import { BasmRequest } from '../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../common/types/basm_response'
import {GenericEvent} from "../../../../../common/types/generic_event";
import {SupplierService} from "../../../../../common/services/supplier";


async function ensureSupplierInfo(events: GenericEvent[], supplierService: SupplierService){
  const eventsWithoutSupplierInfo = events.filter(
    ({supplier: Supplier})  =>
      Supplier !== undefined && Supplier !== null && Supplier.name == null
  )
  if (eventsWithoutSupplierInfo && eventsWithoutSupplierInfo.length > 0){
    console.log("Found events without supplier details, populating them")
    const suppliers = await supplierService.getAll({})
    eventsWithoutSupplierInfo.forEach(e => {
      const supplierId = e.supplier?.id
      const details = suppliers.filter( (s: { id: string | undefined; }) => s.id === supplierId)
      e.supplier = details[0]
    })
    console.log("Finished ensuring supplier info")
  }
}
export async function renderTimeline(req: BasmRequest, res: BasmResponse) {
  const { move }  = req
  const { status, cancellation_reason } = move

  // TODO: remove this second call when backend returns rebook info as part of move
  if (status === 'cancelled' && cancellation_reason === 'rejected') {
    const moveRejectEvent = move.timeline_events?.filter(
      event => event.event_type === 'MoveReject'
    )[0]
    req.move.rebook = moveRejectEvent?.details.rebook
  }

  if (move.timeline_events){
    await ensureSupplierInfo(move.timeline_events, req.services.supplier)
  }
  if (move.important_events){
    await ensureSupplierInfo(move.important_events, req.services.supplier)
  }

  const timeline = await presenters.moveToTimelineComponent(
    get(req.session, 'grant.response.access_token'),
    move
  )

  const locals = {
    timeline,
  }
       
  res.render('move/app/view/views/timeline', locals)
}
