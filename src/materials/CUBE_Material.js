import * as THREE from 'three'
import { Vector3 } from 'three'
import { helvetiker } from './assets/font'

export default class CUBE_Material {
  constructor (type) {
    this.type = type
  }

  Basic (property = { color: 0xff0000 }) {
    return new THREE.MeshPhongMaterial(property)
  }

  Point (property = { size: 4, color: 0xff0000, sizeAttenuation: false }) {
    return new THREE.PointsMaterial(property)
  }

  Text (property = { color: 0xff0000 }) {
    return new THREE.MeshBasicMaterial(property)
  }

  TextFont (fontJson) {
    const font = new THREE.FontLoader().parse(fontJson || helvetiker)
    return font
  }

  Terrain (property = { color: 0xfafafa, side: THREE.DoubleSide, wireframe: true }) {
    return new THREE.MeshPhongMaterial(property)
  }

  Ground (property = { transparent: false, opacity: 1, color: 0x141825, specular: 0x171B2C, reflectivity: 0 }) {
    return new THREE.MeshPhongMaterial(property)
  }

  GeoMap (property = { transparent: false, opacity: 1, color: 0x2E3342, specular: 0x383D51, reflectivity: 0.6 }) {
    return new THREE.MeshPhongMaterial(property)
  }

  GeoBuilding (property = { color: 0x7884B2, specular: 0xfafafa, reflectivity: 0.6 }) {
    return new THREE.MeshPhongMaterial(property)
  }

  GeoBorder (property = { color: 0x49DEFF }) {
    return new THREE.LineBasicMaterial(property)
  }

  GeoRoad (property = { color: 0x1B4686 }) {
    return new THREE.LineBasicMaterial(property)
  }

  GeoRoadAnimation (property = { color: 0xff9900 }) {
    return new THREE.LineDashedMaterial(property)
  }

  GeoWater (sun, normal, fog = true) {
    const property = {
      textureWidth: 0.5,
      textureHeight: 0.5,
      waterNormals: loadNormal(normal),
      alpha: 1.0,
      sunColor: 0xDDEBFF,
      waterColor: 0x78AFFF,
      distortionScale: 2
    }
    property.fog = fog // Boolean
    property.sunDirection = sun ? sun.position.clone().normalize() : new Vector3(0, 0, 0) // THREE.Light
    return property
  }
}

function loadNormal (normalTexture) {
  if (!normalTexture) return

  return new THREE.TextureLoader().load(normalTexture, function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  })
}
