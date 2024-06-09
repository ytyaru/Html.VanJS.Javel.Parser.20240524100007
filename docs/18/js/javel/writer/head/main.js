(function(){
class JavelHeadWriter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._data = this._manuscript.head
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._authBtn = DivButton.make(null, ()=>'著者')
        this._authBtn.dataset.select = 'javel-auth-writer'
        //this._editor = van.tags.div({style:`padding:0;margin:0;`}, this.#makeEls())
        this._viewer = new Viewer()
        this._editor = new Editor(this._data, this._viewer)
        this._menu = new MenuScreen([this._backBtn, this._authBtn])
        this._layout = new Triple()
        this._layout.first = this._editor.el
        this._layout.menu = this._menu.el
        this._layout.last = this._viewer.el
        this._el = this._layout.el
        van.add(document.body, this._el)
        van.derive(()=>this._editor.updateViewer())
    }
    get el() { return this._el }
}
class Editor {
    constructor(head, viewer) {
        //this._manuscript = manuscript
        //this._data = this._manuscript.head
        this._data = head // this._manuscript.head
        this._viewer = viewer
        this._el = van.tags.div({style:`padding:0;margin:0;`}, this.#makeEls())
        this.#initCheckValues()
    }
    get el() { return this._el }
    #makeEls() {
        this._ja = {
            'title': {l:'表題', t:'textarea', wcl:100, p:'表題'},
            'catch': {l:'ｷｬｯﾁｺﾋﾟｰ', t:'text', wcl:35, p:'キャッチコピー'},
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
            'keywords': {l:'ｷｰﾜｰﾄﾞ', t:'textarea', wcl:200, p:'語,語,語（カンマ区切り）'},
            //'keywords': {l:'ｷｰﾜｰﾄﾞ', t:'tagify', wcl:20},
            'warning': {l:'描写', t:'checkbox', items:{'sex':{l:'性',c:false},'violence':{l:'暴力',c:false,},'cruelty':{l:'残酷',c:false}}}, // 性,暴力,残酷 描写有
        }
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
    //#makeSelect(k,v) { return van.tags.select({name:k, oninput:(e)=>this._data[k].val=e.target.value}, this.#makeOptions(v)) }
    //#makeOptions(v) { return [...Object.entries(v.options).map(e=>van.tags.option({value:e[0]}, e[1]))] }
    //#makeOptions(v) { return [...Object.entries(v.options).map(e=>van.tags.option({value:e[0]}, e[1].l))] }
    //#makeOptions(k,v) { return [...Object.entries(v.options).map(e=>van.tags.option({value:e[0], selected:(e[0]===this._data[k].val)}, e[1].l))] }
    #makeOptions(k,v) { return [...Object.entries(v.options).map(e=>{console.error(k,e[0],':',this._data,this._data['category'],this._data[k].val);return van.tags.option({value:e[0], selected:(e[0]===this._data[k].val)}, e[1].l)})] }
    #makeCheckbox(k,v) { return [...Object.entries(v.items)].map(e=>van.tags.label(van.tags.input({type:'checkbox', name:`${k}-${e[0]}`, checked:e[1].c, 'data-key':k, 'data-value':e[0], onchange:(E)=>this._data[k].val[e[0]] = E.target.checked}, e[1].l), e[1].l)) }
    //#makeText(k,v) { return van.tags.input({name:k, type:'text', maxlength:v.wcl, oninput:(e)=>this._data[k].val=e.target.value, style:`box-sizing:border-box;width:100%;`}, ()=>this._data[k].val/*this._manuscript.head[k].val*/) }
    #makeText(k,v) { return van.tags.input({name:k, type:'text', maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>this._data[k].val=e.target.value, style:`box-sizing:border-box;width:100%;`}) }
    #makeTextarea(k,v) { return van.tags.textarea({name:k, maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>{this._data[k].val=e.target.value;console.log(this._data)}, style:`box-sizing:border-box;width:100%;resize:none;`}) }
    #makeDefault(k,v) {return van.tags[v.t](((Object.hasOwnProperty(v.o)) ? d.o : null))}
    #makeTr(lb, el, wc) { return van.tags.tr({style:`padding:0;margin:0;`}, van.tags.th({style:`padding:0;margin:0;`}, lb), van.tags.td({style:`padding:0;margin:0;`,colspan:((Array.isArray(el) && 'select'===el[0].tagName.toLowerCase()) ? 2 : 1)}, el), van.tags.td({style:`padding:0;margin:0;`}, wc)) }
    #makeCounter(k, t, max) { return (('textarea,text'.split(',').includes(t)) ? div({style:`font-size:16px;padding:0;margin:0;`}, ()=>this._data[k].val.Graphemes.length, `/`, `${max}字`) : null) }
//    #makeCounter(k, t, max) { console.log(k, t, max, this._data[k]);return (('textarea,text'.split(',').includes(t)) ? div({style:`font-size:16px;padding:0;margin:0;`}, ()=>((Type.isStr(this._data[k].val)) ? `${this._data[k].val.Graphemes.length}/${max}字` : `${tagify.value.length}/${tagify.settings.maxTags}個 ${this._ja[k].wcl}/${max}字`)) : null) }
    /*
    #makeTagify(k, v) {
        const el = van.tags.textarea({id:k, onchange:(e)=>this._data[k].val=document.querySelector(`#${k}`).value.map(v=>v.value)})
        console.log(el)
        return new Tagify(el, {
        
    })}
    */
    #initCheckValues() {
        const hasKeys = [...document.querySelectorAll(`input[type="checkbox"][data-key]`)]
        const keys = [...new Set(hasKeys.map(cb=>cb.dataset.key))] // 重複削除した配列
        for (let key of keys) { this.#createCheckValues(key) }
    }
    #createCheckValues(key) {
        const kvs = [...document.querySelectorAll(`input[type="checkbox"][data-key="${key}"]`)].map(el=>[el.dataset.value, el.checked])
        this._data[key].val = Object.assign(...kvs.map(([k,v])=>({[k]:v})))
    }
    updateViewer() {
        this._viewer.children = [
            ...[
                van.tags.h1(()=>this._data.title.val),
                van.tags.h2(()=>this._data.catch.val),
                van.tags.p(()=>this._data.intro.val),
                van.tags.p(()=>{
                    console.log(this._ja.category.options[this._data.category.val], this._ja.genre.options[this._data.genre.val])
//                    console.log(this._ja.category.options[this._data.category.val].l, this._ja.genre.options[this._data.genre.val].l)
//                    return this._ja.category.options[this._data.category.val].l + '　' + this._ja.genre.options[this._data.genre.val].l}),
//                    return this._ja.category.options[this._data.category.val] + '　' + this._ja.genre.options[this._data.genre.val]}),
                    return this._data.category.val + '/' + this._data.genre.val}),
//                    return ((this._data.category.val + '/' + this._data.genre.val) ? this._ja.category.options[this._data.category.val].l + '　' + this._ja.genre.options[this._data.genre.val].l : '')}),
                van.tags.p(()=>this._data.keywords.val),
            ], 
            ...[
                van.tags.p(()=>((this._data.warning.val.sex) ? `⚠ ${this._ja.warning.items.sex.l}描写あり` : null)),
                van.tags.p(()=>((this._data.warning.val.violence) ? `⚠ ${this._ja.warning.items.violence.l}描写あり` : null)),
                van.tags.p(()=>((this._data.warning.val.cruelty) ? `⚠ ${this._ja.warning.items.cruelty.l}描写あり` : null)),
            ],
        ]
    }
}
window.JavelHeadWriter = JavelHeadWriter
})()
