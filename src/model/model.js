import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'



export class Model{

    constructor(coordinate){
        // If no world coordinate than computed
        this.position = new THREE.Vector3(coordinate.x, coordinate.y, coordinate.z)
        this.object = null
    }

    Update(position){
        this.position = position
    }

    LoadGLTF(url, name, displayName, scale){
        
        return new Promise((resolve, reject) => {

            let GLTF = new GLTFLoader()

            GLTF.load(url, obj => {
                let object = obj.scene.children[0]
                object.position.set(this.position.x, this.position.y, this.position.z)
            
                object.name = name
                object.displayName = displayName

                if(scale){
                    object.scale.x = scale
                    object.scale.y = scale
                    object.scale.z = scale
                }

                this.object = object

                resolve(this.object)

            }, null, reject)
          })
    }

    Attach(obj){
        if(Array.isArray(obj)){
            for(let i=0;i<obj.length;i++){
                this.object.add(obj[i])
            }
        } else {
            this.object.add(obj)
        }

        return this.object
    }

}