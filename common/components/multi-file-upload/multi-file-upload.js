import axios from 'axios'
import Dropzone from 'dropzone'

Dropzone.autoDiscover = false

const {
  dragAndDropAvailable,
  formDataAvailable,
  fileApiAvailable,
} = require('../../../common/assets/javascripts/utils')

function MultiFileUpload($module) {
  this.$module = $module
  const $input = $module.querySelector('[type="file"]')
  this.$input = $input

  this.defaultParams = {
    url: this.$module.getAttribute('data-url'),
    parallelUploads: 1,
    createImageThumbnails: false,
    clickable: '[data-dz-clickable]',
    previewsContainer: '[data-dz-previews-container]',
    paramName: $input.name,
    // acceptedFiles: $input.getAttribute('accept') || '',
    // maxFilesize: parseInt($input.getAttribute('data-max-filesize') || ''),
    accept: function(file, done) {
      const accept = $input.getAttribute('accept')
      // if (!accept.match(new RegExp(file.type + ';*'))) {
      if (accept) {
        if (!file.type || accept.indexOf(file.type) === -1) {
          return done('is not an acceptable file type')
          // NB. should actually be of the form The selected file must be a Word, Excel, PDF or JPEG file
        }
      }
      const maxSize = $input.getAttribute('data-max-filesize')
      if (maxSize && file.size > parseInt(maxSize, 10) * 1024 * 1024) {
        return done('must be smaller than ' + maxSize)
      }
      done()
    },
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

  cacheEls: function () {
    this.$previewNode = this.$module.querySelector('[data-dz-preview-template]')
    this.$previewNode.classList.remove('app-hidden')
    this.$previewNode.removeAttribute('data-dz-preview-template')
    this.$dropzone = this.$module.querySelector('[data-dz-dropzone]')
    this.previewTemplate = this.$previewNode.outerHTML
    this.xrsfToken = document.querySelector('input[name="_csrf"]').value
  },

  bindEvents() {
    this.$module.addEventListener('click', this.onDeleteClickHandler.bind(this))
    this.$module.addEventListener('change', this.onChangeHandler.bind(this))
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
        _csrf: this.xrsfToken,
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

  deleteFile(fileId) {
    const formData = {
      delete: fileId,
      _csrf: this.xrsfToken,
    }
    const config = {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }

    return axios.post(this.params.url, formData, config)
  },
}

export default MultiFileUpload
