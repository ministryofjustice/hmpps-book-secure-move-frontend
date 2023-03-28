import { BaseController } from './base'

export class SaveController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  successHandler(req: any, res: any, next: any) {
    console.log('SAVE!')

    next()
  }
}
