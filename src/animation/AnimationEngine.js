import TWEEN from '@tweenjs/tween.js'
import { Layer } from '../layers/Layer'

export class AnimationEngine{

    constructor(ins){
        this.ins = ins
        this.allTween = []
        this.allCircular = []
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

                ani.angle += 0.005
    
                let x = 3 * Math.sin(ani.angle)
    
                let z = 3 * Math.cos(ani.angle)
    
                ani.object.position.set(x, 5, z)
            })
        }

        if(this.allTween.length > 0){
    
            TWEEN.update()
        }

    }
}