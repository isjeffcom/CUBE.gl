import PS_Shader from '../PS_Shader'

let heatVertex = `
    uniform sampler2D heightMap;
    uniform float heightRatio;
    uniform float heightColor;
    varying vec2 vUv;
    varying float hValue;
    varying float hColor;
    void main() {
        vUv = uv;
        vec3 pos = position;
        hValue = texture2D(heightMap, vUv).r;
        pos.y = hValue * heightRatio;
        hColor = heightColor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
`

let heatFragment = `
    varying float hValue;
    varying float hColor;

    // honestly stolen from https://www.shadertoy.com/view/4dsSzr
    vec3 heatmapGradient(float t) {
        return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
    }

    void main() {
        float v = abs(hValue - 1.);
        gl_FragColor = vec4(heatmapGradient(hValue * hColor), 1. - v * v) ;
    }
`



export default class PS_Heatmap extends PS_Shader {
    
    constructor(name){
        super(name)
    }

    GetVertex(){
        return heatVertex
    }

    GetFragment(){
        return heatFragment
    }
}