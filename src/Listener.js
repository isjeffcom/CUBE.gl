import deepmerge from "deepmerge"

const defaultOptions = {
    select: true,
    hover: false
}

export class Listener{
    /**
     * Listener for interaction
     * @param {DOM Object} container render target
     * @public
    */

    constructor(container, options={}){

        this.options = deepmerge(defaultOptions, options)

        // Container
        this.container = container

        // Drag state
        this.isDrag = true

        // Init event listener
        this.Init()
    }

    Init(){
        
        // Need enable interaction
        if(!this.options.enable) return

        if(this.options.select){

            // Identify if click or touch or drag
            this.container.addEventListener( 'touchstart', () => {
                this.isDrag = false
                setTimeout(() => {
                    this.isDrag = true
                },200)
            }, false)


            this.container.addEventListener( 'touchend', (event) => {
                if(this.isDrag){
                    // Do nothing...
                }else{
                    this.Select(event)
                }
            }, false)

            this.container.addEventListener("mousedown", () => {
                this.isDrag = false
                // Detect if is drag
                setTimeout(() => {
                    this.isDrag=true
                },100)
            }, false)

            this.container.addEventListener("mouseup", (event) => {
                if(this.isDrag){
                    // Drag, do nothing.....
                }else{
                    this.Select(event)
                }
            }, false)

        }

        if(this.options.hover){

            this.container.addEventListener("mousemove", (event) => {
                this.Hover(event)
            }, false)

        }
    }

    /**
     * Reaction: select
     * @public
    */

    Select(uxEvt){
        // Init Event
        let cevt = new CustomEvent('cube-select', {
            detail: {
                ux: uxEvt
            }
        })

        // Send
        this.container.dispatchEvent(cevt)
    }

    Hover(uxEvt){
        // Init Event
        let cevt = new CustomEvent('cube-hover', {
            detail: {
                ux: uxEvt
            }
        })

        // Send
        this.container.dispatchEvent(cevt)
    }
}