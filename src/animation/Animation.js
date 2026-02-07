import TWEEN from '@tweenjs/tween.js'
import { Coordinate } from '../coordinate/Coordinate'
import deepmerge from 'deepmerge'
import { Vector3 } from 'three'

const opt = {
  startNow: true,
  delay: 0,
  haveEnd: true,
  repeat: false
}

export class Animation {
  // State 0: stop, 1: playing, 2: paused, 99: infinite

  /**
     * @param {String} name animation name
     * @param {Object3D} object a 3D object
     * @param {Object} options config {startNow: Boolean, delay: Number, repeat: Boolean}
     * @public
    */
  constructor (name, object, type, options = {}) {
    this.name = name
    this.object = object
    this.type = type

    // Storage state
    this.state = 0
    this.angle = 0

    // Tween object
    this.tween = null
    this.distance = null

    this.options = deepmerge(opt, options)
  }

  /**
     * @param {Array} paths an array of paths, paths[0]: {latitude: Number, longitude: Number, altitude: Number}
     * @param {Number} duration how long of this animation
     * @public
    */

  GPSPath (paths, duration) {
    this.type = 'tween'

    const all = new Vector3([], [], [])

    for (let i = 0; i < paths.length; i++) {
      const elPath = paths[i]

      // Get Position
      const posi = new Coordinate('GPS', elPath).ComputeWorldCoordinate()
      all.x.push(-posi.world.x)
      all.y.push(posi.world.y)
      all.z.push(posi.world.z)
    }

    this.tween = new TWEEN.Tween(this.object.position).to(all, duration).easing(TWEEN.Easing.Linear.None)
    if (this.options.startNow) this.Play() // Start Now
    if (this.options.repeat) this.Loop() // Repeat Loop

    return this
  }

  /**
     * @param {THREE.Object3D} object an array of paths
     * @param {THREE.Vector3 || Object || Array} endPosi {x, y, z} || [{x,y,z}, {x,y,z}]
     * @param {Object} options {easing: "linear" || "ease-out"}
     * @public
    */

  MoveTo (endPosi, duration, options = {}) {
    this.type = 'ins_tween'

    let end = new Vector3([], [], [])

    if (Array.isArray(endPosi)) {
      for (let i = 0; i < endPosi.length; i++) {
        const ani = endPosi[i]
        end.x.push(ani.x)
        end.y.push(ani.y)
        end.z.push(ani.z)
      }
    } else {
      end = endPosi
    }

    const easingType = options.easing || options.easing === 'linear' ? TWEEN.Easing.Linear.None : TWEEN.Easing.Quadratic.Out
    this.tween = new TWEEN.Tween(this.object.position)
      .to(end, duration)
      .easing(easingType)
    // .onUpdate(function(coor) {
    //     // self.object.position.x = coor.x
    //     // self.object.position.y = coor.y
    //     // self.object.position.z = coor.z
    // })

    this.Play() // Start Now, no loop

    return this
  }

  /**
     * @param {Number} distance how long the line is
     * @public
    */

  /**
   * @param {Number} distance total line length
   * @param {Number} totalInstances total line segment count (for Line2 fat line animation)
   */
  DashLine (distance, totalInstances) {
    this.type = 'dashline'
    this.distance = distance
    this.speedStep = distance / 600
    this.totalInstances = totalInstances || 0
    return this
  }

  /**
     * @param {Number} radius rotating radius
     * @param {Number} height rotating altitude
     * @public
    */

  Circular (radius = 5, height = 5) {
    this.type = 'circular'
    this.radius = radius
    this.height = height
    if (this.options.startNow) this.Play()
    if (this.options.repeat) this.Loop()
    return this
  }

  Destroy () {
    if (this.tween) this.tween.stop()
  }

  Play () {
    if (this.tween) {
      if (this.options.delay !== 0) {
        setTimeout(() => {
          this.tween.start()
        }, this.options.delay)
      } else {
        this.tween.start()
      }
    }
    this.state = 1
  }

  Stop () {
    this.state = 0
  }

  Pause () {
    this.state = 2
  }

  Loop () {
    if (this.tween) this.tween.repeat(Infinity)
    this.state = 99
  }
}
