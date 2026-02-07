import * as THREE from 'three'

/**
 * CUBE.gl - WebGL-powered geographic data visualization framework
 */

// ============ Core ============

export interface CubeConfig {
  /** Map scale factor */
  scale: number
  /** Map center GPS coordinate */
  center: GPSCoordinate
  /** Background color hex string (without #), e.g. "333333" */
  background?: string
  /** Camera configuration */
  camera?: {
    name?: string
    type?: string
    near?: number
    far?: number
    position?: { x: number; y: number; z: number }
  }
  /** Renderer configuration */
  renderer?: {
    antialias?: boolean
    shadowMap?: { enabled: boolean }
  }
  /** Controls configuration */
  controls?: {
    type?: string
    rotateSpeed?: number
    damping?: { enabled: boolean; factor: number }
    screenSpacePanning?: boolean
    autoRotate?: { enabled: boolean; speed: number }
    minDistance?: number
    maxDistance?: number
  }
  /** Light configuration array */
  lights?: LightConfig[]
  /** Fog configuration */
  fog?: {
    enabled: boolean
    color: string
    near: number
    far: number
  }
  /** Interaction configuration */
  interaction?: {
    enable: boolean
    select?: boolean
    hover?: boolean
  }
  /** Enable debug mode (shows FPS stats) */
  debug?: boolean
  /** Lab features */
  lab?: {
    wasm?: boolean
  }
}

export interface LightConfig {
  /** Light name identifier */
  name: string
  /** Light type: "Ambient" | "Point" | "Directional" | "Hemisphere" */
  type: 'Ambient' | 'Point' | 'Directional' | 'Hemisphere'
  /** Color hex string (without #), e.g. "fafafa" */
  color: string
  /** Light intensity. Ambient: multiplier (0.5-5), Point: candela (1000-100000), Directional: lux (1-10) */
  intensity?: number
  /** @deprecated Use intensity instead */
  opacity?: number
  /** Enable shadow casting */
  shadow?: boolean
  /** Light position (for Point and Directional) */
  position?: { x: number; y: number; z: number }
  /** Decay rate for Point lights (default: 2, physically correct) */
  decay?: number
  /** Max distance for Point lights (0 = infinite) */
  distance?: number
  /** Ground color for Hemisphere lights */
  groundColor?: string
}

export interface GPSCoordinate {
  latitude: number
  longitude: number
  altitude?: number
}

export interface WorldCoordinate {
  x: number
  y: number
  z: number
}

/**
 * Main CUBE.gl space instance - manages scene, camera, renderer and runtime
 */
export class Space {
  /** Three.js module reference */
  three: typeof THREE
  /** Three.js scene */
  scene: THREE.Scene
  /** Three.js camera */
  camera: THREE.PerspectiveCamera
  /** Three.js renderer */
  renderer: THREE.WebGLRenderer
  /** Map controls */
  controls: any
  /** Space options */
  options: CubeConfig
  /** Map scale */
  scale: number
  /** Action handler (available when interaction is enabled) */
  Action: Action

  /**
   * Create a CUBE.gl space
   * @param container - DOM element to render into
   * @param opt - Configuration options (center and scale are required)
   */
  constructor(container: HTMLElement, opt: CubeConfig)

  /**
   * Add a 3D object to the scene or a group
   * @param object3D - Three.js Object3D to add
   * @param group - Target group (name string, Group object, or undefined for scene root)
   * @returns The added object
   */
  Add(object3D: THREE.Object3D, group?: THREE.Group | string): THREE.Object3D

  /**
   * Remove and dispose a 3D object
   * @param object3D - Object to remove
   * @param group - Group to remove from (defaults to scene)
   */
  Delete(object3D: THREE.Object3D, group?: THREE.Group): boolean

  /**
   * Create and add a named group (layer) to the scene
   * @param name - Layer name
   * @returns The created group
   */
  AddLayer(name: string): THREE.Group

  /**
   * Remove a layer and dispose all its children
   * @param name - Layer name to delete
   */
  DeleteLayer(name: string): void

