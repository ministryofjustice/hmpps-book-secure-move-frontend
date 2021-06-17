const presenters = require('../../../../../common/presenters')

const CreateBaseController = require('./base')

class TimetableController extends CreateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.getTimetable)
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkTimetable)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setTimetable)
  }

  async getTimetable(req, res, next) {
    const profile = req.sessionModel.get('profile') || {}
    const moveDate = req.sessionModel.get('date')

    if (!profile.person?.id) {
      return next()
    }

    try {
      req.timetable = await req.services.person.getTimetableByDate(
        profile.person.id,
        moveDate
      )
      next()
    } catch (error) {
      next(error)
    }
  }

  checkTimetable(req, res, next) {
    if (req.timetable && req.timetable.length) {
      return next()
    }

    req.form.options.skip = true
    this.successHandler(req, res, next)
  }

  setTimetable(req, res, next) {
    res.locals.timetable = presenters.timetableToTableComponent(req.timetable)
    next()
  }
}

module.exports = TimetableController
