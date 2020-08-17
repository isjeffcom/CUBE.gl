import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DefaultConfig } from './static/Config.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import merge from 'deepmerge'
import { Clone } from './utils/Clone'

// Import
import './static/Global'

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

        // Update Global Config
        window.CUBE_GLOBAL.CENTER = opt.center ? Clone(opt.center) : window.CUBE_GLOBAL.CENTER
        window.CUBE_GLOBAL.MAP_SCALE = opt.scale ? opt.scale : window.CUBE_GLOBAL.MAP_SCALE
        
        this.scale = window.CUBE_GLOBAL.MAP_SCALE

        this.three = THREE

        // Merge or overwrite options 
        let DefaultOptions = DefaultConfig()
        let options = opt ? merge(DefaultOptions, opt) : DefaultOptions
        this.options = options

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
        container.appendChild(this.renderer.domElement)


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
            container.appendChild( this.stats.dom )
        }

        // Save Instance to global for internal access
        //window.CUBE_GLOBAL.INS = this

        // Auto resize
        this.WindowResize()
        
        window.addEventListener( 'resize', ()=>{
            this.WindowResize(window)
        }, false )
    }

    Ray(event, layer){
        let mouse = {}
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
        this.raycaster.setFromCamera( mouse, this.camera )
        let intersects = this.raycaster.intersectObjects( layer )
        return intersects
    }

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
            if(this.isViewable()) this.AniEngine.Update()
        }

        if(this.ShaderEngine) this.ShaderEngine.Update()

        if(this.hasLookAt){
            this.lookats.forEach(LAObj => {
                if(LAObj) LAObj.lookAt(this.camera.position)
            })
        }
        
        if(this.options.debug) this.stats.update()
    }

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
            group = this.FindLayer(group)
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
        let group = this.FindLayer(name)
        for(let i=0;i<group.children.length;i++){
            let mesh = group.children[i]
            this.Delete(mesh, group)
        }
        this.scene.remove(group)
    }

    /**
     * Find a group in scene
     * @param {String} name Group name you wish to search for
     * @public
    */

    // Find a group 找到组
    FindLayer(name){

        let res = null
        let groups = this.scene.children

        for(let i=0;i<groups.length;i++){
            if(groups[i].name == name){
                res = groups[i]
            }
        }

        return res
    }

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
        if(this.AniEngine){ console.e("AnimationEngine has existed. You cannot add twice."); return }
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
        if(this.ShaderEngine){ console.e("ShaderEngine has existed. You cannot add twice."); return }
        this.ShaderEngine = shaderEngine
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

    isViewable(){
        if(this.camera.position.y < 60 && this.camera.position.x < 60){
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
}