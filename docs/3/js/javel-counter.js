class JavelCounter {
    constructor() {
//        this.manuscript = new JavelManuscriptCounter() // 書字数
//        this.content = new JavelContentCounter() // 読字数
        this._write = new JavelManuscriptCounter() // 書字数
        this._read = new JavelContentCounter() // 読字数
        this._print = null // 印字数
        this._file = new FileSizeCounter() // ファイルサイズ予想
        this._rate = new CharRate() // 字種比
    }
    get Write() { return this._write }
    get Read() { return this._read }
    get Print() { return this._print }
    get File() { return this._file }
    get Rate() { return this._rate }
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
    getMin(text) { // 削除（空白文字、制御文字、メタ文字、ルビ、３以上連続字、非有効字（漢字ひらがなカタカナ英数字以外））
        let result = text.replace(/^[#]{1,6} /gu, '')              // headingの#とスペース
        result = result.replace(/《《/gu, '')                      // emの二重《《
        result = result.replace(/》》/gu, '')                      // emの二重》》
        result = result.replace(/(《[^｜《》\n\r]{1,20}》)/gu, '') // rt
        result = result.replace(/｜/gu, '')                        // rubyの｜
        result = this.#deleteWhiteSpace(result)                    // 空白文字
        result = this.#delete3(result)                             // 同字３以上を１字にする
        result = this.#deleteInvalid(result)                       // 印字されるが無意味な字を消す
        console.log(result)
        return result.Graphemes.length
    }
    get(text) {
        let result = text
        if (!this._options.meta) {
            result = this.#deleteWhiteSpace(result) // メタ字（block(h1, p), br）、字下げ（全角スペース）
            result = result.replace(/[｜《》]/gu, '') // メタ字（em, ruby）
            result = result.replace(/^[#]{1,6} /gu, '') // メタ字（見出し）
        }
        if (!this._options.rt) { result = result.replace(/(《.+》)/gu, '') }
        return result.Graphemes.length
    }
    #deleteWhiteSpace(text) { return text.replace(/[\p{C}\p{Z}]/gu, ''); }
    #delete3(text) { return text.replace(/(.)\1{3,}/gu, '$1') }
    #deleteInvalid(text) { // 印字されるが意味のない文字を消す（漢字、ひらがな、カタカナ、英数字、句読点等一部記号、以外の全字）
        return text.replace(/[^一-龠々仝〆〇ヶぁ-んーァ-ヶｱ-ﾝﾞﾟa-zA-Zａ-ｚＡ-Ｚ0-9０-９]/gu, '')// 漢字
        /*
        let result = text.replace(/^[一-龠々仝〆〇ヶ]/gu, '')// 漢字
        result = text.replace(/^[ぁ-んー]/gu, '')// ひらがな
        result = text.replace(/^[ァ-ヶー]/gu, '')// カタカナ（全角）
        result = text.replace(/^[ｱ-ﾝﾞﾟ]/gu, '')  // カタカナ（半角）
        result = text.replace(/^[a-zA-Z]/gu, '') // 英字（半角）
        result = text.replace(/^[ａ-ｚＡ-Ｚ]/gu, '')// 英字（全角）
        result = text.replace(/^[0-9]/gu, '')// 数字（半角）
        result = text.replace(/^[０-９]/gu, '')// 数字（全角）
        result = text.replace(/^[,\.!\?'"]/gu, '')        // 記号（半角）句読点、感嘆符、引用符
        result = text.replace(/^[、。！？‼⁉‘’“”]/gu, '')// 記号（全角）句読点、感嘆符、引用符
        result = text.replace(/^[「」『』（）【】［］〈〉〔〕｛｝]/gu, '')// 記号（全角）括弧
        // …―・（三点リーダー、ダッシュ、中黒も消す。これらは空白文字と見做して排除）
        // 、。！？（句読点、感嘆符も空白文字と見做して排除）
        // 「」””（括弧、引用符も空白文字と見做して排除）
        // 他記号・絵文字（字ではなく絵と見做して排除）
        return result
        */
    }
    //getFull(text) { return htmls.reduce((sum, el)=>sum + el.innerText.length, 0) }
}
class JavelContentCounter {

}
class FileSizeCounter {

}
class CharRate {

}
