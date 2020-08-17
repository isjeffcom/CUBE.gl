export function DefaultConfig(){
  return {
    "scale": 15,
    "center": {
      "latitude": 52.460562, 
      "longitude":-1.772472
    },
    "background": "222222",
    "camera": {
        "name": "Main-Camera",
        "type": "Perspective",
        "container": "window",
        "near": 1,
        "far": 3000,
        "position": {"x": 0, "y": 0, "z": 0}
    },
    "renderer": {
        "antialias": true,
        "shadowMap": {
            "enabled": false
        }
    },
    "controls": {
        "type": "Map",
        "rotateSpeed": 0.7,
        "damping": {
            "enabled": true,
            "factor": 0.25
        },
        "screenSpacePanning": true,
        "limitUnderground": false,
        "autoRotate": {
            "enabled": false,
            "speed": 1
        },
        "minDistance": 5,
        "maxDistance": 800
  
    },
    "lights": [
        {
        "name": "enviorment",
        "type": "Ambient",
        "color":"fafafa",
        "opacity": 0.35
      },
      {
        "name": "front-left",
        "type": "Point",
        "color": "fafafa",
        "opacity": 0.4,
        "shadow": false,
        "position": {
          "x": 200,
          "y": 90,
          "z": 40
        }
      },
      {
        "name": "front-right",
        "type": "Point",
        "color": "fafafa",
        "opacity": 0.4,
        "shadow": false,
        "position": {
          "x": 200,
          "y": 90,
          "z": -40
        }
      },
      {
        "name": "back-left",
        "type": "Point",
        "color": "fafafa",
        "opacity": 0.4,
        "shadow": true,
        "position": {
          "x": -200,
          "y": 90,
          "z": -40
        }
      },
      {
        "name": "back-right",
        "type": "Point",
        "color": "fafafa",
        "opacity": 0.4,
        "shadow": false,
        "position": {
          "x": -200,
          "y": 90,
          "z": -40
        }
      }
    ],
    "fog":{
        "enabled": true,
        "color": "262E4F",
        "near": 50,
        "far": 150
    },
    "debug": false
  }
}