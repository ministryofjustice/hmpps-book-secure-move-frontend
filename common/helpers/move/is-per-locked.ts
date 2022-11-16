import { Move } from '../../types/move'

export function isPerLocked(move: Move): boolean {
  const assessmentType =
    move.profile?.requires_youth_risk_assessment &&
    move.profile?.youth_risk_assessment?.status !== 'confirmed'
      ? 'youth_risk_assessment'
      : 'person_escort_record'
  const assessment = move.profile?.[assessmentType]

  return !!(
    !['requested', 'booked', 'proposed'].includes(move.status) ||
    (assessment &&
      (assessment.status === 'confirmed' || move.status === 'cancelled'))
  )
}
