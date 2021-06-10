/**
 * CUBE.GL
 * High-level API: download data from APIs and generate elements
 * jeffwu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

// High level map api, loading 3d visualisation like using a map
// Rely on third party APIs, it is possible not working stablely.

// import * as THREE from 'three'
import { MakeBBox } from '../utils/geotools/GeoCalculator'
import osmtogeojson from 'osmtogeojson'

const API_MAP = 'http://overpass-api.de/api/interpreter'
const API_TERRAIN = 'https://portal.opentopography.org/API/globaldem'

export class City {
  /**
     * Init generate a part of the city by center and range
     * @param {Number} [range] - minimal range of a city in meter, default is 1000
     * @param {String} [options.API_MAP] - allow user replace remote building/water/roads data api address
     * @param {String} [options.API_TERRAIN] - allow user replace remote terrain data api address
    */

  constructor (range = 1000, options = {}) {
    // Allow replace api
    this.API_MAP = options.API_MAP ? options.API_MAP : API_MAP
    this.API_TERRAIN = options.API_TERRAIN ? options.API_TERRAIN : API_TERRAIN

    // Get center from global CUBE instance paramter
    this.center = window.CUBE_GLOBAL.CENTER

    // Define Initial Range, default is 10
    this.range = range

    // Calculate bounding box
    this.bbox = MakeBBox(this.center, this.range)
  }

  /**
     * Generate buildings
     * @param {String} [name] - name of the layer
     * @param {Object} [options] - to replace building geo layer options, check GeoLayer for more info
     * @param {THREE.Material} [material] - to replace building material, check GeoLayer for more info
    */
  async Buildings (name = 'building', options = { merge: true, color: 0xE5E5E5 }, material) {
    // construct query string
    const queryURL = constOverpassQL(this.API_MAP, 'building', this.bbox)

    // request json
    const json = await (await fetch(queryURL)).json()

    // convert to geojson
    const geojson = osmtogeojson(json)

    // return layer
    return new CUBE.GeoLayer(name, geojson).Buildings(options, material || undefined)
  }

  /**
     * Generate roads
     * @param {String} [name] - name of the layer
     * @param {Object} [options] - replace roads geo layer options, check GeoLayer for more info
     * @param {THREE.Material} [material] - replace roads material, check GeoLayer for more info
    */

  async Roads (name = 'roads', options, material) {
    // construct query string
    const queryURL = constOverpassQL(this.API_MAP, 'highway', this.bbox)

    // request json
    const json = await (await fetch(queryURL)).json()

    // convert to geojson
    const geojson = osmtogeojson(json)

    // return layer
    return new CUBE.GeoLayer(name, geojson).Road(options || undefined, material || undefined)
  }
}

/**
 * Constucture overpass ql query url
 * @param {String} baseAPI basic overpass api
 * @param {String} type query type, support building, highway(==road) and water
 * @param {Number} bbox.south bounding box south
 * @param {Number} bbox.north bounding box north
 * @param {Number} bbox.east bounding box east
 * @param {Number} bbox.west bounding box west
 * @param {String} [output] output type, default is json
 * @param {Number} [timeout] query timeout, default is 30 seconds
 * @private
*/
function constOverpassQL (baseAPI, type, bbox, output = 'json', timeout = 30) {
  // overpass query string first line
  let query = `[out:${output}][timeout:${timeout}];`

  // Ready to add Bounding Box into overpass query string
  const b = `(${bbox.south}, ${bbox.west}, ${bbox.north}, ${bbox.east})`

  // construct overpass query string by type
  if (type === 'building') {
    // query += `(way["building"]${b};relation["building"]["type"="multipolygon"]{b};);`
    query += `(way["building"]${b};` +
                  `relation["building"]["type"="multipolygon"]${b};` +
                  ');'
  }

  if (type === 'highway') {
    query += `(way["highway"]${b};` +
                 ');'
  }

  if (type === 'water') {
    query += `(way["natural"="water"]${b};` +
                 `relation["natural"="water"]${b};` +
                 `way["waterway"]${b};` +
                 ');'
  }

  query += 'out;>;out qt;'

  // encode and return whole url
  return baseAPI + '?data=' + encodeURI(query)
}

// From Python

// def constOverpassQL(api, output, timeout, query_type, bbox):
//     if not query_type:
//         return False

//     query = f'[out:{output}][timeout:{timeout}];'

//     b = f'({bbox["south"]}, {bbox["west"]}, {bbox["north"]}, {bbox["east"]})'
//     if query_type == 'building':
//         query += f'(way["building"]{b};' \
//                  f'relation["building"]["type"="multipolygon"]{b};' \
//                  ');'

//     if query_type == 'highway':
//         query += f'(way["highway"]{b};' \
//                  ');'

//     if query_type == 'water':
//         query += f'(way["natural"="water"]{b};' \
//                  f'relation["natural"="water"]{b};' \
//                  f'way["waterway"]{b};' \
//                  ');'

//     query += 'out;>;out qt;'
//     # print(query)
//     return BASE_OVERPASS + '?data=' + quote(query, 'utf-8')
//     # return quote(query, 'utf-8')
