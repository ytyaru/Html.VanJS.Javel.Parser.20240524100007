const {div, textarea, button} = van.tags
class JavelEditor {
    constructor() {
        this.parser = new JavelParser()
        this.manuscript = van.state('')
        this.textBlocks = van.derive(()=>this.parser.toBlocks(this.manuscript.val))
        this.htmls = van.derive(()=>this.parser.toHtml(this.textBlocks.val))
        this.size = van.derive(()=>this.parser.calcSize(this.htmls.val))
    }
    init() {
        van.add(document.body, div({style:()=>this.style()}, textarea({rows:5, cols:40, oninput:(e)=>this.manuscript.val=e.target.value}, ()=>this.manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${this.size.val}字`), ()=>div(this.htmls.val)))
        this.manuscript.val = `# 原稿《げんこう》

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

――そのとき、神風が吹いた`
        new ResizeObserver(entries=>{
            for (let entry of entries) { this.resize(entry.contentRect.width, entry.contentRect.height) }
        }).observe(document.querySelector('body'));
        document.querySelector('textarea').focus()
    }
    fontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${uiWidth / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }
    style() { return `display:grid;${this.resize()}` }
    resize(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        const isLandscape = (height <= width)
        const menuBlockSize = 16
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        this.fontSize(uiWidth)
        return `grid-template-columns:${columns};grid-template-rows:${rows};`
    }
}
