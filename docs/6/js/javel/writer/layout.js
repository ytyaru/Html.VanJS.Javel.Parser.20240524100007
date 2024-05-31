class Triple {
    constructor() {
        this._columns = van.state(`48% 4% 48%`)
        this._rows = van.state(`100%`)
        this._first = van.tags.div({style:`background-color:red;`})
        this._last = van.tags.div({style:`background-color:green;`})
        this._menu  = van.tags.div({style:`background-color:blue;`})
        this._el = van.tags.div({style:()=>this.#style()})
        this.resize()
    }
    get el() { return this._el }
    get first() { return this._el.children.item(0) }
    get last () { return this._el.children.item(1) }
    get menu () { return this._el.children.item(2) }
    set first(el) { this.#setChild(el, 0) }
    set menu (el) { this.#setChild(el, 1) }
    set last (el) { this.#setChild(el, 2) }
    #setChild(el, i) {
        if (this._el.children.length < i) { throw new Error(`first,menu,lastの順にセットしてください。`) }
        if (i===this._el.children.length) { this._el.appendChild(el) }
        else { this._el.children.item(i).remove(); this._el.insertBefore(el, this._el.children.item(i-1)) }
    }
    #style() { return `display:grid;grid-template-columns:${this._columns.val};grid-template-rows:${this._rows.val};` }
    resize(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        const isLandscape = (height <= width)
        const menuBlockSize = 16 + 4
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
//        const columns = sizes[0]
//        const rows = sizes[1]
        this._columns.val = sizes[0]
        this._rows.val = sizes[1]
        //this.fontSize(uiWidth)
        //setFontSize(uiWidth)
        this.#setFontSize(uiWidth)
//        console.log(isLandscape, width, height)
//        console.log(`grid-template-columns:${columns.val};grid-template-rows:${rows.val};`)
//        console.log(document.querySelector(`textarea`))
//        document.querySelector(`textarea`).value = `grid-template-columns:${columns.val};\n\ngrid-template-rows:${rows.val};\n\nFontSize:${getFontSize(uiWidth)};`
        //document.title = `grid-template-columns:${columns};grid-template-rows:${rows};`
        //document.title = `${columns};${rows};`
        //return `grid-template-columns:${columns};grid-template-rows:${rows};`
        //return `grid-template-columns:${this._columns.val};grid-template-rows:${this._rows.val};`
    }
    #getFontSize(uiWidth) {                       // 一行40字迄。字間0.05em（1字間／20字）の場合で計算
        const lineOfChars = uiWidth / 16
        if (lineOfChars <= 30) { return 16 }      //      〜480px（  〜30字）
        else if (lineOfChars <= 42) { return 18 } // 481px〜672px（25〜35字）
        else { return uiWidth / 42 }              // 673px〜     （    40字）
    }
    #setFontSize(uiWidth) { document.querySelector(':root').style.setProperty('--font-size', `${this.#getFontSize(uiWidth)}px`); console.log('--font-size:', `${this.#getFontSize(uiWidth)}px`); }
}
