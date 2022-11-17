import { Move } from '../../types/move'

// assessmentType: 'person_escort_record' | 'youth_risk_assessment',
export function canEditAssessment(
  move: Move,
  canAccess: (permission: string) => boolean = () => false
) {
  const assessmentType =
    move.profile?.requires_youth_risk_assessment &&
    move.profile?.youth_risk_assessment?.status !== 'confirmed'
      ? 'youth_risk_assessment'
      : 'person_escort_record'
  const assessment = move.profile?.[assessmentType]

  return canAccess(`${assessmentType}:${assessment ? 'update' : 'create'}`)
}
