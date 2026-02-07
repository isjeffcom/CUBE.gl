/**
 * CUBE.GL
 * User interaction functions
 * Jeff Wu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

import TWEEN from '@tweenjs/tween.js'
import { AnimationEngine } from '../animation/AnimationEngine'
import { Animation } from '../animation/Animation'
import { Coordinate } from '../coordinate/Coordinate'
import * as THREE from 'three'

export class Action {
  /**
     * Init an action component
     * @param {CUBE.Space} ins cube space instance
     * @public
    */

  constructor (ins) {
    this.ins = ins
    if (!this.ins.AniEngine) {
      this.ins.SetAniEngine(new AnimationEngine(ins))
    }
  }

  /**
     * Void: Focus on an object
     * @param {String || Number || THREE.Object3D} obj focus on object
     * @param {Object} options {duration: Number}
     * @public
    */

  FocusOn (obj, options = {}) {
    if (!obj) return

    // Get object center
    if (obj.geometry && !obj.geometry.boundingSphere) {
      obj.geometry.computeBoundingSphere()
    }

    let posi = obj.geometry.boundingSphere.center !== { x: 0, y: 0, z: 0 } ? obj.geometry.boundingSphere.center : obj.position
    posi = posi || obj.position
    this.FlyTo(posi, options.duration)
  }

  /**
     * Void: Fly to an GPS position
     * @param {Object} coor {latitude: Number, longitude: Number}
     * @param {Object} options {duration: Number}
     * @public
    */

  FlyToGPS (coor, options = {}) {
    let posi = new Coordinate('GPS', coor).ComputeWorldCoordinate()
    posi = new THREE.Vector3(-posi.world.x, posi.world.y, posi.world.z)
    this.FlyTo(posi, options.duration)
  }

  /**
     * Void: Fly to an GPS position
     * @param {Vector3} posi {x: Number, y: Number, z: Number}
     * @param {Number} duration animation duration time
     * @public
    */

  FlyTo (posi, duration) {
    const time = duration || 800

    // Camera destination: offset from target position, keep current height
    const dest = posi.clone()
    dest.x = dest.x + (0.5 * this.ins.scale)
    dest.y = this.ins.camera.position.y
    dest.z = dest.z + (0.5 * this.ins.scale)

    // Smoothly animate camera position
    const cameraAni = new Animation('_flyto_camera', this.ins.camera).MoveTo(dest, time)
    this.ins.AniEngine.Register(cameraAni)

    // Smoothly animate controls target in sync (avoids pitch jerk)
    const startTarget = this.ins.controls.target.clone()
    const endTarget = posi.clone()
    const controls = this.ins.controls

    new TWEEN.Tween(startTarget)
      .to({ x: endTarget.x, y: endTarget.y, z: endTarget.z }, time)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        controls.target.set(startTarget.x, startTarget.y, startTarget.z)
      })
      .start()
  }
}