  /**
   * Find an object in the scene by name, id, or reference
   * @param obj - Name string, numeric id, or Object3D reference
   * @param group - Group to search in (defaults to scene)
   */
  Find(obj: string | number | THREE.Object3D, group?: THREE.Group): THREE.Object3D | undefined

  /**
   * Make an object always face the camera
   * @param object - Object to set look-at behavior
   */
  SetLookAt(object: THREE.Object3D): void

  /**
   * Remove look-at behavior from an object
   * @param obj - Object to remove look-at from
   */
  RemoveLookAt(obj: THREE.Object3D): void

  /**
   * Runtime loop - call this in requestAnimationFrame
   */
  Runtime(): void

  /** Get the current AnimationEngine */
  GetAniEngine(): AnimationEngine | undefined

  /** Set an AnimationEngine instance */
  SetAniEngine(aniEngine: AnimationEngine): void

  /** Get the current ShaderEngine */
  GetShaderEngine(): ShaderEngine | undefined

  /** Set a ShaderEngine instance */
  SetShaderEngine(shaderEngine: ShaderEngine): void

  /**
   * Cast a ray to detect clicked/touched objects
   * @param event - DOM event from cube-select or cube-hover listener
   * @param layer - Optional layer/group to search in
   * @returns The intersected object, or null
   */
  Ray(event: CustomEvent, layer?: THREE.Group | string): THREE.Object3D | null

  /**
   * Export a 3D object to OBJ format string
   * @param obj - Object to export
   * @returns OBJ format string
   */
  exportOBJ(obj: THREE.Object3D): string
}

// ============ Layers ============

/**
 * Base layer class
 */
export class Layer {
  constructor(name: string)
  /** Return the Three.js Group */
  Layer(): THREE.Group
  /** Add an object to this layer */
  Add(object3D: THREE.Object3D): THREE.Group
  /** Remove and dispose an object from this layer */
  Delete(object3D: THREE.Object3D): THREE.Group
  /** Remove all objects from this layer */
  Clear(): THREE.Group
  /** Find an object by name */
  Find(name: string): THREE.Object3D | undefined
}

export interface BuildingOptions {
  /** Merge geometries for better performance (default: false) */
  merge?: boolean
  /** Building color */
  color?: number
  /** Enable invisible colliders for raycasting when merged */
  collider?: boolean
  /** Terrain object for altitude fitting */
  terrain?: THREE.Group
}

export interface RoadOptions {
  /** Road color (default: 0x4287f5) */
  color?: number
  /** Road width (default: 12) */
  width?: number
  /** Terrain object for altitude fitting */
  terrain?: THREE.Group
}

export interface RoadSpOptions extends RoadOptions {
  /** Enable dash line animation */
  animation?: boolean
  /** AnimationEngine instance (required when animation is true) */
  animationEngine?: AnimationEngine
  /** Animation line color (default: 0x00FFFF) */
  animationColor?: number
}

export interface AdministrativeMapOptions {
  /** Show borders */
  border?: boolean
  /** Extrude height */
  height?: number
  /** Merge geometries for performance */
  merge?: boolean
  /** Enable colliders */
  collider?: boolean
}

export interface PolygonOptions {
  /** Polygon color */
  color?: number
  /** Extrude height */
  height?: number
  /** Merge geometries for performance */
  merge?: boolean
}

/**
 * Geographic layer for buildings, roads, water, and administrative maps
 */
export class GeoLayer {
  /**
   * @param name - Layer name
   * @param geojson - GeoJSON data object
   */
  constructor(name: string, geojson: any)

  /**
   * Render administrative/political map boundaries
   * @param options - Map options
   * @param matMap - Optional replacement material for map faces
   * @param matLine - Optional replacement material for borders
   */
  AdministrativeMap(options?: AdministrativeMapOptions, matMap?: THREE.Material, matLine?: THREE.Material): THREE.Group

  /**
   * Render buildings from GeoJSON data
   * @param options - Building options
   * @param mat - Optional replacement material
   */
  Buildings(options?: BuildingOptions, mat?: THREE.Material): THREE.Group

