import { Vector3 } from 'three'
import * as THREE from 'three'
import CUBE_Material from '../materials/CUBE_Material'

export class Shapes {
  /**
     * Create a basic shape
     * @param {String} name name of the shape
     * @param {Object || THREE.Vector3} position object position
     * @public
    */

  constructor (name = 'shape', position = new Vector3(0, 0, 0)) {
    this.name = name
    this.position = position
    this.position.x = -this.position.x
  }

  /**
     * Create a box
     * @param {Number} size box size
     * @param {Number} color color
     * @public
    */

  Box (size = 1, color = 0x00ff00) {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new CUBE_Material().Basic({ color: color })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(this.position.x, this.position.y, this.position.z)

    return cube
  }

  /**
     * Create a sphere
     * @param {Number} size box size
     * @param {Number} color color
     * @public
    */

  Sphere (size = 1, color = 0xff6600) {
    const geometry = new THREE.SphereGeometry(size / 2, 32, 16)
    const material = new CUBE_Material().Basic({ color: color })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(this.position.x, this.position.y, this.position.z)

    return sphere
  }

  /**
     * Create a cylinder
     * @param {Number} size box size
     * @param {Number} color color
     * @public
    */

  Cylinder (size = 1, color = 0xff6600) {
    const geometry = new THREE.CylinderGeometry(size / 4, size / 4, size, 32)
    const material = new CUBE_Material().Basic({ color: color })
    const cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.set(this.position.x, this.position.y, this.position.z)
    return cylinder
  }
}
