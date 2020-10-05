import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DefaultConfig } from './static/Config.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

import merge from 'deepmerge'
import { Clone } from './utils/Clone'
import { Listener } from './Listener.js'


import './static/Global'
import { Action } from './action/Action.js'


/**
 * Create a space, main CUBE instance
 * @class
*/

export class Space {

    /**
     * Main constructor, provides main space runtime, allow limited config, insert animation engine and shader engine
     * @param {document} container DOM Element, DOM <div> element for render
     * @param {Object} opt to overwrite global config
     * @public
    */

    constructor(container, opt={}){

        this.three = THREE
        this.container = container

        // Update Global Config, center and scale is essential
        window.CUBE_GLOBAL.CENTER = opt.center ? Clone(opt.center) : window.CUBE_GLOBAL.CENTER
        window.CUBE_GLOBAL.MAP_SCALE = opt.scale ? opt.scale : window.CUBE_GLOBAL.MAP_SCALE


        // Merge or overwrite options 
        let DefaultOptions = DefaultConfig()
        let options = opt ? merge(DefaultOptions, opt) : DefaultOptions
        this.options = options


        // Activate WASM
        if(options.lab.wasm) this.InitWASM()

        // Global Scale
        this.scale = window.CUBE_GLOBAL.MAP_SCALE

        // Map Center 
        this.center = options.center

        // Init Clock
        this.clock = new THREE.Clock()

        // Init Camera
        this.camera = new THREE.PerspectiveCamera(25, window.clientWidth/window.clientHeight, options.camera.near, options.camera.far)
        this.camera.position.set( options.camera.position.x, options.camera.position.y, options.camera.position.z )
        this.camera.name = options.camera.name ? options.camera.name : "Main-Camera"

        // Init Scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( parseInt("0x" + options.background))
        if(options.fog.enabled){
            this.scene.fog = new THREE.Fog( parseInt("0x" + options.fog.color), options.fog.near, options.fog.far )
        }

        // Init Light
        this.LoadLights(options.lights)

        // Init Ray Caster
        this.raycaster = new THREE.Raycaster()

        // Init render
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.shadowMap.enabled = false
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Print render result to canvas container
        this.container.appendChild(this.renderer.domElement)

        // Init Control
        this.controls = new MapControls( this.camera, this.renderer.domElement )
        this.controls.rotateSpeed = options.controls.rotateSpeed || 0.7 
        this.controls.enableDamping = options.controls.damping.enabled || true 
        this.controls.dampingFactor = options.controls.damping.factor || .25
        this.controls.minDistance = options.controls.minDistance || 10 
        this.controls.maxDistance = options.controls.maxDistance || 1000 
        
        // Auto Rotation
        this.controls.autoRotate = options.controls.autoRotate.enabled || false 
        this.controls.autoRotateSpeed = options.controls.autoRotate.speed || 1

        // Init Controls Update
        this.controls.update()

        // save all lookats object
        this.hasLookAt = false
        this.lookats = []

        //this.controls.addEventListener( 'change', this.Update() ); 

        // Debug Mode 
        // 调试模式
        if(options.debug){
            this.stats = new Stats()
            this.container.appendChild( this.stats.dom )
        }

        // Auto resize
        this.WindowResize()
        
        window.addEventListener('resize', ()=>{
            this.WindowResize(window)
        }, false )

        // Interaction
        this.listener = new Listener(this.container, options.interaction)
        if(options.interaction.enable){
            this.Action = new Action(this)
        }
        
    }

    

    // OBJECT MANIPULATION

    /**
     * Add an 3d object into scene
     * @param {THREE.Object3D} object3D Three.js Object3D object
     * @param {THREE.Group} group Three.js Group Object
     * @public
    */

    // Add and 3D Object to a group 添加一个3D物体进入场景
    Add(object3D, group){

        if(!group) group = this.scene

        // Support add to group by group name, add to scene if doesn't existed
        // 支持由组名搜索，如果组不存在则加到scene根层级中

        if(typeof group == "string"){
            group = this.Find(group)
            group = group ? group : this.scene
        }

        group.add(object3D)
        return object3D
    }


    /**
     * Delete an object from a group
     * @param {THREE.Object3D} object3D Three.js Object3D object
     * @param {THREE.Group} group Three.js Group Object
     * @public
    */

    Delete(object3D, group){
        if(!object3D) return false
        if(!group) group = this.scene
        if(object3D["geometry"]) object3D["geometry"].dispose()
        if(object3D["material"]) object3D["material"].dispose()
        group.remove( object3D )
        return true
    }

    /**
     * Add a group to scene
     * @param {String} name Group name
     * @public
    */

    AddLayer(name){
        
        let group = new THREE.Group()
        group.name = name
        this.scene.add(group)
        return group
    }

    /**
     * DeleteLayer a group
     * @param {String} name Group name
     * @public
    */

    DeleteLayer(name){
        let group = this.Find(name)
        for(let i=0;i<group.children.length;i++){
            let mesh = group.children[i]
            // 这里可能有问题，可能需要递归删
            this.Delete(mesh, group)
        }
        this.scene.remove(group)
    }

    /**
     * Find a group in scene
     * @param {String || Number || THREE.Object3D} obj you wish to search for
     * @param {Object} group layer
     * @public
    */

    // Find an object 找到某个对象
    Find(obj, group){

        group = group ? group : this.scene

        if(typeof obj === "string") return group.getObjectByName(obj)

        if(typeof obj === "number") return group.getObjectById(obj)

        if(typeof obj === "object" && obj["type"] === "Mesh") return obj

        // if(obj["children"] && Array.isArray(obj["chilren"])){
        //     for(let i=0;i<group.children.length;i++){
        //         if(obj === group.children[i]){
        //             return obj
        //         }
        //     }
        // }
    }