  /**
   * Render roads as fat lines (Line2)
   * @param options - Road options
   * @param mat - Optional replacement material
   */
  Road(options?: RoadOptions, mat?: THREE.Material): THREE.Group

  /**
   * Render roads with optional dash animation
   * @param options - Road options with animation support
   * @param mat - Optional replacement material
   */
  RoadSp(options?: RoadSpOptions, mat?: THREE.Material): THREE.Group

  /**
   * Render water bodies
   * @param options - { merge?: boolean }
   */
  Water(options?: { merge?: boolean }): THREE.Group

  /**
   * Render custom polygons
   * @param options - Polygon options
   * @param mat - Optional replacement material
   */
  Polygon(options?: PolygonOptions, mat?: THREE.Material): THREE.Group
}

/** @deprecated Use GeoLayer instead */
export const GeoJsonLayer: typeof GeoLayer

/**
 * Bitmap tile map layer
 */
export class BitmapLayer {
  constructor(name: string)
  /**
   * Create a tile map from OpenStreetMap or custom tile source
   * @param opt - { source?: string, size?: number }
   */
  TileMap(opt?: { source?: string; size?: number }): THREE.Group
}

/**
 * Terrain layer for ground, water ground, and GeoTIFF elevation
 */
export class Terrain {
  constructor(name?: string)

  /**
   * Create a flat ground plane
   * @param sizeX - Width (default: 20)
   * @param sizeY - Height (default: 20)
   * @param segments - Quality segments (default: 32)
   */
  Ground(sizeX?: number, sizeY?: number, segments?: number): THREE.Group

  /**
   * Create a water surface ground
   */
  WaterGround(sizeX?: number, sizeY?: number, segments?: number): THREE.Group

  /**
   * Create terrain from GeoTIFF elevation data
   * @param tiffData - ArrayBuffer of TIFF image
   * @param heightScale - Height multiplier (default: 30)
   * @param options - { color?: number }
   * @param mat - Optional replacement material
   */
  GeoTiff(tiffData: ArrayBuffer, heightScale?: number, options?: { color?: number }, mat?: THREE.Material): Promise<THREE.Group>
}

/**
 * Custom polygon layer
 */
export class Polygon {
  constructor(name: string, coors: number[][][])
  /**
   * Create an extruded polygon
   * @param info - Polygon metadata
   * @param options - { height?: number, color?: number }
   * @param mat - Optional replacement material
   */
  Ground(info?: object, options?: { height?: number; color?: number }, mat?: THREE.Material): THREE.Group
}

// ============ Data Visualization ============

/**
 * Single data point visualization (sphere, bar, cylinder, arc, text)
 */
export class Data {
  constructor(name?: string)

  /**
   * Create a sphere at a GPS coordinate
   * @param coordinate - GPS position
   * @param value - Size multiplier (default: 1)
   * @param size - Base size (default: 2)
   * @param yOffset - Vertical offset (default: 0)
   * @param color - Color (default: 0xff6600)
   * @param mat - Optional replacement material
   */
  Sphere(coordinate: GPSCoordinate, value?: number, size?: number, yOffset?: number, color?: number, mat?: THREE.Material): THREE.Mesh

  /**
   * Create a vertical bar (box) at a GPS coordinate
   * @param coordinate - GPS position
   * @param value - Height multiplier (default: 1)
   * @param size - Base size (default: 0.5)
   * @param yOffset - Vertical offset (default: 0)
   * @param color - Color (default: 0xff6600)
   * @param mat - Optional replacement material
   */
  Bar(coordinate: GPSCoordinate, value?: number, size?: number, yOffset?: number, color?: number, mat?: THREE.Material): THREE.Mesh

  /**
   * Create a cylinder at a GPS coordinate
   */
  Cylinder(coordinate: GPSCoordinate, value?: number, size?: number, yOffset?: number, color?: number, mat?: THREE.Material): THREE.Mesh

