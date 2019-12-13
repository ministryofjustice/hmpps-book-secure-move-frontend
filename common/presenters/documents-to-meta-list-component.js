const { renderComponentToHtml } = require('../../common/lib/component/helpers')

function documentsToMetaListComponent(documents) {
  const items = documents
    .map(({ url, filename, filesize }, index) => {
      return {
        url,
        text: filename,
        hintId: `external-link-label-${index}`,
        target: '_blank',
        meta: filesize,
      }
    })
    .map(document => ({
      value: {
        html: renderComponentToHtml('link', document),
      },
    }))

  return items
}

module.exports = documentsToMetaListComponent
