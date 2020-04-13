const axios = require('axios')
const Dropzone = require('dropzone')

const {
  dragAndDropAvailable,
  formDataAvailable,
  fileApiAvailable,
} = require('../../../common/assets/javascripts/utils')

function MultiFileUpload($module) {
  this.$module = $module

  this.defaultParams = {
    clickable: '[data-dz-clickable]',
    createImageThumbnails: false,
    parallelUploads: 1,
    paramName: this.$module.querySelector('input[type="file"]').name,
    previewsContainer: '[data-dz-previews-container]',
    url: this.$module.getAttribute('data-url'),
  }

  this.params = this.defaultParams
}

MultiFileUpload.prototype = {
  bindEvents() {
    this.$module.addEventListener('click', this.onDeleteClickHandler.bind(this))
    this.$module.addEventListener('change', this.onChangeHandler.bind(this))
  },

  cacheEls: function() {
    this.$previewNode = this.$module.querySelector('[data-dz-preview-template]')
    this.$previewNode.classList.remove('app-hidden')
    this.$previewNode.removeAttribute('data-dz-preview-template')
    this.$dropzone = this.$module.querySelector('[data-dz-dropzone]')
    this.previewTemplate = this.$previewNode.outerHTML
    this.xrsfToken = document.querySelector('input[name="x-csrf-token"]').value
  },

  createDropzone() {
    this.dropzone = new Dropzone(this.$dropzone, {
      ...this.params,
      params: {
        'x-csrf-token': this.xrsfToken,
      },
      previewTemplate: this.previewTemplate,
    })

    this.dropzone.on('addedfile', this.render.bind(this))
    this.dropzone.on('removedfile', this.removedFile.bind(this))
    this.dropzone.on('uploadprogress', this.uploadProgress.bind(this))
  },

  deleteFile(fileId) {
    const formData = {
      delete: fileId,
      'x-csrf-token': this.xrsfToken,
    }
    const config = {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }

    return axios.post(this.params.url, formData, config)
  },

  init() {
    if (
      !dragAndDropAvailable() &&
      !formDataAvailable() &&
      !fileApiAvailable()
    ) {
      return
    }

    this.cacheEls()
    this.bindEvents()
    this.createDropzone()
    this.render()
  },

  onChangeHandler(event) {
    this.dropzone.processQueue()
  },

  onDeleteClickHandler(event) {
    const target = event.target

    if (target.hasAttribute('data-dz-remove')) {
      const fileId = target.value

      event.preventDefault()
      this.deleteFile(fileId)
        .then(() => {
          const row = target.closest('.dz-success')
          row.parentNode.removeChild(row)
          this.render()
        })
        .catch(error => {
          let errorMessage = 'could not be deleted'
          if (error.response && error.response.data) {
            errorMessage = error.response.data
          }
          const row = target.closest('.dz-success')
          row.classList.remove('dz-success')
          row.classList.add('dz-error')
          row.querySelector('[data-dz-errormessage]').innerHTML = errorMessage

          const buttons = this.dropzone.previewsContainer.querySelectorAll(
            'button[data-dz-remove]'
          )
          const actions = [...buttons]
          actions.forEach(action => {
            action.style.visibility = 'hidden'
          })
          return false
        })
    }
  },

  removedFile(file) {
    if (file.status === 'success') {
      const response = JSON.parse(file.xhr.response)

      if (response.id) {
        this.deleteFile(JSON.parse(file.xhr.response).id)
        this.render()
      }
    }
  },

  render() {
    const hasChildren = this.dropzone.previewsContainer.childElementCount > 0

    if (this.$previewNode.parentNode) {
      this.$previewNode.parentNode.removeChild(this.$previewNode)
    }

    if (hasChildren) {
      this.dropzone.previewsContainer.parentNode.classList.remove('app-hidden')
    } else {
      this.dropzone.previewsContainer.parentNode.classList.add('app-hidden')
    }
  },

  uploadProgress(file, progress, bytesSent) {
    const $progress = file.previewElement.querySelector(
      '[data-dz-uploadprogress]'
    )

    $progress.innerText = Math.round(progress)
  },
}

module.exports = MultiFileUpload
