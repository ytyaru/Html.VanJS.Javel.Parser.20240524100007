const {h1, p, br, em, ruby, rt, rp} = van.tags
class JavelParser {
    constructor() {
        this._javel = new JavelToHtml()
        this._html = new HtmlToJavel()
    }
    get Javel() { return this._javel }
    get Html() { return this._html }
}
class JavelToHtml {
    toHtml(value, hasNewline=false) {
        if (!Type.isStr(value) && !Type.isEls(value)) { throw new Error(`第一引数valueはString型またはElement型の配列であるべきです。${typeof value}`)  }
        const els = (Type.isEls(value) ? value : this.toElements(this.toBlocks(value)))
        return els.map(el=>el.outerHTML).join(((hasNewline) ? '\n' : ''))
    }
    toElements(blocks) {
        const BLOCKS = (Type.isStrs(blocks) ? blocks : this.toBlocks(blocks))
        return BLOCKS.map(b=>((b.startsWith('# ')) ? h1(this.#inline(b.slice(2))) : p(this.#inline(b))))
    }
    toBlockElements(block) { return this.#inline(block) }
    calcSize(htmls) { return htmls.reduce((sum, el)=>sum + el.innerText.length, 0) }
    toBlocks(text) {
        if (0===text.trim().length) { return [] }
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')
        const blocks = []; let start = 0;
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
        blocks.push(this.#trimLine(text.slice(start)))
        return blocks.filter(v=>v)
    }
    #inline(block) { 
//        console.log(block)
        const inlines = []; let start = 0;
        for (let d of this.#genBrEmRuby(block)) {
//            console.log(d)
            inlines.push(block.slice(start, d.index))
            inlines.push(d.html)
            start = d.index + d.length
//            console.log(start, d.index, d.length)
        }
        inlines.push(this.#trimLine(block.slice(start)))
//        console.log(inlines)
        return inlines.filter(v=>v)
    }
    #genBrEmRuby(text) { return [...this.#genBr(this.#matchBr(text)), ...this.#genEm(this.#matchEm(text)), ...this.#genRuby(this.#matchRubyL(text)), ...this.#genRuby(this.#matchRubyS(text))].sort((a,b)=>a.index - b.index) }
    #genBr(matches) { return matches.map(m=>({'match':m, 'html':br(), 'index':m.index, 'length':m[0].length})) }
    #matchBr(text) { return [...text.matchAll(/[\r|\r?\n]/gm)] }
    #matchEm(text) { return [...text.matchAll(/《《([^｜《》\n]+)》》/gm)] }
    #genEm(matches) { return matches.map(m=>({'match':m, 'html':em(m[1]), 'index':m.index, 'length':m[0].length}))}
    #matchRubyL(text) { return [...text.matchAll(/｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #matchRubyS(text) { return [...text.matchAll(/([一-龠々仝〆〇ヶ]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #genRuby(matches) { return matches.map(m=>({match:m, html:ruby(m[1], rp('（'), rt(m[2]), rp('）')), 'index':m.index, length:m[0].length})) }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
}
class HtmlToJavel {
    toJavel(value) {
        if (!Type.isStr(value) && !Type.isEls(value)) { throw new Error(`第一引数valueはString型またはElement型の配列であるべきです。${typeof value}`)  }
        const els = (Type.isEls(value) ? value : this.toElements(value))
        console.log(els)
        return this.toBlocks(els).join('\n\n')
//        return els.map(el=>el.outerHTML).join(((hasNewline) ? '\n' : ''))
//        const els = (Type.isEls(value) ? value : this.toElements(this.toBlocks(value)))
//        return els.map(el=>el.outerHTML).join(((hasNewline) ? '\n' : ''))
    }
    parse(html) {

    }
    #getElements(html) {
        
    }
    toElements(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        console.log(div.childNodes)
        return div.childNodes;
        //return div.children;
        //return div.firstElementChild;
    }
    /*
    toBlocks(elements) { // HTMLのBlock要素をTextBlockに変換する（h1→#, p→2改行）
        const blocks = []
        for (let el of elements) {
            const N = el.tagName.toLowerCase()
            const heading = N.match(/h([1-6])/)
            if ('p'===N) { blocks.push(this.toInlines(el.childNodes)) } // パラグラフ
            else if (heading) { // 見出し
                const level = parseInt(heading[1])
                const meta = '#'.repeat(level) + ' '
                blocks.push(meta + this.toInlines(el.childNodes).join(''))
            }
        }
        //return blocks.join('\n\n')
        return blocks
    }
    */
    toBlocks(nodes) { // HTMLのBlock要素をTextBlockに変換する（h1→#, p→2改行）
        const blocks = []
        for (let node of nodes) {
            //console.log(node, node.tagName)
            console.log(node, node.nodeName)
            const N = node.nodeName.toLowerCase()
            const heading = N.match(/h([1-6])/)
            if ('p'===N) { blocks.push(this.toInlines(node.childNodes)) } // パラグラフ
            else if (heading) { // 見出し
                const level = parseInt(heading[1])
                const meta = '#'.repeat(level) + ' '
                blocks.push(meta + this.toInlines(node.childNodes))
            }
        }
        //return blocks.join('\n\n')
        return blocks
    }

    toInlines(nodes) { // HTMLのInline要素をJavel構文に変換する（br→p内1改行, ruby→｜《》, em→《《》》）
        const NODES = (Type.isAry(nodes) ? nodes : [...nodes])
        //return NODES.map(node=>inlines.push(this.toInline(node))).filter(v=>v).join('')
        return NODES.map(node=>this.toInline(node)).filter(v=>v).join('')
    }
    toInline(node) {
        switch (node.nodeType) { // https://developer.mozilla.org/ja/docs/Web/API/Node/nodeType#node.attribute_node
            case 1: // ELEMENT_NODE
                return this.toJavelInline(node)
            case 2: // ATTRIBUTE_NODE
                return null;
            case 3: // TEXT_NODE
                return node.textContent;
            case 4: // CDATA_SECTION_NODE   <!CDATA[[ … ]]>
                return null;
            case 7: // PROCESSING_INSTRUCTION_NODE  <?xml-stylesheet … ?>
                return null;
            case 8: // COMMENT_NODE <!-- … -->
                return null; // <!-- more --> で要約文を取得する拡張構文を将来実装する可能性あり
            case 9: // DOCUMENT_NODE
                return null;
            case 10: // DOCUMENT_TYPE_NODE  <!DOCTYPE html> 
                return null;
            case 11: // DOCUMENT_FRAGMENT_NODE
                return null;
            default:
                return null; // ENTITY_REFERENCE_NODE (5), Node.ENTITY_NODE (6), Node.NOTATION_NODE (12) は非推奨
        }
    }
    toJavelInline(node) {
        const N = node.tagName.toLowerCase()
        switch (N) {
            case 'br': return '\n'
            case 'em': return `《《${node.innerHTML}》》`
            case 'ruby': return this.toRuby(node)
            default: return null
        }
        /*
        if (!['br','em','ruby'].includes(N)) { return null }
        if ('br'===N) { return '\n' }
        else if ('em'===)
        if (['br','em','ruby'].includes(N)) {

        }
        return null
        */
    }
    toRuby(node) {
        console.log(node, node.childNodes, node.textContent, typeof node, node.firstElementChild)
        const rb = node.childNodes[0].textContent // 親文字だけ抽出する
        const rt = node.querySelector(`rt`).textContent // ルビだけ抽出する
        // 親文字が漢字のみなら｜パイプなし
        // 親文字が漢字以外を含むなら｜パイプあり
        const isKanjiOnly = rb.match(/([一-龠々仝〆〇ヶ]{1,50})/)
        console.log(rb, rt, isKanjiOnly, ((isKanjiOnly) ? '' : '｜') + rb + `《${rt}》`)
        return ((isKanjiOnly) ? '' : '｜') + rb + `《${rt}》`
    }
}
class ElementToJavel {
}

