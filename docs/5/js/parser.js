class JavelParser {
    constructor() {
        this.manuscript = van.state('')
        this.textBlocks = van.derive(()=>this.toBlocks(this.manuscript.val))
        this.htmls = van.derive(()=>this.toHtml(this.textBlocks.val))
        this.size = van.derive(()=>this.calcSize(this.htmls.val))
    }
    parse(text) { return this.toHtml(this.toBlocks(text)) }
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
    toHtml(blocks) { return blocks.map(b=>((b.startsWith('# ')) ? h1(this.#inline(b.slice(2))) : p(this.#inline(b)))) }
    #inline(block) { 
        console.log(block)
        const inlines = []; let start = 0;
        for (let d of genBrEmRuby(block)) {
            console.log(d)
            inlines.push(block.slice(start, d.index))
            inlines.push(d.html)
            start = d.index + d.length
            console.log(start, d.index, d.length)
        }
        //inlines.push(block.slice(start).trimLine())
        inlines.push(this.#trimLine(block.slice(start)))
        console.log(inlines)
        return inlines.filter(v=>v)
    }
    #genBrEmRuby(text) { return [...this.#genBr(matchBr(text)), ...this.#genEm(matchEm(text)), ...this.#genRuby(matchRubyL(text)), ...this.#genRuby(matchRubyS(text))].sort((a,b)=>a.index - b.index) }
    #genBr(matches) { return matches.map(m=>({'match':m, 'html':br(), 'index':m.index, 'length':m[0].length})) }
    #matchBr(text) { return [...text.matchAll(/[\r|\r?\n]/gm)] }
    #matchEm(text) { return [...text.matchAll(/《《([^｜《》\n]+)》》/gm)] }
    #genEm(matches) { return matches.map(m=>({'match':m, 'html':em(m[1]), 'index':m.index, 'length':m[0].length}))}
    #matchRubyL(text) { return [...text.matchAll(/｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #matchRubyS(text) { return [...text.matchAll(/([一-龠々仝〆〇ヶ]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #genRuby(matches) { return matches.map(m=>({match:m, html:ruby(m[1], rp('（'), rt(m[2]), rp('）')), 'index':m.index, length:m[0].length})) }
    calcSize(htmls) { return htmls.reduce((sum, el)=>sum + el.innerText.length, 0) }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }

    /*
    function fontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${uiWidth / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }

    function style() { return `display:grid;${resize()}` }
    function resize(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        const isLandscape = (height <= width)
        // this.menu.isVertical = this.#isLandscape()
        const menuBlockSize = 16
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        fontSize(uiWidth)
        return `grid-template-columns:${columns};grid-template-rows:${rows};`
    }



    //van.add(document.body, div({style:()=>style()}, textarea({rows:5, cols:40, oninput:(e)=>manuscript.val=e.target.value}, ()=>manuscript.val), button(()=>`${size.val}字`), div(()=>div(htmls.val))))
    van.add(document.body, div({style:()=>style()}, textarea({rows:5, cols:40, oninput:(e)=>manuscript.val=e.target.value}, ()=>manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${size.val}字`), ()=>div(htmls.val)))
    manuscript.val = `# 原稿《げんこう》

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

――そのとき、神風が吹いた`
    new ResizeObserver(entries=>{
        for (let entry of entries) { resize(entry.contentRect.width, entry.contentRect.height) }
    }).observe(document.querySelector('body'));
    document.querySelector('textarea').focus()
    */

}
