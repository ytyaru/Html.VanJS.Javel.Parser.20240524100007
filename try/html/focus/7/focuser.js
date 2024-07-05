(function(){
class Focuser {
//    constructor() { this._els=[];this._i=-1;this._activeElXpath=null;window.addEventListener('DOMContentLoaded', (event)=>this.setup()) }
    constructor() {
        this._els = []
        this._i = -1
        window.addEventListener('DOMContentLoaded', (event)=>this.setup())
    }
    #FOCUSABLE_ELEMENTS = [
        'a[href]:not([display="none"])',
        'area[href]:not([display="none"])',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden]):not([display="none"])',
        'select:not([disabled]):not([aria-hidden]):not([display="none"])',
        'textarea:not([disabled]):not([aria-hidden]):not([display="none"])',
        'button:not([disabled]):not([aria-hidden]):not([display="none"])',
        'iframe:not([display="none"])',
        'object:not([display="none"])',
        'embed:not([display="none"])',
        '[contenteditable]:not([display="none"])',
        '[tabindex]:not([tabindex^="-"]):not([display="none"])',
        '*.focusable'
    ]
    setup() {
        window.addEventListener('keydown', async(e) => {
            if ('Esc'===e.code) return
            if ('Tab'===e.code) this.#focus(e)
        })
        window.addEventListener('click', async(e) => {
            const i = this.els.indexOf(document.activeElement)
            if (-1===i) { return } // フォーカス対象外要素ならば処理しない
            this.index = i
            console.log(this._i, this._els[this._i])
        })
        this.first()
        console.log('setup():', this._i, this._els.length, this._els)
    }
    get elsi() {
        this._els = [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)].filter(el=>el.offsetParent && 'none'!==getComputedStyle(el).getPropertyValue('display'))
        if (0===this._els.length) { this._i = -1 }
        else if (0 < this._els.length && -1===this._i) { this._i = 0 }
        return [this._els, this._i]
    }
    get els() { return this.elsi[0] }
    get el() { return this._els[this._i] } // === document.activeElement
    get index() { return this.elsi[1] }
    set index(v) { // v:整数値(0〜this.els.length-1 または -1以下の負数(負数時は最後尾から数える。-1=最後尾, els.length*-1=先頭))
        //window.dispatchEvent(this.events.focus, {detail:{el:this._els[this._i], i:this._i}});
        window.dispatchEvent(new CustomEvent('changeFocus', {detail:{el:this._els[this._i], i:this._i, focuser:this}}))
        this.elsi
        if (0===this._els.length) { return }
        this._i = (v < 0) ? this._els.length + (Math.abs(v+1) % this._els.length) - 1 : v % this._els.length
        this._els[this._i].focus()
        window.dispatchEvent(new CustomEvent('changedFocus', {detail:{el:this._els[this._i], i:this._i, focuser:this}}))
        //window.dispatchEvent(this.events.focused, {detail:{el:this._els[this._i], i:this._i}});
    }
    get fi() { this.elsi; return (-1===this._i) ? -1 : 0 }
    get li() { this.elsi; return (-1===this._i) ? -1 : this._els.length - 1 }
    get count() { return this.els.length }
    get has() { return 0 < this.count }
    get isFirst() { return 0===this.index }
    get isLast() { this.elsi; return this._i===this._els.length-1; }
    first() { this.index = 0 }
    last() { this.index = - 1 }
    next() { this.index++ }
    prev() { this.index-- }
    #focus(e) {
        this.elsi
        console.log(e)
             if (this.isFirst && e.shiftKey) { this.last(); }  // 先頭より前に遷移しようとした時は末尾へ
        else if (this.isLast && !e.shiftKey) { this.first(); } // 末尾より後に遷移しようとした時は先頭へ
        else if ( e.shiftKey) { this.prev() }
        else if (!e.shiftKey) { this.next() }
        e.preventDefault() // デフォルト処理を抑制する（ブラウザのURL欄などへフォーカスが飛ばないように）
        //console.assert(this.el===document.activeElement)
        //console.log(this.el===document.activeElement, this.els.indexOf(document.activeElement), document.activeElement)
    }
}
window.focuser = new Focuser()
})()
