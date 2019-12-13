const documentsToMetaListComponent = require('./documents-to-meta-list-component')

const mockApiDocumentResult = [
  {
    id: 'b8089bf8-fc36-4449-9578-ee59549c7974',
    type: 'documents',
    url: 'http://mock-url/green-plant.jpg',
    filename: 'green-plant.jpg',
    filesize: '64 KB',
    content_type: 'image/jpeg',
  },
  {
    id: '2dfda831-5fdb-46d1-8eb4-a28d5502671f',
    type: 'documents',
    url: 'http://mock-url/green-and-white-leaves.jpeg',
    filename: 'green-and-white-leaves.jpeg',
    filesize: '290 KB',
    content_type: 'image/jpeg',
  },
]

describe('Presenters', function() {
  describe('#documentsToMetaListComponent()', function() {
    context('when provided with a mock document array', function() {
      let documentResult,
        firstDocument,
        secondDocument,
        expectedResultOne,
        expectedResultTwo

      beforeEach(function() {
        documentResult = documentsToMetaListComponent(mockApiDocumentResult)
        firstDocument = documentResult[0]
        secondDocument = documentResult[1]
        expectedResultOne = mockApiDocumentResult[0]
        expectedResultTwo = mockApiDocumentResult[1]
      })

      it('should return expected amount of documents', function() {
        expect(documentResult.length).to.equal(2)
      })

      context('first document list data', function() {
        it('should return expected data format', function() {
          expect(firstDocument).to.have.property('value')
          expect(firstDocument.value).to.have.property('html')
        })

        it('anchor markup should contain correct href attribute', function() {
          expect(firstDocument.value.html).to.contain(expectedResultOne.url)
        })

        it('anchor markup should contain correct text ', function() {
          expect(firstDocument.value.html).to.contain(
            expectedResultOne.filename
          )
        })

        it('markup should contain correct meta data', function() {
          expect(firstDocument.value.html).to.contain(
            expectedResultOne.filesize
          )
        })

        it('anchor markup should contain correct aria-labelledby attribute', function() {
          expect(firstDocument.value.html).to.contain('external-link-label-0')
        })

        it('anchor markup should contain correct target attribute', function() {
          expect(firstDocument.value.html).to.contain('_blank')
        })

        it('markup should contain correct hint text', function() {
          expect(firstDocument.value.html).to.contain('(Opens in a new window)')
        })
      })

      context('second document list data', function() {
        it('should return expected data format', function() {
          expect(secondDocument).to.have.property('value')
          expect(secondDocument.value).to.have.property('html')
        })

        it('anchor markup should contain correct href attribute', function() {
          expect(secondDocument.value.html).to.contain(expectedResultTwo.url)
        })

        it('anchor markup should contain correct text ', function() {
          expect(secondDocument.value.html).to.contain(
            expectedResultTwo.filename
          )
        })

        it('markup should contain correct meta data', function() {
          expect(secondDocument.value.html).to.contain(
            expectedResultTwo.filesize
          )
        })

        it('anchor markup should contain correct aria-labelledby attribute', function() {
          expect(secondDocument.value.html).to.contain('external-link-label-1')
        })

        it('anchor markup should contain correct target attribute', function() {
          expect(secondDocument.value.html).to.contain('_blank')
        })

        it('markup should contain correct hint text', function() {
          expect(secondDocument.value.html).to.contain(
            '(Opens in a new window)'
          )
        })
      })
    })
  })
})
