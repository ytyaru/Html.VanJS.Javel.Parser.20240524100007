class ElementSelector { // 複数子要素[data-sid="..."]のうち一つだけ表示する
    constructor(parent, sid) {
        this._parent = ((Type.isEl(parent)) ? parent : document.body)
        this._sid = sid
        this._dispMap = new Map()
        this.#init()
        this.sid = this._sid
    }
    #init() {
        this.#setDispMap()
        this.#setSelectMethod()
        this.#hideAll()
        if (!this._sid) { this._sid = this._parent.querySelector(`[data-sid="${v}"]`).dataset.sid }
    }
    #setDispMap() {
        for (let el of this._parent.querySelectorAll(`[data-sid]`)) {
            this._dispMap.set(el.dataset.sid, Css.get('display', el))
        }
        console.log(this._dispMap)
    }
    get els() { return [...this._parent.querySelectorAll(`[data-sid]`)] }
    get sid( ) { return this._sid }
    set sid(v) {
        if (Type.isStr(v)) {
            this._sid = v
            this.#hideAll()
            console.log(v, this._parent.querySelector(`[data-sid="${v}"]`))
            this.#show(this._parent.querySelector(`[data-sid="${v}"]`))
        }
    }
    #hideAll() { for (let el of this._parent.querySelectorAll(`[data-sid]`)) { this.#hide(el) } }
    #hide(el) { this.#setDisp(el, false) }
    #show(el) { this.#setDisp(el, true); focusLooper.reset(); }
    #setDisp(el, isShow) { el.style.setProperty('display', ((isShow) ? this._dispMap.get(el.dataset.sid) : 'none')) }
    #setSelectMethod() { // DivButton依存。data-select属性があるDivButton要素に対して画面遷移処理をセットする
        for (let btn of document.querySelectorAll('[data-select]')) {
            const sid = btn.dataset.select
            //btn.method = ()=>this.sid = btn.dataset.select
            btn.onclick = ()=>this.sid = btn.dataset.select
            btn.onkeydown = (e)=>{if([' ', 'Enter'].some(k=>k===e.key)) { this.sid = btn.dataset.select; e.preventDefault(); }}
        }
    }
}
