export class ShaderEngine{
    constructor(ins){
        this.ins = ins
        this.allShaders = []
    }

    // Range: {max: 2, step: 0.01, min: 1}
    Register(object, type, node, range){
        if(!object.material) return

        if(type === "uniforms"){
            this.allShaders.push({node: object.material.uniforms[node], range: range})
        }

    }

    Update(){
        this.allShaders.forEach(shader => {
            if(shader.node.value < shader.range.max){
                shader.node.value += shader.range.step
            }else{
                shader.node.value = shader.range.min
            }
        })

    }
}