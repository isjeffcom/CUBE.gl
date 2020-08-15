import { WorldCoordinate } from '../../coordinate/Coordinate'

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

