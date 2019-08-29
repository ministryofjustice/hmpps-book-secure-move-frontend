const moveService = require('../../../common/services/move')

module.exports = {
  post: async (req, res, next) => {
    try {
      const { move } = res.locals

      await moveService.cancel(move.id)

      req.flash('success', {
        title: req.t('messages::cancel_move.success.title'),
        content: req.t('messages::cancel_move.success.content', {
          name: move.person.fullname,
          location: move.to_location.title,
        }),
      })

      res.redirect(res.locals.MOVES_URL)
    } catch (error) {
      next(error)
    }
  },
  get: (req, res) => res.render('move/views/cancel'),
}
