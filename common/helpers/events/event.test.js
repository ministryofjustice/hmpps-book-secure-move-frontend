const i18n = require('../../../config/i18n')

const eventHelpers = require('./event')

describe('Helpers', function () {
  describe('#event()', function () {
    const mockEvent = {
      id: 'eventId',
      event_type: 'eventType',
      details: 'details',
    }
    const mockEventWithDefaultClassification = {
      ...mockEvent,
      classification: 'default',
    }
    const mockEventWithMedicalClassification = {
      ...mockEvent,
      classification: 'medical',
    }
    const mockEventWithIncidentClassification = {
      ...mockEvent,
      classification: 'incident',
    }
    const mockEventWithCount = {
      ...mockEvent,
      _index: 3,
    }

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    describe('#getLabelClasses', function () {
      let labelClasses

      context('when event is not a triggered status change', function () {
        beforeEach(function () {
          labelClasses = eventHelpers.getLabelClasses(mockEvent)
        })

        it('should invoke i18n.exists expected number of times', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::eventType.statusChange'
          )
        })

        it('should return undefined', function () {
          expect(labelClasses).to.equal(undefined)
        })
      })

      context('when event is a triggered status change', function () {
        beforeEach(function () {
          i18n.exists.returns(true)
          labelClasses = eventHelpers.getLabelClasses(mockEvent)
        })

        it('should invoke i18n.exists expected number of times', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::eventType.statusChange'
          )
        })

        it('should return the expected label classes', function () {
          expect(labelClasses).to.equal('moj-badge')
        })
      })
    })

    describe('#getContainerClasses', function () {
      let containerClasses

      context('when event has no classification', function () {
        beforeEach(function () {
          containerClasses = eventHelpers.getContainerClasses(mockEvent)
        })

        it('should return an empty string', function () {
          expect(containerClasses).to.equal('')
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          containerClasses = eventHelpers.getContainerClasses(
            mockEventWithDefaultClassification
          )
        })

        it('should return an empty string', function () {
          expect(containerClasses).to.equal('')
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          containerClasses = eventHelpers.getContainerClasses(
            mockEventWithMedicalClassification
          )
        })

        it('should return expected classes', function () {
          expect(containerClasses).to.deep.equal('app-panel')
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          containerClasses = eventHelpers.getContainerClasses(
            mockEventWithIncidentClassification
          )
        })

        it('should return expected classes', function () {
          expect(containerClasses).to.deep.equal('app-panel')
        })
      })
    })

    describe('#getHeaderClasses', function () {
      let headerClasses

      context('when event has no classification', function () {
        beforeEach(function () {
          headerClasses = eventHelpers.getHeaderClasses(mockEvent)
        })

        it('should return an empty string', function () {
          expect(headerClasses).to.equal('')
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          headerClasses = eventHelpers.getHeaderClasses(
            mockEventWithDefaultClassification
          )
        })

        it('should return an empty string', function () {
          expect(headerClasses).to.equal('')
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          headerClasses = eventHelpers.getHeaderClasses(
            mockEventWithMedicalClassification
          )
        })

        it('should return expected classes', function () {
          expect(headerClasses).to.deep.equal('app-tag')
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          headerClasses = eventHelpers.getHeaderClasses(
            mockEventWithIncidentClassification
          )
        })

        it('should return expected classes', function () {
          expect(headerClasses).to.deep.equal('app-tag app-tag--destructive')
        })
      })
    })

    describe('#getHeading', function () {
      let heading

      context('when event has no count', function () {
        beforeEach(function () {
          heading = eventHelpers.getHeading(mockEvent)
        })

        it('should get the heading string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.heading',
            'details'
          )
        })

        it('should return the heading', function () {
          expect(heading).to.equal('events::eventType.heading')
        })
      })

      context('when event has count', function () {
        beforeEach(function () {
          heading = eventHelpers.getHeading(mockEventWithCount)
        })

        it('should get the heading string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.heading',
            'details'
          )
        })

        it('should return the heading', function () {
          expect(heading).to.equal('events::eventType.heading (3)')
        })
      })
    })

    describe('#getFlag', function () {
      let flag

      context('when event has no classification', function () {
        beforeEach(function () {
          flag = eventHelpers.getFlag(mockEvent)
        })

        it('should return undefined', function () {
          expect(flag).to.equal(undefined)
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          flag = eventHelpers.getFlag(mockEventWithDefaultClassification)
        })

        it('should return undefined', function () {
          expect(flag).to.equal(undefined)
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          flag = eventHelpers.getFlag(mockEventWithMedicalClassification)
        })

        it('should get classification string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::classification.medical'
          )
        })

        it('should return expected flag properties', function () {
          expect(flag).to.deep.equal({
            html: 'events::classification.medical',
            type: 'medical',
          })
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          flag = eventHelpers.getFlag(mockEventWithIncidentClassification)
        })

        it('should get classification string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::classification.incident'
          )
        })

        it('should return expected flag properties', function () {
          expect(flag).to.deep.equal({
            html: 'events::classification.incident',
            type: 'incident',
          })
        })
      })
    })

    describe('#getDescription', function () {
      let description

      context('when fetching the description', function () {
        beforeEach(function () {
          i18n.t.onCall(0).returns(' <br><br>description<br>more description')
          description = eventHelpers.getDescription(mockEvent)
        })

        it('should get description string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.description',
            'details'
          )
        })

        it('should strip any leading <br>s and return the description', function () {
          expect(description).to.equal('description<br>more description')
        })
      })
    })
  })
})
