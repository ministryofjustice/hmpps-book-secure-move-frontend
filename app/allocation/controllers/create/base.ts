import { NextFunction } from 'express'

import { BasmResponse } from '../../../../common/types/basm_response'
import { AllocationRequest } from '../edit/allocation-details'

const FormWizardController = require('../../../../common/controllers/form-wizard')

export default class CreateAllocationBaseController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setButtonText)
    this.use(this.setCancelUrl)
  }

  setButtonText(req: AllocationRequest, res: BasmResponse, next: NextFunction) {
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const buttonText = nextStep.includes(lastStep)
      ? 'actions::create_allocation'
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }

  setCancelUrl(_req: AllocationRequest, res: BasmResponse, next: NextFunction) {
    res.locals.cancelUrl = '/allocations'
    next()
  }
}
