(function(){
class Icon { // URLからIcoMoonアイコン用IDを返す
    constructor() {
        this._map = {
            mastodon: [
                'pawoo.net',
                'ichiji.social',
                'fedibird.com',
                'otadon.com',
                'mstdn.jp',
                'mastodon-japan.net',
            ],
            misskey: [
                'novelskey.tarbin.net',
                'misskey.design',
                'misskey.art',
                'maniakey.com',
                'mi.nakn.jp',
                'sushi.ski',
                'misskey.io',
            ],
            twitter: ['twitter.com'],
            github: ['github.co.jp'],
            amazon: ['www.amazon.co.jp'],
            dropbox: ['www.dropbox.com'],
            youtube: ['www.youtube.com'],
            novel: {
                'alpha-police':{d:'www.alphapolis.co.jp',l:'アルファポリス'},
                'berrys-cafe':{d:'www.berrys-cafe.jp',l:'ベリーズカフェ',start:'2011',o:'starts',features:'女性向け'},
                'estar':{d:'estar.jp',l:'エブリスタ',start:'2010'},
                'kakuyomu':{d:'kakuyomu.jp',l:'カクヨム',start:'2016',o:'kadokawa'},
                'novel-days':{d:'novel.daysneo.com',l:'Novel Days',start:'2016',o:'kodansha'},
                'narou':{d:'syosetu.com',l:'小説家になろう',start:'2014'},
                //'novelup':{d:'novelup.plus',l:'ノベルアップ＋',start:'2019'},
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
            review: {
                'ono-log':{d:'onolog.net',l:'オノログ',rb:'㋔'},
            },
            blog: {
                'note':{d:'note.com',l:'Note'}, 
                'notion':{d:'www.notion.so',l:'Notion'}, 
                'monaledge':{d:'monaledge.com',l:'Monaledge',rb:'Ⓜ'}, 
                'wordpress': {d:'wordpress.com', l:'WordPress',rb:'Ⓦ'},
                'hatena': {d:'hatena.blog', l:'Hatena',rb:'？'},
                'qiita': {d:'qiita.com', l:'Qiita',rb:'Ⓠ'},
                'zenn': {d:'zenn.dev', l:'Zenn',rb:'Ⓩ'},
                'scrapbox': {d:'scrapbox.io', l:'ScrapBox',rb:'Ⓢ'},
            },
            complex: {
                'pixiv':{d:'www.pixiv.net',l:'Pixiv'},
                'kakuzoo':{d:'storie.jp', l:'Kakuzoo'},
                'tap-novel':{d:'tapnovel.com',l:'タップノベル'},
                'plicy':{d:'plicy.net',l:'PLiCy'},
            },
            bbs: {
                'ask-mona-3':{d:'web3.askmona.org', l:'Ask Mona 3.0', rb:'Ⓐ'},
            },
        }
    }
    get Map() { return this._map }
    get Ids() { return 'mona,btc,ltc,doge,eth,sol,mona-min,btc-min,ltc-min,doge-min,eth-min,sol-min,github,mastodon,misskey,youtube,spotify,x,twitter,wikipedia,amazon,booth,alpha-police,berrys-cafe,estar,kakuyomu,lanove-street,monogatary,narou,no-ichigo,nola-novel,novel-days,novel-up-plus,novelba,novema,pri-novel,prologue,tugi-kuru,kakuzoo,pixiv,plicy,tap-novel,note,notion,javel,person,link'.split(',') }
    get Cryptos() { return '$pac,0xbtc,1inch,2give,aave,abt,act,actn,ada,add,adx,ae,aeon,aeur,agi,agrs,aion,algo,amb,amp,ampl,ankr,ant,ape,apex,appc,ardr,arg,ark,arn,arnx,ary,ast,atlas,atm,atom,audr,aury,auto,avax,aywa,bab,bal,band,bat,bay,bcbc,bcc,bcd,bch,bcio,bcn,bco,bcpt,bdl,beam,bela,bix,blcn,blk,block,blz,bnb,bnt,bnty,booty,bos,bpt,bq,brd,bsd,bsv,btc,btcd,btch,btcp,btcz,btdx,btg,btm,bts,btt,btx,burst,bze,call,cc,cdn,cdt,cenz,chain,chat,chips,chsb,chz,cix,clam,cloak,cmm,cmt,cnd,cnx,cny,cob,colx,comp,coqui,cred,crpt,crv,crw,cs,ctr,ctxc,cvc,d,dai,dash,dat,data,dbc,dcn,dcr,deez,dent,dew,dgb,dgd,dlt,dnt,dock,doge,dot,drgn,drop,dta,dth,dtr,ebst,eca,edg,edo,edoge,ela,elec,elf,elix,ella,emb,emc,emc2,eng,enj,entrp,eon,eop,eos,eqli,equa,etc,eth,ethos,etn,etp,eur,evx,exmo,exp,fair,fct,fida,fil,fjc,fldc,flo,flux,fsn,ftc,fuel,fun,game,gas,gbp,gbx,gbyte,generic,gin,glxt,gmr,gmt,gno,gnt,gold,grc,grin,grs,grt,gsc,gto,gup,gusd,gvt,gxs,gzr,hight,hns,hodl,hot,hpb,hsr,ht,html,huc,husd,hush,icn,icp,icx,ignis,ilk,ink,ins,ion,iop,iost,iotx,iq,itc,jnt,jpy,kcs,kin,klown,kmd,knc,krb,ksm,lbc,lend,leo,link,lkk,loom,lpt,lrc,lsk,ltc,lun,maid,mana,matic,max,mcap,mco,mda,mds,med,meetone,mft,miota,mith,mkr,mln,mnx,mnz,moac,mod,mona,msr,mth,mtl,music,mzc,nano,nas,nav,ncash,ndz,nebl,neo,neos,neu,nexo,ngc,nio,nkn,nlc2,nlg,nmc,nmr,npxs,ntbc,nuls,nxs,nxt,oax,ok,omg,omni,one,ong,ont,oot,ost,ox,oxt,oxy,part,pasc,pasl,pax,paxg,pay,payx,pink,pirl,pivx,plr,poa,poe,polis,poly,pot,powr,ppc,ppp,ppt,pre,prl,pungo,pura,qash,qiwi,qlc,qnt,qrl,qsp,qtum,r,rads,rap,ray,rcn,rdd,rdn,ren,rep,repv2,req,rhoc,ric,rise,rlc,rpx,rub,rvn,ryo,safe,safemoon,sai,salt,san,sand,sbd,sberbank,sc,ser,shift,sib,sin,skl,sky,slr,sls,smart,sngls,snm,snt,snx,soc,sol,spacehbit,spank,sphtx,srn,stak,start,steem,storj,storm,stox,stq,strat,stx,sub,sumo,sushi,sys,taas,tau,tbx,tel,ten,tern,tgch,theta,tix,tkn,tks,tnb,tnc,tnt,tomo,tpay,trig,trtl,trx,tusd,tzc,ubq,uma,uni,unity,usd,usdc,usdt,utk,veri,vet,via,vib,vibe,vivo,vrc,vrsc,vtc,vtho,wabi,wan,waves,wax,wbtc,wgr,wicc,wings,wpr,wtc,x,xas,xbc,xbp,xby,xcp,xdn,xem,xin,xlm,xmcc,xmg,xmo,xmr,xmy,xp,xpa,xpm,xpr,xrp,xsg,xtz,xuc,xvc,xvg,xzc,yfi,yoyow,zcl,zec,zel,zen,zest,zil,zilla,zrx'.split(',') }
    #getId(href) { // id, cid, l, rb（識別子,カテゴリID,ラベル,rb）
        try {
            const url = new URL(href)
            console.log(url)
            for (let [k,v] of Object.entries(this._map)) {
                console.log(k,v, Type.isAry(v), Type.isObj(v))
                if (Type.isAry(v)) {
                    if (v.includes(url.host)) { return [k, k, k.Title, null] }
                }
                else if (Type.isObj(v)) {
                    for (let [K,V] of Object.entries(v)) {
                        if (V.d===url.host) { return [K, k, ((V.hasOwnProperty('l')) ? V.l : V.d), ((V.hasOwnProperty('rb')) ? V.rb : null)] }
                    }
                }
            }
        } catch(e) { return [null, null, null, null] }
        return [null, null, null, null]
    }
    getEl(href, hasRuby=false, isOver=false) {
        const [id, cid, l, rb] = this.#getId(href)
        console.log(id, cid, l, rb, href)
        const icon = id || 'link'
        const i = van.tags.i({class:`icon-${icon}`})
        //return (hasRuby) ? van.tags.ruby({style:`ruby-position:under;`}, i, van.tags.rt(l)) : i
        //return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), i, van.tags.rt(l)) : i
        return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), ((rb) ? rb : i), van.tags.rt(l)) : i
    }
    getCategoryEl(id, hasRuby=false, isOver=false) {
        console.log([...Object.keys(this._map)], [...Object.keys(this._map)].includes(id))
        const icon = ([...Object.keys(this._map)].includes(id)) ? id : 'link'
        const i = van.tags.i({class:`icon-${icon}`})
        //return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), i, van.tags.rt(id.Title)) : i
        return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), ((rb) ? rb : i), van.tags.rt(id.Title)) : i
    }
    getDomainEl(id, href, hasRuby=false, isOver=false) { // Mastodon/Misskey（ルビがドメイン名）
        console.error([...Object.keys(this._map)], [...Object.keys(this._map)].includes(id))
        const icon = ([...Object.keys(this._map)].includes(id)) ? id : 'link'
        const i = van.tags.i({class:`icon-${icon}`})
        const url = new URL(href)
        console.log(url, url.host)
        //return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), i, van.tags.rt(url.host)) : i
        return (hasRuby) ? van.tags.ruby(((isOver) ? ({}) : ({style:`ruby-position:under;`})), ((rb) ? rb : i), van.tags.rt(url.host)) : i
    }
}
window.Icon = new Icon()
})()
