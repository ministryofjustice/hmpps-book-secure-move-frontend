const { format } = require('date-fns')

module.exports = function download(req, res, next) {
  const { results } = req
  const { dateRange, extension } = req.params
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
    return res.json(results)
  }

  if (extension === 'csv') {
    res.setHeader('Content-Type', 'text/csv')
    return res.send(results)
  }

  next()
}
