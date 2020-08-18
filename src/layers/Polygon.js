import * as THREE from 'three'
import CUBE_Material from "../materials/CUBE_Material"
import {GenShape, GenGeometry } from '../utils/ModelBuilder'
import { Layer } from "./Layer"

export class Polygon {

    /**
     * @param {String} name: name of the layer
     * @param {CUBE.Coordinate || Object} name: wgs84 coordinate
     * @public
    */

    constructor(name, coors){
        this.coors = coors

        this.layer = new Layer(name)
        this.layer_objects = new Layer(name + "_objects")
        this.layer_collider = new Layer(name + "_collider")
    }

    /**
     * @param {Object} info {} polygon information
     * @param {Object} options {height: 1, color: 0xffffff} height: extrude height, color: color
     * @param {THREE.Material} mat replace line material
     * @public
    */
    Ground(info={}, options={}, mat){
        let height = options.height ? options.height : 1
        let material = mat ? mat : new CUBE_Material().Ground({color: options.color ? options.color : 0xffffff})

        let province = genPoly(this.coors, info, height)

        this.layer_objects.Add(new THREE.Mesh(province.geometry, material))
        this.layer.Add(this.layer_objects.Layer())
        return this.layer.Layer()
    }
}

function genPoly(coordinates, info, height=1){
    let shape, geometry
    // Loop for all nodes
    for(let i=0;i<coordinates.length;i++){
        
        let el = coordinates[i]
        if(typeof el[0][0] != "number"){
            shape = GenShape(el[0])
        }else{
            shape = GenShape(el)
        }

    }

    if(shape){
        // Extrude Shape to Geometry
        geometry = GenGeometry(shape, {
            curveSegments: 12,  // curves
            steps: 1, // subdividing segments
            depth: height, // Height
            bevelEnabled: false // Bevel (round corner)
        })
        
        // Adjust geometry rotation
        geometry.rotateX(Math.PI / 2)
        geometry.rotateZ(Math.PI)

        // let helper = GenHelper(geometry)
        // if(helper){
        //     helper.name = info["name"] ? info["name"] : "Building"
        //     helper.info = info
        // }

        // let mesh = new THREE.Mesh(geometry, material)
        // //mesh.position.y = 0
        // mesh.info = info

        return {
            geometry: geometry, 
            //helper: helper
        }
    }

    
}