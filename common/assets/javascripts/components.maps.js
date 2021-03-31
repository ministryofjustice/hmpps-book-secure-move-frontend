import Map from '../../components/map/map'

const { nodeListForEach } = require('./utils')

const $map = document.querySelectorAll('[data-module="app-map"]')
nodeListForEach($map, function ($map) {
  new Map($map).init()
})
