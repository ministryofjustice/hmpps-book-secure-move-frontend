import { Request, Response, Router } from 'express'
import { addEvents } from './controllers'
import { BasmRequest } from '../../common/types/basm_request'
import { BasmResponse } from '../../common/types/basm_response'

const router = Router({ mergeParams: true })

router.get('/', (req: Request, res: Response) => {
  const basmRes = res as BasmResponse
  delete basmRes.breadcrumb
  basmRes.render('police-custody-form/police-custody-form')
})

router.post('/', (req: Request, res: Response) => {
  const basmReq = req as unknown as BasmRequest
  addEvents(basmReq, res as BasmResponse)
})

export = {
  router,
  mountpath: '/police-custody-form',
}
