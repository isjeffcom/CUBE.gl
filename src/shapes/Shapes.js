import { Vector3 } from "three"
import * as THREE from 'three'
import CUBE_Material from "../materials/CUBE_Material"

export class Shapes {
    constructor(name="shape", position=new Vector3(0,0,0)){
        this.name = name
        this.position = position
    }

    Box(size=1, color=0x00ff00){
        let geometry = new THREE.BoxBufferGeometry( size, size, size )
        let material = new CUBE_Material().Basic({color: color})
        let cube = new THREE.Mesh( geometry, material )
        cube.position.set(this.position.x, this.position.y, this.position.z)
        
        return cube
    }

    Sphere(size=1, color=0xff6600){
        size = parseInt(size)
        let geometry = new THREE.SphereBufferGeometry( size/2, (size/2)*32, (size/2)*32 )
        let material = new CUBE_Material().Basic({color: color})
        let sphere = new THREE.Mesh( geometry, material )
        sphere.position.set(this.position.x, this.position.y, this.position.z)

        return sphere
    }

    Cylinder(size=1, color=0xff6600){
        let geometry = new THREE.CylinderBufferGeometry( size/4, size/4, size, size*32 )
        let material = new CUBE_Material().Basic({color: color})
        let cylinder = new THREE.Mesh( geometry, material )
        cylinder.position.set(this.position.x, this.position.y, this.position.z)
        return cylinder
    }
}