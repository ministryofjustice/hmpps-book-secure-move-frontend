const { format } = require('date-fns')

const presenters = require('../../../common/presenters')

module.exports = function download(req, res, next) {
  const { extension } = req.params
  const { dateRange, activeMovesByDate, cancelledMovesByDate } = res.locals
  const moves = [...activeMovesByDate, ...cancelledMovesByDate]
  const currentTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  const filename = req.t('moves::download_filename', {
    date: dateRange.toString().replace(/,/g, 'to'),
    timestamp: currentTimestamp,
  })

  if (!extension) {
    return next()
  }

  res.setHeader(
    'Content-disposition',
    `attachment; filename="${filename}.${extension}"`
  )

  if (extension === 'json') {
    return res.json(moves)
  }

  if (extension === 'csv') {
    return presenters
      .movesToCSV(moves)
      .then(csv => {
        res.setHeader('Content-Type', 'text/csv')
        res.send(csv)
      })
      .catch(next)
  }

  next()
}
