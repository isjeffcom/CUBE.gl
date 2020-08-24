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

        // Instant tween will not be recorded
        if(animation.type === "ins_tween") // do nothing

        if(animation.type === "tween"){
            this.allTween.push(animation)
            this.aniGroup.Add(animation.object)
            //this.CleanTween()
        }

        if(animation.type === "circular"){
            this.allCircular.push({object: animation.object, radius: animation.radius, height: animation.height, angle: animation.angle})
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

    // Clean Tween Animation of which already stopped
    CleanTween(){

        if(this.allTween.length < 1) return

        let readyToDel = []
        for(let i=0;i<this.allTween.length;i++){
            if(this.allTween[i] && this.allTween[i].options.haveEnd && this.allTween[i].tween._isPlaying == false){
                readyToDel.push(i)
            }
        }

        for(let c=0;c<readyToDel.length;c++){
            this.allTween[c].Destroy()
            this.allTween.splice(readyToDel, 1)
        }
    }

    Update(){
        if(this.allCircular.length > 0){

            this.allCircular.forEach(ani => {

                // if(ani.state != 1) return

                if(ani){
                    ani.angle += 0.005
    
                    let x = ani.radius * Math.sin(ani.angle)
        
                    let z = ani.radius * Math.cos(ani.angle)
        
                    ani.object.position.set(x, ani.height, z)
                }
                
            })
        }

        // Tweenjs instance update
        TWEEN.update()

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