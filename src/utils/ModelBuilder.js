// Import
import * as THREE from 'three'
import { Coordinate } from '../coordinate/Coordinate'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export function GenBuilding(coordinates, height){
    // // Create Shape
    let shape = this.GenShape(coordinates)

    // Extrude Shape to Geometry
    let geometry = this.GenGeometry(shape, {
        curveSegments: 2,  // curves
        steps: 1, // subdividing segments
        depth: 0.05 * height, // Height
        bevelEnabled: false // Bevel (round corner)
    })

    // var geometry = new THREE.ShapeBufferGeometry( shape )

    return geometry
}

// Render building by geojson->geometry->coordinates points data, a set 2-d array
export function GenGeometry(shape, extrudeSettings){

    let geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings )
    geometry.computeBoundingBox()

    return geometry
}

export function GenShape(points, options){
    // Create a shape object for create model after
    let shape = new THREE.Shape()

    // Get deeper layer of point data
    for(let ii=0;ii<points.length;ii++){
        let elp = points[ii]

        //convert position from the center position
        let melp = new Coordinate("GPS", {latitude: elp[1], longitude: elp[0]}).ComputeWorldCoordinate()

        // Draw shape
        if(ii == 0){
            shape.moveTo(melp.world.x, melp.world.z)
        } else {
            shape.lineTo(melp.world.x, melp.world.z)
        }
    }

    return shape
}

export function GenHelper(geometry){

    if(!geometry.boundingBox){
        geometry.computeBoundingBox()
    }

    let box3 = geometry.boundingBox

    if(!isFinite(box3.max.x)){
        return false
    }

    let helper = new THREE.Box3Helper( box3, 0xffff00 )
    // Project new position
    helper.updateMatrixWorld()

    return helper
}

export function GenLine(data){
    let points = this.GenLinePoints(data)
    return new THREE.BufferGeometry().setFromPoints( points )
}

export function GenLinePoints(data){
    // Init points array
    let points = []

    // Loop for all nodes
    for(let i=0;i<data.length;i++){
        
        if(!data[0][1]) return
        
        let el = data[i]

        //Just in case
        if(!el[0] || !el[1]) return
        
        let elp = [el[0], el[1]]

        //convert position from the center position
        elp = new Coordinate("GPS", {latitude: elp[1], longitude: elp[0]}).ComputeWorldCoordinate()
        
        // Draw Line
        points.push( new THREE.Vector3( elp.world.x, 0.1, elp.world.z ) )
    }

    return points
}

export function GenWaterGeometry(shape, config){
    let geometry = new THREE.ExtrudeBufferGeometry( shape, config )
    geometry.computeBoundingBox()

    return geometry
    //return new THREE.PlaneBufferGeometry(shape)
}

export function MergeGeometry(geometries){
    return BufferGeometryUtils.mergeBufferGeometries(geometries)
}

export function MergeLineGeometry(geometries){
    
    let arr = []
    for(let i=0;i<geometries.length;i++){
        arr.push(geometries[i].attributes.position.array)
    }
    let geometry = new THREE.BufferGeometry()
    //geometry.attributes.position.array = arr
    
    //geometry.attributes.position.array = arr
    // geometry.attributes.onUploadCallback  = geometries[0].attributes.onUploadCallback
    return geometry
}
