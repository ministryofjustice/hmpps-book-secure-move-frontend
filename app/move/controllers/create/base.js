const { get, set } = require('lodash')
const moveService = require('../../../../common/services/move')
const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')

class CreateBaseController extends FormWizardController {
  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkCurrentLocation)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setCancelUrl)
    this.use(this.setMoveSummary)
    this.use(this.setJourneyTimer)
  }

  setCancelUrl(req, res, next) {
    res.locals.cancelUrl = res.locals.MOVES_URL
    next()
  }

  async post(req, res, next) {
    /*
    TODO - upcoming functionality will remove this work & the cancel button

    At present the move is created the step before document uploads. Because
    we need a move id to upload documents to. This means that if a user cancels
    on the document uploads page we need to delete the move that has just been
    created.
    This is not ideal because the user can exit the page without clicking the
    "cancel" button. Meaning a move has been created but the user hasn't
    scheduled it.

    There is work to be played around a "draft" status, so when a move is
    created, to enable document uploads, it has a status of "draft".
    Then when a user finishes the journey by clicking "schedule move" the
    status is set to "requested". We could then not display "drafts" and remove
    stale "drafts" of a certain age. And also remove this cancel functionality
    and the cancel button in the view.
    */
    const { cancel_move: cancelMove } = req.body

    if (cancelMove && cancelMove === 'cancel') {
      const { id } = req.sessionModel.get('move') || {}

      try {
        if (id) {
          await moveService.destroy(id)
        }
      } catch (error) {
        return next(error)
      }

      return res.redirect(res.locals.MOVES_URL)
    }

    super.post(req, res, next)
  }

  setJourneyTimer(req, res, next) {
    if (!get(req, 'session.createMoveJourneyTimestamp')) {
      set(req, 'session.createMoveJourneyTimestamp', new Date().getTime())
    }

    next()
  }

  checkCurrentLocation(req, res, next) {
    if (!req.session.currentLocation) {
      const error = new Error('Current location is not set in session')
      error.code = 'MISSING_LOCATION'
      return next(error)
    }

    next()
  }

  setMoveSummary(req, res, next) {
    const currentLocation = req.session.currentLocation
    const sessionModel = req.sessionModel.toJSON()
    const moveSummary = presenters.moveToMetaListComponent({
      ...sessionModel,
      from_location: currentLocation,
    })

    res.locals.person = sessionModel.person
    res.locals.moveSummary = sessionModel.move_type ? moveSummary : {}

    next()
  }
}

module.exports = CreateBaseController
