const eventToTimelinePanel = require('./event-to-timeline-panel')

describe('Presenters', function () {
  describe('#eventToTimelinePanel()', function () {
    const event = {
      id: 'event',
      classification: 'incident',
      event_type: 'eventType',
      occurred_at: '2020-01-01T10:00:00Z',
      supplier: '12341-12312132',
    }

    const move = { id: 'move' }

    let timelinePanel
    beforeEach(async function () {
      timelinePanel = await eventToTimelinePanel('token', event, move)
    })

    it('should return tag for the event', function () {
      expect(timelinePanel.tag).to.deep.equal({
        classes: 'app-tag app-tag--destructive',
        flag: {
          html: 'Serious incident',
          type: 'incident',
        },
        html: 'eventType.heading',
        id: 'event',
      })
    })

    it('should return html for the event', function () {
      expect(timelinePanel.html).to.equal(
        `<table class="govuk-table"><tbody class="govuk-table__body"><div class="app-timeline__description">eventType.description</div></tbody></table><p><time datetime="{{ formattedDate }}" class="app-timeline__date govuk-!-width-full">10:00 on Wednesday 1 Jan 2020</time></p>`
      )
    })

    it('should return attributes for the event', function () {
      expect(timelinePanel.attributes).to.deep.equal({ id: 'event' })
    })

    it('should return isFocusable for the event', function () {
      expect(timelinePanel.isFocusable).to.be.true
    })
  })

  describe('#eventToTimelinePanel() with a PerSuicideAndSelfHarm event', function () {
    const move = { id: 'move' }

    const baseDetails = {
      source: { option: 'Self-reported' },
      nature_of_self_harm: [{ option: 'Cutting', details: 'Left arm' }],
      history_of_self_harm_recency: '2020-01-01',
      history_of_self_harm_method: ['Cutting'],
      history_of_self_harm_details: 'Used a blade',
      actions_of_self_harm_undertaken: [{ option: 'Referral made' }],
      observation_level: { option: '15 minute checks' },
      comments: 'Some comments',
      reporting_officer: 'Officer A',
      reporting_officer_signed_at: '2020-01-01T10:00:00Z',
      reception_officer: 'Officer B',
      reception_officer_signed_at: '2020-01-01T11:00:00Z',
    }

    const buildEvent = overrides => ({
      id: 'event',
      classification: 'suicide_and_self_harm',
      event_type: 'PerSuicideAndSelfHarm',
      occurred_at: '2020-01-01T10:00:00Z',
      supplier: '12341-12312132',
      details: { ...baseDetails, ...overrides },
    })

    context('when all fields are present', function () {
      let html

      beforeEach(async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent(),
          move
        )
        html = timelinePanel.html
      })

      it('renders the Source row', function () {
        expect(html).to.include(
          '<th scope="row" class="govuk-table__header"><h4 class="govuk-heading-s govuk-!-font-size-16">Source</h4></th>'
        )
        expect(html).to.include('Self-reported')
      })

      it('renders the Concern row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Concern</h4>'
        )
        expect(html).to.include('Cutting - Left arm')
      })

      it('renders the History row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">History</h4>'
        )
        expect(html).to.include(
          '<time class="govuk-!-font-size-16" datetime="2020-01-01">2020-01-01</time>'
        )
      })

      it('renders the Method row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Method</h4>'
        )
        expect(html).to.include('Cutting - Used a blade')
      })

      it('renders the Safety actions row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Safety actions</h4>'
        )
        expect(html).to.include('Referral made')
      })

      it('renders the Observation level row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Observation level</h4>'
        )
        expect(html).to.include('15 minute checks')
      })

      it('renders the Comments row', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Comments</h4>'
        )
        expect(html).to.include('Some comments')
      })

      it('renders the Reporting officer rows', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Reporting officer</h4>'
        )
        expect(html).to.include('Officer A')
        expect(html).to.include('1 January 2020 at 10:00')
      })

      it('renders the Reception officer rows', function () {
        expect(html).to.include(
          '<h4 class="govuk-heading-s govuk-!-font-size-16">Reception officer</h4>'
        )
        expect(html).to.include('Officer B')
        expect(html).to.include('1 January 2020 at 11:00')
      })
    })

    context('when source has no option', function () {
      ;[undefined, {}, { comments: 'no option here' }].forEach(value => {
        context(`source: ${JSON.stringify(value)}`, function () {
          it('does not render the Source row', async function () {
            const timelinePanel = await eventToTimelinePanel(
              'token',
              buildEvent({ source: value }),
              move
            )

            expect(timelinePanel.html).to.not.include('>Source<')
          })
        })
      })
    })

    context('when nature_of_self_harm is a single object (not an array)', function () {
      it('renders the Concern row from the single object', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({
            nature_of_self_harm: { option: 'Ligature' },
          }),
          move
        )

        expect(timelinePanel.html).to.include('>Ligature</p>')
      })
    })

    context(
      'when nature_of_self_harm contains entries without an option',
      function () {
        it('filters out entries missing an option', async function () {
          const timelinePanel = await eventToTimelinePanel(
            'token',
            buildEvent({
              nature_of_self_harm: [
                { option: 'Cutting', details: 'Left arm' },
                { details: 'no option, should be dropped' },
                undefined,
              ],
            }),
            move
          )

          expect(timelinePanel.html).to.include('Cutting - Left arm')
          expect(timelinePanel.html).to.not.include(
            'no option, should be dropped'
          )
        })
      }
    )

    context('when nature_of_self_harm is missing entirely', function () {
      it('does not render the Concern row', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({ nature_of_self_harm: undefined }),
          move
        )

        expect(timelinePanel.html).to.not.include('>Concern<')
      })
    })

    context('when history_of_self_harm_recency is missing', function () {
      it('does not render the History row', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({ history_of_self_harm_recency: undefined }),
          move
        )

        expect(timelinePanel.html).to.not.include('>History<')
      })
    })

    context(
      'when history_of_self_harm_method or history_of_self_harm_details is missing',
      function () {
        ;[
          { history_of_self_harm_method: undefined },
          { history_of_self_harm_details: undefined },
        ].forEach(overrides => {
          context(`missing field: ${Object.keys(overrides).join(', ')}`, function () {
            it('does not render the Method row', async function () {
              const timelinePanel = await eventToTimelinePanel(
                'token',
                buildEvent(overrides),
                move
              )

              expect(timelinePanel.html).to.not.include('>Method<')
            })
          })
        })
      }
    )

    context(
      'when actions_of_self_harm_undertaken contains entries without an option',
      function () {
        it('filters out entries missing an option', async function () {
          const timelinePanel = await eventToTimelinePanel(
            'token',
            buildEvent({
              actions_of_self_harm_undertaken: [
                { option: 'Referral made' },
                { details: 'no option, should be dropped' },
              ],
            }),
            move
          )

          expect(timelinePanel.html).to.include('Referral made')
          expect(timelinePanel.html).to.not.include(
            'no option, should be dropped'
          )
        })
      }
    )

    context('when actions_of_self_harm_undertaken is missing entirely', function () {
      it('does not render the Safety actions row', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({ actions_of_self_harm_undertaken: undefined }),
          move
        )

        expect(timelinePanel.html).to.not.include('>Safety actions<')
      })
    })

    context('when observation_level has no option', function () {
      it('does not render the Observation level row', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({ observation_level: {} }),
          move
        )

        expect(timelinePanel.html).to.not.include('>Observation level<')
      })
    })

    context('when observation_level has no details', function () {
      it('renders the option without a trailing dash', async function () {
        const timelinePanel = await eventToTimelinePanel(
          'token',
          buildEvent({ observation_level: { option: 'Constant watch' } }),
          move
        )

        expect(timelinePanel.html).to.include('Constant watch</p>')
        expect(timelinePanel.html).to.not.include('Constant watch -')
      })
    })
  })
})
