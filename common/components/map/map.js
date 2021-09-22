import axios from 'axios'
import { Map, View } from 'ol'
import TileState from 'ol/TileState'
import { buffer, boundingExtent } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import LayerGroup from 'ol/layer/Group'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'

function MapComponent($module) {
  this.cacheEls($module)

  this.defaults = {}

  this.settings = this.defaults
}

MapComponent.prototype = {
  init: function () {
    this._getToken()
      .then(token => {
        this.accessToken = token
        this.render()
      })
      .catch(error => this.renderError(error))
  },

  cacheEls: function ($module) {
    this.$map = null
    this.$module = $module

    this.points = JSON.parse($module.getAttribute('data-points'))
    this.lines = JSON.parse($module.getAttribute('data-lines'))
    this.apiKey = $module.getAttribute('data-api-key')
    this.tileUrl = $module.getAttribute('data-tile-url')

    this.lineSource = new VectorSource()
    this.pointSource = new VectorSource()
  },

  render: function () {
    this._renderMap()
    this._appendPoints()
    this._appendLines()
  },

  renderError: function (e) {
    this.$module.innerHTML =
      '<p class="app-map__error">The map could not be loaded.</p>'
  },

  _ordnanceTileLoader: function (tile, src) {
    const config = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      responseType: 'blob',
    }

    axios
      .get(src, config)
      .then(response => {
        if (response.data !== undefined) {
          tile.getImage().src = URL.createObjectURL(response.data)
        } else {
          tile.setState(TileState.ERROR)
        }
      })
      .catch(e => e)
  },

  _getToken() {
    return axios.get('/map/token').then(response => response.data.access_token)
  },

  _renderMap() {
    this.$map = new Map({
      layers: [
        new LayerGroup({
          title: 'Base map',
          layers: [
            new TileLayer({
              title: 'Light',
              type: 'base',
              visible: true,
              source: new XYZ({
                url: this.tileUrl,
                tileLoadFunction: this._ordnanceTileLoader.bind(this),
              }),
            }),
          ],
        }),
        new LayerGroup({
          title: 'Lines',
          layers: [
            new VectorLayer({
              source: this.lineSource,
              style: this._lineStyle.bind(this),
            }),
          ],
        }),
        new LayerGroup({
          title: 'Points',
          layers: [
            new VectorLayer({
              source: this.pointSource,
              style: this._pointStyle.bind(this),
            }),
          ],
        }),
      ],
      target: 'app-map',
      view: new View({
        projection: 'EPSG:3857',
        minZoom: 7,
        maxZoom: 20,
        zoom: 8,
        center: fromLonLat([-0.118092, 51.509865]),
      }),
    })
  },

  _appendPoints() {
    const format = new GeoJSON()
    const features = format.readFeatures(
      {
        type: 'FeatureCollection',
        features: this.points,
      },
      {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }
    )

    for (let i = 0; i < features.length; i++) {
      this.pointSource.addFeature(features[i])
    }

    const allExtent = buffer(
      boundingExtent(
        features.map(feature => feature.getGeometry().getCoordinates())
      ),
      100
    )

    // centre map on points
    this.$map.getView().fit(allExtent, {
      size: this.$map.getSize(),
      padding: [30, 30, 30, 30],
    })
  },

  _appendLines() {
    const format = new GeoJSON()
    const features = format.readFeatures(
      {
        type: 'FeatureCollection',
        features: this.lines,
      },
      {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }
    )

    for (let i = 0; i < features.length; i++) {
      this.lineSource.addFeature(features[i])
    }
  },

  _lineStyle: function () {
    return new Style({
      stroke: new Stroke({
        width: 4,
        color: [177, 180, 182, 0.8],
      }),
    })
  },

  _textStyle: function (feature) {
    return new Text({
      textAlign: 'left',
      textBaseline: 'middle',
      font: 'bold 12px "Inter", system-ui, sans-serif',
      text: feature.get('name'),
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'white', width: 2 }),
      offsetX: 12,
      offsetY: 1,
    })
  },

  _pointStyle: function (feature) {
    let fill
    let stroke

    if (feature.get('isOrigin')) {
      fill = new Fill({ color: 'white' })
      stroke = new Stroke({ color: '#00703c', width: 2 })
    } else if (feature.get('isFinalDestination')) {
      fill = new Fill({ color: 'white' })
      stroke = new Stroke({ color: '#f47738', width: 2 })
    } else {
      fill = new Fill({ color: 'white' })
      stroke = new Stroke({ color: '#505a5f', width: 2 })
    }

    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: fill,
        stroke: stroke,
      }),
      text: this._textStyle(feature),
    })
  },
}

export default MapComponent
