(function(){
class Manuscript { // van.state()
    constructor() {
        this.head = new Head()
        this.body = van.state('')
    }
    get javel( ) { return `---\n${this.head.yaml}---\n\n${this.body.val}` } // manuscript
    set javel(v) {
        const matches = [...v.matchAll(/^[\-]{3}$/gm)]
        console.error(matches)
        if (2 <= matches.length) {
            const yaml = v.slice(matches[0].index+3, matches[1].index)
            console.error(yaml)
            this.head.yaml = yaml
            this.body.val = v.slice(matches[1].index + 3).trimLine()
            console.log(this.head.yaml)
            console.log(this.body.val)
        } else { this.body.val = v }
    }
}
class Head {
    constructor() {
        this.title = van.state('')
        this.catch = van.state('')
        this.intro = van.state('')
        this.category = van.state('web-novel')
        this.genre = van.state('fantasy')
        this.keywords = van.state('')
        this.warning = {
            sex: van.state(false),
            violence: van.state(false),
            cruelty: van.state(false),
        }
        this.created = van.state(Date.toIso())
        this.updated = van.state('')
        this.published = van.state('')
        this.uuid = van.state(crypto.randomUUID())
        this.writeWordCount = van.state(0)
        this.printWordCount = van.state(0)
        this.readWordCount = van.state(0)
        this.url = van.state('')
        this.license = van.state('')
        this.reply = van.state('')
        this.repost = van.state('')
        this.revisions = van.state([])
        this.author = {
            name: van.state(''),
            coin: { // コインID:アドレス
                mona: van.state(''),
            },
            sns: {
                silo: {// silo:{サービス名:ユーザ名／ユーザID／ユーザページURL}
                    github: van.state(''),
                    twitter: van.state(''),
                    dropbox: van.state(''),
                    youtube: van.state(''),
                },
                // サービス名:{インスタンスドメイン名:ユーザ名／ユーザID／ユーザページURL}
                mastodon: {
                    'mstdn.jp': van.state(''),
                },
                misskey: {
                    'mi.nakn.jp': van.state(''),
                },
            },
            sites: van.state(['']), // サイトURL
            created: van.state(Date.toIso()),
            uuid: van.state(crypto.randomUUID()),
        }
    }
    //get yaml( ) { return jsyaml.dump(Object.assign(...[...Object.keys(this)].map(k=>({[k]:this[k].val})))) }
    get yaml( ) { return jsyaml.dump(Object.assign(...[...Object.keys(this)].map(k=>({[k]:this.#toYaml(k)})))) }
    #toYaml(p) { // p: property name
        //if ('warning'===p) { return Object.keys(this.warning).map(k=>({[k]:this[p][k].val})) }
        if ('warning'===p) { return Object.assign(...[...Object.keys(this.warning).map(k=>({[k]:this[p][k].val}))]) }
        else if ('author'===p) { return ({
            name: this.author.name.val,
            coin: Object.assign(...[...Object.keys(this.author.coin)].map(k=>({[k]:this.author.coin[k].val}))),
            sns: Object.assign(...[...Object.entries(this.author.sns)].map(([k,v])=>({[k]:Object.assign(...[...Object.entries(v)].map(([K,V])=>({[K]:V.val})))}))),
//            coin: jsyaml.dump(Object.assign(...[...Object.keys(this.author.coin)].map(k=>({[k]:this.author.coin[k].val})))),
//            sns: jsyaml.dump(Object.assign(...[...Object.entries(this.author.sns)].map(([k,v])=>({[k]:jsyaml.dump(Object.assign(...[...Object.entries(v)].map(([K,V])=>({[K]:V.val}))))})))),
            sites: this.author.sites.val,
            created: this.author.created.val,
            uuid: this.author.uuid.val, 
        }) } else { return this[p].val }
        //}) } else { return ({[p]:this[p].val}) }
    }
    set yaml(v) {
        //const obj = jsyaml.load(v)
        //console.error(obj)
        //for (let key of Object.keys(obj)) { this[key].val = obj[key] }
        //for (let key of Object.keys(obj)) { this[key].val = obj[key]; console.log(key, this[key].val); }
        this.#fromYaml(v) 
    }
    #fromYaml(yaml) {
        const obj = jsyaml.load(yaml)
        console.log(obj)
        for (let [p,o] of Object.entries(obj)) {
            if ('warning'===p) { for (let k of Object.keys(this.warning)) { this.warning[k].val = obj.warning[k] } }
            else if ('author'===p) {
                this.author.name.val = o.name
                for (let k of Object.keys(o.coin)) { console.log(p, k, o.coin[k], o, o.coin);this.author.coin[k].val = o.coin[k] }
                for (let [k,v] of Object.entries(o.sns)) {
                    for (let [K,V] of Object.entries(v)) {
                        this.author.sns[k][K].val = V
                    }
                }
                this.author.sites.val = o.sites.map(v=>v)
                this.author.created.val = o.created
                this.author.uuid.val = o.uuid
            } else { this[p].val = obj[p] }
        }
    }
}
/*
class Author {
    constructor() {
        this.name = van.state('')
        this.coin = { // コインID:アドレス
            mona: van.state(''),
        }
        this.sns = {
            silo: {// silo:{サービス名:ユーザ名／ユーザID／ユーザページURL}
                github: van.state(''),
                twitter: van.state(''),
                dropbox: van.state(''),
            }
            // サービス名:{インスタンスドメイン名:ユーザ名／ユーザID／ユーザページURL}
            mastodon: {
                'mstdn.jp': van.state(''),
            }
            misskey: {
                'mi.nakn.jp': van.state(''),
            }
        }
        this.sites = [van.state('')]
    }
    get yaml() { return jsyaml.dump({name:this.name.val, ...this.#toYamlCoin(), ...this.#toYamlSns()}) }
    set yaml(yaml) {
        
    }
    #toYamlCoin() { return jsyaml.dump(Object.assign(...[...Object.keys(this.coin)].map(k=>({[k]:this.coin[k].val}))) }
    #fromYamlCoin(yaml) {
        const obj = jsyaml.load(yaml)
        for (let key of Object.keys(obj)) { this.coin[key].val = obj[key] }
    }
    #toYamlSns() { return jsyaml.dump(Object.assign(...[...Object.entries(this.sns)].map([k,v]=>({[k]:jsyaml.dump(Object.assign(...[...Object.entries(v)].map([K,V]=>({[K]:V.val}))))})))) }
    #fromYamlSns(yaml) {
        const obj = jsyaml.load(yaml)
        for (let [k,v] of Object.entires(obj)) {
            for (let [K,V] of Object.entries(v)) {
                this.sns[k][K].val = V
            }
        }
    }
}
*/
window.Manuscript = Manuscript
})()