  /**
   * Create a semicircular arc between two GPS coordinates
   * @param coorA - Start GPS position
   * @param coorB - End GPS position
   * @param height - Arc peak height (default: 5). When height equals half the distance between A and B, it forms a perfect semicircle
   * @param yOffset - Vertical offset (default: 0)
   * @param color - Color (default: 0xff6600)
   * @param mat - Optional replacement material
   */
  Arc(coorA: GPSCoordinate, coorB: GPSCoordinate, height?: number, yOffset?: number, color?: number, mat?: THREE.Material): THREE.Line

  /**
   * Create 3D text at a GPS coordinate
   * @param coordinate - GPS position
   * @param text - Text content
   * @param size - Font size (default: 30)
   * @param color - Color (default: 0xff0000)
   * @param thickness - Text depth/thickness (default: 0.1)
   * @param fontface - Custom font JSON object
   * @param mat - Optional replacement material
   */
  Text(coordinate: GPSCoordinate, text: string, size?: number, color?: number, thickness?: number, fontface?: object, mat?: THREE.Material): THREE.Mesh
}

/**
 * Dataset visualization for arrays of data points (point cloud, heatmap)
 */
export class Datasets extends Data {
  /**
   * @param name - Dataset name
   * @param data - Array of { location: GPSCoordinate, val: number }
   */
  constructor(name: string, data: Array<{ location: GPSCoordinate; val: number }>)

  /** Create a point cloud from the dataset */
  PointCloud(): THREE.Group

  /**
   * Create a heatmap from the dataset
   * @param size - Canvas size (default: 60)
   * @param radius - Highlight radius (default: 2.5)
   */
  Heatmap(size?: number, radius?: number): THREE.Group
}

// ============ Model ============

/**
 * 3D model loader (GLTF)
 */
export class Model {
  /**
   * @param coordinate - World position { x, y, z }
   */
  constructor(coordinate: WorldCoordinate)

  /**
   * Load a GLTF/GLB model
   * @param url - URL to the GLTF file
   * @param name - Object name
   * @param displayName - Display name
   * @param scale - Uniform scale factor
   * @returns Promise resolving to the loaded Object3D
   */
  LoadGLTF(url: string, name: string, displayName?: string, scale?: number): Promise<THREE.Object3D>

  /**
   * Attach other objects to the loaded model
   * @param obj - Object or array of objects to attach
   */
  Attach(obj: THREE.Object3D | THREE.Object3D[]): THREE.Object3D
}

// ============ Shapes ============

/**
 * Basic 3D shape primitives
 */
export class Shapes {
  /**
   * @param name - Shape name (default: "shape")
   * @param position - World position (default: {x:0, y:0, z:0})
   */
  constructor(name?: string, position?: THREE.Vector3 | WorldCoordinate)

  /**
   * Create a box
   * @param size - Box size (default: 1)
   * @param color - Color (default: 0x00ff00)
   */
  Box(size?: number, color?: number): THREE.Mesh

  /**
   * Create a sphere
   * @param size - Sphere diameter (default: 1)
   * @param color - Color (default: 0xff6600)
   */
  Sphere(size?: number, color?: number): THREE.Mesh

  /**
   * Create a cylinder
   * @param size - Cylinder size (default: 1)
   * @param color - Color (default: 0xff6600)
   */
  Cylinder(size?: number, color?: number): THREE.Mesh
}

// ============ Animation ============

/**
 * Animation definition for objects
 */
export class Animation {
  /** Current state: 0=stop, 1=playing, 2=paused, 99=infinite */
  state: number

  /**
   * @param name - Animation name
   * @param object - 3D object to animate
   * @param type - Animation type identifier
   * @param options - { startNow?: boolean, delay?: number, haveEnd?: boolean, repeat?: boolean }
   */
  constructor(name: string, object: THREE.Object3D, type?: string, options?: {
    startNow?: boolean
    delay?: number
    haveEnd?: boolean
    repeat?: boolean
  })

  /**
   * Animate along a GPS path
   * @param paths - Array of GPS coordinates (with optional altitude)
   * @param duration - Animation duration in ms
   */
  GPSPath(paths: GPSCoordinate[], duration: number): Animation

