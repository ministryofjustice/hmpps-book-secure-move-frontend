function isNonObject(obj) {
  let nonObj = false

  if (obj === null) {
    nonObj = true
  } else if (typeof obj !== 'object') {
    nonObj = true
  } else if (Array.isArray(obj)) {
    nonObj = true
  }

  return nonObj
}

function isSkippableObject(obj, { include, exclude = [] } = {}) {
  let skip = false

  if (include && obj.type && !include.includes(obj.type)) {
    skip = true
  } else if (exclude.includes(obj.type)) {
    skip = true
  }

  return skip
}

function isUnpopulatedObject(obj) {
  let unpopulated = true

  if (Object.keys(obj).length !== 2) {
    unpopulated = false
  } else if (!obj.id || !obj.type) {
    unpopulated = false
  }

  return unpopulated
}

module.exports = {
  isNonObject,
  isSkippableObject,
  isUnpopulatedObject,
}
