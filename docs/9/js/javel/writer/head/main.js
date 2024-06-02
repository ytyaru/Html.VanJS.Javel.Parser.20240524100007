class JavelHeadWriter {
    constructor() {
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-body-writer'
        this._authBtn = DivButton.make(null, ()=>'著者')
        this._authBtn.dataset.select = 'javel-auth-writer'
        this._el = van.tags.div(van.tags.h1('JavelHeadWriter'), this._backBtn, this._authBtn)
        van.add(document.body, this._el)
    }
    get el() { return this._el }
}
