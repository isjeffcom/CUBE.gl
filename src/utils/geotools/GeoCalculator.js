import { WorldCoordinate } from '../../coordinate/Coordinate'
import GEOLIB from "geolib"

let defaultScale = 50000

/**
 * Func: GPS to Three World
 * 
 * @param {object} objPosi {latitude: Number, longitude: Number}
 * @param {object} centerPosi {latitude: Number, longitude: Number}
 * 
 * @return {array} [latitude, longitude]
*/
export function GPSRelativePosition(objPosi, centerPosi, scale=defaultScale){
    let obj = GetXY(objPosi.latitude, objPosi.longitude)
    let center = GetXY(centerPosi.latitude, centerPosi.longitude)
    return new WorldCoordinate((center.x - obj.x) / scale, (center.y - obj.y) / scale)
}

/**
 * Create a square by center and distance(-*-)
 * @param {object} center {latitude: latitude, longitude: lontitude}
 * @param {number} dis in meter
 * @returns {object} four direction coordinate {east: east, south: south, west: west, north: north, }
 * @public
 */

export function MakeBBox(center, dis){
    let res = {}
    //console.log(center)
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

    return res
}

/**
 * Mercator projection WGS84 > X,Y
 * @param lat latitude
 * @param lon lontitude
 * @return {object} {x: x, y: y}
 * @public
 */

function GetXY(lat, lon) {
    var mercator = {}
    var earthRad = 6378137
    mercator.x = lon * Math.PI / 180 * earthRad
    var a = lat * Math.PI / 180
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
    return mercator 
}

