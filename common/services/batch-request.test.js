const proxyquire = require('proxyquire')

const mockBatchSize = 5

const batchRequest = proxyquire('./batch-request', {
  '../../config': {
    LOCATIONS_BATCH_SIZE: mockBatchSize,
  },
})

describe('Batching requests', function () {
  let clientMethodCallStub
  let props
  let propPaths
  let items

  beforeEach(function () {
    props = {
      apiClient: {},
      filter: {
        'filter[foo]': '1,2,3,4,5,6,7,8,9,10',
        'filter[bar]': 'I,II,III,IV,V,VI,VII,VIII,IX,X',
      },
    }
    propPaths = []
    clientMethodCallStub = sinon.stub().resolves(['a'])
  })

  describe('when called with no matching props', async function () {
    describe('and asking for items', async function () {
      beforeEach(async function () {
        items = await batchRequest(clientMethodCallStub, props)
      })

      it('should call the client method as is', function () {
        expect(clientMethodCallStub).to.be.calledOnceWithExactly(props)
      })

      it('should return the items', function () {
        expect(items).to.deep.equal(['a'])
      })
    })

    describe('and asking for number of items', async function () {
      beforeEach(async function () {
        props.isAggregation = true
        clientMethodCallStub.resolves(10)
        items = await batchRequest(clientMethodCallStub, props)
      })

      it('should call the client method as is', function () {
        expect(clientMethodCallStub).to.be.calledOnceWithExactly(props)
      })

      it('should return the number of items', function () {
        expect(items).to.equal(10)
      })
    })
  })

  describe('when called with a matching prop', async function () {
    beforeEach(async function () {
      propPaths = ['foo']
    })

    describe('and there are more prop params than the batch limit', async function () {
      describe('and asking for items', async function () {
        beforeEach(async function () {
          items = await batchRequest(clientMethodCallStub, props, propPaths)
        })

        it('should batch the client method correctly', function () {
          expect(clientMethodCallStub).to.be.calledTwice
          expect(clientMethodCallStub.firstCall.args).to.deep.equal([
            {
              apiClient: {},
              filter: {
                'filter[foo]': '1,2,3,4,5',
                'filter[bar]': 'I,II,III,IV,V,VI,VII,VIII,IX,X',
              },
            },
          ])
          expect(clientMethodCallStub.secondCall.args).to.deep.equal([
            {
              apiClient: {},
              filter: {
                'filter[foo]': '6,7,8,9,10',
                'filter[bar]': 'I,II,III,IV,V,VI,VII,VIII,IX,X',
              },
            },
          ])
        })

        it('should return the items', function () {
          expect(items).to.deep.equal(['a', 'a'])
        })
      })

      describe('and asking for number of items', async function () {
        beforeEach(async function () {
          props.isAggregation = true
          clientMethodCallStub.resolves(10)
          items = await batchRequest(clientMethodCallStub, props, propPaths)
        })

        it('should return the number of items', function () {
          expect(items).to.equal(20)
        })
      })
    })

    describe('and there are fewer prop params than the batch limit', async function () {
      beforeEach(async function () {
        props = {
          apiClient: {},
          filter: {
            'filter[foo]': '1,2,3,4,5',
            'filter[bar]': 'I,II,III,IV,V,VI,VII,VIII,IX,X',
          },
        }
      })

      describe('and asking for items', async function () {
        beforeEach(async function () {
          items = await batchRequest(clientMethodCallStub, props, propPaths)
        })

        it('should call the client method once', function () {
          expect(clientMethodCallStub).to.be.calledOnceWithExactly({
            apiClient: {},
            filter: {
              'filter[foo]': '1,2,3,4,5',
              'filter[bar]': 'I,II,III,IV,V,VI,VII,VIII,IX,X',
            },
          })
        })

        it('should return the items', function () {
          expect(items).to.deep.equal(['a'])
        })
      })

      describe('and asking for number of items', async function () {
        beforeEach(async function () {
          props.isAggregation = true
          clientMethodCallStub.resolves(10)
          items = await batchRequest(clientMethodCallStub, props, propPaths)
        })

        it('should return the number of items', function () {
          expect(items).to.equal(10)
        })
      })
    })
  })

  describe('when called with multiple matching prop', async function () {
    beforeEach(async function () {
      propPaths = ['bar', 'foo']
      items = await batchRequest(clientMethodCallStub, props, propPaths)
    })
    it('should only batch the client method for the first matching prop', function () {
      expect(clientMethodCallStub).to.be.calledTwice
      expect(clientMethodCallStub.firstCall.args).to.deep.equal([
        {
          apiClient: {},
          filter: {
            'filter[foo]': '1,2,3,4,5,6,7,8,9,10',
            'filter[bar]': 'I,II,III,IV,V',
          },
        },
      ])
      expect(clientMethodCallStub.secondCall.args).to.deep.equal([
        {
          apiClient: {},
          filter: {
            'filter[foo]': '1,2,3,4,5,6,7,8,9,10',
            'filter[bar]': 'VI,VII,VIII,IX,X',
          },
        },
      ])
    })
    it('should return the items', function () {
      expect(items).to.deep.equal(['a', 'a'])
    })
  })

  describe('when called with a batchable param as an array', async function () {
    beforeEach(async function () {
      props = {
        apiClient: {},
        filter: {
          'filter[foo]': ['1', '2', '3', '4', '5'],
        },
      }
      items = await batchRequest(clientMethodCallStub, props, ['foo'])
    })

    it('should call the client method with the param concatenated', function () {
      expect(clientMethodCallStub).to.be.calledOnceWithExactly({
        apiClient: {},
        filter: {
          'filter[foo]': '1,2,3,4,5',
        },
      })
    })
  })
})
