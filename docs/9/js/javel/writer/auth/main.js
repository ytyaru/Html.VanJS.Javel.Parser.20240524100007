class JavelAuthWriter {
    constructor() {
        this._backBtn = DivButton.make(null, ()=>'戻')
        this._backBtn.dataset.select = 'javel-head-writer'
        this._el = van.tags.div(van.tags.h1('JavelAuthWriter'), this._backBtn)
        van.add(document.body, this._el)
    }
    get el() { return this._el }

}
