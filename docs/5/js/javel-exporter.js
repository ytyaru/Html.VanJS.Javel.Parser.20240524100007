class JavelExporter {
    constructor(parser) { this.parser = parser || new JavelParser() }
    export(javel, type, platform, isCmp=true, cmpLv=9) { // javel:テキスト, 他:ZIPオプション（未設定でもいい感じにしてくれる）
        const zip = new JSZip();
        zip.file('manuscript.md', javel)
        zip.file('index.html', this.parser.Javel.toHtml(javel))
//        const html = zip.folder('html')
//        const fix = zip.folder('fix')
//        const reflow = zip.folder('reflow')
//        dir.file("smile.gif", imgData, {base64: true});
//        zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:9}}).then((content)=>File.download(content, 'javel.zip'))
        zip.generateAsync(this.#option(type,platform,isCmp,cmpLv)).then((content)=>File.download(content, 'javel.zip'))
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
