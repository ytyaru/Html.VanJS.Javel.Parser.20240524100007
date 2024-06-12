class DivButton {
    static make(method, child) { return van.tags.div({
            class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;font-size:16px;`, 
            onclick:method,
            onkeydown:(e)=>{if([' ', 'Enter'].some(k=>k===e.key)) { method() }},
            },
            child)
    }
}
