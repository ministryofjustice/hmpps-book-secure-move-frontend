import { mapValues } from 'lodash'

// @ts-ignore / TODO: convert to TS and remove this ignore
import mapItemToSection from '../../../helpers/frameworks/map-item-to-section'
// @ts-ignore / TODO: convert to TS and remove this ignore
import mapQuestionToResponse from '../../../helpers/frameworks/map-question-to-response'
// @ts-ignore / TODO: convert to TS and remove this ignore
import frameworksService from '../../../services/frameworks'
import { Assessment } from '../../../types/assessment'

export function assessmentTransformer(assessment: Assessment) {
  const { name: frameworkName, version: frameworkVersion } =
    assessment.framework || {}

  if (frameworkName && frameworkVersion) {
    const framework = frameworksService.getFramework({
      framework: frameworkName,
      version: frameworkVersion,
    })

    assessment.responses = assessment.responses?.map(
      mapQuestionToResponse(framework)
    )

    framework.sections = mapValues(
      framework.sections,
      mapItemToSection(assessment)
    )

    assessment._framework = framework
  }
}
