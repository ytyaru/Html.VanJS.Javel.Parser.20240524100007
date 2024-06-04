class JavelHeadWriter {
    constructor(headData) {
        //this._data = new HeadData()
        this._data = headData
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._authBtn = DivButton.make(null, ()=>'著者')
        this._authBtn.dataset.select = 'javel-auth-writer'
        this._editor = van.tags.div({style:`padding:0;margin:0;`}, this.#makeEls())
        this._menu = new MenuScreen([this._backBtn, this._authBtn])
        this._layout = new Triple()
        this._viewer = new Viewer()
        this._layout.first = this._editor
        this._layout.menu = this._menu.el
        this._layout.last = this._viewer.el
        this._el = this._layout.el
        van.add(document.body, this._el)
        this.#initCheckValues()
        van.derive(()=>this.#updateViewer())
    }
    get el() { return this._el }
    #makeEls() {
        this._ja = {
            'title': {l:'表題', t:'textarea', wcl:100},
            'catch': {l:'ｷｬｯﾁｺﾋﾟｰ', t:'text', wcl:35},
            'intro': {l:'紹介', t:'textarea', wcl:200},
            'category': {l:'ｶﾃｺﾞﾘ', t:'select', options:{
                'light-novel':'ライトノベル',
                'light-literature':'ライト文芸',
                'general-literature':'一般文芸',
                'pure-literature':'文学',
                'children-novel':'児童小説',
                'erotic-novel':'官能小説',
            }},
            'genre': {l:'ｼﾞｬﾝﾙ', t:'select', options:{
                'fantasy':'ファンタジー', 
                'sf':'SF', 
                'mystery':'ミステリー', 
                'horror':'ホラー', 
                'love':'恋愛', 
                'youth':'青春', 
                'drama':'現代ドラマ',
                'history':'歴史', 
                'economy':'経済', 
                'politics':'政治',
            }},
            'keyword': {l:'ｷｰﾜｰﾄﾞ', t:'text', wcl:20},
            'warning': {l:'描写', t:'checkbox', items:{'sex':{l:'性',c:false},'violence':{l:'暴力',c:false,},'cruelty':{l:'残酷',c:false}}}, // 性,暴力,残酷 描写有
        }
        //return van.tags.table([...Object.entries(data)].map(e=>this.#makeTr(this.#makeLabel(e[0],e[1]), this.#makeEl(e[0],e[1]))))
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
            default: return this.#makeDefault(k,v)
        }
    }
    #makeLabel(k,v) { return van.tags.label(v.l || k) }
    #makeSelect(k,v) { return van.tags.select({name:k, oninput:(e)=>this._data[k].val=e.target.value}, this.#makeOptions(v)) }
    #makeOptions(v) { return [...Object.entries(v.options).map(e=>van.tags.option({value:e[0]}, e[1]))] }
    #makeCheckbox(k,v) { return [...Object.entries(v.items)].map(e=>van.tags.label(van.tags.input({type:'checkbox', name:`${k}-${e[0]}`, checked:e[1].c, 'data-key':k, 'data-value':e[0], onchange:(E)=>this._data[k].val[e[0]] = E.target.checked}, e[1].l), e[1].l)) }
    #makeText(k,v) { return van.tags.input({name:k, type:'text', maxlength:v.wcl, oninput:(e)=>this._data[k].val=e.target.value, style:`box-sizing:border-box;width:100%;`}) }
    #makeTextarea(k,v) { return van.tags.textarea({name:k, maxlength:v.wcl, oninput:(e)=>{this._data[k].val=e.target.value;console.log(this._data)}, style:`box-sizing:border-box;width:100%;resize:none;`}) }
    #makeDefault(k,v) {return van.tags[v.t](((Object.hasOwnProperty(v.o)) ? d.o : null))}
    #makeTr(lb, el, wc) { return van.tags.tr({style:`padding:0;margin:0;`}, van.tags.th({style:`padding:0;margin:0;`}, lb), van.tags.td({style:`padding:0;margin:0;`}, el), van.tags.td({style:`padding:0;margin:0;`}, wc)) }
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

    #updateViewer() {
        /*
        const children = []
        children.push()
            for (let [k,v] of Object.entries(this._data.warning.items)) {
                if (v) {
                    //van.tags.p(()=>'⚠ ' + this._data.keyword.val),
                    van.tags.p(()=>`⚠ ${this._ja.warning.items[k].l}描写あり`),
                }
            }

        [...Object.entries(this._data.warning.items)].filter(kv=>kv[1])
        */
        console.error(this._data.warning.val)
        console.error([...Object.entries(this._data.warning.val)])
        console.error([...Object.entries(this._data.warning.val)].filter(kv=>kv[1]))
        console.log()
        console.log()
        this._viewer.children = [
            ...[
                van.tags.h1(()=>this._data.title.val),
                van.tags.h2(()=>this._data.catch.val),
                van.tags.p(()=>this._data.intro.val),
                van.tags.p(()=>this._ja.category.options[this._data.category.val] + '　' + this._ja.genre.options[this._data.genre.val]),
                van.tags.p(()=>this._data.keyword.val),
            ], 
            //...[...Object.entries(this._data.warning.val)].map(kv=>van.tags.p(()=>`⚠ ${this._ja.warning.items[kv[0]].l}描写あり`)),
            ...[
                van.tags.p(()=>((this._data.warning.val.sex) ? `⚠ ${this._ja.warning.items.sex.l}描写あり` : null)),
                van.tags.p(()=>((this._data.warning.val.violence) ? `⚠ ${this._ja.warning.items.violence.l}描写あり` : null)),
                van.tags.p(()=>((this._data.warning.val.cruelty) ? `⚠ ${this._ja.warning.items.cruelty.l}描写あり` : null)),
            ],
        ]

        /*
        */
        
    }
    /*
    #setChecked(k, name, checked) {
        this._data[k]
    }
    */
    /*
    #checked(key, value, checked) {
        console.log(key, value, checked)
        if (checked) {
            if (0===this._data[key].val.length) { this._data[key].val = value }
            else { this._data[key].val += ',' + value }
        } else {
            if (value===this._data[key].val) { this._data[key].val = '' }
            else {
                console.log(typeof this._data[key].val)
                console.log(this._data[key].val)
                console.log(this._data[key].val.trimAny())
                this._data[key].val = this._data[key].val.trimAny(value + ',')
                this._data[key].val = this._data[key].val.trimAny(',' + value)
            }
        }
    }
    */
    /*
    #checked(key, value, checked) { this._data[key].val[value] = checked }
    #getChecked(k) { return [...document.querySelectorAll(`input[type="checkbox"]`)].filter(el=>(el.checked && (k===el.dataset.key))).map(el=>el.dataset.value) }

    #getChecked(k) {
        for (let el of document.querySelectorAll(`input[type="checkbox"]`)) {
            if (k!==el.dataset.key) { continue }
            
        }
        [...document.querySelectorAll(`input[type="checkbox"][name^="${k}-"]`)].filter(el=>el.checked).map(el=>)
    }
    */
}