    /**
     * Set an object always lookat camera
     * @param {object3D} obj an array of type and THREE.Light objects. { "name": "front-left", "type": "Point", "color": "fafafa", "opacity": 0.4, "shadow": false,"position": {"x": 200, "y": 90, "z": 40}
     * @public
    */

    SetLookAt(object){
        this.lookats.push(object)
        if(this.lookats.length > 0) this.hasLookAt = true
    }

    /**
     * Remove an object always lookat camera
     * @param {object3D} obj an array of type and THREE.Light objects. { "name": "front-left", "type": "Point", "color": "fafafa", "opacity": 0.4, "shadow": false,"position": {"x": 200, "y": 90, "z": 40}
     * @public
    */

    RemoveLookAt(obj){
        let ready = []
        for(let i=0;i<this.lookats.length;i++){
            let lookat = this.lookats[i]
            if(lookat === obj){
                ready.push(i)
            }
        }

        for(let ii=0;ii<ready.length;ii++){
            this.lookats.splice(ready[ii], 1)
        }
    }

    // RUNTIME AND ANIMATION

    /**
     * Runtime rendering and controls/animation updates. Call it in requestAnimationFrame or setTimeout(()=>{}, gap)
     * @public
    */

   Runtime(){
        this.delta = this.clock.getDelta()
        this.time += this.delta

        this.renderer.render(this.scene, this.camera)
        this.controls.update()

        if(this.AniEngine){
            //if(this.isViewable()) this.AniEngine.Update()
            this.AniEngine.Update()
        }

        if(this.ShaderEngine) this.ShaderEngine.Update()

        if(this.hasLookAt){
            this.lookats.forEach(LAObj => {
                if(LAObj) LAObj.lookAt(this.camera.position)
            })
        }
        
        if(this.options.debug) this.stats.update()
    }

    // ENGINES

    /**
     * @class Getter to return current AnimationEngine
     * @public
    */

    GetAniEngine(){
        return this.AniEngine
    }

    /**
     * Set an AnimationEngine
     * @public
    */

    SetAniEngine(aniEngine){
        if(this.AniEngine){ console.warn("Animation Engine has already existed"); return }
        this.AniEngine = aniEngine
    }

    /**
     * Getter return the ShaderEngine
     * @public
    */

    GetShaderEngine(){
        return this.ShaderEngine
    }

    /**
     * Set an ShaderEngine
     * @public
    */

    SetShaderEngine(shaderEngine){
        if(this.ShaderEngine){ console.e("Shader Engine has existed."); return }
        this.ShaderEngine = shaderEngine
    }

    // INIT LOODER

    /**
     * Find a group in scene
     * @param {Array} lights an array of type and THREE.Light objects. { "name": "front-left", "type": "Point", "color": "fafafa", "opacity": 0.4, "shadow": false,"position": {"x": 200, "y": 90, "z": 40}
     * @public
    */

    // Init lights 初始化灯光
    LoadLights(lights){

        lights.forEach(el => {

            let light
        
            if(el.type == "Ambient"){
                light = new THREE.AmbientLight ( new THREE.Color(parseInt("0x" + el.color)) , el.opacity)
            }

            else if(el.type == "Point") {
                light = new THREE.PointLight( new THREE.Color(parseInt("0x" + el.color)), el.opacity)
                light.position.set(el.position.x, el.position.y, el.position.z)
            }

            light.castShadow = false

            light.name = el.name
            
            this.scene.add(light)
        })
        
    }

    /**
     * Check if camera too far then stop animation
     * @public
    */

    isViewable(){
        if(this.camera.position.y < this.scale * 6 && this.camera.position.x < this.scale * 6){
            return true
        } else {
            return false
        }
    }

    /**
     * Call when window resize, put this into resize EventListener
     * @public
    */

    WindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }


    /**
     * Init WASM module and loaded to global env
     * @public
    */

    async InitWASM(){
        window.CUBE_GLOBAL.WASMCAL = await import("./wasm/main.wasm")
        window.CUBE_GLOBAL.WASM = true
    }

    /**
     * Send a ray to check if touch/click object
     * @param {DOM Event} event: dom event auto generated by event listener
     * @param {CUBE.Layer.layer || THREE.Group || String} layer: optional. CUBE layer, Threejs group or name of the group/layer that added to the scene. If this param remain empty than Ray will search CUBE.Space.scene instead.
     * @public
    */

    Ray(event, layer){

        // GeoJson Layer compatiable setting

        // With merged object
        if(layer && layer.CUBE_TYPE === "GeoLayer" && layer.CUBE_COLLIDER.enabled){
            // Helper Debug
            //layer = this.Find(layer.name + "_colliders", layer)
            
            // Production
            layer = layer.CUBE_COLLIDER.colliders
        }

        // If not merge
        if(layer && layer.CUBE_TYPE === "GeoLayer" && !layer.CUBE_COLLIDER.enable){
            layer = layer.children[0]
        }

        // If is string
        if(layer && typeof layer === "string") layer = this.Find(layer)


        // Defind layer
        layer = layer ? layer.children : this.scene.children
        
        // Get mouse information from Action() class
        let uxEvt = event.detail.ux
        let mouse = {
            x: ( uxEvt.clientX / this.container.clientWidth ) * 2 - 1, 
            y: - ( uxEvt.clientY / this.container.clientHeight ) * 2 + 1
        }

        // Update Ray position as camera position
        this.raycaster.setFromCamera( mouse, this.camera )

        // Fire ray, check all objects intersect with the ray
        let intersects = this.raycaster.intersectObjects( layer )
        
        return intersects.length > 0 ? intersects[0].object : null

    }
    
}