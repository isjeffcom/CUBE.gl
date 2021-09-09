/**
 * CUBE.GL
 * Utils tools: calculate geolocation
 * jeffwu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

import { WorldCoordinate } from '../../coordinate/Coordinate'
import * as GEOLIB from 'geolib'

const defaultScale = 50000

/**
 * Func: GPS to Three World
 *
 * @param {object} objPosi {latitude: Number, longitude: Number}
 * @param {object} centerPosi {latitude: Number, longitude: Number}
 *
 * @return {array} [latitude, longitude]
*/
export function GPSRelativePosition (objPosi, centerPosi, scale = defaultScale) {
  const obj = GetXY(objPosi.latitude, objPosi.longitude)
  const center = GetXY(centerPosi.latitude, centerPosi.longitude)
  return new WorldCoordinate((center.x - obj.x) / scale, (center.y - obj.y) / scale)
}

/**
 * Create a square by center and distance(-*-)
 * @param {object} center {latitude: latitude, longitude: lontitude}
 * @param {number} dis in meter
 * @returns {object} four direction coordinate {east: east, south: south, west: west, north: north, }
 * @public
 */

export function MakeBBox (center, dis) {
  const res = {}
  // console.log(center)
  res.east = GEOLIB.computeDestinationPoint(
    { latitude: center.latitude, longitude: center.longitude },
    dis,
    90
  )

  res.west = GEOLIB.computeDestinationPoint(
    { latitude: center.latitude, longitude: center.longitude },
    dis,
    270
  )

  res.north = GEOLIB.computeDestinationPoint(
    { latitude: center.latitude, longitude: center.longitude },
    dis,
    0
  )

  res.south = GEOLIB.computeDestinationPoint(
    { latitude: center.latitude, longitude: center.longitude },
    dis,
    180
  )

  return {
    south: res.south.latitude,
    north: res.north.latitude,
    west: res.west.longitude,
    east: res.east.longitude
  }
}

/**
 * Mercator projection WGS84 > X,Y
 * @param lat latitude
 * @param lon lontitude
 * @return {object} {x: x, y: y}
 * @public
 */

function GetXY (lat, lon) {
  const mercator = {}
  const earthRad = 6378137
  mercator.x = lon * Math.PI / 180 * earthRad
  const a = lat * Math.PI / 180
  mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
  return mercator
}
