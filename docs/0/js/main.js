window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const editor = new JavelEditor()
    editor.init()
    /*
    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.Javel.Parser.20240524100007/`}, 'Javel.Parser')),
        p('Javel構文のパーサ。'),
//        p('Parser for Javel syntax.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
    */
    /*
    const parser = new JavelParser()
    console.log(parser)
    const manuscript = `# これは原稿《げんこう》です

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。｜H《Hyper》｜T《Text》｜M《Markup》｜L《Language》形式で出力します。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

――そのとき、神風が吹いた`
    const elements = parser.parse(manuscript)
    console.log(elements)
    for (el of elements) { console.log(el.outerHTML) }
    van.add(document.querySelector('main'), elements)
    */
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

