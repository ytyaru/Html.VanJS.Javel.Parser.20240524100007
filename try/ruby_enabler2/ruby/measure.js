function measure(ruby) { // 両面ルビ要素の位置合わせをする（直前にspanを追加しその位置に合わせる）

    const WM = getComputedStyle(ruby).getPropertyValue('writing-mode')
    console.log(WM)
    console.log('ruby:', ruby.getBoundingClientRect())
    console.log('#span-measure:', document.querySelector('#span-measure').getBoundingClientRect())
    const clone = ruby.cloneNode(true)
    console.log(ruby, clone)
    /*
    if ('vertical-rl'===WM) {
        clone.classList.replace('w')
        clone.classList.add(('vertical-rl') ? 'w' :  '_reds')
    } else {

    }
    */


    if (!ruby.classList.contains('w') && !ruby.classList.contains('_reds')) {
        ruby.classList.add(('vertical-rl') ? 'w' :  '_reds')
    } else if (ruby.classList.contains('w')) {
        if ('horizontal-tb'===WM) { ruby.classList.replace('w', '_reds') }
    } else if (ruby.classList.contains('_reds')) {
        if ('vertical-rl'===WM) { ruby.classList.replace('_reds', 'w') }
    }
    if ('vertical-rl'===WM) { ruby.style.verticalAlign = `0px` }






    const span = document.createElement('span')
    span.id = '_redsdummy'
    span.innerHTML = 'あ'
    clone.style.verticalAlign = '0px'
    //const rbcs = ruby.getElementsByTagName('rbc')
    const rbcs = ruby.getElementsByTagName('rb')
    console.log(rbcs)
    console.log('rbc[0]',rbcs[0].getBoundingClientRect())
//    const rbcs = document.getElementsByTagName('rbc')
//    rbcs[0].id = '_dsmeasure'
    ruby.parentNode.insertBefore(span, ruby)
    //const spanTop = span.getBoundingClientRect().top + window.scrollY
    const spanTop = _blockStart(span, WM)
    console.log(`spanTop:${spanTop}\n${span.getBoundingClientRect().top}\n${window.scrollY}`)
    ruby.parentNode.removeChild(span)
    ruby.parentNode.insertBefore(clone, ruby)
    //const pos = rbcs[0].getBoundingClientRect().top - spanTop + window.scrollY
    const pos = _blockStart(rbcs[0], WM) - spanTop
    console.log(`pos:${pos}\n`, 
        `${rbcs[0].getBoundingClientRect().top}\n`, 
        `${window.scrollY}\n`)
    console.log(`ruby-pos:${ruby.getBoundingClientRect().top + window.scrollY}\n`)
    console.log(`rbc-0-pos:${rbcs[0].getBoundingClientRect().top + window.scrollY}\n`)
    console.log(`rtc-0-pos:${ruby.getElementsByTagName('rtc')[0].getBoundingClientRect().top + window.scrollY}\n`)
    console.log(`rtc-1-pos:${ruby.getElementsByTagName('rtc')[1].getBoundingClientRect().top + window.scrollY}\n`)
    ruby.parentNode.removeChild(clone)
    ruby.style.verticalAlign = `${pos}px`

    if (!ruby.classList.contains('w') && !ruby.classList.contains('_reds')) {
        ruby.classList.add(('vertical-rl') ? 'w' :  '_reds')
    } else if (ruby.classList.contains('w')) {
        if ('horizontal-tb'===WM) { ruby.classList.replace('w', '_reds') }
    } else if (ruby.classList.contains('_reds')) {
        if ('vertical-rl'===WM) { ruby.classList.replace('_reds', 'w') }
    }
    if ('vertical-rl'===WM) { ruby.style.verticalAlign = `0px` }



    return pos + 'px'

    /*
    var d, n, r, i = this.newEle("SPAN");
    return i.id = "_redsdummy", i.innerHTML = "あ", t.style.verticalAlign = "0px", d = this.getByTag(t, "RB"), 0 == d.length && (d = this.getByTag(t, "RBC")), d[0].id = "_dsmeasure", e.parentNode.insertBefore(i, e), r = this.getTop(i) + window.scrollY, e.parentNode.removeChild(i), e.parentNode.insertBefore(t, e), n = this.getTop(d[0]) - r + window.scrollY, d[0].removeAttribute("id"), e.parentNode.removeChild(t), n + "px"
    */
}
function _blockStart(el, WM) { return (('vertical-rl'===WM) ? el.getBoundingClientRect().right: el.getBoundingClientRect().top) + _blockScroll(WM) }
function _blockScroll(WM) { return ('vertical-rl'===WM) ? window.scrollX : window.scrollY }

