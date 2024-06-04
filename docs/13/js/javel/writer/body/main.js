const {div, textarea, button} = van.tags
//class JavelWriter {
class JavelBodyWriter {
    constructor(headData) {
        this._headData = headData
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
        this.editor = textarea({placeholder:`# 原稿《げんこう》\n\n　本文。《《強調》》\n段落内改行。`, style:()=>`box-sizing:border-box;width:100%;height:100%;resize:none;`, oninput:(e)=>{this.manuscript.val=e.target.value; if(0===this.manuscript.val.length){this._anyoneBtn.showImport()}else{this._anyoneBtn.showExport()}}}, ()=>this.manuscript.val)
        /*
        this.menu = new MenuScreen([
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'題'),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.exporter.export(this.manuscript.val)},()=>`${this.size.val}字`),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'⚠'),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.colorScheme.toggle()}, ()=>this.colorScheme.nextName),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`, onclick:()=>this.viewer.toggleWritingMode()}, ()=>this.viewer.getNextWritingModeName()),
            div({class:'button', tabindex:0, style:`box-sizing:border-box;word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;cursor:pointer;user-select:none;`},'？'),
        ])
        */
        const headBtn = DivButton.make(()=>{}, '題')
        headBtn.dataset.select = 'javel-head-writer'
        /*
        const aboutBtn = DivButton.make(()=>{}, '？')
        aboutBtn.dataset.select = 'javel-writer-about'
        const expBtn = DivButton.make()=>this.exporter.export(this.manuscript.val), ()=>`出`)
        const impBtn = DivButton.make()=>{}, ()=>`入`)
        */
        this._anyoneBtn = new AnyOneButton(this._headData, this.editor, this.exporter, this.colorScheme)
        this.menu = new MenuScreen([
            headBtn,
            DivButton.make(()=>this.exporter.export(this._headData.yaml + this.manuscript.val), ()=>`${this.size.val}字`),
            DivButton.make(()=>{}, '⚠'),
            DivButton.make(()=>this.colorScheme.toggle(), ()=>this.colorScheme.nextName),
            DivButton.make(()=>this.viewer.toggleWritingMode(), ()=>this.viewer.getNextWritingModeName()),
            //aboutBtn,
            this._anyoneBtn.el,
        ])
        this.layout.first = this.editor
        this.layout.menu = this.menu.el
        this.layout.last = this.viewer.el
        this.#init()
    }
    get el() { return this.layout.el }
    #init() {
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

「あﾞあﾞあﾞあﾞ」

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
        //this._rows = van.state(`1fr`)
        this._rows = van.state(`16px`)
        this._el = div({style:()=>this.#style()})
        if (Array.isArray(items)) { for (let el of items) { this.add(el) } }
        this.resize()
    }
    get el() { return this._el }
    get items() { return this._items.val }
    add(item) { this._el.appendChild(item) }
    resize() { if (this.#isLandscape) {this.setVertical()} else {this.setHorizontal()} }
    #style() { console.log(`${this.#writingMode()}${this.#grid()}`); return `${this.#writingMode()}${this.#grid()}${this.#zero()}` }
    #writingMode() { return `writing-mode:${this._writingMode.val};text-orientation:${this._textOrient.val};` }
    #grid() { return `display:grid;grid-template-columns:${this._columns.val};grid-template-rows:${this._rows.val};` }
    #zero() { return `padding:0;margin:0;line-height:1em;letter-spacing:0;` }
    setVertical() { this._writingMode.val = 'vertical-rl'; this._textOrient.val = 'upright'; this._columns.val = `repeat(${this._el.children.length}, 1fr)`; }
    setHorizontal() { this._writingMode.val = 'horizontal-tb'; this._textOrient.val = 'mixed'; this._columns.val = `repeat(${this._el.children.length}, 1fr)`; }
    get #width() { return document.body.clientWidth; }
    get #height() { return document.documentElement.clientHeight; }
    get #isLandscape() { return (this.#height < this.#width) }
    get #isPortrate() { return !this.#isLandscape }
}
class AnyOneButton { // ButtonSelector 常にどれか一つのボタンだけ表示する
    constructor(headData, editor, exporter, colorScheme) {
        this._headData = headData
        this._exporter = exporter
        this._colorScheme = colorScheme 
        this._editor = editor
        this.isImmediatelyExport = false
        this._aboutBtn = DivButton.make(()=>{}, '？')
        this._aboutBtn.dataset.select = 'javel-writer-about'
        //this._expBtn = DivButton.make(()=>{this._exporter.export(this._manuscript.val);this.showAbout();this._expBtn.focus();Toastify({text:'ファイル出力しました',duration:3000,position:'center'}).showToast();}, ()=>`出`)
        this._toast = new PopToast();
        this._expBtn = DivButton.make(()=>{this._exporter.export(/*this._headData.yaml + */this._editor.value);this.showAbout();this._expBtn.focus();this._toast.show('ファイル出力しました', {type:'success',position:'top-right',style:{backgroundColor:this._colorScheme.reverseBg, color:this._colorScheme.reverseFg, fontFamily:['Noto Sans JP', 'Source Han Sans JP', 'Noto Color Emoji', 'sans-serif']}});}, ()=>`出`)
        this._impBtn = DivButton.make(async()=>{
            const file = await FileOpener.openDialog();
            const content = await FileOpener.readAsText(file);
            this._editor.value = content;
            this._editor.dispatchEvent(new Event('input'))
            this._editor.focus()
        }, ()=>`入`)
        // ボタン出現条件
        //   [入]: 0===this.manuscript.length
        //   [？]: [出]押下直後＆this.manuscriptに変更なし
        //   [出]: 上記以外
        this.#hideAll()
        this.showExport()
        this._el = van.tags.div(this._aboutBtn, this._expBtn, this._impBtn)
    }
    get el() { return this._el }
    showAbout() { this.#hideAll(); this.#show(this._aboutBtn); console.log('showAbout!!!!!!');}
    showExport() { this.#hideAll(); this.#show(this._expBtn); }
    showImport() { this.#hideAll(); this.#show(this._impBtn); }
    #hideAll() { for (let el of [this._aboutBtn, this._expBtn, this._impBtn]) { this.#hide(el) } }
    #hide(el) { this.#setDisp(el, false) }
    #show(el) { this.#setDisp(el, true) }
    #setDisp(el, isShow) { el.style.setProperty('display', ((isShow) ? 'block' : 'none')) }
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

