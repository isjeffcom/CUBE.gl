
import * as THREE from 'three'
import { getCenter } from 'geolib'
import { Coordinate } from '../coordinate/Coordinate'
import CUBE_Material from '../materials/CUBE_Material'


let axisX = new THREE.Vector3(1,0,0)
//let axisY = new THREE.Vector3(0,1,0)
//let axisZ = new THREE.Vector3(0,0,1)


// pass in an a single data
export default class Data {
    
    /**
     * Create a sphere
     * @param {String} name name of the data
     * @public
    */

    constructor(name){
        this.name = name
        this._SCALE = window.CUBE_GLOBAL.MAP_SCALE
        this._HEIGHT_SCALE = 1 * this._SCALE
        this._SEGMENTS = 16 * this._SCALE
    }

    /**
     * Create a sphere
     * @param {Object} coordinate {latitude: Number, longitude: Number}
     * @param {Number} value segments
     * @param {Number} size size of the sphere
     * @param {Number} yOffset set a default y value
     * @param {THREE.Color} color 0xff6600
     * @param {THREE.Material} mat replacement material
     * @public
    */

    Sphere(coordinate, value=1, size=2, yOffset=0, color=0xff6600, mat){

        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.SphereBufferGeometry( size*3, value*size, value*size )
        let material = mat ? mat : new THREE.MeshBasicMaterial( {color: color} )
        let sphere = new THREE.Mesh( geometry, material )

        let y = local_coor.world.y + yOffset
        sphere.position.set(-local_coor.world.x, y, local_coor.world.z)
        sphere.name = this.name
        return sphere
    }

    /**
     * Create a bar
     * @param {Object} coordinate {latitude: Number, longitude: Number}
     * @param {Number} value segments
     * @param {Number} size size of the sphere
     * @param {Number} yOffset set a default y value
     * @param {THREE.Color} color 0xff6600
     * @param {THREE.Material} mat replacement material
     * @public
    */

    Bar(coordinate, value=1, size=.5, yOffset=0, color=0xff6600, mat){

        let height = this._HEIGHT_SCALE * value

        size = size * this._SCALE
        
        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.BoxBufferGeometry( size, size, height, this._SEGMENTS ) // top, bottom, height, segments

        let material = mat ? mat : new THREE.MeshPhongMaterial( {color: color} )
        let bar = new THREE.Mesh( geometry, material )
        
        
        //Rotate around X 90deg
        bar.rotateOnAxis(axisX, THREE.Math.degToRad(90))

        let y = local_coor.world.y + yOffset
        bar.position.set(-local_coor.world.x, y + ((height/2)), local_coor.world.z)
        //bar.rotateY(Math.PI / 2)

        bar.name = this.name

        return bar
    }

    /**
     * Create a bar
     * @param {Object} coordinate {latitude: Number, longitude: Number}
     * @param {Number} value segments
     * @param {Number} size size of the sphere
     * @param {Number} yOffset set a default y value
     * @param {THREE.Color} color 0xff6600
     * @param {THREE.Material} mat replacement material
     * @public
    */

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

        cylinder.name = this.name

        return cylinder
    }

    /**
     * Create a bar
     * @param {Object} coorA {latitude: Number, longitude: Number}
     * @param {Object} coorB {latitude: Number, longitude: Number}
     * @param {Number} height top point of the arc
     * @param {Number} yOffset set a default y value
     * @param {THREE.Color} color 0xff6600
     * @param {THREE.Material} mat replacement material
     * @public
    */

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
        arc.name = this.name

        //Rotate around X 90deg 绕X轴旋转90度
        //arc.rotateOnAxis(axisY, THREE.Math.degToRad(90))

        return arc
    }

    /**
     * Create a bar
     * @param {Object} coordinate {latitude: Number, longitude: Number}
     * @param {String} text text content
     * @param {Number} size font size
     * @param {THREE.Color} color 0xff6600
     * @param {Number} thickness thickness
     * @param {Object} fontface json font json object
     * @param {THREE.Material} mat replacement material
     * @public
    */

    Text(coordinate, text, size=30, color, thickness=.1, fontface, mat){
        const font = new CUBE_Material().TextFont(fontface ? fontface : undefined)
        
        let local_coor = new Coordinate("GPS", coordinate).ComputeWorldCoordinate()

        let geometry = new THREE.TextBufferGeometry( text, {
            font: font,
            size: size,
            height: thickness,
            curveSegments: parseInt(size/6)
        })

        geometry.center()
        
        const textColor = color ? color : 0xff0000
        let mesh = new THREE.Mesh(geometry, mat ? mat : new CUBE_Material().Text({color: textColor}))
        
        mesh.position.set(-local_coor.world.x, local_coor.world.yy, local_coor.world.z)
        mesh.name = this.name
        
        return mesh
        
    }

}

export { Data }
