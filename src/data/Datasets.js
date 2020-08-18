import * as THREE from 'three'
import Data from './Data'
import PS_Heatmap from '../shader/assets/CS_Heatmap'
import CUBE_Material from '../materials/CUBE_Material'
import { Coordinate } from '../coordinate/Coordinate'
import { Layer } from '../layers/Layer'

/*
data: [
    {
        locations: {latitude: Number, longitude: Number}
        val: Number
    }
]
*/

// Pass in an array of data
export class Datasets extends Data{

    /**
     * Datasets constructor
     * @param {String} name name of the datasets
     * @param {Array} data an array of data
     * @public
    */


    constructor(name, data){
        super()
        this.name = name
        this.data = data
        this.mat_point = new CUBE_Material().Point()

        this.center = window.CUBE_GLOBAL.CENTER
        this.scale = window.CUBE_GLOBAL.MAP_SCALE

        // New Layer
        this.layer = new Layer(name)
    }

    /**
     * PointCloud
     * @public
    */

    PointCloud(){
        for(let i=0;i<this.data.length;i++){

            // Position
            let posi = new Coordinate("GPS", this.data[i].location).ComputeWorldCoordinate()

            // Geometry
            var geometry = new THREE.Geometry()
            geometry.vertices.push(new THREE.Vector3( 0, 0, 0))

            // Point mesh
            let mesh = new THREE.Points(geometry, this.mat_point)
            mesh.position.set(posi.world.x, posi.world.y, posi.world.z)

            // Add to layer
            this.layer.Add(mesh)

        }

        return this.layer.Layer()
    }

    /**
     * Heatmap
     * @param {Number} size heatmap canvas size
     * @param {Number} radius highlight radius
     * @public
    */

    Heatmap(size=60, radius=2.5){
        
        size = size * this.scale
        radius = radius * this.scale

        let shader = new PS_Heatmap()

        let heightMapData = []
        for(let i=0;i<this.data.length;i++){
            
            let posi = new Coordinate("GPS", this.data[i].location).ComputeWorldCoordinate()
            heightMapData.push({x: posi.world.x, y: posi.world.z, val: this.data[i].val})
        }
        
        let heightMap = HeightMap(heightMapData, size, radius)
        

        let planeGeometry = new THREE.PlaneBufferGeometry(size, size, 1000, 1000)
        planeGeometry.rotateX(-Math.PI / 2)

        let heat = new THREE.Mesh(planeGeometry, new THREE.ShaderMaterial({
            uniforms: {
                heightMap: {value: heightMap},
                heightRatio: {value: Math.floor(size / 10)},
                heightColor: {value: 1}
            },
            vertexShader: shader.GetVertex(),
            fragmentShader: shader.GetFragment(),
            transparent: true,
            opacity: 0.95
        }))

        this.layer.Add(heat)

        return this.layer.Layer()
    }
    
}

function HeightMap(data=[], size=256, radius=50){

    let canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, size, size)

    for(let i = 0; i < data.length; i++){
        let el = data[i]
        
        let x = (size / 2) + (-el.x)
        let y = (size / 2) + el.y

        let grd = ctx.createRadialGradient(x, y, 1, x, y, radius)
        let h8 = el.val

        grd.addColorStop(0, "rgb("+ h8 + "," + h8 + "," + h8 +")")
        grd.addColorStop(1, "transparent")
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(canvas)
}