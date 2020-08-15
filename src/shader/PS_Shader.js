
export default class PS_Shader {
    constructor(name, vertex, fragment){
        this.name = name
        this.vertex = vertex
        this.fragment = fragment
    }

    GetVertex(){
        return this.vertex
    }

    GetFragment(){
        return this.fragment
    }
}