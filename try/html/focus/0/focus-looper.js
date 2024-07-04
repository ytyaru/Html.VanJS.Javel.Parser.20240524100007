(function(){
class Focuser {
//class FocusLooper {
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
    setup(textarea) {
        this.textarea = textarea
        window.addEventListener('keydown', async(e) => {
            if ('Esc'===e.code) return
            //if ('Tab'===e.code) this.#retainFocus(e)
            if ('Tab'===e.code) this.focus(e)
        })
        // ボタンは矢印キーを押すとフォーカスがbodyに飛んでしまうので、矢印キーの操作を殺した
        for (let button of document.querySelectorAll('button')) {
            button.addEventListener('keydown', async(e) => {
                if (['Right','Left','Up','Down'].some((key)=>`Arrow${key}`===e.code)) e.preventDefault()
                else if ('Esc'===e.code) this.textarea.focus()
            })
        }
        this.#setFocusToFirstNode()
    }
    get els() { return this.#getFocusableNodes() } // els
    get has() { return 0 < this.els.length }
    reset() { this.#setFocusToFirstNode() }
    first() { this.#setFocusToFirstNode() }
    last() { const els = this.els; if (0 < els.length) { els.slice(-1)[0].focus() } }
    next() { this.#loop() }
    prev() { this.#loop(true) }
    get index() { return this.els.indexOf(document.activeElement) }
    get isFirst() { 0===this.index }
    get isLast() { const els = this.els; const idx=els.indexOf(document.activeElement); return (els.length-1)===idx; }
    /*
    #step(isPrev) {
        const els = this.#getFocusableNodes()
        const step = isPrev ? -1 : 1
        const activeIdx = els.indexOf(document.activeElement)
        const nextEl = els[activeIdx + step]
    }
    */
    //#loop(isPrev, idx) { // 先頭より前で末尾、末尾より後で先頭、へ移動する
    #loop(isPrev=false) { // 先頭より前で末尾、末尾より後で先頭、へ移動する
//        if (this.isFirst && isPrev) { return this.last() }
//        if (this.isLast && !isPrev) { return this.first() }
//        const step = isPrev ? -1 : 1
//        const nextEl = els[activeIdx + step]
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
    /*
    #yoyo(isPrev) {
        if (this.isFirst && isPrev) { this.next() }
        if (this.isLast && !isPrev) { this.prev() }
    }
    #stop(isPrev) {
        if (this.isFirst && isPrev) {  }
        if (this.isLast && !isPrev) {  }
        
    }
    */
    //#getFocusableNodes() { return [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)] }
    //#getShowNode() { return document.querySelector(`[data-sid]:not([display="none"]`) || document } // 動的変更したdisplay値が取得できない！
    /*
    #getShowNode() {
        for (let el of document.querySelectorAll(`[data-sid]`)) {
            //const display = Css.get('display', el)
            const display = getComputedStyle(el).getPropertyValue('display')
            console.log('display:', display)
            if ('none'!==display) { return el }
        }
        return document
    }
    #getFocusableNodes() { console.log(this.#getShowNode());return [...this.#getShowNode().querySelectorAll(this.#FOCUSABLE_ELEMENTS)] }
    */
    #getFocusableNodes() { return [...document.querySelectorAll(this.#FOCUSABLE_ELEMENTS)].filter(el=>'none'!==getComputedStyle(el).getPropertyValue('display')) }
    #setFocusToFirstNode() {
        const nodes = this.#getFocusableNodes()
        if (nodes.length > 0) nodes[0].focus()
        console.log(nodes)
    }
    //#retainFocus(e) {
    focus(e) {
        console.log(`e.code:${e.code}`, e)
        let nodes = this.#getFocusableNodes()
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
//window.focusLooper = new FocusLooper()
window.focuser = new Focuser()
})()
