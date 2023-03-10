const { startOfTomorrow, startOfYesterday } = require('date-fns')

const movesApp = require('../../app/moves')
const SERVICE_NAME = 'Book a secure move'

function startOfDayAfterTomorrow() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  const date = new Date(0)
  date.setFullYear(year, month, day + 2)
  date.setHours(0, 0, 0, 0)
  return date
}

module.exports = function setLocals(req, res, next) {
  const protocol = req.encrypted ? 'https' : req.protocol
  const baseUrl = `${protocol}://${req.get('host')}`
  const locals = {
    CANONICAL_URL: baseUrl + req.path,
    TODAY: new Date(),
    TOMORROW: startOfTomorrow(),
    DAY_AFTER_TOMORROW: startOfDayAfterTomorrow(),
    YESTERDAY: startOfYesterday(),
    REQUEST_PATH: req.path,
    USER: req.user,
    CURRENT_LOCATION: req.session.currentLocation,
    CURRENT_REGION: req.session.currentRegion,
    MOVES_URL: req.session.movesUrl || movesApp.mountpath,
    SERVICE_NAME,
    getLocal: key => res.locals[key],
    getMessages: () => req.flash(),
    canAccess: permission => {
      if (!req.canAccess) {
        return false
      }

      return req.canAccess(permission)
    },
    getBreadcrumbs() {
      if (!res.breadcrumb) {
        return []
      }

      const breadcrumbs = res.breadcrumb()
      return breadcrumbs.map(({ text, href }, i) => {
        return {
          text,
          href: i === breadcrumbs.length - 1 ? null : href,
        }
      })
    },
    getPageTitle() {
      if (!res.breadcrumb) {
        return []
      }

      const items = res
        .breadcrumb()
        .filter(item => !item._home)
        .map(item => item.text)

      return [SERVICE_NAME, ...items].reverse()
    },
  }

  res.locals = {
    ...res.locals,
    ...locals,
  }

  next()
}
