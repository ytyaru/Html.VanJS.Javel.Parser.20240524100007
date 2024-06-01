class DivButton {
    static make(method, child) { return van.tags.div({
            class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, 
//            onclick:()=>this.exporter.export(this.manuscript.val),
//            onkeydown:(e)=>{if([' ', 'Enter'].some(k=>k===e.key)) { method(e); }},
            onclick:method,//()=>this.exporter.export(this.manuscript.val),
            onkeydown:(e)=>{if([' ', 'Enter'].some(k=>k===e.key)) { method() }},
            },
            child)
    }
    /*
    // DivButton.make(()=>this.exporter.export(this.manuscript.val), ()=>`${this.size.val}字`)

    constructor(method, child) {
        this._el = div({
            class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, 
            onclick:()=>this.exporter.export(this.manuscript.val),
            onkeydown:(e)=>this.#onKeydown(e),
            },
            ()=>`${this.size.val}字`)
    }
    get el() { return this._el }
    #onKeydown(e) {
        console.log('#onKeydown(e):', e.key, ' '===e.key)
        if      ([' ', 'Enter'].some(k=>k===e.key)) { this.#pushKeyboard(e); }
//        else if ('Enter'===e.key) { this._device.keyboard.isDown = true; this.#updateState(); }
//        else if ('Esc'===e.key) {  }
//        else if ('F1'===e.key) {  }
    }
    */
}
