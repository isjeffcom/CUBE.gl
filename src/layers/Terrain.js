/**
 * CUBE.GL
 * Layer: Terrain layer
 * Jeff Wu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

import * as GeoTIFF from '../utils/third/geotiff'
import * as THREE from 'three'
import { Coordinate } from '../coordinate/Coordinate'
import CUBE_Material from '../materials/CUBE_Material'
import { Water } from 'three/examples/jsm/objects/Water'
import { Layer } from './Layer'

export class Terrain {
  /**
     * @param {String} name name of the terrain object
     * @public
    */

  constructor (name) {
    this.geometry = null

    // Main Layer
    this.layer = new Layer(name)
  }

  /**
     * @param {Number} sizeX width
     * @param {Number} sizeY height
     * @param {Number} segments quality
     * @public
    */

  Ground (sizeX = 20, sizeY = 20, segments = 32) {
    const geometry = new THREE.PlaneBufferGeometry(sizeX, sizeY, segments)
    geometry.rotateX(Math.PI / 2)
    geometry.rotateZ(Math.PI)
    const ground = new THREE.Mesh(geometry, new CUBE_Material().Ground())

    this.layer.Add(ground)
    return this.layer.Layer()
  }

  /**
     * @param {Number} sizeX width
     * @param {Number} sizeY height
     * @param {Number} segments quality
     * @public
    */

  WaterGround (sizeX = 20, sizeY = 20, segments = 32) {
    const sun = new THREE.Light('#ffffff', 0.5)
    sun.position.set(0, 4, 0)
    const matWater = new CUBE_Material().GeoWater(sun, true)

    const geometry = new THREE.PlaneBufferGeometry(sizeX, sizeY, segments)
    geometry.rotateX(Math.PI / 2)
    geometry.rotateZ(Math.PI)

    const mesh = new Water(geometry, matWater)
    this.layer.Add(mesh)
    return this.layer.Layer()
  }

  /**
     * @param {ArrayBuffer} tiffData Get digital elevation model data from tiff image
     * @param {Number} heightScale Height scale
     * @param {options} options {color: 0x999999}
     * @param {THREE.Material} mat replacement material if required
     * @public
    */

  async GeoTiff (tiffData, heightScale = 30, options = {}, mat) {
    // Read and parse geotiff data from tif image
    const rawTiff = await GeoTIFF.fromArrayBuffer(tiffData)
    const tifImage = await rawTiff.getImage()

    // Obtain bounding box from geotiff image
    const bbox = tifImage.getBoundingBox() // 0: west Longitude, 1: south latitude, 2: east longitude, 3: north latitude

    // Get start(left-bottom) and end (right-top) coordinates
    const start = { longitude: bbox[0], latitude: bbox[1] }
    const end = { longitude: bbox[2], latitude: bbox[3] }

    // Calculate world position
    const leftBottom = new Coordinate('GPS', start).ComputeWorldCoordinate()
    const rightTop = new Coordinate('GPS', end).ComputeWorldCoordinate()

    // Set offset from center position
    const x = Math.abs(leftBottom.world.x - rightTop.world.x)
    const y = Math.abs(leftBottom.world.z - rightTop.world.z)

    // Initial a plane geometry
    const geometry = new THREE.PlaneGeometry(
      x,
      y,
      x - 1,
      y - 1
    )

    // Read image pixel values that each pixel corresponding a height
    const data = await tifImage.readRasters({ width: Math.floor(x), height: Math.floor(y), resampleMethod: 'bilinear', interleave: true })

    // Fill z values of the geometry
    for (let i = 0; i < data.length; i++) {
      const el = data[i]

      if (geometry.vertices[i]) {
        geometry.vertices[i].z = (el / heightScale)
      }
    }

    // Rotate
    geometry.rotateX(Math.PI / 2)
    geometry.rotateY(Math.PI)
    geometry.rotateZ(Math.PI)

    // Material
    const color = options.color ? options.color : 0x999999
    this.mat_terrain = mat || new CUBE_Material().Terrain({ color: color, side: THREE.DoubleSide, wireframe: true })

    // Create a plane mesh
    const plane = new THREE.Mesh(geometry, this.mat_terrain)
    this.layer.Add(plane)

    return this.layer.Layer()
  }
}
