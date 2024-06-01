class ElementSelector { // 複数子要素[data-sid="..."]のうち一つだけ表示する
    constructor(parent, sid) {
        this._parent = ((Type.isEl(parent)) ? parent : document.body)
        this._sid = sid
        this._dispMap = new Map()
        this.#init()
    }
    #init() {
        this.#setDispMap()
        this.#hideAll()
        if (!this._sid) { this.sid = this._parent.querySelector(`[data-sid="${v}"]`).dataset.sid }
    }
    #setDispMap() {
        for (let el of this._parent.querySelectorAll(`[data-sid]`)) {
            this._dispMap.set(el.dataset.sid, Css.get('display', el))
        }
    }
    get els() { return [...this._parent.querySelectorAll(`[data-sid]`)] }
    get sid( ) { return this._sid }
    set sid(v) {
        if (Type.isStr(v)) {
            this._sid = v
            this.#hideAll()
            this.#show(this._parent.querySelector(`[data-sid="${v}"]`))
        }
    }
    #hideAll() { for (let el of this._parent.querySelectorAll(`[data-sid]`)) { this.#hide(el) } }
    #hide(el) { this.#setDisp(el, false) }
    #show(el) { this.#setDisp(el, true) }
    #setDisp(el, isShow) { el.style.setProperty('display', ((isShow) ? this._dispMap.get(el.dataset.sid) : 'none')) }
//    #hide(sid) { this.#setDisp(sid, false) }
//    #show(sid) { this.#setDisp(sid, true) }
    //#setDisp(sid, isShow) { el.style.setProperty('display', ((isShow) ? this._dispMap.get(sid) : 'none'))} }
    //#setDisp(sid, isShow) { const el=this._builder.getEl(sid); if (el) {el.style.setProperty('display', ((isShow) ? this._dispMap.get(sid) : 'none'))} }

    #addEvent() {
        for (let btn of document.querySelectorAll('[data-select]')) {
            btn.dataset.select
            btn.
            btn.addEventListener('click', (event) => {
        }
    }
}
