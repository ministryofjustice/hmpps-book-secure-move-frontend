export interface Location {
  key: string
  title: string
  id: string
  type: 'locations'
  location_type:
    | 'court'
    | 'police'
    | 'prison'
    | 'secure_training_centre'
    | 'secure_childrens_home'
    | 'approved_premises'
    | 'probation_office'
    | 'community_rehabilitation_company'
    | 'foreign_national_prison'
    | 'voluntary_hostel'
    | 'high_security_hospital'
    | 'hospital'
    | 'immigration_detention_centre'
}
