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
                'fiction':{l:'フィクション',d:'上記以外の架空の物語全般'},
            }},
            'keywords': {l:'ｷｰﾜｰﾄﾞ', t:'textarea', wcl:100, p:'語,語,語（カンマ区切り）'},
            'warning': {l:'描写', t:'checkbox', items:{'sex':{l:'性',c:false},'violence':{l:'暴力',c:false,},'cruelty':{l:'残酷',c:false}}},
        }
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._authBtn = DivButton.make(null, ()=>'著者')
        this._authBtn.dataset.select = 'javel-auth-writer'
//        this._viewer = new Viewer()
        this._viewer = new HeadViewer(this._data, this._ja)
        this._editor = new Editor(this._data, this._ja)
        this._menu = new MenuScreen([this._authBtn, this._backBtn])
        this._layout = new Triple()
        this._layout.first = this._editor.el
        this._layout.menu = this._menu.el
        this._layout.last = this._viewer.el
        this._el = this._layout.el
        van.add(document.body, this._el)
        this._editor.init()
    }
    get el() { return this._el }
    resize() { this._layout.resize(); this._menu.resize(); }
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
        return van.tags.table({style:`width:100%;padding:0;margin:0;`}, [...Object.entries(this._ja)].map(([k,v])=>{
            const el = this.#makeEl(k,v)
            return this.#makeTr(
                this.#makeLabel(k, v), 
                el, 
                this.#makeCounter(k, v.t, v.wcl),
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
    #makeOptions(k,v) { return [...Object.entries(v.options).map(e=>{console.error(k,e[0],':',this._data,this._data['category'],this._data[k].val, e[0]===this._data[k].val);return van.tags.option({value:e[0], selected:()=>(e[0]===this._data[k].val)}, e[1].l)})] }
    #makeCheckbox(k,v) { return [...Object.entries(v.items)].map(e=>van.tags.label(van.tags.input({type:'checkbox', name:`${k}-${e[0]}`, checked:()=>this._data[k][e[0]].val, 'data-key':k, 'data-value':e[0], onchange:(E)=>{this._data[k][e[0]].val = E.target.checked;console.log(k, e[0], this._data[k][e[0]].val);}}, e[1].l), e[1].l)) }
    #makeText(k,v) { return van.tags.input({name:k, type:'text', maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>this._data[k].val=e.target.value, style:`box-sizing:border-box;width:100%;`}) }
    //#makeTextarea(k,v) { return van.tags.textarea({name:k, maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>{this._data[k].val=e.target.value;console.log(this._data)}, style:`box-sizing:border-box;width:100%;resize:none;`}) }
    #makeTextarea(k,v) { return van.tags.textarea({name:k, maxlength:v.wcl, placeholder:v.p, value:()=>this._data[k].val, oninput:(e)=>{this._data[k].val=e.target.value.trimLine();console.log(this._data)}, style:`box-sizing:border-box;width:100%;resize:none;`}) }
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
        console.log(this._data.author.contact.mastodon)
        this.children = [
            van.tags.h1(()=>this._data.title.val),
            van.tags.h2(()=>this._data.catch.val),
            van.tags.p(()=>this._data.intro.val),
            van.tags.p(()=>`${this._category.val}　${this._genre.val}`),
            ()=>van.tags.ul({class:`keywords`},this._data.keywords.val.split(',').filter(v=>v).map(k=>van.tags.li({class:`keyword`},k))),
            van.tags.p(
                ()=>`${this._warningHead.val}`, 
                ()=>van.tags.span(()=>`${this._warningSex.val}`), 
                ()=>van.tags.span(()=>`${this._warningViolence.val}`), 
                ()=>van.tags.span(()=>`${this._warningCruelty.val}`),
                ()=>`${this._warningTail.val}`, 
            ),
            van.tags.p(()=>`${this._data.readWordCount.val}字`),

            // 著者
            van.tags.p(()=>`${this._data.author.name.val}`),
            // 暗号通貨
            ()=>van.tags.ul([...Object.entries(this._data.author.coin)].filter(([k,v])=>v.val).map(([k,v])=>van.tags.li(van.tags.img({src:`../asset/image/icon/coin/svg/icon/${k}.svg`,width:64,height:64,title:()=>v.val})))),
            // 連絡先
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'}, [
//                this._data.author.contact.revision.github.val ? Icon.getEl() : null,
//                this._data.author.contact.sns.twitter.val ? : null,
                ...[...Object.entries(this._data.author.contact.revision)].filter(([k,v])=>v.val).map(([k,v])=>this.#makeLi(v.val, Icon.getEl(v.val))),
                ...[...Object.entries(this._data.author.contact.sns)].filter(([k,v])=>v.val).map(([k,v])=>this.#makeLi(v.val, Icon.getEl(v.val))),
                ...this._data.author.contact.mastodon.val.filter(v=>v).map(v=>this.#makeLi(v, Icon.getCategoryEl('mastodon'))),
                ...this._data.author.contact.misskey.val.filter(v=>v).map(v=>this.#makeLi(v, Icon.getCategoryEl('misskey'))),
                ...this._data.author.contact.novel.val.filter(v=>v).map(v=>this.#makeLi(v, Icon.getEl(v))),
                ...this._data.author.contact.url.val.filter(v=>v).map(v=>this.#makeLi(v, Icon.getEl(v))),
            ]),


            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},[...Object.entries(this._data.author.sns.silo)].filter(([k,v])=>v.val).map(([k,v])=>van.tags.a({href:v.val,target:'_blank',rel:'noopener noreferrer'}, van.tags.li({style:`display:inline-block;`},van.tags.i({class:`icon-${k}`}))))),
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},[...Object.entries(this._data.author.sns.novel)].filter(([k,v])=>v.val).map(([k,v])=>van.tags.a({href:v.val,target:'_blank',rel:'noopener noreferrer'},van.tags.li({style:`display:inline-block;`},van.tags.i({class:`icon-${k}`}))))),

            // Mastodon
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},
                this._data.author.contact.mastodon.val.map(href=>van.tags.li({style:`display:inline-block;`}, van.tags.a({href:href, target:'_blank', rel:'noopener noreferrer', style:`text-decoration:none;color:var(--fg-color);background-color:var(--bg-color);`}, Icon.getDomainEl('mastodon',href,true)))),
            ),
            // Misskey
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},
                this._data.author.contact.misskey.val.map(href=>van.tags.li({style:`display:inline-block;`}, van.tags.a({href:href, target:'_blank', rel:'noopener noreferrer', style:`text-decoration:none;color:var(--fg-color);background-color:var(--bg-color);`}, Icon.getDomainEl('misskey',href,true)))),
            ),
            // Novel
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},
                this._data.author.contact.novel.val.map(href=>van.tags.li({style:`display:inline-block;`}, van.tags.a({href:href, target:'_blank', rel:'noopener noreferrer', style:`text-decoration:none;color:var(--fg-color);background-color:var(--bg-color);`}, Icon.getEl(href,true)))),
            ),
            // Other
            ()=>van.tags.ul({style:`list-style:none;padding:0;`,role:'list'},
                this._data.author.contact.url.val.map(href=>van.tags.li({style:`display:inline-block;`}, van.tags.a({href:href, target:'_blank', rel:'noopener noreferrer', style:`text-decoration:none;color:var(--fg-color);background-color:var(--bg-color);`}, Icon.getEl(href,true)))),
            ),
        ]
    }
    #makeLi(href, children) { return van.tags.li({style:`display:inline-block;`}, Icon.getLink(href, children)) }
    #getContacts() {
        /*
        const ul = van.tags.ul()
        //van.add(ul, ()=>this._data.author.coin.mona.val ? this._data.author.coin.mona.val : null)
        //van.add(ul, ()=>van.tags.li(()=>this._data.author.coin.mona.val))
        van.add(ul, ()=>this._data.author.coin.mona.val ? van.tags.li(()=>this._data.author.coin.mona.val) : null)
        return ul
        */
        //return van.tags.ul(()=>this._data.author.coin.mona.val ? van.tags.li(()=>this._data.author.coin.mona.val) : null)
        ()=>((0 < this._data.author.coin.mona.val.length) ? van.tags.img({src:`../asset/image/icon/coin/mona/mona-line-black.svg`,width:64,height:64,title:()=>this._data.author.coin.mona.val}) : null)
    }
    #getIcon(href) {
        const N = {
            "alpha-police":{"rt":"アルファポリス","h":"https://www.alphapolis.co.jp/","start":"2014"},
            "berrys-cafe":{"rt":"ベリーズカフェ","h":"https://www.berrys-cafe.jp/","o":"starts","start":"2011","features":"女性向け"},
            "estar":{"rt":"エブリスタ","h":"https://estar.jp/","start":"2010"},
            "kakuyomu":{"rt":"カクヨム","h":"https://kakuyomu.jp/","o":"kadokawa","start":"2016"},
            "novel-days":{"rt":"Novel Days","h":"https://novel.daysneo.com/","o":"kodansha","start":"2016"},
            "narou":{"rt":"小説家になろう","h":"https://syosetu.com/","start":"2014"},
            "novel-up-plus":{"rt":"ノベルアップ＋","h":"https://novelup.plus/","start":"2019"},
            "no-ichigo":{"rt":"野いちご","h":"https://www.no-ichigo.jp/","o":"starts","features":"10代女子向け"},
            "nola-novel":{"rt":"Nolaノベル","h":"https://story.nola-novel.com/","o":"株式会社indent"},
            "novelba":{"rt":"ノベルバ","h":"https://novelba.com/","start":"2017"},
            "novema":{"rt":"ノベマ","h":"https://novema.jp/","o":"starts","start":"2020"},
            "pri-novel":{"rt":"プリ小説","h":"https://novel.prcm.jp/","o":"gmo","features":"10代女子向け"},
            "prologue":{"rt":"Prologue","h":"https://prologue-nola.com/","features":"2000字上限"},
            "tugi-kuru":{"rt":"ツギクル","h":"https://www.tugikuru.jp/","o":"ツギクル株式会社","start":"2016"},
            "lanove-street":{"rt":"ラノベストリート","h":"https://ln-street.com/","o":"nakamura-kou"},
            "monogatary":{"rt":"monogatary","h":"https://monogatary.com/","o":"sony-music","features":"楽曲化、映画化コンテストが多い"},
            "suteki":{"rb":"㋜", "rt":"ステキブンゲイ","h":"https://sutekibungei.com/","o":"nakamura-kou","features":"一般文芸に特化","start":"2020"},
            "maho":{"rb":"ⓘ", "rt":"魔法のⅰランド","h":"https://maho.jp/","start":"1999","o":"kadokawa","features":"女性向け"},
            "ssg":{"rb":"SSG", "rt":"ｼｮｰﾄｼｮｰﾄｶﾞｰﾃﾞﾝ","h":"https://short-short.garden/","features":"400字上限"},
            "hameln":{"rb":"㋩","rt":"ハーメルン","h":"https://syosetu.org/","o":"individual","features":"二次創作","start":"2012"},
            "tie-up":{"rb":"tie","rt":"たいあっぷ","h":"https://tieupnovels.com/"},
            "teller":{"rb":"tel","rt":"テラーノベル","h":"https://teller.jp/","start":"2017"},
            "novelism":{"rb":"lism","rt":"ノベリズム","h":"https://novelism.jp/","start":"2020","o":"株式会社viviON"},
            "novelist":{"rb":"list","rt":"ノベリスト","h":"https://2.novelist.jp/","start":"2009","o":"株式会社シンカネット"},
            "novelabo":{"rb":"labo","rt":"ノベラボ","h":"https://www.novelabo.com/","start":"2015","o":"デザインエッグ株式会社"}
        }
        console.log(href)
        const url = new URL(href)
        for (let [k,v] of Object.entries(N)) {
            if (href.startsWith(v.h)) {
                return van.tags.a({href:href, target:'_blank', rel:'noopener noreferrer'},
                    van.tags.ruby({style:`ruby-position:under;`},
//                        ((v.hasOwnProperty('rb')) ? v.rb : van.tags.img({src:`sub/novel/${k}.svg`,width:64,height:64})),
                        ((v.hasOwnProperty('rb')) ? v.rb : van.tags.img({src:`../asset/image/icon/sns/sub/novel/${k}.svg`,width:64,height:64})),
//                        ((v.hasOwnProperty('rb')) ? v.rb : van.tags.i({class:`icon-${k}`,width:64,height:64})),
                        van.tags.rt(v.rt)
                    )
                )
            }
        }
        return van.tags.a({href:url.href, target:'_blank', rel:'noopener noreferrer'}, van.tags.span(url.domain))
    }
}
window.JavelHeadWriter = JavelHeadWriter
})()
