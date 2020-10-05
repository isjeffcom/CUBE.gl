// High level map api, loading 3d visualisation like using a map
// Rely on third party APIs, it is possible not working stablely. 

import * as THREE from 'three'
import { Layer } from './Layer'
import { MakeBBox } from '../utils/geotools/GeoCalculator'

const API_BUILDING = "http://overpass-api.de/api/interpreter"
const API_WATER = API_BUILDING
const API_ROADS = API_BUILDING
const API_TERRAIN = "https://portal.opentopography.org/API/globaldem"


export class City {

    /**
     * Init generate a part of the city by center and range
     * @param {String} name name of the layer
     * @param {Number} range minimal range of a city in meter
     * @param {String} mode static or map, static only generate once, map will constantly generate city by ux
     * @param {String} options.API_BUILDING allow user replace remote building data api address
     * @param {String} options.API_WATER allow user replace remote water data api address
     * @param {String} options.API_ROADS allow user replace remote roads data api address
     * @param {String} options.API_TERRAIN allow user replace remote terrain data api address
    */

    constructor(name, range=100, mode="static", options={}) {

        // Allow replace api
        this.API_BUILDING = options.API_BUILDING ? options.API_BUILDING : API_BUILDING
        this.API_WATER = options.API_WATER ? options.API_WATER : API_WATER
        this.API_ROADS = options.API_ROADS ? options.API_ROADS : API_ROADS
        this.API_TERRAIN = options.API_TERRAIN ? options.API_TERRAIN : API_TERRAIN

        // Set mode
        this.mode = mode

        // Main Layer
        this.layer = new Layer(name)
        
        // Get center from global CUBE instance paramter
        this.center = window.CUBE_GLOBAL.CENTER

        // Define Initial Range, default is 10
        this.range = range

        // Mange tiles 
        this.tiles_building = []

        // Calculate bounding box
        this.init_bbox = MakeBBox(this.center, this.range)
        
    }

    create(){
        
    }

    building(bbox){
        const nyc_building = await (await fetch('<url>/buildings.geojson')).json()
        const buildings = new CUBE.GeoLayer("name", nyc_building).Buildings({merge: true, color: 0xE5E5E5})
        this.tiles_building.push(buildings)
    }

}