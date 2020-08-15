import * as THREE from 'three'

export class Layer {
    constructor(name){
        this.layer = new THREE.Group()
        this.layer.name = name
    }

    Layer(){
        return this.layer
    }

    /**
     * Add an object into layer
     * @param {THREE.Object3D} object3D 3d object
     * @public
    */

    Add(object3D){
        this.layer.add(object3D)
        return this.layer
    }

    /**
     * Remove and dispose an object into layer
     * @param {THREE.Object3D} object3D 3d object
     * @public
    */

    Remove(object3D){
        if(object3D["geometry"]) object3D["geometry"].dispose()
        if(object3D["material"]) object3D["material"].dispose()
        this.layer.remove(object3D)
        return this.layer
    }

    /**
     * Remove all object in this layer
     * @public
    */

    Clear(){
        console.log(this.layer)
        for(let i=0;i<this.layer.children.length;i++){
            let obj = this.layer.children[i]
            if(obj["geometry"]) obj["geometry"].dispose()
            if(obj["material"]) obj["material"].dispose()
        }

        this.layer.children = []
        return this.layer
    }

    /**
     * Find an object in this layer
     * @param {String} name name of the object
     * @public
    */

    Find(name){
        return this.layer.getObjectByName(name)
    }
}