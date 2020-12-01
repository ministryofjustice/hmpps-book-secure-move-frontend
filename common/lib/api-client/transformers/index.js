const assessmentTransformer = require('./assessment.transformer')
const moveTransformer = require('./move.transformer')
const personTransformer = require('./person.transformer')
const transformResource = require('./transform-resource')

module.exports = {
  assessmentTransformer,
  personTransformer,
  moveTransformer,
  transformResource,
}
