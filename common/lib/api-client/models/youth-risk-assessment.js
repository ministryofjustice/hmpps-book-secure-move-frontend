const { transformResource, assessmentTransformer } = require('../transformers')

module.exports = {
  fields: {
    status: '',
    created_at: '',
    confirmed_at: '',
    version: '',
    move: {
      jsonApi: 'hasOne',
      type: 'moves',
    },
    profile: {
      jsonApi: 'hasOne',
      type: 'profiles',
    },
    framework: {
      jsonApi: 'hasOne',
      type: 'frameworks',
    },
    responses: {
      jsonApi: 'hasMany',
      type: 'framework_responses',
    },
    flags: {
      jsonApi: 'hasMany',
      type: 'framework_flags',
    },
    prefill_source: {
      jsonApi: 'hasOne',
      type: 'youth_risk_assessments',
    },
  },
  options: {
    defaultInclude: [
      'profile',
      'profile.person',
      'framework',
      'responses',
      'responses.question',
      'responses.question.descendants.**',
      'responses.nomis_mappings',
      'flags',
      'prefill_source',
      'move',
    ],
    deserializer: transformResource(assessmentTransformer),
  },
}
