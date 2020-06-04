/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }

  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

function dragAndDropAvailable() {
  const div = document.createElement('div')
  return typeof div.ondrop !== 'undefined'
}

function formDataAvailable() {
  return typeof FormData === 'function'
}

function fileApiAvailable() {
  const input = document.createElement('input')
  input.type = 'file'
  return typeof input.files !== 'undefined'
}

module.exports = {
  nodeListForEach,
  dragAndDropAvailable,
  formDataAvailable,
  fileApiAvailable,
}
