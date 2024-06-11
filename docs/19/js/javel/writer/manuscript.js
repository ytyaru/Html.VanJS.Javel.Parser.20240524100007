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
        this.created = van.state('')
        this.updated = van.state('')
        this.published = van.state('')
        this.uuid = van.state('')
        this.writeWordCount = van.state(0)
        this.printWordCount = van.state(0)
        this.readWordCount = van.state(0)
        this.url = van.state('')
        this.license = van.state('')
        this.reply = van.state('')
        this.repost = van.state('')
    }
    get yaml( ) { return jsyaml.dump(Object.assign(...[...Object.keys(this)].map(k=>({[k]:this[k].val})))) }
    set yaml(v) {
        const obj = jsyaml.load(v)
        console.error(obj)
        //for (let key of Object.keys(obj)) { this[key].val = obj[key] }
        for (let key of Object.keys(obj)) { this[key].val = obj[key]; console.log(key, this[key].val); }
    }
}
window.Manuscript = Manuscript
})()

