class JavelWriterAbout {
    constructor() {
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._el = van.tags.div(van.tags.h1('JavelWriterAbout'), this._backBtn)
        van.add(document.body, this._el)
    }
    get el() { return this._el }

}
