class JavelCounter {
    constructor() {
        this.manuscript = new JavelManuscriptCounter()
        this.content = new JavelContentCounter()
        this.file = new FileSizeCounter()
    }
}
class JavelManuscriptCounter {
    constructor() {
        // カウント是非
        // メタ文字
        //   ブロック２改行
        //   p内１改行
        //   ルビ｜《》
        //   圏点《《》》
        // ルビ
        //   ルビ(rt内)
        // 空白文字
        //   全角スペース
        //     字下げ
        //     他
        //   他
        // 囲み文字
        //   「」
        //   『』
        //   【】
        //   （）
        //   ＜＞
        //   〈〉
        //   ［］
        //   〔〕
        //   ｛｝
        //   “”
        //   ‘’
        // 記号（連続する！？系記号はまとめて１字とするか否か）
        //   ！？⁉ ‼
        /*
        this._options = {
            meta: {
                newline: { block:false, inline:false }
                ruby: false,
                em: false,
            }
            rt: false,
            indent: false,
        }
        */
        /*
        this._options = {
            meta: { whiteSpace:false, ruby:false, em:false },
            rt: false
        }
        */
        this._options = { meta:false, rt:false } // 空白文字ルビなし
    }
    get Options() { return this._options }
    getMax(text) { return text.Graphemes.length }
    getMin(text) {
        let result = this.#deleteWhiteSpace(text)            // 空白文字
        result = result.replace(/(《[^｜《》\n\r]》)/gu, '') // rt
        result = result.replace(/[｜《》]/gu, '')            // rubyの｜やemの二重《《》》
        //#matchRubyL(text) { return [...text.matchAll(/｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
        console.log(result)
        return result.Graphemes.length
    }
    get(text) {
        let result = text
        if (!this._options.meta) {
            result = this.#deleteWhiteSpace(result)
            result = result.replace(/[｜《》]/gu, '')
        }
        if (!this._options.rt) { result = result.replace(/(《.+》)/gu, '') }
        return result.Graphemes.length
    }
    #deleteWhiteSpace(text) { return text.replace(/[\p{C}\p{Z}]/gu, ''); }
    //getFull(text) { return htmls.reduce((sum, el)=>sum + el.innerText.length, 0) }
}
class JavelContentCounter {

}
class FileSizeCounter {

}
