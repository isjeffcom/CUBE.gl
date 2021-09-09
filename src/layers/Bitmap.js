/**
 * CUBE.GL
 * Layer: Bitmap layer, loading map, often as ground, require third party API
 * Jeff Wu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

import * as THREE from 'three'
import deepmerge from 'deepmerge'
import { Coordinate } from '../coordinate/Coordinate'

const tileDefaultOptions = {
  source: 'https://b.tile.openstreetmap.org/',
  size: 0.05 * window.CUBE_GLOBAL.MAP_SCALE,
  // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
  copyright: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}

/**
 * Create a bitmap layer
 * @class
*/

export class BitmapLayer {
  /**
     * Init layer
     * @param {String} name name of the layer
     * @public
    */

  constructor (name) {
    this.center = window.CUBE_GLOBAL.CENTER
    this.layer = new THREE.Group()
    this.layer.name = name
  }

  /**
     * Tilemap layer, based on openstreetmap wrap by Leaflet.js
     * @param {Object} opt options to overwrite config
     * @public
    */

  TileMap (opt = {}) {
    const options = deepmerge(tileDefaultOptions, opt)

    // let zoom = window.CUBE_GLOBAL.MAP_SCALE
    // zoom = zoom > 1 ? zoom : 1
    const zoom = 15

    const size = options.size * 256

    // Group for storage multiple objects
    const map = new THREE.Group()

    // let tile = deepmerge(tileDefaultOptions, options)
    const c = new Coordinate('GPS', this.center).ComputeTileCoordinate(zoom)

    // Fix the center offset due to the tile coordinate convertion lost
    // let offsetGPS = c.ReverseTileToGPS(zoom)
    // let offsetWorld = new Coordinate("GPS", offsetGPS).ComputeWorldCoordinate()
    // let offsetCenter = {x: (offsetWorld.world.x * options.size)  - (size/2), z: (offsetWorld.world.z * options.size) - (size/2)}

    // Get 9 mataix tiles
    const textures = []

    // 3x3
    // let m = [
    //     [-1, 1], [0, 1], [1, 1],
    //     [-1, 0],  [0, 0], [1, 0],
    //     [-1, -1], [0, -1], [1, -1],
    // ]

    // 5x5
    const m = [
      [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
      [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
      [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
      [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
      [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2]
    ]

    // let m = [[0,0]]

    // Download image as texture loaded into an array
    for (let i = 0; i < m.length; i++) {
      const x = c.tile.x - m[i][0]
      const y = c.tile.y - m[i][1]
      const req = options.source + zoom + '/' + x + '/' + y + '.png'
      const t = new THREE.TextureLoader().load(req)
      textures.push(t)
    }

    // Generate Geometry and attach textures
    for (let t = 0; t < textures.length; t++) {
      const geometry = new THREE.PlaneBufferGeometry(size, size, 1, 1)
      const mat = new THREE.MeshBasicMaterial({ map: textures[t] })
      geometry.rotateX(-Math.PI / 2)

      const ground = new THREE.Mesh(geometry, mat)
      ground.position.set(-m[t][0] * size, 0, -m[t][1] * size)
      map.add(ground)
    }

    map.position.set(c.tile.centerOffset.x * 4.1, 0, c.tile.centerOffset.y * 5.65)

    this.layer.add(map)
    return this.layer
  }
}
