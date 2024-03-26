import { parseISO } from 'date-fns'

// @ts-ignore // TODO: convert to TS
import { BaseController } from './base'

export class SetLengthController extends BaseController {
  constructor(options = {}) {
    super(options)
  }

  middlewareSetup() {
    super.middlewareSetup()
    // @ts-ignore // .use() does exist
    this.use(this.setAdditionalLocals)
  }

  setAdditionalLocals(req: any, res: any, next: any) {
    const { lodging } = req
    res.locals.lodgeLocation = lodging.location
    res.locals.lodgeStartDate = parseISO(lodging.start_date)

    next()
  }

  process(req: any, res: any, next: () => void) {
    const { lodge_length_type: lodgeLengthType } = req.form.values

    let lodgeLength: number

    if (lodgeLengthType === 'custom') {
      lodgeLength = Number(req.form.values.lodge_length_custom)
    } else {
      req.form.values.lodge_length_custom = ''
      lodgeLength = Number(lodgeLengthType)
    }

    req.form.values.lodge_length = lodgeLength

    next()
  }
}
