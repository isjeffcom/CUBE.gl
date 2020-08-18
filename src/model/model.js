import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


export class Model{

    /**
     * @param {THREE.Vector3 || Object} coordinate {x,y,z} World coordinate
     * @public
    */

    constructor(coordinate){
        // If no world coordinate than computed
        this.position = new THREE.Vector3(coordinate.x, coordinate.y, coordinate.z)
        this.object = null
    }

    /**
     * Load a GLTF model, return object only
     * @param {THREE.Vector3 || Object} coordinate {x,y,z} World coordinate
     * @return {THREE.Object3D} return an 3d object
     * @public
    */

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

    /**
     * Attach another Object3D to this.object
     * @param {THREE.Object3D} obj another object
     * @return {THREE.Object3D} return an 3d object
     * @public
    */

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