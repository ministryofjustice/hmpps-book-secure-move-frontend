const personService = require('../../../common/services/person')
const moveService = require('../../../common/services/move')

module.exports = {
  post: async (req, res, next) => {
    try {
      const { move } = res.locals

      await moveService.cancel(move.id)

      req.flash('success', {
        title: req.t('messages:cancel_move.success.title'),
        content: req.t('messages:cancel_move.success.content', {
          name: personService.getFullname(move.person),
          location: move.to_location.title,
        }),
      })

      res.redirect('/')
    } catch (error) {
      next(error)
    }
  },
  get: (req, res) => {
    const { move } = res.locals
    const locals = {
      fullname: personService.getFullname(move.person),
    }

    res.render('move/views/cancel', locals)
  },
}
