class JavelWriter {
    constructor() {
        this.body = new JavelBodyWriter() // 本文
        this.head = new JavelHeadWriter() // 表紙
        this.auth = new JavelAuthWriter() // 著者
        this.about = new JavelWriterAbout() // 紹介
        this.body.el.dataset.sid = 'javel-body-writer'
        this.head.el.dataset.sid = 'javel-head-writer'
        this.auth.el.dataset.sid = 'javel-auth-writer'
        this.about.el.dataset.sid = 'javel-writer-about'
        this.selector = new ElementSelector(document.body, 'javel-body-writer')
    }
}
