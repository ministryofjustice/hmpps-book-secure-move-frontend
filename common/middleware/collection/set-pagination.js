const i18n = require('../../../config/i18n').default
const urlHelpers = require('../../helpers/url')

function setPagination(route) {
  return function handlePagination(req, res, next) {
    const totalPages = req.results?.meta?.pagination?.total_pages

    if (totalPages > 1) {
      const { page = 1 } = req.query
      let nextPage
      let prevPage

      if (req.results?.links?.next) {
        const nextPageNumber = parseInt(page) + 1

        nextPage = {
          href: urlHelpers.compileFromRoute(
            route,
            req,
            {},
            {
              page: `${nextPageNumber}`,
            }
          ),
          text: i18n.t('pagination.next_page'),
          label: i18n.t('pagination.page_of', {
            current: nextPageNumber,
            total: totalPages,
          }),
        }
      }

      if (req.results?.links?.prev) {
        const previousPageNumber = parseInt(page) - 1

        prevPage = {
          href: urlHelpers.compileFromRoute(
            route,
            req,
            {},
            {
              page: `${previousPageNumber}`,
            }
          ),
          text: i18n.t('pagination.previous_page'),
          label: i18n.t('pagination.page_of', {
            current: previousPageNumber,
            total: totalPages,
          }),
        }
      }

      req.pagination = {
        next: nextPage,
        previous: prevPage,
      }
    }

    next()
  }
}

module.exports = setPagination
