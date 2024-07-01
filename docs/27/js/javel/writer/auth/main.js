(function(){
class JavelAuthWriter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._head = this._manuscript.head
        this._addCryptos = van.state([]) // 追加した暗号資産ID
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-head-writer'
        this.#createEls()
        van.add(document.body, this._el)
    }
    get el() { return this._el }
    #createEls() {
        this._editor = new Editor(this._head, this._addCryptos)
        this._menu = new MenuScreen([this._backBtn])
        this._viewer = new Intro(this._head, this._addCryptos)
        this._layout = new Triple()
        this._layout.first = this._editor.el
        this._layout.menu = this._menu.el
        this._layout.last = this._viewer.el
        this._el = this._layout.el
    }
    resize() { this._layout.resize(); this._menu.resize(); }
}
class Editor extends Viewer {
    constructor(head, addCryptos) {
        super()
        this._head = head
        this._addCryptos = addCryptos
        this._addCryptoTrs = van.state({})
        this.setHorizontal()
        this.children = [this.#createTable(), ()=>this.#makeCryptoTable()]
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
        return van.tags.a({tabindex:-1, href:h,target:'_blank',rel:'noopener noreferrer',style:`display:block;text-decoration:none;color:var(--fg-color);backgorund-color:var(--bg-color);`}, van.tags.ruby({style:`display:block;ruby-position:under;`},van.tags.i({class:`icon-${id}`}), van.tags.rt(l)))
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
    #createTable() { return van.tags.table({style:'width:100%;height:100%;'},
        van.tags.tr(
            van.tags.th({style:'width:3.5em;padding:0;margin:0;'},van.tags.ruby({style:`ruby-position:under;`},van.tags.i({class:'icon-person'}),van.tags.rt('著者'))),
            van.tags.td(van.tags.input({id:`author-name`, maxlength:20, placeholder:`山田《やまだ》太郎《たろう》`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;', oninput:(e)=>this._head.author.name.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('mona')),
            van.tags.td(van.tags.input({id:`mona-coin-address`, maxlength:100, placeholder:'x'.repeat(34), style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', oninput:(e)=>{this._head.author.coin.mona.val=e.target.value;console.log(this._head.author.coin.mona.val);}})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('github')),
            van.tags.td(van.tags.input({id:`github-user-url`, maxlength:100, placeholder:`https://github.com/ユーザ名`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', 
//            oninput:(e)=>this._head.author.sns.silo.github.val=e.target.value})),
            oninput:(e)=>this._head.author.contact.revision.github.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('twitter')),
            van.tags.td(van.tags.input({id:`twitter-user-url`, maxlength:100, placeholder:`http://twitter.com/ユーザー名`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', 
//            oninput:(e)=>this._head.author.sns.silo.twitter.val=e.target.value})),
            oninput:(e)=>this._head.author.contact.sns.twitter.val=e.target.value})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('mastodon')),
            van.tags.td(van.tags.textarea({id:`mastodon-user-urls`, placeholder:`https://mstdn.jp/@ユーザー名\nhttps://kmy.blue/@ユーザー名`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', oninput:(e)=>this.#setList('mastodon', e)})),
        ),
        van.tags.tr(
            van.tags.th(this.#makeIcon('misskey')),
            van.tags.td(van.tags.textarea({id:`misskey-user-urls`, placeholder:`https://misskey.design/@ユーザ名\nhttps://novelskey.tarbin.net/@ユーザ名`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', oninput:(e)=>this.#setList('misskey', e)})),
        ),
        van.tags.tr(
            van.tags.th(van.tags.ruby({style:`ruby-position:under;`},van.tags.i({class:'icon-link'}),van.tags.rt('他サイト'))),
            van.tags.td(van.tags.textarea({id:`other-urls`, placeholder:`https://some.com/\nhttps://any.org/`, style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', oninput:(e)=>this.#setList('url', e), value:`
https://www.alphapolis.co.jp/
https://www.berrys-cafe.jp/
https://estar.jp/
https://kakuyomu.jp/
https://novel.daysneo.com/
https://syosetu.com/
https://novelup.plus/
https://www.no-ichigo.jp/
https://story.nola-novel.com/
https://novelba.com/
https://novema.jp/
https://novel.prcm.jp/
https://prologue-nola.com/
https://www.tugikuru.jp/
https://ln-street.com/
https://monogatary.com/
https://sutekibungei.com/
https://maho.jp/
https://short-short.garden/
https://syosetu.org/
https://tieupnovels.com/
https://teller.jp/
https://novelism.jp/
https://2.novelist.jp/
https://www.novelabo.com/

https://pawoo.net/
https://ichiji.social/
https://fedibird.com/
https://otadon.com/
https://mstdn.jp/
https://mastodon-japan.net/

https://novelskey.tarbin.net/
https://misskey.design/
https://misskey.art/
https://maniakey.com/
https://mi.nakn.jp/
https://sushi.ski/
https://misskey.io/

https://twitter.com/
https://github.co.jp/
https://www.amazon.co.jp/
https://www.dropbox.com/
https://www.youtube.com/

https://onolog.net/

https://note.com/
https://www.notion.so/
https://monaledge.com/

https://www.pixiv.net/
https://storie.jp/
https://tapnovel.com/
https://plicy.net/

https://web3.askmona.org/
            `})),
        ),
    ) }
    #makeCryptoTable() { return van.tags.table({style:'width:100%;height:100%;'},
        this._addCryptos.val.map(id=>van.tags.tr(
            van.tags.th({style:'width:3.5em;'},
                van.tags.a({tabindex:0, 'data-id':`delete-${id}`, style:'display:block;', onclick:()=>this.#deleteCryptoTr(id), onkeydown:(e)=>{if(' ,Enter'.split(',').includes(e.key)){this.#deleteCryptoTr(id);e.preventDefault();}}}, van.tags.ruby({style:'ruby-position:under;'},
                    (Icon.Cryptos.includes(id) ? van.tags.i({class:`icon-${id}`}) : '◯'), 
                    van.tags.rt(id.toUpperCase())))),
            van.tags.td(
                van.tags.input({id:`crypto-${id}-address`,value:(this._head.author.coin.hasOwnProperty(id)) ? this._head.author.coin[id].val : '', placeholder:'x'.repeat(34), style:'box-sizing:border-box;resize:none;width:100%;height:100%;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', onchange:(e)=>{this._head.author.coin[id].val=e.target.value;console.log(this._head.author.coin);}}),
            ),
        )),
    )}
    #deleteCryptoTr(id) {
        const input = document.querySelector(`#crypto-${id}-address`)
        const tr = input.parentElement.parentElement
        const value = input.value.trim()
        if (value) { if (!confirm(`暗号資産 ${id} のアドレスを削除します。\n${value}\nよろしいですか？`)) { return } }
        this._addCryptos.val = this._addCryptos.val.filter(v=>v!==id);
        const nextTr = tr.nextElementSibling || tr.previousElementSibling
        delete this._head.author.coin[id]
        if (nextTr) {
            const id = nextTr.querySelector(`input`).id
            setTimeout(()=>document.querySelector(`#${id}`).focus(), 50)
        }
        else {setTimeout(()=>document.querySelector(`#add-crypto-id`).focus(), 50)}
    }
    #setUrls() {
        for (let key of ['mastodon','misskey']) {
            this.#setInstanceUrls(document.querySelector(`#${key}-user-urls`).value, key)
        }
    }
    #setInstanceUrls(value, serviceName) {
        try {
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
    #setList(key, e) {
        const list = []
        for (let href of e.target.value.split('\n').filter(v=>v)) {
            try {
                const url = new URL(href)
                list.push(href)
            } catch (e) { console.warn(`URL不正値：${href}`) }
        }
        this._head.author.contact[key].val = Array.from(new Set(list))
        console.log(key, this._head.author.contact[key].val)
    }
}
class Intro extends Viewer {
    constructor(head, addCryptos) {
        super()
        this.setHorizontal()
        this._head = head
        this._addCryptos = addCryptos
        this._map = {
            crypto: {
//                l:'暗号資産',
                l:van.tags.span(van.tags.ruby({style:`ruby-position:under;`},Icon.getCryptoEl('btc'),van.tags.rt('暗号資産'))),
                icons:'mona,btc,ltc,doge,eth,sol'.split(','),
                all:'$pac,0xbtc,1inch,2give,aave,abt,act,actn,ada,add,adx,ae,aeon,aeur,agi,agrs,aion,algo,amb,amp,ampl,ankr,ant,ape,apex,appc,ardr,arg,ark,arn,arnx,ary,ast,atlas,atm,atom,audr,aury,auto,avax,aywa,bab,bal,band,bat,bay,bcbc,bcc,bcd,bch,bcio,bcn,bco,bcpt,bdl,beam,bela,bix,blcn,blk,block,blz,bnb,bnt,bnty,booty,bos,bpt,bq,brd,bsd,bsv,btc,btcd,btch,btcp,btcz,btdx,btg,btm,bts,btt,btx,burst,bze,call,cc,cdn,cdt,cenz,chain,chat,chips,chsb,chz,cix,clam,cloak,cmm,cmt,cnd,cnx,cny,cob,colx,comp,coqui,cred,crpt,crv,crw,cs,ctr,ctxc,cvc,d,dai,dash,dat,data,dbc,dcn,dcr,deez,dent,dew,dgb,dgd,dlt,dnt,dock,doge,dot,drgn,drop,dta,dth,dtr,ebst,eca,edg,edo,edoge,ela,elec,elf,elix,ella,emb,emc,emc2,eng,enj,entrp,eon,eop,eos,eqli,equa,etc,eth,ethos,etn,etp,eur,evx,exmo,exp,fair,fct,fida,fil,fjc,fldc,flo,flux,fsn,ftc,fuel,fun,game,gas,gbp,gbx,gbyte,generic,gin,glxt,gmr,gmt,gno,gnt,gold,grc,grin,grs,grt,gsc,gto,gup,gusd,gvt,gxs,gzr,hight,hns,hodl,hot,hpb,hsr,ht,html,huc,husd,hush,icn,icp,icx,ignis,ilk,ink,ins,ion,iop,iost,iotx,iq,itc,jnt,jpy,kcs,kin,klown,kmd,knc,krb,ksm,lbc,lend,leo,link,lkk,loom,lpt,lrc,lsk,ltc,lun,maid,mana,matic,max,mcap,mco,mda,mds,med,meetone,mft,miota,mith,mkr,mln,mnx,mnz,moac,mod,mona,msr,mth,mtl,music,mzc,nano,nas,nav,ncash,ndz,nebl,neo,neos,neu,nexo,ngc,nio,nkn,nlc2,nlg,nmc,nmr,npxs,ntbc,nuls,nxs,nxt,oax,ok,omg,omni,one,ong,ont,oot,ost,ox,oxt,oxy,part,pasc,pasl,pax,paxg,pay,payx,pink,pirl,pivx,plr,poa,poe,polis,poly,pot,powr,ppc,ppp,ppt,pre,prl,pungo,pura,qash,qiwi,qlc,qnt,qrl,qsp,qtum,r,rads,rap,ray,rcn,rdd,rdn,ren,rep,repv2,req,rhoc,ric,rise,rlc,rpx,rub,rvn,ryo,safe,safemoon,sai,salt,san,sand,sbd,sberbank,sc,ser,shift,sib,sin,skl,sky,slr,sls,smart,sngls,snm,snt,snx,soc,sol,spacehbit,spank,sphtx,srn,stak,start,steem,storj,storm,stox,stq,strat,stx,sub,sumo,sushi,sys,taas,tau,tbx,tel,ten,tern,tgch,theta,tix,tkn,tks,tnb,tnc,tnt,tomo,tpay,trig,trtl,trx,tusd,tzc,ubq,uma,uni,unity,usd,usdc,usdt,utk,veri,vet,via,vib,vibe,vivo,vrc,vrsc,vtc,vtho,wabi,wan,waves,wax,wbtc,wgr,wicc,wings,wpr,wtc,x,xas,xbc,xbp,xby,xcp,xdn,xem,xin,xlm,xmcc,xmg,xmo,xmr,xmy,xp,xpa,xpm,xpr,xrp,xsg,xtz,xuc,xvc,xvg,xzc,yfi,yoyow,zcl,zec,zel,zen,zest,zil,zilla,zrx'.split(','),
                items: {
                    'mona': {w:'Monacoin', l:'MONA'},
                    'btc': {w:'Bitcoin', l:'BTC'},
                    'ltc': {w:'%E3%83%A9%E3%82%A4%E3%83%88%E3%82%B3%E3%82%A4%E3%83%B3', l:'LTC'},
                    'doge': {w:'%E3%83%89%E3%83%BC%E3%82%B8%E3%82%B3%E3%82%A4%E3%83%B3', l:'DOGE'},
                    'eth': {w:'%E3%82%A4%E3%83%BC%E3%82%B5%E3%83%AA%E3%82%A2%E3%83%A0', l:'ETH'},
                    'sol': {w:'Solana_(blockchain_platform)', lang:'en', l:'SOL'},
                }
            },
            mona: {
                l:van.tags.span(Icon.getCryptoEl('mona',true), '系'),
                items:{
                    'ask-mona-3': {d:'web3.askmona.org', l:'Ask Mona 3.0',rb:'Ⓐ'},
                    'monaledge': {d:'monaledge.com', l:'Monaledge',rb:'Ⓜ'},
                    'plicy': {d:'plicy.net', l:'PLiCy'},
                    'bitcoin-mall': {d:'bitcoinmall.jp', l:'BitcoinMall',rb:'Ⓑ'},
                    'bit-de-money': {d:'bitdemoney.jp', l:'Bit de Money',rb:'Ⓑ'},
                },
            },
            ec: {
                l:'EC',
                items:{
                    'amazon': {d:'www.amazon.co.jp', l:'Amazon'},
                    'booth': {d:'booth.pm', l:'BOOTH'},
                },
            },
            revision: {
                l:'コード', //
                items: {
                    'github': {d:'github.co.jp', l:'Github'},
                    'gitlab': {d:'about.gitlab.com/ja-jp', l:'GitLab',rb:'Ⓖ'},
                    'bit-bucket': {d:'bitbucket.org', l:'BitBucket',rb:'ⓑ'},
                    'assembla': {d:'get.assembla.com', l:'Assembla',rb:'ⓐ'},
                },
            },
            host: {
                l:'ホスト',
                items: {
                    'github': {d:'github.co.jp', l:'Github Pages'},
                    'firebase': {d:'firebase.google.com', l:'Firebase Hosting',rb:'ⓑ'},
                    'cloudflare': {d:'www.cloudflare.com', l:'Cloudflare Pages',rb:'Ⓒ'},
                    'vercel': {d:'vercel.com', l:'vercel',rb:'Ⓥ'},
                    'netlify': {d:'www.netlify.app', l:'Netlify',rb:'Ⓝ'},
                },
            },
            sns: {
                l:'SNS',
                items: {
                    'twitter': {d:'twitter.com', l:'Twitter'},
                    'facebook': {d:'www.facebook.com', l:'Facebook',rb:'Ⓕ'},
                    'youtube': {d:'www.youtube.com', l:'YouTube'},
                    'tumblr': {d:'www.tumblr.com', l:'Tumblr',rb:'ⓣ'},
                    'mastodon': {
                        instance: {
                            'pawoo.net': {h:'', l:''},
                            'ichiji.social': {h:'', l:''},
                            'fedibird.com': {h:'', l:''},
                            'otadon.com': {h:'', l:''},
                            'mstdn.jp': {h:'', l:''},
                            'mastodon-japan.net': {h:'', l:''},
                        },
                    },
                    'misskey': {
                        instance: {
                            'novelskey.tarbin.net': {h:'', l:''},
                            'misskey.design': {h:'', l:''},
                            'misskey.art': {h:'', l:''},
                            'maniakey.com': {h:'', l:''},
                            'mi.nakn.jp': {h:'', l:''},
                            'sushi.ski': {h:'', l:''},
                            'misskey.io': {h:'', l:''},
                        },
                    }
                },
            },
            novel: {
                l:'小説',
                items: {
                    'alpha-police': {d:'www.alphapolis.co.jp',l:'アルファポリス'},
                    'berrys-cafe':{d:'www.berrys-cafe.jp',l:'ベリーズカフェ',start:'2011',o:'starts',features:'女性向け'},
                    'estar':{d:'estar.jp',l:'エブリスタ',start:'2010'},
                    'kakuyomu':{d:'kakuyomu.jp',l:'カクヨム',start:'2016',o:'kadokawa'},
                    'novel-days':{d:'novel.daysneo.com',l:'Novel Days',start:'2016',o:'kodansha'},
                    'narou':{d:'syosetu.com',l:'小説家になろう',start:'2014'},
                    'novel-up-plus':{d:'novelup.plus',l:'ノベルアップ＋',start:'2019'},
                    'no-ichigo':{d:'www.no-ichigo.jp',l:'野いちご',o:'starts',features:'10代女子向け'},
                    'nola-novel':{d:'story.nola-novel.com',l:'Nolaノベル',o:'株式会社indent'},
                    'novelba':{d:'novelba.com',l:'ノベルバ',start:'2017'},
                    'novema':{d:'novema.jp',l:'ノベマ',o:'starts',start:'2020'},
                    'pri-novel':{d:'novel.prcm.jp',l:'プリ小説',o:'gmo',features:'10代女子向け'},
                    'prologue':{d:'prologue-nola.com',l:'Prologue',features:'2000字上限'},
                    'tugi-kuru':{d:'www.tugikuru.jp',l:'ツギクル',o:'ツギクル株式会社',start:'2016'},
                    'lanove-street':{d:'ln-street.com',l:'ラノベストリート',o:'nakamura-kou'},
                    'monogatary':{d:'monogatary.com',l:'Monogatary',o:'sony-music',features:'楽曲化、映画化コンテストが多い'},
                    'suteki':{d:'sutekibungei.com',l:'ステキブンゲイ',rb:'㋜',start:'2020',o:'nakamura-kou',features:'一般文芸に特化'},
                    'maho':{d:'maho.jp',l:'魔法のⅰランド',rb:'ⓘ',start:'1999',o:'kadokawa',features:'女性向け'},
                    'ssg':{d:'short-short.garden',l:'SSG',rb:'Ⓢ',rt:'ｼｮｰﾄｼｮｰﾄｶﾞｰﾃﾞﾝ',features:'400字上限'},
                    'hameln':{d:'syosetu.org',l:'ハーメルン',rb:'㋩',rt:'ハーメルン',o:'individual',features:'二次創作',start:'2012'},
                    'tie-up':{d:'tieupnovels.com',l:'たいあっぷ',rb:'Ⓣ',rt:'たいあっぷ'},
                    'teller':{d:'teller.jp',l:'テラーノベル',rb:'ⓣ',rt:'テラーノベル',start:'2017'},
                    'novelism':{d:'novelism.jp',l:'ノベリズム',rb:'Ⓛ',rt:'ノベリズム',start:'2020',o:'株式会社viviON'},
                    'novelist':{d:'2.novelist.jp',l:'ノベリスト',rb:'ⓛ',rt:'ノベリスト',start:'2009',o:'株式会社シンカネット'},
                    'novelabo':{d:'www.novelabo.com',l:'ノベラボ',rb:'Ⓛ',rt:'ノベラボ',start:'2015',o:'デザインエッグ株式会社'}
                },
            },
            review: {
                l:'書評',
                items: {
                    'ono-log':{d:'onolog.net',l:'オノログ',rb:'㋔'},
                    'bookmeter':{d:'bookmeter.com',l:'読書メーター',rb:'Ⓑ'},
                    'booklog':{d:'booklog.jp',l:'ブクログ',rb:'Ⓑ'},
                    'dokusho-log':{d:'www.dokusho-log.com',l:'読書ログ',rb:'Ⓓ'},
                    'honzuki':{d:'www.honzuki.jp',l:'本が好き！',rb:'Ⓗ'},
                },
            },
            blog: {
                l:'Blog',
                items: {
                    'note':{d:'note.com',l:'Note'}, 
                    'notion':{d:'www.notion.so',l:'Notion'}, 
                    'wordpress': {d:'wordpress.com', l:'WordPress',rb:'Ⓦ'},
                    'hatena': {d:'hatena.blog', l:'Hatena',rb:'？'},
                    'qiita': {d:'qiita.com', l:'Qiita',rb:'Ⓠ'},
                    'zenn': {d:'zenn.dev', l:'Zenn',rb:'Ⓩ'},
                    'scrapbox': {d:'scrapbox.io', l:'ScrapBox',rb:'Ⓢ'},
                },
            },
            complex: {
                l:'複合',
                items: {
                    'pixiv':{d:'www.pixiv.net',l:'Pixiv'},
                    'kakuzoo':{d:'storie.jp', l:'Kakuzoo'},
                    'tap-novel':{d:'tapnovel.com',l:'タップノベル',rb:'Ⓣ'},
                    'plicy':{d:'plicy.net',l:'PLiCy'},
                },
            },
        }
        this.children = [van.tags.h2({style:'text-align:center;'},'外部サービス'), this.#make(), van.tags.p({style:'text-align:center;'},'創作活動に利用できそうなサービス一覧')]
    }
    #make() {
        return van.tags.table({style:'width:100%;height:100%;border-collapse:collapse;'},
            van.tags.tr({style:'border-block-end-color:var(--fg-color);border-block-end-style:solid;border-block-end-width:1px;'}, van.tags.th('分類'),van.tags.th('URL')),
            [...Object.entries(this._map)].map(([k,v])=>van.tags.tr(
                van.tags.th({style:'border-inline-end-color:var(--fg-color);border-inline-end-style:solid;border-inline-end-width:1px;'}, v.l),
                //van.tags.td({style:'overflow-wrap:break-word;word-wrap:break-word;white-space:normal;'}, [...Object.entries(v.items)].map(([K,V])=>this.#makeLink(k,K,V)), ('crypto'===k) ? this.#makeAddCryptoUi() : null),
                van.tags.td({style:'overflow-wrap:break-word;word-wrap:break-word;white-space:normal;'}, [...Object.entries(v.items)].map(([K,V])=>this.#makeLink(k,K,V)), ('crypto'===k) ? ()=>van.tags.div({style:()=>`display:inline-block;`},this.#makeAddCryptoUi()) : null),
            ))
        )
    }
    #makeLink(k,K,V) {
        const href = this.#getHref(V)
        if (Type.isAry(href)) { return href.map(h=>this.#makeLinkTag(k,K,V,h)) }
        else { return this.#makeLinkTag(k,K,V) }
    }
    #makeLinkTag(k,K,V,h) { return van.tags.a({href:(h) ? h : this.#getHref(V), target:'_blank', rel:'noopener noreferrer', style:'color:var(--fg-color);background-color:var(--bg-color);text-decoration:none;', ...this.#onCryptoLinkEvent(k,K)}, V.hasOwnProperty('rb') ? van.tags.span(V.rb) : this.#getIcon(k,K,V)) }
    #onCryptoLinkEvent(k,K) {
        if ('crypto'===k) {
            return {onclick:()=>document.querySelector(`#add-crypto-id`).value=K, onkeydown:(e)=>{if(' ,Enter'.split(',').includes(e.key)){document.querySelector(`#add-crypto-id`).value=K}}}
        }
        else { return ({}) }
    }
    #getIcon(k,K,V) {
        if (V.hasOwnProperty('instance')) { return van.tags.i({class:`icon-${K}`}) }
        else {
            if (Icon.Ids.includes(K)) { return van.tags.i({class:`icon-${K}`}) }
            else if (V.hasOwnProperty('rb')) { return van.tags.span(V.rb) }
            else { return van.tags.i({class:`icon-link`}) }
        }
    }
    #getHref(v) {
        if (v.hasOwnProperty('d')) { return `https://${v.d}/` }
        else if (v.hasOwnProperty('w')) { return `https://${v.hasOwnProperty('lang') ? v.lang : 'ja'}.wikipedia.org/wiki/${v.w}` }
        else if (v.hasOwnProperty('h')) { return v.h }
        else if (v.hasOwnProperty('instance')) { return [...Object.keys(v.instance)].map(k=>`https://${k}/`) }
        else { console.error(v); throw new Error(`href情報がありません！`) }
    }
    #makeAddCryptoUi() {
        const ID = 'crypto-list'
        const cryptos = Icon.Cryptos.filter(id=>!this._addCryptos.val.includes(id)) // 全CryptosIDから追加分を削除した差集合
        const datalist = van.tags.datalist({id:ID},
            cryptos.map(id=>van.tags.option({value:id}, id))
        )
        const input = van.tags.input({id:'add-crypto-id', list:ID, maxlength:10, style:'box-sizing:border-box;resize:none;width:8em;height:1em;line-height:1em;letter-spacing:0;padding:0;margin:0;font-family:var(--font-family-mono);', onkeydown:(e)=>{if(' ,Enter'.split(',').includes(e.key)){document.querySelector(`#add-crypto`).dispatchEvent(new Event('click'))}}})
        const add = van.tags.button({id:'add-crypto',
                onclick:()=>{
                    const input = document.querySelector(`#add-crypto-id`)
                    const id = input.value.toLowerCase()
                    if (!id.trim()) { return }
                    if ([...Object.keys(this._head.author.coin)].includes(id)) { return document.querySelector(`#crypto-${id}-address`).focus() }
                    this._head.author.coin[id] = van.state(null)
                    this._addCryptos.val = Array.from(new Set([...this._addCryptos.val, id]))
                    input.value = ''
//                    input.focus()
                    setTimeout(()=>document.querySelector(`#crypto-${id}-address`).focus(), 200)
                    // 再描画
                    console.log(this._head.author.coin)
                },
            },
            '＋'
        )
        const count = van.tags.span({style:()=>`font-size:1rem;letter-spacing:0;line-height:1rem;`},`${cryptos.length}`)
        return [input, add, datalist, count]
    }
}
window.JavelAuthWriter = JavelAuthWriter 
})()
