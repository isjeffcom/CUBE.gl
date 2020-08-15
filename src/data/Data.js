
import * as THREE from 'three'
import { getCenter } from 'geolib'
import { Coordinate } from '../coordinate/Coordinate'

let axisX = new THREE.Vector3(1,0,0)
//let axisY = new THREE.Vector3(0,1,0)
//let axisZ = new THREE.Vector3(0,0,1)


// pass in an a single data
export default class Data {

    constructor(name){
        this.name = name
        this._SCALE = window.CUBE_GLOBAL.MAP_SCALE
        this._HEIGHT_SCALE = 1 * this._SCALE
        this._SEGMENTS = 16 * this._SCALE
    }

    Sphere(coordinate, value=1, size=2, yOffset=0, color=0xff6600){

        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.SphereBufferGeometry( size*3, value*size, value*size )
        let material = new THREE.MeshBasicMaterial( {color: color} )
        let sphere = new THREE.Mesh( geometry, material )

        let y = local_coor.world.y + yOffset
        sphere.position.set(-local_coor.world.x, y, local_coor.world.z)
        return sphere
    }

    Bar(coordinate, value=1, size=.5, yOffset=0, color=0xff6600, mat){

        let height = this._HEIGHT_SCALE * value

        size = size * this._SCALE
        
        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.BoxBufferGeometry( size, size, height, this._SEGMENTS ) // top, bottom, height, segments

        let material = mat ? mat : new THREE.MeshPhongMaterial( {color: color} )
        let bar = new THREE.Mesh( geometry, material )
        
        
        //Rotate around X 90deg 绕X轴旋转90度
        bar.rotateOnAxis(axisX, THREE.Math.degToRad(90))

        let y = local_coor.world.y + yOffset
        bar.position.set(-local_coor.world.x, y + ((height/2)), local_coor.world.z)
        //bar.rotateY(Math.PI / 2)

        return bar
    }

    Cylinder(coordinate, value=1, size=.5, yOffset=0, color=0xff6600, mat){

        let height = this._HEIGHT_SCALE * value

        size = size * this._SCALE

        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.CylinderBufferGeometry( size, size, height, this._SEGMENTS ) // top, bottom, height, segments

        let material = mat ? mat : new THREE.MeshPhongMaterial( {color: color} )
        let cylinder = new THREE.Mesh( geometry, material )

        //Rotate around X 90deg 绕X轴旋转90度
        //cylinder.rotateOnAxis(axisX, THREE.Math.degToRad(90))
        let y = local_coor.world.y + yOffset
        cylinder.position.set(-local_coor.world.x, y + ((height/2)), local_coor.world.z)

        return cylinder
    }

    Arc(coorA, coorB, height=5, yOffset=0, color=0xff6600, mat){
        height = height * this._SCALE
        let localA = new Coordinate("GPS", coorA).ComputeWorldCoordinate()
        let localB = new Coordinate("GPS", coorB).ComputeWorldCoordinate()
        let localCenter = new Coordinate("GPS", getCenter([coorA, coorB])).ComputeWorldCoordinate()

        let arcLine = new THREE.CatmullRomCurve3([
            new THREE.Vector3( -localA.world.x, localA.world.y + yOffset, localA.world.z ),
            new THREE.Vector3( -localCenter.world.x, height + yOffset, localCenter.world.z ),
            new THREE.Vector3( -localB.world.x, localA.world.y + yOffset, localB.world.z )
        ], false,"catmullrom")
        
        let points = arcLine.getPoints( 50 )
        let geometry = new THREE.BufferGeometry().setFromPoints( points )
        geometry.computeBoundingSphere()
        geometry.boundingSphere.center = new THREE.Vector3(localCenter.world.x, 0, localCenter.world.z)

        let material = mat ? mat : new THREE.LineBasicMaterial( { color : color, linewidth: 1 } )
        let arc = new THREE.Line( geometry, material )


        //Rotate around X 90deg 绕X轴旋转90度
        //arc.rotateOnAxis(axisY, THREE.Math.degToRad(90))

        return arc
    }

}

export { Data }
