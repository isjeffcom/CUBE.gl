import TWEEN from '@tweenjs/tween.js'
import { Coordinate } from '../coordinate/Coordinate'
import deepmerge from 'deepmerge'
import { Vector3 } from 'three'

let opt = {
    startNow: true,
    delay: 0,
    repeat: false
}

export class Animation {
    // State 0: stop, 1: playing, 2: paused, 99: infinite
    constructor(name, object, type, options={}){
        this.name = name
        this.object = object
        this.type = type
        
        // Storage state
        this.state = 0
        this.angle = 0

        // Tween object
        this.tween = null

        this.options = deepmerge(opt, options)
    }

    GPSPath(paths, duration){

        this.type == "tween"

        let altitude = this.object.position.y

        let all = new Vector3([], [], [])

        for(let i=0;i<paths.length;i++){

            let elPath = paths[i]
            elPath.altitude = altitude

            // Get Position
            let posi = new Coordinate("GPS", elPath).ComputeWorldCoordinate()
            all.x.push(-posi.world.x)
            all.y.push(posi.world.y)
            all.z.push(posi.world.z)

        }

        this.tween = new TWEEN.Tween(this.object.position).to(all, duration).easing(TWEEN.Easing.Linear.None)
        if(this.options.startNow) this.Play() // Start Now
        if(this.options.repeat) this.Loop() // Repeat Loop

        return this
    }

    Destroy(){
        if(this.tween) this.tween.stop()
    }

    Circular(){
        this.type = "circular"
        if(this.options.startNow) this.Play()
        if(this.options.repeat) this.Loop()
    }

    Play(){
        if(this.tween){
            if(this.options.delay != 0){
                setTimeout(()=>{
                    this.tween.start()
                }, this.options.delay)
            } else {
                this.tween.start()
            }
            
        }
        this.state = 1
    }

    Stop(){
        this.state = 0
    }

    Pause(){
        this.state = 2
    }

    Loop(){
        if(this.tween) this.tween.repeat(Infinity)
        this.state = 99
    }
}