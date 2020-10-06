/**
 * CUBE.GL
 * Utils tools: some universal functions
 * jeffwu
 * https://cubegl.org/
 * https://github.com/isjeffcom/CUBE.gl
 * 2020.10.07
*/

export function Clone(Object){
    return JSON.parse(JSON.stringify(Object))
}