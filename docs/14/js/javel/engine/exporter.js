class JavelExporter {
    constructor(parser, counter) {
        this.parser = parser || new JavelParser()
        this.counter = counter || new JavelCounter(this.parser)
    }
    async export(headData, body, type, platform, isCmp=true, cmpLv=9) {
        this.#setHead(headData, body)
        await this.#exportZip(headData, body)
    }
    #setHead(headData, body) {
        console.error(Date.toIso())
        if (!headData.created.val) { headData.created.val = Date.toIso() }
        else { headData.updated.val = Date.toIso() }
        if (!headData.uuid.val) { headData.uuid.val = crypto.randomUUID() }
        const count = this.counter.Word.count(body)
        if (0===headData.writeWordCount.val) { headData.writeWordCount.val = count.write }
        if (0===headData.printWordCount.val) { headData.printWordCount.val = count.print }
        if (0===headData.readWordCount.val) { headData.readWordCount.val = count.read }
    }
    #toFrontMatter(headData) { return `---\n${headData.yaml}---` }
    async #exportZip(headData, body, type, platform, isCmp=true, cmpLv=9) { // javel:テキスト, 他:ZIPオプション（未設定でもいい感じにしてくれる）
        const zip = new JSZip();
        const javel = this.#toFrontMatter(headData) + '\n\n' + body
        zip.file('manuscript.md', javel)
        zip.file('index.html', this.parser.Javel.toHtml(body))
//        const html = zip.folder('html')
        await zip.generateAsync(this.#option(type,platform,isCmp,cmpLv)).then((content)=>{console.log('ZIP:',content.size, 'Byte');File.download(content, 'javel.zip')})
    }
    /*
    exportZip(javel, type, platform, isCmp=true, cmpLv=9) { // javel:テキスト, 他:ZIPオプション（未設定でもいい感じにしてくれる）
        const zip = new JSZip();
        zip.file('manuscript.md', javel)
        zip.file('index.html', this.parser.Javel.toHtml(javel))
//        const html = zip.folder('html')
        zip.generateAsync(this.#option(type,platform,isCmp,cmpLv)).then((content)=>{console.log('ZIP:',content.size, 'Byte');File.download(content, 'javel.zip')})
    }
    */
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
