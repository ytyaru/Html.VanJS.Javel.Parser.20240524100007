const {div, textarea, button} = van.tags
class JavelWriter {
    constructor() {
        this.parser = new JavelParser()
        this.counter = new JavelCounter(this.parser)
        this.exporter = new JavelExporter()
        this.manuscript = van.state('')
        this.textBlocks = van.derive(()=>this.parser.Javel.toBlocks(this.manuscript.val))
        this.els = van.derive(()=>this.parser.Javel.toElements(this.textBlocks.val))
        this.size = van.derive(()=>this.parser.Javel.calcSize(this.els.val))
        this.viewer = new SingleScreen() 
        this.viewer.toggleWritingMode()
        this.editor = textarea({rows:5, cols:40, oninput:(e)=>this.manuscript.val=e.target.value}, ()=>this.manuscript.val)
    }
    init() {
        van.derive(()=>this.viewer.children=this.els.val) // this.elsが作成されたらビューアにセットして表示する
        /*
        this.layout = new TripleScreen()
        this.layout.left.children = [this.editor]
        this.layout.right.children = [this.viewer]
        this.layout.center.children = [
            button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`, onclick:()=>this.exporter.export(this.manuscript.val)},()=>`${this.size.val}字`),
        ]
        this.layout.center.gridTemplateColumns = `repeat(${this.layout.center.children.length}, 1fr)`
        van.add(document.body, div(()=>this.layout.el))
        */
        van.add(document.body, div({style:()=>this.style()}, textarea({rows:5, cols:40, oninput:(e)=>this.manuscript.val=e.target.value}, ()=>this.manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`, onclick:()=>this.exporter.export(this.manuscript.val)},()=>`${this.size.val}字`), ()=>{return this.viewer.el}))
//        new ResizeObserver(entries=>{
//            for (let entry of entries) { this.resize(entry.contentRect.width, entry.contentRect.height) }
//        }).observe(document.querySelector('body'));
        //window.addEventListener('resize', (event) => { this.resize(); this.layout.resize(); })
        window.addEventListener('resize', (event) => { this.resize(); })
        document.querySelector('textarea').focus()
        this.manuscript.val = `# 原稿《げんこう》

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。｜H《Hyper》｜T《Text》｜M《Markup》｜L《Language》形式で出力します。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

「同じ字が３つ以上続いたら１字とみなすよおおおおおおおおお」

「GAAAAAAAAAAAAA!!!!!!!!!」

「あ゛あ゛あ゛あ゛」

――そのとき、神風が吹いた`

        // パース確認（Javel, Element, HTMLの相互変換）
        console.log(this.parser.Javel.toHtml(this.els.val, true)) // El→HTML
        console.log(this.parser.Javel.toHtml(this.manuscript.val, true)) // Javel→HTML
        console.log(this.parser.Html.toJavel(this.els.val, true)) // El→Javel
        console.log(this.parser.Html.toJavel(this.parser.Javel.toHtml(this.els.val, true), true)) // HTML→Javel
        console.log(this.parser.Html.toJavel(this.parser.Javel.toHtml(this.manuscript.val, true), true)) // HTML→Javel
        console.log(this.parser.Html.toElements(this.parser.Javel.toHtml(this.manuscript.val, true), true)) // HTML→El
        console.log(this.parser.Javel.toElements(this.manuscript.val, true)) // Javel→El

//        console.log('MAX:', this.counter.Write.getMax(this.manuscript.val))
//        console.log('MIN:', this.counter.Write.getMin(this.manuscript.val))
        const count = this.counter.Word.count(this.manuscript.val)
        console.log('Write:', count.write)
        console.log('Print:', count.print)
        console.log('Read :', count.read)
    }
    /*
    #makeMenu() { return div({writing-mode:${this._writingMode.val};grid-template-columns:${columns};grid-template-rows:${rows};}
       button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${this.size.val}字`),
    )}
    #makeMenu() {
        const screen = new SingleScreen()
        const count = button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${this.size.val}字`)
        const output = button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${this.size.val}字`)
        screen.children = [count, output]
        return screen
    }
    */
    fontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${uiWidth / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }
    style() { return `display:grid;${this.resize()}` }
    resize(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        const isLandscape = (height <= width)
        const menuBlockSize = 16
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        this.fontSize(uiWidth)
        console.log(`grid-template-columns:${columns};grid-template-rows:${rows};`)
        //document.title = `grid-template-columns:${columns};grid-template-rows:${rows};`
        document.title = `${columns};${rows};`
        return `grid-template-columns:${columns};grid-template-rows:${rows};`
    }
}
class SingleScreen {
    constructor() {
        this._children = van.state([])
        this._w = van.state('100%')
        this._h = van.state('100%')
        this._writingMode = van.state('horizontal-tb') // vertical-rl
        this._gridTemplateColumns = van.state('1fr')
        this._gridTemplateRows = van.state('1fr')
        this._overflowX = van.state('auto')
        this._overflowY = van.state('auto')
        this._textOrient = van.state('mixed') // upright
        this._border = van.state('solid 1px #000')
        this._wordBreak = van.state('normal')
        this._fontSize = van.state(16)
        this._div = van.tags.div({onwheel:(e)=>this.#onWheel(e), style:()=>`padding:0;margin:0;font-size:${this._fontSize.val}px;display:grid;display:grid;grid-template-columns:1fr;grid-template-rows:${this._gridTemplateRows.val};box-sizing:border-box;border:${this._border.val};writing-mode:${this._writingMode.val};overflow-x:${this._overflowX.val};overflow-y:${this._overflowY.val};text-orientation:${this._textOrient.val};word-break:${this._wordBreak.val};`}, ()=>div({style:`padding:0;margin:0;font-size:${this._fontSize.val}px;display:grid;display:grid;grid-template-columns:${this._gridTemplateColumns.val};grid-template-rows:${this._gridTemplateRows.val};box-sizing:border-box;`}, this.children))
    }
    get el() { return this._div }
    get children( ) { return this._children.val }
    set children(v) { this._children.val = v; this.resize(); }
    get isVertical() { return !this.isHorizontal }
    get isHorizontal() { return ('horizontal-tb'===this._writingMode.val) }
    set isVertical(v) { this._writingMode.val = ((v) ? 'vertical-rl' : 'horizontal-tb'); this.resize(); }
    set isHorizontal(v) { this._writingMode.val = ((v) ? 'horizontal-tb' : 'vertical-rl'); this.resize(); }
    toggleWritingMode() {
        this._writingMode.val = (('horizontal-tb'===this._writingMode.val) ? 'vertical-rl' : 'horizontal-tb')
        this.#setOverflow()
        this.resize()
    }
    get gridTemplateColumns( ) { return this._gridTemplateColumns.val }
    set gridTemplateColumns(v) { this._gridTemplateColumns.val = v }
    get gridTemplateRows( ) { return this._gridTemplateRows.val }
    set gridTemplateRows(v) { this._gridTemplateRows.val = v }
    #setOverflow() {
        if ('horizontal-tb'===this._writingMode.val) {
            this._overflowX.val = 'hidden'
            this._overflowY.val = 'auto'
            this._textOrient.val = 'mixed'
        } else {
            this._overflowX.val = 'auto'
            this._overflowY.val = 'hidden'
            this._textOrient.val = 'upright'
        }
        this.#setFontSize()
    }
    set wordBreak(val) { if (['normal','break-all','keep-all','break-word'].some(v=>v===val)) { this._wordBreak.val = val } }
    get hasScrollBar() { return ((this.el.isHorizontal) ? this.el.scrollHeight > this.el.this.height : this.el.scrollWidth > this.el.this.width) }
    get scrollSize() { return ((this.el.isHorizontal) ? this.el.offsetHeight - this.el.clientHeight : this.el.offsetWidth - this.el.clientWidth) }
    #onWheel(e) {
        if ('vertical-rl'===this._writingMode.val) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            this._div.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
    resize() { this.#setFontSize() }
    #setFontSize() { console.log('this.el:',this.el);this._fontSize.val = Font.calc(this.el); this.#setFontSizeElements(); }
    //#setFontSize() { console.log('this.el:',this.el);Font.resize();this._fontSize.val = Font.size; this.#setFontSizeElements(); }
    #setFontSizeElements() {
        console.log('#setFontSizeElements()')
        for (let el of this.el.querySelectorAll('textarea,select,input,button,label,legend')) {
        //for (let el of this.el.querySelectorAll('*[data-sid][data-eid]')) {
            const tagName = el.tagName.toLowerCase()
            if (!'div,textarea,select,input,button,label,legend'.split(',').some(v=>v===tagName)) { continue }
            console.error(tagName)
            Css.set('font-size', `${this._fontSize.val}px`, el)
            console.log(el, this._fontSize.val)
            if ('textarea'===tagName || ('div'===tagName)) {
                Css.set('line-height', '1.7em', el)
                Css.set('letter-spacing', '0.05em', el)
            }
        }
    }
}
class TripleScreen {
    constructor() {
        this._left = new SingleScreen()
        this._right = new SingleScreen()
        this._center = new SingleScreen()
        //this._center = new GridScreen()
        this._gridTemplateColumns = van.state('48% 4% 48%')
        this._gridTemplateRows = van.state(document.body.clientHeight)
        this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;display:grid;grid-template-columns:${this._gridTemplateColumns.val};grid-template-rows:${this._gridTemplateRows.val};`}, this._left.el, this._center.el, this._right.el)
    }
    get el() { return this._div }
    get left() { return this._left }
    get right() { return this._right }
    get center() { return this._center }
    resize() {
        this.#setGridTemplate()
        this._center.wordBreak = ((this.#isLandscape) ? 'break-all' : 'normal')
        this.left.resize()
        this.right.resize()
        this.center.resize()
    }
    #setGridTemplate() {
        const screenSize = Math.floor(this.#longEdgeSize * 0.48)
        const centerSize = Math.floor(Math.max(18, this.#longEdgeSize * 0.04))
        const longEdgeGrid = `${screenSize}px ${centerSize}px ${screenSize}px`
        const shortEdgeGrid = `${Math.floor(this.#shortEdgeSize)}px`
        this._gridTemplateColumns.val = ((this.#isLandscape) ? longEdgeGrid : shortEdgeGrid)
        this._gridTemplateRows.val = ((this.#isLandscape) ? shortEdgeGrid : longEdgeGrid)
        console.log(this._gridTemplateColumns.val)
        console.log(this._gridTemplateRows.val)
        this.center.isVertical = this.#isLandscape
        this.center.gridTemplateRows = `${centerSize}px`
        console.log(this.center.gridTemplateColumns)
        console.log(this.center.gridTemplateRows)
        console.log(this.center.children[0], this.center.children[0].width, this.center.children[0].height)
        //this.center.gridTemplateRows = `${centerSize}px`
        //this.center.gridTemplateRows = `${this.#height}px`
        //console.error('this.center.isVertical:', this.center.isVertical, this.center._writingMode.val, this.center.gridTemplateColumns)
        //console.error(this.#isLandscape, this.#width, this.#height)
//        this._left.children = [p('isLandscape:', this.#isLandscape), p('body.client:', document.body.clientWidth, ',', document.body.clientHeight), p('documentElement.client:', document.documentElement.clientWidth, ',', document.documentElement.clientHeight), p('window.inner:', window.innerWidth, ',', window.innerHeight), p('long,short:', this.#longEdgeSize, ',', this.#longEdgeSize), p('gridTemplateColumns:', this._gridTemplateColumns.val), p('gridTemplateRows:', this._gridTemplateRows.val)]
    }
    get #longEdgeSize() { return Math.max(this.#width, this.#height) }
    get #shortEdgeSize() { return Math.min(this.#width, this.#height) }
    get #width() { return document.body.clientWidth; }
    get #height() { return document.documentElement.clientHeight; }
    get #isLandscape() { return (this.#height < this.#width) }
    get #isPortrate() { return !this.#isLandscape }
}

