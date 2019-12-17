const axios = require('axios')
const FormData = require('form-data')

const {
  dragAndDropAvailable,
  formDataAvailable,
  fileApiAvailable,
} = require('../../../common/assets/javascripts/utils')

function MultiFileUpload(params = {}) {
  this.defaultParams = {
    uploadStatusText: 'Uploading files, please wait',
    dropZoneHintText: 'Drag and drop files here or',
    dropZoneButtonText: 'Choose files',
    successMessageText: 'File Uploaded!',
  }

  this.params = Object.assign(this.defaultParams, params)
}

MultiFileUpload.prototype = {
  init() {
    if (
      !dragAndDropAvailable() &&
      !formDataAvailable() &&
      !fileApiAvailable()
    ) {
      return
    }

    this.$uploadList = this.params.container.querySelector('.js-upload-list')
    this.$errorSummary = document.querySelector('.js-error-summary')
    this.$errorSummaryList = this.$errorSummary.querySelector(
      '.govuk-error-summary__list'
    )
    this.$fileFormGroup = this.params.container.querySelector(
      '.js-file-form-group'
    )
    this.$htmlTitle = document.querySelector('title')

    this.buildDropZone()
    this.setupFileInput()
    this.setupDeleteButtonEvent()
    this.setupUploadMessages()
  },

  buildDropZone() {
    const $fileInput = this.params.container.querySelector(
      '.js-upload-file-input'
    )

    const $clonedFileInput = $fileInput.cloneNode(true)
    $clonedFileInput.classList.add('app-multi-file-upload__dropzone-file')

    const $dropZone = document.createElement('div')
    $dropZone.classList.add(
      'app-multi-file-upload__dropzone',
      'js-upload-dropzone'
    )
    $dropZone.setAttribute('draggable', 'true')
    $dropZone.appendChild($clonedFileInput)

    $fileInput.parentElement.replaceChild($dropZone, $fileInput)

    $dropZone.addEventListener('dragenter', this.onDragOver.bind(this), false)
    $dropZone.addEventListener('dragover', this.onDragOver.bind(this), false)
    $dropZone.addEventListener('dragleave', this.onDragLeave.bind(this), false)
    $dropZone.addEventListener('drop', this.onDrop.bind(this), false)

    this.$dropzone = document.querySelector('.js-upload-dropzone')
    this.$fileInput = document.querySelector('.js-upload-file-input')

    this.buildDropZoneLabel()
  },

  buildDropZoneLabel() {
    const $label = document.createElement('label')
    $label.classList.add(
      'govuk-button',
      'govuk-button--secondary',
      'govuk-!-margin-bottom-0',
      'app-multi-file-upload__dropzone-label',
      'js-upload-label'
    )
    $label.setAttribute('for', this.$fileInput.id)
    $label.setAttribute('tabindex', '0')
    $label.innerText = this.params.dropZoneButtonText

    const hintText = document.createTextNode(this.params.dropZoneHintText)
    const $dropZoneHint = document.createElement('p')

    $dropZoneHint.classList.add(
      'govuk-body',
      'app-multi-file-upload__dropzone-hint',
      'js-upload-dropzone-hint'
    )
    $dropZoneHint.appendChild($label)
    $dropZoneHint.insertBefore(hintText, $label)

    this.$dropzone.appendChild($dropZoneHint)

    this.setupLabelEvents()
    this.setupAriaStatus()
  },

  setupLabelEvents() {
    const $label = document.querySelector('.js-upload-label')
    $label.addEventListener(
      'keypress',
      event => this.onLabelClick(event),
      false
    )
  },

  setupUploadMessages() {
    this.successMessage = `
     <span class="app-multi-file-upload-message app-multi-file-upload-message__success">
       <span class="app-icon app-icon--tick"></span>
       ${this.params.successMessageText}
     </span>`.trim()
  },

  onLabelClick(event) {
    event.preventDefault()

    if (event.keyCode === 32) {
      event.target.click()
    }
  },

  setupAriaStatus() {
    const $status = document.createElement('div')
    $status.setAttribute('aria-live', 'polite')
    $status.setAttribute('role', 'status')
    $status.classList.add('govuk-visually-hidden', 'js-upload-status')

    this.$dropzone.appendChild($status)
    this.$status = document.querySelector('.js-upload-status')
  },

  onDragOver(event) {
    event.preventDefault()
    event.stopPropagation()

    this.$dropzone.classList.add('app-multi-file-upload__dropzone--dragover')
  },

  onDragLeave() {
    this.$dropzone.classList.remove('app-multi-file-upload__dropzone--dragover')
  },

  onDrop(event) {
    event.preventDefault()
    event.stopPropagation()

    this.$dropzone.classList.remove('app-multi-file-upload__dropzone--dragover')
    this.$status.innerText = this.params.uploadStatusText
    this.uploadFiles(event.dataTransfer.files)
  },

  setupFileInput: function() {
    this.$fileInput.addEventListener(
      'change',
      event => this.onFileChange(event),
      false
    )

    this.$fileInput.value = ''
  },

  onFileChange: function(event) {
    this.$status.innerText = this.params.uploadStatusText
    this.uploadFiles(event.currentTarget.files)

    this.$fileInput.focus()
  },

  setupDeleteButtonEvent() {
    this.$uploadList.addEventListener(
      'click',
      event => {
        if (event.target.matches('.js-upload-delete')) {
          this.onFileDeleteClick(event)
        }
      },
      false
    )
  },

  uploadFiles(files) {
    Array.prototype.forEach.call(files, file => this.uploadFile(file))
  },

  buildFileRowHtml(document) {
    return `
      <div class="govuk-summary-list__row app-row js-upload-row">
        <dt class="govuk-summary-list__key govuk-!-width-one-half app-row__key">
          ${document.name}
        </dt>
        <dd class="govuk-summary-list__value app-row__value js-upload-message">
          <span class="app-multi-file-upload__progress-bar js-upload-progress-bar"></span>
          <span class="app-multi-file-upload__progress-number js-upload-progress-number">0%</span>
        </dd>      
        <dd class="govuk-summary-list__actions app-row__actions js-upload-actions"></dd>
      </div>`.trim()
  },

  buildDeleteButton(fileId, originalFileName) {
    const $button = document.createElement('button')
    const $buttonText = document.createTextNode('Delete')

    $button.classList.add(
      'govuk-button',
      'govuk-button--secondary',
      'govuk-!-margin-bottom-0',
      'js-upload-delete'
    )
    $button.type = 'button'
    $button.name = 'delete'
    $button.value = fileId

    const $span = document.createElement('span')
    $span.className = 'govuk-visually-hidden'
    $span.innerText = originalFileName

    $button.appendChild($span)
    $button.insertBefore($buttonText, $span)

    return $button
  },

  uploadFile(file) {
    const xhrUrl = this.params.container.getAttribute('data-xhr-url')
    const xsrfToken = document.querySelector('input[name="x-csrf-token"]')
    const formData = new FormData()

    this.resetErrors()

    formData.append('file', file)
    formData.append('x-csrf-token', xsrfToken.value)

    const $tmpDiv = document.createElement('div')
    $tmpDiv.innerHTML = this.buildFileRowHtml(file)

    const $fileUploadRow = $tmpDiv.firstElementChild
    this.$uploadList.appendChild($fileUploadRow)

    const $fileUploadRowMessage = $fileUploadRow.querySelector(
      '.js-upload-message'
    )

    axios
      .post(xhrUrl, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
        },
        onUploadProgress: function(event) {
          if (event.lengthComputable) {
            const $progressNumberElem = $fileUploadRow.querySelector(
              '.js-upload-progress-number'
            )
            const $progressBarElem = $fileUploadRow.querySelector(
              '.js-upload-progress-bar'
            )
            const percentComplete = parseInt(
              (event.loaded / event.total) * 100,
              10
            )

            $progressBarElem.style.width = `${percentComplete}px`
            $progressNumberElem.innerText = ` ${percentComplete}%`
          }
        },
      })
      .then(response => {
        const [documentDetail] = response.data
        $fileUploadRowMessage.innerHTML = this.successMessage
        this.$status.innerText = this.params.successMessageText

        const $uploadActions = $fileUploadRow.querySelector(
          '.js-upload-actions'
        )

        $uploadActions.appendChild(
          this.buildDeleteButton(
            documentDetail.id,
            documentDetail.attributes.filename
          )
        )
      })
      .catch(errors => this.renderErrors(errors, $fileUploadRow))
  },

  renderErrors(errors, $fileUploadRow = null) {
    this.$htmlTitle.textContent = `Error: ${this.$htmlTitle.textContent}`

    this.$errorSummary.classList.remove('app-hidden')
    this.$errorSummaryList.innerHTML = ''

    if ($fileUploadRow) {
      this.$uploadList.removeChild($fileUploadRow)
    }
    this.$fileFormGroup.classList.add('govuk-form-group--error')

    const errorData = (errors.response && errors.response.data) || []

    if (errorData.length === 0) {
      errorData.push({
        text: 'Something went wrong',
        href: '#document_upload',
      })
    }

    errorData.forEach(error => {
      const $errorListItem = document.createElement('li')

      const $anchor = document.createElement('a')

      $anchor.href = error.href
      $anchor.textContent = error.text
      $errorListItem.appendChild($anchor)

      this.$errorSummaryList.appendChild($errorListItem)

      if (!document.getElementById('file-error')) {
        const $inlineError = document.createElement('span')
        $inlineError.id = 'file-error'
        $inlineError.classList.add(
          'govuk-error-message',
          'js-file-inline-error'
        )
        $inlineError.innerHTML = `<span class="govuk-visually-hidden">Error:</span> ${error.text}`

        this.$dropzone.parentNode.insertBefore($inlineError, this.$dropzone)
      }
    })
  },

  resetErrors() {
    this.$htmlTitle.textContent = this.$htmlTitle.textContent.replace(
      /^Error:\s+/,
      ''
    )
    this.$errorSummary.classList.add('app-hidden')
    this.$errorSummaryList.innerHTML = ''
    this.$fileFormGroup.classList.remove('govuk-form-group--error')

    const $inlineError = document.querySelector('.js-file-inline-error')

    if ($inlineError) {
      $inlineError.parentNode.removeChild($inlineError)
    }
  },

  onFileDeleteClick(event) {
    event.preventDefault()

    this.resetErrors()

    const $button = event.target
    const $fileUploadRow = $button.closest('.js-upload-row')
    const xhrUrl = this.params.container.getAttribute('data-xhr-url')
    const xhrDeleteUrl = `${xhrUrl}?document_id=${$button.value}`
    const xsrfToken = document.querySelector('input[name="x-csrf-token"]').value

    axios
      .delete(xhrDeleteUrl, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'x-csrf-token': xsrfToken,
        },
      })
      .then(() => this.$uploadList.removeChild($fileUploadRow))
      .catch(errors => this.renderErrors(errors))
  },
}

module.exports = MultiFileUpload
