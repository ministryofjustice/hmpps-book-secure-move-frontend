const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

class UnassignController extends FormWizardController {
  middlewareLocals() {
    super.middlewareLocals()
    this.use(async (req, res, next) => {
      const { moveId, personId } = req

      const move = await moveService.getById(moveId)

      if (personId === move.person.id) {
        // bail out
      }
      res.locals.move = move
      res.locals.person = move.person

      next()
    })
  }

  async successHandler(req, res, next) {
    const { id: allocationId } = res.locals.allocation

    try {
      const { moveId } = req
      await moveService.update({
        id: moveId,
        person: {
          id: null,
        },
        move_agreed: false,
        move_agreed_by: '',
      })

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(`/allocation/${allocationId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UnassignController
