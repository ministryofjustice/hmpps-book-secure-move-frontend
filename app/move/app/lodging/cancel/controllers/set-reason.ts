import { BaseController } from './base'

export class SetReasonController extends BaseController {
  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // .use() does exist
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req: any, res: any, next: any) {
    res.locals.moveId = req.move.id

    next()
  }

  process(req: any, res: any, next: () => void) {
    next()
  }
}
