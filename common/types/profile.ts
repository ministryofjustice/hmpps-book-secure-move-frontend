import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'
import { YouthRiskAssessment } from './youth-risk-assessment'

export interface Profile {
  id: string
  person: Person
  person_escort_record?: PersonEscortRecord
  youth_risk_assessment?: YouthRiskAssessment
  assessment_answers?: any
  requires_youth_risk_assessment?: boolean
}
