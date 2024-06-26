const {div, textarea, button} = van.tags
class JavelWriter {
    constructor() {
        this.colorScheme = new ColorScheme()
        this.parser = new JavelParser()
        this.counter = new JavelCounter(this.parser)
        this.exporter = new JavelExporter()
        this.manuscript = van.state('')
        this.textBlocks = van.derive(()=>this.parser.Javel.toBlocks(this.manuscript.val))
        this.els = van.derive(()=>this.parser.Javel.toElements(this.textBlocks.val))
        this.size = van.derive(()=>this.parser.Javel.calcSize(this.els.val))
        this.layout = new Triple()
        this.viewer = new Viewer() 
        this.editor = textarea({style:()=>`box-sizing:border-box;width:100%;height:100%;resize:none;`, oninput:(e)=>this.manuscript.val=e.target.value}, ()=>this.manuscript.val)
        this.menu = new MenuScreen([
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'題'),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.exporter.export(this.manuscript.val)},()=>`${this.size.val}字`),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'⚠'),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.colorScheme.toggle()}, ()=>this.colorScheme.nextName),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.viewer.toggleWritingMode()}, ()=>this.viewer.getNextWritingModeName()),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'？'),
        ])
        this.layout.first = this.editor
        this.layout.menu = this.menu.el
        this.layout.last = this.viewer.el
    }
    init() {
        van.derive(()=>this.viewer.children=this.els.val) // this.elsが作成されたらビューアにセットして表示する
        van.add(document.body, this.layout.el)
        window.addEventListener('resize', (event) => { this.layout.resize(); this.menu.resize(); })
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
        focusLooper.setup(this.editor)

        // パース確認（Javel, Element, HTMLの相互変換）
        console.log(this.parser.Javel.toHtml(this.els.val, true)) // El→HTML
        console.log(this.parser.Javel.toHtml(this.manuscript.val, true)) // Javel→HTML
        console.log(this.parser.Html.toJavel(this.els.val, true)) // El→Javel
        console.log(this.parser.Html.toJavel(this.parser.Javel.toHtml(this.els.val, true), true)) // HTML→Javel
        console.log(this.parser.Html.toJavel(this.parser.Javel.toHtml(this.manuscript.val, true), true)) // HTML→Javel
        console.log(this.parser.Html.toElements(this.parser.Javel.toHtml(this.manuscript.val, true), true)) // HTML→El
        console.log(this.parser.Javel.toElements(this.manuscript.val, true)) // Javel→El
        // 字数
        const count = this.counter.Word.count(this.manuscript.val)
        console.log('Write:', count.write)
        console.log('Print:', count.print)
        console.log('Read :', count.read)
    }
}
class MenuScreen {
    constructor(items) {
        this._items = van.state((Array.isArray(items)) ? items : [])
        this._writingMode = van.state(`vertical-rl`) // horizontal-tb/vertical-rl
        this._textOrient = van.state('upright') // mixed/upright
        this._columns = van.state(`repeat(${this._items.length}, 1fr)`)
        this._rows = van.state(`1fr`)
        this._el = div({style:()=>this.#style()})
        if (Array.isArray(items)) { for (let el of items) { this.add(el) } }
        this.resize()
    }
    get el() { return this._el }
    get items() { return this._items.val }
    add(item) { this._el.appendChild(item) }
    resize() { if (this.#isLandscape) {this.setVertical()} else {this.setHorizontal()} }
    #style() { console.log(`${this.#writingMode()}${this.#grid()}`); return `${this.#writingMode()}${this.#grid()}` }
    #writingMode() { return `writing-mode:${this._writingMode.val};text-orientation:${this._textOrient.val};` }
    #grid() { return `display:grid;grid-template-columns:${this._columns.val};grid-template-rows:${this._rows.val};` }
    setVertical() { this._writingMode.val = 'vertical-rl'; this._textOrient.val = 'upright'; this._columns.val = `repeat(${this._el.children.length}, 1fr)`; }
    setHorizontal() { this._writingMode.val = 'horizontal-tb'; this._textOrient.val = 'mixed'; this._columns.val = `repeat(${this._el.children.length}, 1fr)`; }
    get #width() { return document.body.clientWidth; }
    get #height() { return document.documentElement.clientHeight; }
    get #isLandscape() { return (this.#height < this.#width) }
    get #isPortrate() { return !this.#isLandscape }
}
class Viewer {
    constructor() {
        this._children = van.state([])
        this._writingMode = van.state(`horizontal-tb`) // horizontal-tb/vertical-rl
        this._textOrient = van.state(`mixed`) // mixed/upright
        this._overflow = van.state(`y`) // y/x
        this.toggleWritingMode()
        this._el = van.tags.div({tabindex:0, style:()=>this.#style(), onwheel:(e)=>this.#onWheel(e)}, ()=>van.tags.div(this._children.val))
    }
    get el() { return this._el }
    get children( ) { return this._children.val }
    set children(v) { this._children.val = v }
    #style() { return `${this.#writingMode()}${this.#break()}` }
    #writingMode() { return `writing-mode:${this._writingMode.val};text-orientation:${this._textOrient.val};overflow-${this._overflow.val}:scroll;` }
    #break() { return `word-break:break-all;overflow-wrap:anywhere;hyphens:auto;` }
    #onWheel(e) {
        if ('vertical-rl'===this._writingMode.val) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            this._el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
    toggleWritingMode() { ((this.isVertical()) ? this.setHorizontal() : this.setVertical()) }
    isVertical() { return 'vertical-rl'===this._writingMode.val }
    isHorizontal() { return 'horizontal-tb'===this._writingMode.val }
    setVertical() {
        this._writingMode.val = 'vertical-rl'
        this._textOrient.val = 'upright'
        this._overflow.val = 'x'
    }
    setHorizontal() {
        this._writingMode.val = 'horizontal-tb'
        this._textOrient.val = 'mixed'
        this._overflow.val = 'y'
    }
    getWritingModeName() { return ((this.isVertical()) ? '縦' : '横') }
    getNextWritingModeName() { return ((this.isVertical()) ? '横' : '縦') }
}

