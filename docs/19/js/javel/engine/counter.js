class JavelCounter {
    constructor(manuscript) {
        this._manuscript = manuscript
        this._word = new WordCounter(this._manuscript)     // 字数カウンタ
        this._file = new FileSizeCounter(this._manuscript) // ファイルサイズ予想
        this._rateS = new CharRate(this._manuscript)       // 文種比（SentenceRate）
        this._rateC = new CharRate(this._manuscript)       // 字種比（CharacterRate）
    }
    get Word() { return this._word }
    get File() { return this._file }
    get Rate() { return this._rate }
}
class WordCounter {
    constructor(manuscript) { this._manuscript = manuscript; }
    countup() { this.Write; this.Print; this.Read; }
    count(text) { return { // https://inside.pixiv.blog/2020/05/13/181507
        write: this.write(text), // 書字数：全字数
        print: this.print(text), // 印字数：一部除去（書字からJavelメタ文字とルビを消す）
        read: this.read(text),   // 読字数：一部除去（印字から空白文字と記号を消し３連続同字１化）
    }}
    get Write() { return this._manuscript.head.writeWordCount.val = this._manuscript.body.val.Graphemes.length }
    get Print() { return this._manuscript.head.printWordCount.val = this.#print(this._manuscript.body.val).Graphemes.length }
    get Read() { return this._manuscript.head.readWordCount.val = this.read(this._manuscript.body.val) }
    write(text) { return text.Graphemes.length } // 書字数
    print(text) {  return this.#print(text).Graphemes.length } // 印字数
    read(text) { // 読字数
        let result = this.#print(text)          // 印字対象字
        result = this.#deleteWhiteSpace(result) // 空白文字
        result = this.#deleteInvalid(result)    // 印字されるが無意味な字を消す
        result = this.#delete3(result)          // 同字３以上を１字にする
        console.log('READ:',result)
        return result.Graphemes.length
    }
    #print(text) { // 印字対象字を返す
        let result = this.#deleteMeta(text) // Javelのメタ文字とルビを消す
        result = this.#deleteNewline(result)  // 改行コードを消す（Javelブロック（h1, p）、br（p内改行））
        console.log('PRINT:',result)
        return result // 全角スペースや記号は残る
    }
    #deleteMeta(text) { // Javelメタ文字とルビを消す
        let result = text.replace(/^[#]{1,6} /gu, '')              // headingの#とスペース
        result = result.replace(/《《/gu, '')                      // emの二重《《
        result = result.replace(/》》/gu, '')                      // emの二重》》
        result = result.replace(/(《[^｜《》\n\r]{1,20}》)/gu, '') // rt（ルビ）
        result = result.replace(/｜/gu, '')                        // rubyの｜
        return result
    }
    #deleteNewline(text) { return text.replace(/[\r\n]/gu, '') }
    #deleteWhiteSpace(text) { return text.replace(/[\p{C}\p{Z}]/gu, ''); } // 制御文字、区切り文字
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
