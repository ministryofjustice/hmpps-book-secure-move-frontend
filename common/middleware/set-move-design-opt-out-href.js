module.exports = function ({ previewPrefix }) {
  return function (req, res, next) {
    const moveId = req.move?.id || req.moveId

    if (req.moveDesignPreview && moveId) {
      res.locals.moveDesignOptOutHref = `/move${previewPrefix}/opt-out?move_id=${moveId}`
    } else {
      res.locals.moveDesignOptOutHref = null
    }

    next()
  }
}
