class JavelAuthWriter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._head = this._manuscript.head
        //this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn = DivButton.make(()=>this.#setUrls(), ()=>'戻')
        this._backBtn.dataset.select = 'javel-head-writer'
//        this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this._backBtn)
        this.#createEls()
        van.add(document.body, this._el)
    }
    get el() { return this._el }
    #createEls() {
        this._el = van.tags.div(this.#createTable(), this._backBtn)
    }
    #makeIcon(id) {
        const C = { // Crypto
            'mona':{h:'https://ja.wikipedia.org/wiki/Monacoin'},
            'btc':{h:'https://ja.wikipedia.org/wiki/Bitcoin'},
            'ltc':{h:'https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%83%88%E3%82%B3%E3%82%A4%E3%83%B3'},
            'doge':{h:'https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%BC%E3%82%B8%E3%82%B3%E3%82%A4%E3%83%B3'},
            'eth':{h:'https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%BC%E3%82%B5%E3%83%AA%E3%82%A2%E3%83%A0'},
            'sol':{h:'https://en.wikipedia.org/wiki/Solana_(blockchain_platform)'},
        }
        const P = { // POSSE
            'mastodon':{h:'https://ja.wikipedia.org/wiki/%E3%83%9E%E3%82%B9%E3%83%88%E3%83%89%E3%83%B3_(%E3%83%9F%E3%83%8B%E3%83%96%E3%83%AD%E3%82%B0)'},
            'misskey':{h:'https://ja.wikipedia.org/wiki/Misskey'},
            'peertube':{h:'https://ja.wikipedia.org/wiki/PeerTube'},
        }
        const S = { // Silo
            'github':{h:'https://github.co.jp/'},
            'twitter':{h:'https://twitter.com/?lang=ja'},
            'amazon':{h:'https://www.amazon.co.jp/'},
            'dropbox':{h:'https://www.dropbox.com/ja/'},
        }
        const N = { // Silo-Novel
            'kakuyomu':{h:'https://kakuyomu.jp/',l:'カクヨム'}, // カクヨム（角川）
            'narou':{h:'https://syosetu.com/',l:'小説家になろう'}, // 小説家になろう
            'alpha-police':{h:'https://www.alphapolis.co.jp/',l:'アルファポリス'}, // アルファポリス
            'suteki':{h:'https://sutekibungei.com/',l:'ステキブンゲイ'}, // ステキブンゲイ
            'novel-days':{h:'https://novel.daysneo.com/beginner.html',l:'Novel Days'}, // Novel Days（講談社）
            'monogatary':{h:'https://monogatary.com/',l:'Monogatary'},
            'estar':{h:'https://estar.jp/',l:'エブリスタ'}, // エブリスタ
            'no-ichigo':{h:'https://www.no-ichigo.jp/',l:'野いちご'}, // 野いちご
            'maho':{h:'https://maho.jp/',l:'魔法のⅰランド'}, // 角川
            'note':{h:'https://note.com/',l:'Note'}, 
            'novelup':{h:'https://novelup.plus/',l:'ノベルアップ＋'}, // 
            'prologue':{h:'https://prologue-nola.com/',l:'Prologue'}, // 
            'pixiv':{h:'https://www.pixiv.net/',l:'Pixiv'}, // 
            'ssg':{h:'https://short-short.garden/',l:'SS庭'}, // 
            'novelba':{h:'https://novelba.com/help',l:'ノベルバ'}, // 
        }
        const [h,l] = this.#makeLabel(id,C,P,S,N)
        return van.tags.a({href:h,target:'_blank',rel:'noopener noreferrer',style:`text-decoration:none;`}, van.tags.ruby({style:`ruby-position:under;`},van.tags.i({class:`icon-${id}`}), van.tags.rt(l)))
    }
    #makeLabel(id,C,P,S,N) {
        if (C.hasOwnProperty(id)) { return [C[id].h, id.toUpperCase()] }
        else if (P.hasOwnProperty(id)) { return [P[id].h, id.Title] }
        else if (S.hasOwnProperty(id)) { return [S[id].h, id.Title] }
        else if (N.hasOwnProperty(id)) { return [N[id].h, N[id].l] }
        else {
            try {
                const url = new URL(id)
                return [url.href, url.domain]
            } catch (e) { throw new Error(`アイコン情報の取得に失敗！`) }
        }
    }
    #createTable() { return van.tags.table(
        van.tags.tr(
            van.tags.th(van.tags.ruby({style:`ruby-position:under;`},'👤',van.tags.rt('著者'))),
            van.tags.th('名前'),
            van.tags.td(van.tags.input({id:`author-name`, maxlength:20, placeholder:`山田《やまだ》太郎《たろう》`, oninput:(e)=>this._head.author.name.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('mona')),
            van.tags.th('アドレス'),
            van.tags.td(van.tags.input({id:`mona-coin-address`, maxlength:100, placeholder:'x'.repeat(34), oninput:(e)=>{this._head.author.coin.mona.val=e.target.value;console.log(this._head.author.coin.mona.val);}})),
        ),

        van.tags.tr(
            van.tags.th(this.#makeIcon('github')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.input({id:`github-user-url`, maxlength:100, placeholder:`https://github.com/ユーザ名`, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('twitter')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.input({id:`twitter-user-url`, maxlength:100, placeholder:`http://twitter.com/ユーザー名`, oninput:(e)=>this._head.author.sns.silo.twitter.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('mastodon')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.textarea({id:`mastodon-user-urls`, maxlength:500, placeholder:`https://mstdn.jp/@ユーザー名\nhttps://kmy.blue/@ユーザー名`})),
            /*
            van.tags.td(van.tags.textarea({id:`mastodon-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>
                try {
                    const urls=e.target.value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
                    for (let url of urls) {
                        console.log(url)
                        const domain = url.hostname
                        console.log(domain)
                        if (this._head.author.sns.mastodon.hasOwnProperty(domain)) {
                            this._head.author.sns.mastodon[domain].val = `${url}`
                        } else {this._head.author.sns.mastodon[domain] = van.state(`${url}`)}
                    }
                } catch(err) {console.error(err)}
            }})),
            */
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('misskey')),
            van.tags.th('ユーザURL'),
            //van.tags.td(van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{try{const domain=new URL(e.target.value).origin;this._head.author.misskey[domain].val=e.target.val;}catch(err){console.warn(err)}}})),
            van.tags.td(van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:`https://misskey.design/@ユーザ名\nhttps://novelskey.tarbin.net/@ユーザ名`})),
            /*
            van.tags.td(van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{
                try {
                    const urls=e.target.value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
                    for (let url of urls) {
                        console.log(url)
                        const domain = url.hostname
                        console.log(domain)
//                        this._head.author.sns.misskey[domain].val = `${url}`
                        if (this._head.author.sns.misskey.hasOwnProperty(domain)) {
                            this._head.author.sns.misskey[domain].val = `${url}`
                        } else {this._head.author.sns.misskey[domain] = van.state(`${url}`)}
                    }
                } catch(err) {console.error(err)}

//                try{const domain=new URL(e.target.value).origin;this._head.author.misskey[domain].val=e.target.val;}catch(err){console.warn(err)}}
            }})),
            */
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('kakuyomu')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.input({id:`kakuyomu-user-url`, maxlength:100, placeholder:`https://kakuyomu.jp/users/ユーザ名`, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('narou')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.input({id:`narou-user-url`, maxlength:100, placeholder:`https://mypage.syosetu.com/ユーザID`, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('alpha-police')),
            van.tags.th('ユーザURL'),
            van.tags.td(van.tags.input({id:`alpha-police-user-url`, maxlength:100, placeholder:`https://www.alphapolis.co.jp/author/detail/ユーザID`, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(van.tags.ruby({style:`ruby-position:under;`},'🔗',van.tags.rt('他サイト'))),
            van.tags.th('URL'),
            van.tags.td(van.tags.textarea({id:`site-urls`, maxlength:500, placeholder:`https://note.com/ユーザ名\nhttps://profile.hatena.ne.jp/ユーザ名/\nhttps://ユーザ名.hatenablog.com/`, oninput:(e)=>{
                try {
                    const urls=e.target.value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
                    this._head.author.sites.val = urls.map(url=>`${url}`)
                } catch (err) {console.warn(err)}
            }})),
        ),
    ) }
    #setUrls() {
        for (let key of ['mastodon','misskey']) {
            this.#setInstanceUrls(document.querySelector(`#${key}-user-urls`).value, key)
        }
//        this.#setInstanceUrls(document.querySelector(`#mastodon-user-urls`).value, 'mastodon')
//        this.#setInstanceUrls(document.querySelector(`#misskey-user-urls`).value, 'misskey')
    }
    #setInstanceUrls(value, serviceName) {
        try {
            //const urls=e.target.value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
            const urls = value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
            for (let url of urls) {
                console.log(url)
                const domain = url.hostname
                console.log(domain)
                if (this._head.author.sns[serviceName].hasOwnProperty(domain)) {
                    this._head.author.sns[serviceName][domain].val = `${url}`
                } else {this._head.author.sns[serviceName][domain] = van.state(`${url}`)}
            }
        } catch(err) {console.error(err)}
    }
}
