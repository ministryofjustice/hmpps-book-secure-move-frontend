const middleware = require('./locals.identity-bar-journeys')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsIdentityBarJourneys()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          t: sinon.stub().returnsArg(0),
        }
        res = {
          locals: { identityBar: {} },
        }
        nextSpy = sinon.spy()
      })

      context(
        'when there are journeys and the move is not locked out and the journey dates are not the same as the move date',
        function () {
          beforeEach(function () {
            req.move = {
              id: '12345',
              reference: 'AB1234XY',
              date: '2020-10-07',
              status: 'requested',
              is_lockout: false,
              profile: {
                person: {
                  _fullname: 'DOE, JOHN',
                },
              },
              from_location: {
                title: 'Guildford Custody Suite',
              },
              to_location: {
                title: 'HMP Brixton',
              },
              foo: 'bar',
            }

            req.journeys = [
              {
                id: '544328e8-677a-4318-a59f-6f7d421d2cc2',
                type: 'journeys',
                state: 'completed',
                billable: true,
                vehicle: { id: '8619', fake: true, registration: 'QRD-6' },
                date: '2021-01-13',
                number: 1,
                timestamp: '2021-01-11T09:00:00+00:00',
                from_location: {
                  id: '54b75c66-61dd-440e-be3d-b3c58c90be1d',
                  type: 'locations',
                  key: 'wyi',
                  title: 'WETHERBY (HMPYOI)',
                  location_type: 'prison',
                  nomis_agency_id: 'WYI',
                  can_upload_documents: false,
                  young_offender_institution: true,
                  premise: 'IlHchsRIlHchsR',
                  locality: null,
                  city: 'Wetherby',
                  country: 'England',
                  postcode: 'UO11 5VE',
                  latitude: 53.935249,
                  longitude: -1.36782,
                  disabled_at: null,
                },
                to_location: {
                  id: '496795c5-a6ca-4c80-b2cd-908ccd922fd3',
                  type: 'locations',
                  key: 'dcp009',
                  title: 'Exeter Probation Office',
                  location_type: 'probation_office',
                  nomis_agency_id: 'DCP009',
                  can_upload_documents: false,
                  young_offender_institution: false,
                  premise: null,
                  locality: null,
                  city: null,
                  country: null,
                  postcode: 'EX1 1RD',
                  latitude: 50.72293,
                  longitude: -3.524391,
                  disabled_at: null,
                },
              },
            ]

            middleware(req, res, nextSpy)
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })

          it('will show the journeys,', function () {
            expect(res.locals.identityBar.journeys).to.deep.equal([
              {
                context: undefined,
                date: '13 Jan 2021',
                fromLocation: 'WETHERBY (HMPYOI)',
                toLocation: 'Exeter Probation Office',
              },
            ])
          })
        }
      )

      context(
        'when there are journeys and the move is locked out',
        function () {
          beforeEach(function () {
            req.move = {
              id: '12345',
              reference: 'AB1234XY',
              date: '2020-10-07',
              status: 'requested',
              is_lockout: true,
              profile: {
                person: {
                  _fullname: 'DOE, JOHN',
                },
              },
              from_location: {
                title: 'Guildford Custody Suite',
              },
              to_location: {
                title: 'HMP Brixton',
              },
              foo: 'bar',
            }

            req.journeys = [
              {
                id: '544328e8-677a-4318-a59f-6f7d421d2cc2',
                type: 'journeys',
                state: 'completed',
                billable: true,
                vehicle: { id: '8619', fake: true, registration: 'QRD-6' },
                date: '2020-10-07',
                number: 1,
                timestamp: '2021-01-11T09:00:00+00:00',
                from_location: {
                  id: '54b75c66-61dd-440e-be3d-b3c58c90be1d',
                  type: 'locations',
                  key: 'wyi',
                  title: 'WETHERBY (HMPYOI)',
                  location_type: 'prison',
                  nomis_agency_id: 'WYI',
                  can_upload_documents: false,
                  young_offender_institution: true,
                  premise: 'IlHchsRIlHchsR',
                  locality: null,
                  city: 'Wetherby',
                  country: 'England',
                  postcode: 'UO11 5VE',
                  latitude: 53.935249,
                  longitude: -1.36782,
                  disabled_at: null,
                },
                to_location: {
                  id: '496795c5-a6ca-4c80-b2cd-908ccd922fd3',
                  type: 'locations',
                  key: 'dcp009',
                  title: 'Exeter Probation Office',
                  location_type: 'probation_office',
                  nomis_agency_id: 'DCP009',
                  can_upload_documents: false,
                  young_offender_institution: false,
                  premise: null,
                  locality: null,
                  city: null,
                  country: null,
                  postcode: 'EX1 1RD',
                  latitude: 50.72293,
                  longitude: -3.524391,
                  disabled_at: null,
                },
              },
            ]

            middleware(req, res, nextSpy)
          })

          it('will show the move from/to locations,', function () {
            expect(res.locals.identityBar.journeys).to.deep.equal([
              {
                date: '7 Oct 2020',
                fromLocation: 'Guildford Custody Suite',
                toLocation: '(awaiting destination)',
              },
              {
                date: '(awaiting date)',
                fromLocation: '(awaiting location)',
                toLocation: 'HMP Brixton',
              },
            ])
          })
        }
      )

      context(
        'when there are journeys and the move is not locked out and the move date is the same as the journey dates',
        function () {
          beforeEach(function () {
            req.move = {
              id: '12345',
              reference: 'AB1234XY',
              date: '2020-10-07',
              status: 'requested',
              is_lockout: false,
              profile: {
                person: {
                  _fullname: 'DOE, JOHN',
                },
              },
              from_location: {
                title: 'Guildford Custody Suite',
              },
              to_location: {
                title: 'HMP Brixton',
              },
              foo: 'bar',
            }

            req.journeys = [
              {
                id: '544328e8-677a-4318-a59f-6f7d421d2cc2',
                type: 'journeys',
                state: 'completed',
                billable: true,
                vehicle: { id: '8619', fake: true, registration: 'QRD-6' },
                date: '2020-10-07',
                number: 1,
                timestamp: '2021-01-11T09:00:00+00:00',
                from_location: {
                  id: '54b75c66-61dd-440e-be3d-b3c58c90be1d',
                  type: 'locations',
                  key: 'wyi',
                  title: 'WETHERBY (HMPYOI)',
                  location_type: 'prison',
                  nomis_agency_id: 'WYI',
                  can_upload_documents: false,
                  young_offender_institution: true,
                  premise: 'IlHchsRIlHchsR',
                  locality: null,
                  city: 'Wetherby',
                  country: 'England',
                  postcode: 'UO11 5VE',
                  latitude: 53.935249,
                  longitude: -1.36782,
                  disabled_at: null,
                },
                to_location: {
                  id: '496795c5-a6ca-4c80-b2cd-908ccd922fd3',
                  type: 'locations',
                  key: 'dcp009',
                  title: 'Exeter Probation Office',
                  location_type: 'probation_office',
                  nomis_agency_id: 'DCP009',
                  can_upload_documents: false,
                  young_offender_institution: false,
                  premise: null,
                  locality: null,
                  city: null,
                  country: null,
                  postcode: 'EX1 1RD',
                  latitude: 50.72293,
                  longitude: -3.524391,
                  disabled_at: null,
                },
              },
            ]

            middleware(req, res, nextSpy)
          })

          it('will show the move from/to locations,', function () {
            expect(res.locals.identityBar.journeys).to.deep.equal([
              {
                context: 'requested',
                date: '7 Oct 2020',
                fromLocation: 'Guildford Custody Suite',
                toLocation: 'HMP Brixton',
              },
            ])
          })
        }
      )

      context('move and journey are empty', function () {
        beforeEach(function () {
          req.move = null
          req.journeys = null

          middleware(req, res, nextSpy)
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
