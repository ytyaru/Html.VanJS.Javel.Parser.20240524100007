(function(){
class JavelHeadWriter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._data = this._manuscript.head
        this._ja = {
            'title': {l:'表題', t:'textarea', wcl:100, p:'表題'},
            'catch': {l:'ｷｬｯﾁｺﾋﾟｰ', t:'textarea', wcl:35, p:'キャッチコピー'},
            'intro': {l:'紹介', t:'textarea', wcl:200, p:'紹介文。'},
            'category': {l:'ｶﾃｺﾞﾘ', t:'select', options:{
                'web-novel':{l:'WEB小説',d:'自己満足小説'}, // （商業化・大衆化しなそうなニッチでマイナーな小説）
                'light-novel':{l:'ライトノベル',d:'中高生が楽しむ小説'},
                'light-literature':{l:'ライト文芸',d:'一般文芸より俗っぽい小説'}, // 学生から社会人が楽しむ
                'general-literature':{l:'一般文芸',d:'大衆向け小説'},
                'pure-literature':{l:'文学',d:'人間の醜さ愚かさを描いた物語'},
                'children-novel':{l:'児童小説',d:'小学生が楽しむ小説'},
                'erotic-novel':{l:'官能小説',d:'性行為の描写を主題とする小説'},
            }},
            'genre': {l:'ｼﾞｬﾝﾙ', t:'select', options:{
                'fantasy':{l:'ファンタジー',d:'現実には絶対にありえない物語'}, 
                'sf':{l:'SF',d:'少しありえそうに思える物語'}, 
                'mystery':{l:'ミステリー',d:'事件の犯人を推理する物語'}, 
                'horror':{l:'ホラー',d:'恐怖を掻き立てられる物語'}, 
                'love':{l:'恋愛',d:'恋愛を疑似体験する物語'}, 
                'youth':{l:'青春',d:'学生が主人公の物語'}, 
                'drama':{l:'現代ドラマ',d:'現実世界を題材にした物語'},
                'history':{l:'歴史',d:'史実を題材にした物語'}, 
                'economy':{l:'経済',d:'経済を題材にした物語'}, 
                'politics':{l:'政治',d:'政治を題材にした物語'},
            }},
            'keywords': {l:'ｷｰﾜｰﾄﾞ', t:'textarea', wcl:100, p:'語,語,語（カンマ区切り）'},
            'warning': {l:'描写', t:'checkbox', items:{'sex':{l:'性',c:false},'violence':{l:'暴力',c:false,},'cruelty':{l:'残酷',c:false}}},
        }
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._authBtn = DivButton.make(null, ()=>'著者')
        this._authBtn.dataset.select = 'javel-auth-writer'
        this._viewer = new Viewer()
        this._viewer = new HeadViewer(this._data, this._ja)
        this._editor = new Editor(this._data, this._ja)
        this._menu = new MenuScreen([this._backBtn, this._authBtn])
        this._layout = new Triple()
        this._layout.first = this._editor.el
        this._layout.menu = this._menu.el
        this._layout.last = this._viewer.el
        this._el = this._layout.el
        van.add(document.body, this._el)
        this._editor.init()
    }
    get el() { return this._el }
}
class Editor {
    constructor(head, ja) {
        this._data = head // this._manuscript.head
        this._ja = ja
        this._el = van.tags.div({style:`padding:0;margin:0;`}, this.#makeEls())
    }
    get el() { return this._el }
    init() { for (let select of document.querySelectorAll('select')) { select.dispatchEvent(new Event('input')) } }
    #makeEls() {
        return van.tags.table({style:`width:100%;padding:0;margin:0;`}, [...Object.entries(this._ja)].map(e=>{
            const el = this.#makeEl(e[0],e[1])
            return this.#makeTr(
                this.#makeLabel(e[0],e[1]), 
                el, 
                this.#makeCounter(e[0], e[1].t, e[1].wcl),
            )
        }))
    }
    #makeEl(k,v) {
        switch (v.t) {
            case 'text': return this.#makeText(k,v)
            case 'checkbox': return this.#makeCheckbox(k,v)
            case 'select': return this.#makeSelect(k,v)
            case 'textarea': return this.#makeTextarea(k,v)
//            case 'tagify': return this.#makeTagify(k,v)
            default: return this.#makeDefault(k,v)
        }
    }
    #makeLabel(k,v) { return van.tags.label(v.l || k) }
    #makeSelect(k,v) { return [van.tags.select({name:k, oninput:(e)=>{this._data[k].val=e.target.value;console.error(`${k}-summary`, k, this._data[k].val);console.error(this._ja[k].options[e.target.value].l);document.querySelector(`[name="${k}-summary"]`).innerHTML=v.options[e.target.value].d;}}, this.#makeOptions(k,v)), van.tags.span({name:`${k}-summary`,style:`font-size:16px;`}, '')] }
    #makeOptions(k,v) { return [...Object.entries(v.options).map(e=>{console.error(k,e[0],':',this._data,this._data['category'],this._data[k].val);return van.tags.option({value:e[0], selected:(e[0]===this._data[k].val)}, e[1].l)})] }
    #makeCheckbox(k,v) { return [...Object.entries(v.items)].map(e=>van.tags.label(van.tags.input({type:'checkbox', name:`${k}-${e[0]}`, checked:e[1].c, 'data-key':k, 'data-value':e[0], onchange:(E)=>{this._data[k][e[0]].val = E.target.checked;console.log(k, e[0], this._data[k][e[0]].val);}}, e[1].l), e[1].l)) }
    #makeText(k,v) { return van.tags.input({name:k, type:'text', maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>this._data[k].val=e.target.value, style:`box-sizing:border-box;width:100%;`}) }
    #makeTextarea(k,v) { return van.tags.textarea({name:k, maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>{this._data[k].val=e.target.value;console.log(this._data)}, style:`box-sizing:border-box;width:100%;resize:none;`}) }
    #makeDefault(k,v) {return van.tags[v.t](((Object.hasOwnProperty(v.o)) ? d.o : null))}
    #makeTr(lb, el, wc) { return van.tags.tr({style:`padding:0;margin:0;`}, van.tags.th({style:`padding:0;margin:0;`}, lb), van.tags.td({style:`padding:0;margin:0;`,colspan:((Array.isArray(el) && 'select'===el[0].tagName.toLowerCase()) ? 2 : 1)}, el), van.tags.td({style:`padding:0;margin:0;`}, wc)) }
    #makeCounter(k, t, max) { return (('textarea,text'.split(',').includes(t)) ? div({style:`font-size:16px;padding:0;margin:0;`}, ()=>this._data[k].val.Graphemes.length, `/`, `${max}字`) : null) }
    #initCheckValues() {
        const hasKeys = [...document.querySelectorAll(`input[type="checkbox"][data-key]`)]
        const keys = [...new Set(hasKeys.map(cb=>cb.dataset.key))] // 重複削除した配列
        for (let key of keys) { this.#createCheckValues(key) }
    }
    #createCheckValues(key) {
        const kvs = [...document.querySelectorAll(`input[type="checkbox"][data-key="${key}"]`)].map(el=>[el.dataset.value, el.checked])
        this._data[key].val = Object.assign(...kvs.map(([k,v])=>({[k]:v})))
    }
}
class HeadViewer extends Viewer {
    constructor(data, ja) {
        super()
        this._data = data
        this._ja = ja
        this._title = van.state('')
        this._catch = van.state('')
        this._intro = van.state('')
        this._category = van.derive(()=>this._ja.category.options[this._data.category.val].l)
        this._genre = van.derive(()=>this._ja.genre.options[this._data.genre.val].l)
        this._keywords = van.state('')
        this._warningSex = van.derive(()=>{console.log(this._data.warning.sex.val);return ((this._data.warning.sex.val) ? ` ${this._ja.warning.items.sex.l}` : '')})
        this._warningViolence = van.derive(()=>{console.log(this._data.warning.violence.val);return ((this._data.warning.violence.val) ? ` ${this._ja.warning.items.violence.l}` : '')})
        this._warningCruelty = van.derive(()=>{console.log(this._data.warning.cruelty.val);return ((this._data.warning.cruelty.val) ? ` ${this._ja.warning.items.cruelty.l}` : '')})
        this._warningHead = van.derive(()=>((this._warningSex.val || this._warningViolence.val || this._warningCruelty.val) ? '⚠ ' : ''))
        this._warningTail = van.derive(()=>((this._warningSex.val || this._warningViolence.val || this._warningCruelty.val) ? ' 描写あり' : ''))

        this.children = [
                van.tags.h1(()=>this._data.title.val),
                van.tags.h2(()=>this._data.catch.val),
                van.tags.p(()=>this._data.intro.val),
                van.tags.p(()=>`${this._category.val}　${this._genre.val}`),
                //van.tags.p(()=>this._data.keywords.val),
                //van.tags.p(()=>this._data.keywords.val.split(',').filter(v=>v).join(' ')),
                //van.tags.p(()=>this._data.keywords.val.split(',').filter(v=>v).map(k=>van.tags.span(k))),
                //van.tags.ul(()=>this._data.keywords.val.split(',').filter(v=>v).map(k=>van.tags.li(k))),
                //van.tags.ul(this._data.keywords.val.split(',').filter(v=>v).map(k=>van.tags.li(k))),
                ()=>van.tags.ul({class:`keywords`},this._data.keywords.val.split(',').filter(v=>v).map(k=>van.tags.li({class:`keyword`},k))),
                van.tags.p(
                    ()=>`${this._warningHead.val}`, 
                    ()=>van.tags.span(()=>`${this._warningSex.val}`), 
                    ()=>van.tags.span(()=>`${this._warningViolence.val}`), 
                    ()=>van.tags.span(()=>`${this._warningCruelty.val}`),
                    ()=>`${this._warningTail.val}`, 
                ),
        ]
    }
}
window.JavelHeadWriter = JavelHeadWriter
})()
