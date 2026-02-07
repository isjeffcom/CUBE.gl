export function DefaultConfig () {
  return {
    scale: 15,
    center: {
      latitude: 52.460562,
      longitude: -1.772472
    },
    background: '222222',
    camera: {
      name: 'Main-Camera',
      type: 'Perspective',
      container: 'window',
      near: 1,
      far: 3000,
      position: { x: 0, y: 0, z: 0 }
    },
    renderer: {
      antialias: true,
      shadowMap: {
        enabled: false
      }
    },
    controls: {
      type: 'Map',
      rotateSpeed: 0.7,
      damping: {
        enabled: true,
        factor: 0.25
      },
      screenSpacePanning: true,
      limitUnderground: false,
      autoRotate: {
        enabled: false,
        speed: 1
      },
      minDistance: 1,
      maxDistance: 800

    },
    // Three.js r155+: physically correct lighting
    // - AmbientLight intensity: multiplier (reasonable range: 0.5 - 5.0)
    // - PointLight intensity: candela (cd), needs large values for distant lights
    // - DirectionalLight intensity: lux (lx), reasonable range: 1 - 10
    lights: [
      {
        name: 'environment',
        type: 'Ambient',
        color: 'fafafa',
        intensity: 1.0
      },
      {
        name: 'front-left',
        type: 'Point',
        color: 'fafafa',
        intensity: 50000,
        decay: 2,
        shadow: false,
        position: {
          x: 200,
          y: 90,
          z: 40
        }
      },
      {
        name: 'front-right',
        type: 'Point',
        color: 'fafafa',
        intensity: 50000,
        decay: 2,
        shadow: false,
        position: {
          x: 200,
          y: 90,
          z: -40
        }
      },
      {
        name: 'back-left',
        type: 'Point',
        color: 'fafafa',
        intensity: 50000,
        decay: 2,
        shadow: false,
        position: {
          x: -200,
          y: 90,
          z: -40
        }
      },
      {
        name: 'back-right',
        type: 'Point',
        color: 'fafafa',
        intensity: 50000,
        decay: 2,
        shadow: false,
        position: {
          x: -200,
          y: 90,
          z: -40
        }
      }
    ],
    fog: {
      enabled: true,
      color: '262E4F',
      near: 50,
      far: 150
    },
    interaction: {
      enable: false,
      select: false,
      hover: false
    },
    debug: false,
    lab: {
      wasm: false
    }

  }
}