  /**
   * Move object to a position
   * @param endPosi - Target position or array of waypoints
   * @param duration - Duration in ms
   * @param options - { easing?: "linear" | "ease-out" }
   */
  MoveTo(endPosi: THREE.Vector3 | WorldCoordinate | WorldCoordinate[], duration: number, options?: { easing?: string }): Animation

  /**
   * Dash line animation
   * @param distance - Total line length
   */
  DashLine(distance: number): Animation

  /**
   * Circular orbit animation
   * @param radius - Orbit radius (default: 5)
   * @param height - Orbit height (default: 5)
   */
  Circular(radius?: number, height?: number): Animation

  /** Play the animation */
  Play(): void
  /** Stop the animation */
  Stop(): void
  /** Pause the animation */
  Pause(): void
  /** Loop the animation infinitely */
  Loop(): void
  /** Destroy/cleanup the animation */
  Destroy(): void
}

/**
 * Animation engine - manages and updates all registered animations
 */
export class AnimationEngine {
  /**
   * @param ins - CUBE.Space instance
   */
  constructor(ins: Space)

  /**
   * Register an animation to be managed by this engine
   * @param animation - Animation instance to register
   */
  Register(animation: Animation): void

  /** Clear all animations */
  Clear(): void

  /** Update all animations (called automatically by Space.Runtime) */
  Update(): void
}

// ============ Shader ============

/**
 * Shader engine for custom visual effects
 */
export class ShaderEngine {
  constructor(ins: Space)

  /**
   * Register a shader uniform for animation
   * @param object - Object with ShaderMaterial
   * @param type - "uniforms"
   * @param node - Uniform name
   * @param range - { max: number, step: number, min: number }
   */
  Register(object: THREE.Mesh, type: string, node: string, range: { max: number; step: number; min: number }): void

  /** Update all registered shaders */
  Update(): void
}

// ============ Coordinate ============

/**
 * Coordinate transformation between GPS (WGS84) and Three.js world positions
 */
export class Coordinate {
  /** Computed world coordinate */
  world: WorldCoordinate
  /** GPS coordinate */
  gps: GPSCoordinate
  /** Tile coordinate */
  tile: { x: number; y: number; centerOffset: { x: number; y: number } }

  /**
   * @param type - "GPS" or "World"
   * @param coor - GPS coordinate { latitude, longitude, altitude? } or World coordinate { x, y, z }
   */
  constructor(type: 'GPS' | 'World', coor: GPSCoordinate | WorldCoordinate)

  /**
   * Convert GPS coordinate to Three.js world position (relative to center)
   * @returns this (for chaining)
   */
  ComputeWorldCoordinate(): Coordinate

  /**
   * Convert GPS coordinate to tile map coordinate
   * @param zoom - Tile zoom level
   * @returns this (for chaining)
   */
  ComputeTileCoordinate(zoom: number): Coordinate

  /**
   * Reverse tile coordinate back to GPS
   * @param zoom - Tile zoom level
   */
  ReverseTileToGPS(zoom: number): GPSCoordinate | undefined
}

// ============ High-level API ============

/**
 * High-level city API - downloads and renders city data from OpenStreetMap
 */
export class City {
  /**
   * @param range - City range in meters (default: 1000)
   * @param options - { API_MAP?: string, API_TERRAIN?: string }
   */
  constructor(range?: number, options?: { API_MAP?: string; API_TERRAIN?: string })

  /**
   * Download and render buildings
   * @param name - Layer name (default: "building")
   * @param options - Building options (default: { merge: true, color: 0xE5E5E5 })
   * @param material - Optional replacement material
   */
  Buildings(name?: string, options?: BuildingOptions, material?: THREE.Material): Promise<THREE.Group>

  /**
   * Download and render roads
   * @param name - Layer name (default: "roads")
   * @param options - Road options
   * @param material - Optional replacement material
   */
  Roads(name?: string, options?: RoadOptions, material?: THREE.Material): Promise<THREE.Group>
}
