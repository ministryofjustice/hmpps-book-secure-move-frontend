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
    url: this.$module.getAttribute('data-url'),
    parallelUploads: 1,
    createImageThumbnails: false,
    clickable: '[data-dz-clickable]',
    previewsContainer: '[data-dz-previews-container]',
    paramName: this.$module.querySelector('input[type="file"]').name,
  }

  this.params = this.defaultParams
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

    this.cacheEls()
    this.bindEvents()
    this.createDropzone()
    this.render()
  },

  cacheEls: function() {
    this.$previewNode = this.$module.querySelector('[data-dz-preview-template]')
    this.$previewNode.classList.remove('app-hidden')
    this.$previewNode.removeAttribute('data-dz-preview-template')
    this.$dropzone = this.$module.querySelector('[data-dz-dropzone]')
    this.previewTemplate = this.$previewNode.outerHTML
    this.xrsfToken = document.querySelector('input[name="x-csrf-token"]').value
  },

  bindEvents() {
    this.$module.addEventListener('click', this.onDeleteClickHandler.bind(this))
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

  createDropzone() {
    this.dropzone = new Dropzone(this.$dropzone, {
      ...this.params,
      previewTemplate: this.previewTemplate,
      params: {
        'x-csrf-token': this.xrsfToken,
      },
    })

    this.dropzone.on('addedfile', this.render.bind(this))
    this.dropzone.on('removedfile', this.removedFile.bind(this))
    this.dropzone.on('uploadprogress', this.uploadProgress.bind(this))
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

  uploadProgress(file, progress, bytesSent) {
    const $progress = file.previewElement.querySelector(
      '[data-dz-uploadprogress]'
    )

    $progress.innerText = Math.round(progress)
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
        .catch(() => false)
    }
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
}

module.exports = MultiFileUpload
