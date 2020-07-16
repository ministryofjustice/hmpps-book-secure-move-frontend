const proxyquire = require('proxyquire')

const registerStub = sinon.stub()
const renderStub = sinon.stub().returnsArg(0)
const useStub = sinon.stub()

const markdown = proxyquire('./markdown', {
  'markdown-it': () => {
    return {
      render: renderStub,
      use: useStub,
    }
  },
  'nunjucks-markdown': {
    register: registerStub,
  },
})

describe('Markdown config', function () {
  afterEach(function () {
    renderStub.resetHistory()
    registerStub.resetHistory()
  })

  describe('#renderInset', function () {
    it('should render opening tags', function () {
      const response = markdown.renderInset([{ nesting: 1 }], 0)
      expect(response).to.equal('<div class="govuk-inset-text">\n')
    })

    it('should render closing tags', function () {
      const response = markdown.renderInset([{ nesting: 2 }], 0)
      expect(response).to.equal('</div>\n')
    })
  })

  describe('#renderWarning', function () {
    it('should render opening tags', function () {
      const response = markdown.renderWarning([{ nesting: 1 }], 0)
      expect(response).to.equal(
        '<div class="govuk-warning-text">\n<span class="govuk-warning-text__icon" aria-hidden="true">!</span>\n<strong class="govuk-warning-text__text">\n<span class="govuk-warning-text__assistive">Warning</span>\n'
      )
    })

    it('should render closing tags', function () {
      const response = markdown.renderWarning([{ nesting: 2 }], 0)
      expect(response).to.equal('</strong>\n</div>\n')
    })
  })

  describe('#render', function () {
    let output

    context('without body', function () {
      beforeEach(function () {
        output = markdown.render()
      })

      it('should call md.render method', function () {
        expect(renderStub).to.be.calledOnceWithExactly(undefined)
      })

      it('should return rendered markdown', function () {
        expect(output).to.equal()
      })
    })

    context('with body', function () {
      beforeEach(function () {
        output = markdown.render('Some markdown content')
      })

      it('should call md.render method', function () {
        expect(renderStub).to.be.calledOnceWithExactly('Some markdown content')
      })

      it('should return rendered markdown', function () {
        expect(output).to.equal('Some markdown content')
      })
    })
  })

  describe('#init', function () {
    context('without nunjucks env', function () {
      beforeEach(function () {
        markdown.init()
      })

      it('should not register nunjucks markdown', function () {
        expect(registerStub).not.to.be.called
      })
    })

    context('with nunjucks env', function () {
      const mockNunjucksEnv = {}

      beforeEach(function () {
        markdown.init(mockNunjucksEnv)
      })

      it('should register nunjucks markdown', function () {
        expect(registerStub).to.be.calledOnce
        expect(registerStub.args[0][0]).to.deep.equal(mockNunjucksEnv)
      })
    })
  })
})
