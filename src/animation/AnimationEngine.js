import TWEEN from '@tweenjs/tween.js'
import { Layer } from '../layers/Layer'

export class AnimationEngine{

    constructor(ins){
        this.ins = ins
        this.allTween = []
        this.allCircular = []
        this.allDash=[]
        this.aniGroup = new Layer("_animation")
    }

    Register(animation){
        if(animation.type === "tween"){
            this.allTween.push(animation)
            this.aniGroup.Add(animation.object)
        }

        if(animation.type === "circular"){
            this.allCircular.push(animation)
            this.aniGroup.Add(animation.object)
        }

        if(animation.type === "dashline"){
            this.allDash.push({object: animation.object, distance: animation.distance, speedStep: animation.speedStep})
            this.aniGroup.Add(animation.object)
        }

        this.ins.Add(this.aniGroup.Layer())
    }

    Clear(){
        for(let i=0;i<this.allTween.length;i++){
            this.allTween[i].Destroy()
        }
        this.allTween = []
        this.allCircular = []
        this.aniGroup.Clear()
        this.ins.Delete(this.aniGroup)
    }

    Update(){
        if(this.allCircular.length > 0){

            this.allCircular.forEach(ani => {

                // if(ani.state != 1) return

                if(ani){
                    ani.angle += 0.005
    
                    let x = 3 * Math.sin(ani.angle)
        
                    let z = 3 * Math.cos(ani.angle)
        
                    ani.object.position.set(x, 5, z)
                }
                
            })
        }

        if(this.allTween.length > 0){
    
            TWEEN.update()
        }

        if(this.allDash.length > 0){
    
            for(let i=0;i<this.allDash.length;i++){
                let line = this.allDash[i]

                let dash = parseInt(line.object.material.dashSize)
                let length = parseInt(line.distance)

                if (dash > length) {
                //console.log("b")
                line.object.material.dashSize = 0
                line.object.material.opacity = 1
                } else {
                    //console.log("a")
                    line.object.material.dashSize += line.speedStep
                    line.object.material.opacity = line.object.material.opacity > 0 ? line.object.material.opacity - 0.002 : 0
                }
            }
        }

    }
}