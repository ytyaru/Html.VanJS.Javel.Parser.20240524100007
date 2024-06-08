class JavelWriter {
    constructor() {
        window.ColorScheme = new ColorScheme()
        window.Toast = new Toast()
        this._manuscript = new Manuscript() // 原稿 van.state()
        this.body = new JavelBodyWriter(this._manuscript) // 本文
        this.head = new JavelHeadWriter(this._manuscript) // 表紙
        this.auth = new JavelAuthWriter(this._manuscript) // 著者
        this.about = new JavelWriterAbout() // アプリ紹介
        this.body.el.dataset.sid = 'javel-body-writer'
        this.head.el.dataset.sid = 'javel-head-writer'
        this.auth.el.dataset.sid = 'javel-auth-writer'
        this.about.el.dataset.sid = 'javel-writer-about'
        console.log(this.body.el.dataset.sid)
        console.log(this.head.el.dataset.sid)
        console.log(this.auth.el.dataset.sid)
        console.log(this.about.el.dataset.sid)
        this.selector = new ElementSelector(document.body, 'javel-body-writer')
        this.selector.sid = 'javel-body-writer'
    }
}
