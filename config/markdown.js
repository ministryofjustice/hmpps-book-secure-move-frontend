const md = require('markdown-it')({
  html: true,
  typographer: true,
})
const markdownItContainer = require('markdown-it-container')
const njkMarkdown = require('nunjucks-markdown')

function renderWarning(tokens, idx) {
  if (tokens[idx].nesting === 1) {
    return '<div class="govuk-warning-text">\n<span class="govuk-warning-text__icon" aria-hidden="true">!</span>\n<strong class="govuk-warning-text__text">\n<span class="govuk-warning-text__assistive">Warning</span>\n'
  }

  return '</strong>\n</div>\n'
}

function renderInset(tokens, idx) {
  if (tokens[idx].nesting === 1) {
    return '<div class="govuk-inset-text">\n'
  }

  return '</div>\n'
}

md.use(markdownItContainer, 'warning', {
  marker: '!',
  render: renderWarning,
})

md.use(markdownItContainer, 'inset', {
  marker: '!',
  render: renderInset,
})

module.exports = {
  renderWarning,
  renderInset,
  init: nunjucks => {
    if (nunjucks) {
      njkMarkdown.register(nunjucks, body => md.render(body))
    }
  },
}
