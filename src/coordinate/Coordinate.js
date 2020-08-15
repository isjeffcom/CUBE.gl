

/**
 * @class Main constructor, provides main space runtime, allow limited config, insert animation engine and shader engine
 * @param {Object} options { latitude: Number, longitude: Number, altitude: Number, x: Number, y: Number, z: Number }
 * @public
 * 
 * Notice: Be aware that the altitude is not the real altitude but the world position y-axis
*/

export class Coordinate{

    constructor(type, coor) {
        if(type === "GPS"){
            this.world = {}
            this.gps = new GPSCoordinate(coor.latitude, coor.longitude, coor.altitude || 0)
        }

        if(type === "World"){
            this.gps = {}
            this.world = new WorldCoordinate(coor.x, coor.y, coor.z)
        }

        this.tile = {x: 0, y:0, centerOffset: {x: 0, y: 0}}

        this.type = type

        // Obtain Global Config
        this.center = window.CUBE_GLOBAL.CENTER
        this.scale = window.CUBE_GLOBAL.MAP_SCALE
    }

    /**
     * Compute GPS/WGS84 Coordinate to Threejs World Postion Relatively to Center Coordinate
     * @public
    */

    ComputeWorldCoordinate(){
        let obj = Mercator(this.gps.latitude, this.gps.longitude)
        let center = Mercator(this.center.latitude, this.center.longitude)

        this.world.x = (center.x - obj.x) * this.scale
        this.world.z = (center.y - obj.y) * this.scale
        this.world.y = this.gps.altitude

        return this
    }

    /**
     * Compute GPS/WGS84 coordinate to tile map coordinate
     * @public
    */

    ComputeTileCoordinate(zoom){
        let t = GPSToTile(this.gps.latitude, this.gps.longitude, zoom)
        this.tile.x = t.x
        this.tile.y = t.y
        this.tile.centerOffset.x = t.offsetX
        this.tile.centerOffset.y = t.offsetY

        return this
    }

    /**
     * Reverse tile coordinate back to gps coordinate for getting the center position
     * @public
    */

    ReverseTileToGPS(zoom){
        if(!this.tile.x) return
        return TileToGPS(this.tile.x, this.tile.y, zoom)
    }

}

/**
 * @class GPS coordination
 * @param {Number} latitude latitude
 * @param {Number} longitude longitude
 * @private
*/

class GPSCoordinate{
    constructor(latitude, longitude, altitude) {
        this.latitude = latitude
        this.longitude = longitude
        this.altitude = altitude
    }
}


/**
 * @class World coordination
 * @param {Number} x x-axis coordinate
 * @param {Number} y y-axis coordinate
 * @param {Number} z z-axis coordinate
 * @private
*/

class WorldCoordinate{
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }

    // computeGPSCoordinate(scale=100){
    //     // Reserved
    // }
}

/**
 * Mercator WGS84 EPSG4326 -> Mercator projection EPSG3857
 * @param {Number} lat latitude
 * @param {Number} lon longitude
 * @return {Object} {x: Number, y: Number}
 * @private
 * @inner
*/

function Mercator(lat, lon) {
    var mercator = {}
    var earthRad = 6378.137

    mercator.x = lon * Math.PI / 180 * earthRad
    var a = lat * Math.PI / 180
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
    return mercator
}

// function MercatorReverse(x, y) {
//     // Reserved
// }

export function GPSToTile(lat, lon, zoom){
    let x = (lon + 180) / 360 * Math.pow(2, zoom)
    let y = (1 - Math.log( Math.tan( lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180) ) / Math.PI) / 2 * Math.pow(2,zoom)
    return {
        x: Math.floor(x),
        y: Math.floor(y),
        offsetX: Math.floor(x) - x,
        offsetY: Math.floor(y) - y 
    }
}

export function TileToGPS(x, y, zoom){
    let n = Math.PI - 2 * Math.PI * y / Math.pow(2,zoom)
    return{
        latitude: (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n)))),
        longitude: (x/Math.pow(2,zoom)*360-180),
        altitude: 0
    }
}