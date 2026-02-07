
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { getCenter } from 'geolib'
import { Coordinate } from '../coordinate/Coordinate'
import CUBE_Material from '../materials/CUBE_Material'

const axisX = new THREE.Vector3(1, 0, 0)
// let axisY = new THREE.Vector3(0,1,0)
// let axisZ = new THREE.Vector3(0,0,1)

// pass in an a single data
export default class Data {
  /**
     * Create a sphere
     * @param {String} name name of the data
     * @public
    */

  constructor (name) {
    this.name = name
    this._SCALE = window.CUBE_GLOBAL.MAP_SCALE
    this._HEIGHT_SCALE = 1 * this._SCALE
    // Ensure minimum segments for geometry (Three.js r133+ no longer clamps to 1 internally)
    this._SEGMENTS = Math.max(3, Math.round(16 * this._SCALE))
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

  Sphere (coordinate, value = 1, size = 2, yOffset = 0, color = 0xff6600, mat) {
    const localCoor = new Coordinate('GPS', coordinate).ComputeWorldCoordinate()

    const geometry = new THREE.SphereGeometry(size * 3, Math.max(16, value * size), Math.max(8, value * size))
    const material = mat || new THREE.MeshBasicMaterial({ color: color })
    const sphere = new THREE.Mesh(geometry, material)

    const y = localCoor.world.y + yOffset
    sphere.position.set(-localCoor.world.x, y, localCoor.world.z)
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

  Bar (coordinate, value = 1, size = 0.5, yOffset = 0, color = 0xff6600, mat) {
    const height = this._HEIGHT_SCALE * value

    size = size * this._SCALE

    const localCoor = new Coordinate('GPS', coordinate).ComputeWorldCoordinate()

    const geometry = new THREE.BoxGeometry(size, size, height, this._SEGMENTS) // top, bottom, height, segments

    const material = mat || new THREE.MeshPhongMaterial({ color: color })
    const bar = new THREE.Mesh(geometry, material)

    // Rotate around X 90deg
    bar.rotateOnAxis(axisX, THREE.MathUtils.degToRad(90))

    const y = localCoor.world.y + yOffset
    bar.position.set(-localCoor.world.x, y + ((height / 2)), localCoor.world.z)
    // bar.rotateY(Math.PI / 2)

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

  Cylinder (coordinate, value = 1, size = 0.5, yOffset = 0, color = 0xff6600, mat) {
    const height = this._HEIGHT_SCALE * value

    size = size * this._SCALE

    const localCoor = new Coordinate('GPS', coordinate).ComputeWorldCoordinate()

    const geometry = new THREE.CylinderGeometry(size, size, height, Math.max(16, this._SEGMENTS)) // top, bottom, height, radialSegments

    const material = mat || new THREE.MeshPhongMaterial({ color: color })
    const cylinder = new THREE.Mesh(geometry, material)

    // Rotate around X 90deg 绕X轴旋转90度
    // cylinder.rotateOnAxis(axisX, THREE.Math.degToRad(90))
    const y = localCoor.world.y + yOffset
    cylinder.position.set(-localCoor.world.x, y + ((height / 2)), localCoor.world.z)

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

  Arc (coorA, coorB, height = 5, yOffset = 0, color = 0xff6600, mat) {
    height = height * this._SCALE
    const localA = new Coordinate('GPS', coorA).ComputeWorldCoordinate()
    const localB = new Coordinate('GPS', coorB).ComputeWorldCoordinate()

    const startPoint = new THREE.Vector3(-localA.world.x, localA.world.y + yOffset, localA.world.z)
    const endPoint = new THREE.Vector3(-localB.world.x, localB.world.y + yOffset, localB.world.z)

    // Midpoint between start and end
    const mid = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5)

    // Horizontal direction from start to end
    const dir = new THREE.Vector3().subVectors(endPoint, startPoint)
    const halfDist = dir.length() / 2
    dir.normalize()

    // Vertical direction
    const up = new THREE.Vector3(0, 1, 0)

    // Generate semicircular arc points using parametric equation
    // When height === halfDist, it's a perfect semicircle
    // Otherwise it's a semi-elliptical arc
    const segments = 64
    const points = []
    for (let i = 0; i <= segments; i++) {
      const t = Math.PI * i / segments // 0 → π
      const point = new THREE.Vector3()
      point.copy(mid)
      point.addScaledVector(dir, -Math.cos(t) * halfDist) // horizontal: start → end
      point.addScaledVector(up, Math.sin(t) * height) // vertical: 0 → height → 0
      points.push(point)
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.computeBoundingSphere()

    const material = mat || new THREE.LineBasicMaterial({ color: color, linewidth: 1 })
    const arc = new THREE.Line(geometry, material)
    arc.name = this.name

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

  Text (coordinate, text, size = 30, color, thickness = 0.1, fontface, mat) {
    const font = new CUBE_Material().TextFont(fontface || undefined)

    const localCoor = new Coordinate('GPS', coordinate).ComputeWorldCoordinate()

    const geometry = new TextGeometry(text, {
      font: font,
      size: size,
      depth: thickness,
      curveSegments: Math.max(3, Math.round(size / 6))
    })

    geometry.center()

    const textColor = color || 0xff0000
    const mesh = new THREE.Mesh(geometry, mat || new CUBE_Material().Text({ color: textColor }))

    mesh.position.set(-localCoor.world.x, localCoor.world.y, localCoor.world.z)
    mesh.name = this.name

    return mesh
  }
}

export { Data }
