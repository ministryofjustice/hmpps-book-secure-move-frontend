// @ts-ignore // TODO: convert to ts
import EditBase from '../../edit/controllers/base'

export class AddLodgeController extends EditBase {
  middlewareSetup() {
    console.log('Setting up middleware')
    super.middlewareSetup()
  }

  setNextStep(req: any, res: any, next: any) {
    console.log('Hi')
    next()
  }

  canEdit(req: any, res: any, next: Function) {
    const { id, status } = req.getMove()

    if (['completed', 'cancelled'].includes(status)) {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  setButtonText(req: any, res: any, next: () => void) {
    // @ts-ignore // #getNextStep does exist
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const buttonText = nextStep.includes(lastStep)
      ? 'actions::add_lodge'
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }
}
