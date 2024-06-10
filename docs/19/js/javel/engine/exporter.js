class JavelExporter {
    constructor(manuscript, parser, counter) {
        this._manuscript = manuscript
        this._parser = parser || new JavelParser()
        this._counter = counter || new JavelCounter(this._parser)
    }
    async export(type, platform, isCmp=true, cmpLv=9) {
        this.#setHead()
        await this.#exportZip()
    }
    #setHead() {
        if (!this._manuscript.head.created.val) { this._manuscript.head.created.val = Date.toIso() }
        else { this._manuscript.head.updated.val = Date.toIso() }
        if (!this._manuscript.head.uuid.val) { this._manuscript.head.uuid.val = crypto.randomUUID() }
        const count = this._counter.Word.count(this._manuscript.body.val)
        if (0===this._manuscript.head.writeWordCount.val) { this._manuscript.head.writeWordCount.val = count.write }
        if (0===this._manuscript.head.printWordCount.val) { this._manuscript.head.printWordCount.val = count.print }
        if (0===this._manuscript.head.readWordCount.val) { this._manuscript.head.readWordCount.val = count.read }
    }
    async #exportZip(type, platform, isCmp=true, cmpLv=9) { // javel:テキスト, 他:ZIPオプション（未設定でもいい感じにしてくれる）
        const zip = new JSZip();
        zip.file('manuscript.md', this._manuscript.javel)
        zip.file('index.html', this._parser.Javel.toHtml(this._manuscript.body.val))
//        const html = zip.folder('html')
        await zip.generateAsync(this.#option(type,platform,isCmp,cmpLv)).then((content)=>{console.log('ZIP:',content.size, 'Byte');File.download(content, 'javel.zip')})
    }
    #option(type, platform, isCmp=true, cmpLv=9) { return {
        type: this.#optionType(type),
        platform: this.#platform(platform),
        compression: this.#compression(isCmp),
        compressionOptions: this.#compressionOptions(isCmp, cmpLv),
    }}
    #optionType(v) { return (('base64,binarystring,array,uint8array,arraybuffer,blob,nodebuffer'.split(',').some(valid=>valid===v)) ? v : 'blob') } 
    #compression(is=true) { return ((is) ? 'DEFLATE' : 'STORE') }
    #compressionOptions(is=true, level=9) {
        const l = parseInt(level)
        const L = ((1<=l && l<=9) ? l : 9)
        return ((is) ? L : null)
    }
    #platform(p) { return ('DOS,UNIX'.split(',').includes(p) ? p : (('windows'===this.#platformUA()) ? 'DOS' : 'UNIX')) }
    #platformUA() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf('windows nt') !== -1) { return 'windows' }
        else if(ua.indexOf('android') !== -1) { return 'android' }
        else if(ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1) { return 'iOS' }
        else if(ua.indexOf('mac os x') !== -1) { return 'mac' }
        else { return 'linux' }
    }
}
