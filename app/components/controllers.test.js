const controllers = require('./controllers')

const mockComponents = [
  {
    name: 'mock-component-one',
  },
  {
    name: 'mock-component-two',
  },
]
const mockComponent = {
  name: 'mock-component-one',
  config: {
    examples: [
      {
        name: 'example one',
      },
      {
        name: 'example two',
      },
    ],
  },
}

describe('Components controllers', function () {
  let resMock, reqMock

  beforeEach(function () {
    resMock = {
      render: sinon.stub(),
    }
    reqMock = {}
  })

  describe('#renderComponent()', function () {
    beforeEach(function () {
      reqMock = {
        components: mockComponents,
        component: mockComponent,
        activeComponent: 'active',
      }
      controllers.renderComponent(reqMock, resMock)
    })

    it('should call template', function () {
      expect(resMock.render.args[0][0]).to.equal('components/views/component')
    })

    it('should set locals', function () {
      expect(resMock.render.args[0][1]).to.deep.equal({
        components: reqMock.components,
        component: reqMock.component,
        activeComponent: 'active',
      })
    })
  })

  describe('#renderRawExample()', function () {
    beforeEach(function () {
      reqMock = {
        components: mockComponents,
        component: mockComponent,
        activeComponent: 'active',
        params: {
          example: 'example one',
        },
      }
      controllers.renderRawExample(reqMock, resMock)
    })

    it('should call template', function () {
      expect(resMock.render.args[0][0]).to.equal('components/views/example')
    })

    it('should set locals', function () {
      expect(resMock.render.args[0][1]).to.deep.equal({
        component: reqMock.component,
        example: {
          name: 'example one',
        },
      })
    })
  })

  describe('#renderList()', function () {
    beforeEach(function () {
      reqMock = {
        components: mockComponents,
      }
      controllers.renderList(reqMock, resMock)
    })

    it('should call template', function () {
      expect(resMock.render.args[0][0]).to.equal('components/views/list')
    })

    it('should set locals', function () {
      expect(resMock.render.args[0][1]).to.deep.equal({
        components: reqMock.components,
      })
    })
  })
})
