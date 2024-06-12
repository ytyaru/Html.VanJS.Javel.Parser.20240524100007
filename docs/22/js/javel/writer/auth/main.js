class JavelAuthWriter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._head = this._manuscript.head
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-head-writer'
//        this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this._backBtn)
        this.#createEls()
        van.add(document.body, this._el)
    }
    get el() { return this._el }
    #createEls() {
        this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this.#createTable(), this._backBtn)
        /*
        //this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this._backBtn)
        this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this._backBtn,
            van.tags.input({id:`author-name`, maxlength:20, placeholder:`山田《やまだ》太郎《たろう》`, oninput:(e)=>this._head.author.name.val=e.target.val}),
            van.tags.input({id:`mona-coin-address`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.coin.mona.val=e.target.val}),
            van.tags.input({id:`github-user-url`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.val}),
            van.tags.input({id:`twitter-user-url`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.sns.silo.twitter.val=e.target.val}),
            van.tags.textarea({id:`mastodon-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{try{const domain=new URL(e.target.value).origin;this._head.author.mastodon[domain].val=e.target.val;}catch(err){}}}),
            van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{try{const domain=new URL(e.target.value).origin;this._head.author.misskey[domain].val=e.target.val;}catch(err){}}}),
        )
        */
    }
    #createTable() { return van.tags.table(
        van.tags.tr(
            van.tags.th('名前'),
            van.tags.td(van.tags.input({id:`author-name`, maxlength:20, placeholder:`山田《やまだ》太郎《たろう》`, oninput:(e)=>this._head.author.name.val=e.target.val})),
        ),
        van.tags.tr(
            van.tags.th('MONAコインアドレス'),
            van.tags.td(van.tags.input({id:`mona-coin-address`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.coin.mona.val=e.target.val})),
        ),
        van.tags.tr(
            van.tags.th('GitHubユーザURL'),
            van.tags.td(van.tags.input({id:`github-user-url`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.sns.silo.github.val=e.target.val})),
        ),
        van.tags.tr(
            van.tags.th('TwitterユーザURL'),
            van.tags.td(van.tags.input({id:`twitter-user-url`, maxlength:100, placeholder:``, oninput:(e)=>this._head.author.sns.silo.twitter.val=e.target.val})),
        ),
        van.tags.tr(
            van.tags.th('MastodonユーザURL'),
            //van.tags.td(van.tags.textarea({id:`mastodon-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{try{const domain=new URL(e.target.value).origin;this._head.author.mastodon[domain].val=e.target.val;}catch(err){}}})),
            van.tags.td(van.tags.textarea({id:`mastodon-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{
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
            
        ),
        van.tags.tr(
            van.tags.th('MisskeyユーザURL'),
            //van.tags.td(van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{try{const domain=new URL(e.target.value).origin;this._head.author.misskey[domain].val=e.target.val;}catch(err){console.warn(err)}}})),
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
        ),
        van.tags.tr(
            van.tags.th('他URL'),
            van.tags.td(van.tags.textarea({id:`misskey-user-urls`, maxlength:500, placeholder:``, oninput:(e)=>{
                try {
                    const urls=e.target.value.split('\n').map(url=>{try{return new URL(url)}catch(err){return null}}).filter(v=>v)
                    this._head.author.sites.val = urls.map(url=>`${url}`)
                } catch (err) {console.warn(err)}
            }})),
        ),
    ) }
}
