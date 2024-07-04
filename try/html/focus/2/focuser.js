(function(){
class Focuser {
    constructor() { this._els=[];this._activeElXpath=null;window.addEventListener('DOMContentLoaded', (event)=>this.setup()) }
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
//    setup(textarea) {
//        this.textarea = textarea
        window.addEventListener('keydown', async(e) => {
            if ('Esc'===e.code) return
            //if ('Tab'===e.code) this.#retainFocus(e)
            if ('Tab'===e.code) this.focus(e)
        })
        /*
        // ボタンは矢印キーを押すとフォーカスがbodyに飛んでしまうので、矢印キーの操作を殺した
        for (let button of document.querySelectorAll('button')) {
            button.addEventListener('keydown', async(e) => {
                if (['Right','Left','Up','Down'].some((key)=>`Arrow${key}`===e.code)) e.preventDefault()
                else if ('Esc'===e.code) this.textarea.focus()
            })
        }
        this.#setFocusToFirstNode()
        */
        this._observer = new MutationObserver(records => {
            this.#setFocusableNodes()
            //this._els = this.#getFocusableNodes() // フォーカス対象要素一覧を更新する
            console.log('フォーカス対象要素更新：', this._els)
            //this._activeElXpath
            this.#focusForXpath()
//            this.#addEvents() // これを実行すると無限ループする（VanJSの自動更新とこれが互いに循環参照になる？）
        })
        this._observer.observe(document.body, {
            // オプションを指定
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['display']
        })
        this.#setFocusableNodes()
        this.first()
    }
    #focusForXpath() {
        if (this._activeElXpath) {
            const nodes = document.evaluate(
                //'//a[@class="c-paging__pagenavi-item" and text() = ">"]', 
                this._activeElXpath,
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
            if (0 < nodes.snapshotLength) { nodes.snapshotItem(0).click() }
        }
    }
    #addEvents() {
        for (let el of this._els) {
            el.addEventListener('focus', async(e) => {
                this._activeElXpath = getXpathByElementNode(document.activeElement)
            })
        }
    }
    //get els() { return this.#getFocusableNodes() } // els
    get els() { return this._els } // フォーカス対象要素一覧を返す
    get has() { return 0 < this.els.length }
    reset() { this.#setFocusToFirstNode() }
    first() { this.#setFocusToFirstNode() }
    last() { const els = this.els; if (0 < els.length) { els.slice(-1)[0].focus() } }
    next() { this.#loop() }
    prev() { this.#loop(true) }
    get index() { return this.els.indexOf(document.activeElement) }
    get isFirst() { 0===this.index }
    get isLast() { const els = this.els; const idx=els.indexOf(document.activeElement); return (els.length-1)===idx; }
    #loop(isPrev=false) { // 先頭より前で末尾、末尾より後で先頭、へ移動する
        const els = this.els
        if (0===els.length) { return }
        const activeIdx = els.indexOf(document.activeElement)
        const nextEl = els[activeIdx + this.#calcStep(isPrev, els)]
    }
    #calcStep(isPrev) {
             if (this.isFirst && isPrev) { return  els.length-1 }
        else if (this.isLast && !isPrev) { return (els.length-1) * -1 }
        return isPrev ? -1 : 1
    }
    #setFocusableNodes() { this._els = [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)].filter(el=>'none'!==getComputedStyle(el).getPropertyValue('display')) }
    #getFocusableNodes() { return [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)].filter(el=>'none'!==getComputedStyle(el).getPropertyValue('display')) }
    #setFocusToFirstNode() {
//        const nodes = this.#getFocusableNodes()
//        if (nodes.length > 0) nodes[0].focus()
//        console.log(nodes)
        if (0 < this.els.length) this.els[0].focus()
        console.log(this.els.length)
    }
    focus(e) {
        console.log(`e.code:${e.code}`, e)
        //let nodes = this.#getFocusableNodes()
        let nodes = this.els
        console.log(nodes)
        if (nodes.length === 0) return
        nodes = nodes.filter(node=>(node.offsetParent !== null))
        if (!document.contains(document.activeElement)) { nodes[0].focus() }
        else {
            const focusedItemIndex = nodes.indexOf(document.activeElement)
            if (e.shiftKey && focusedItemIndex === 0) {
                nodes[nodes.length - 1].focus()
                e.preventDefault()
            }
            if (!e.shiftKey && nodes.length > 0 && focusedItemIndex === nodes.length - 1) {
                nodes[0].focus()
                e.preventDefault()
            }
        }
    }
}
window.focuser = new Focuser()
})()
