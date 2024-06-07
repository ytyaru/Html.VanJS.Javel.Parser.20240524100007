(function(){
class Overlay {
    constructor() {
        this._display = van.state(`flex`) // flex/none
//        this._opacity = van.state(0) // 0/1
        this._el = van.tags.div({id:`dnd-overlay`, style:()=>`display:${this._display.val};justify-content:center;align-items:center;position:fixed;z-index:0;top:0;left:0;width:100vw;height:100vh;color:#fff;font-size:4.75rem;background-color:rgba(#000,.75);transition:.24s;`})
        //this._overlay = van.tags.div({id:`dnd-overlay`, style:()=>`display:${this._display.val};justify-content:center;align-items:center;position:fixed;z-index:0;top:0;left:0;width:100vw;height:100vh;filter:opacity(0);visibility:hidden;color:#fff;font-size:4.75rem;background-color:rgba(#000,.75);transition:.24s;`})
    }
    get el() { return this._el }
    show() { console.error('show'); this._display.val = 'flex' }
    hide() { this._display.val = 'none' }
}
class Mask {
    constructor() {
        this._display = van.state(`flex`) // flex/none
        this._el = van.tags.div({id:`dnd-overlay-mask`,style:()=>`display:${this._display};position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;display:none;z-index:9999;`})
    }
    get el() { return this._el }
    show() { console.error('show'); this._display.val = 'block' }
    hide() { this._display.val = 'none' }
}
class DnD {
    constructor() {
        this._overlay = new Overlay()
        this._mask = new Mask()
//        this._display = van.state('block') // block/none
//        this._filter = van.state('opacity(0)') // opacity(0)/opacity(1)
//        this._visibility = van.state('hidden') // hidden/visible
//        this._mask = van.tags.div({id:`overlay-mask`,style:()=>`filter:${this._filter.val};visibility:${this._visibility};position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;display:none;z-index:9999;`})
        this.setup()
        document.body.prepend(this._overlay.el)
        this._overlay.el.insertAdjacentElement('afterend', this._mask.el)
        /*
        van.add(document.body, this._mask)
        van.add(document.body, this._mask)
        this.overlay.insertAdjacentElement('afterend', this._mask)
        */
    }
    get overlay() { return document.querySelector('#overlay') }
    setup() {
        const overlay = this._overlay.el
        //const overlay = document.querySelector('#overlay');
        console.log(overlay)
        /*
        for (let en of ['dragenter', 'dragover', 'dragleave', 'drop']) {overlay.addEventListener(en, this.preventDefaults, false)}
        window.addEventListener('dragenter', (e)=>this.enabled(e, overlay));
        overlay.addEventListener('dragleave', (e)=>this.disabled(e, overlay));
        overlay.addEventListener('drop', async(e)=>{ await this.handleDrop(e) });
        */
        window.addEventListener('dragenter', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        //window.addEventListener('dragover', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        //window.addEventListener('dragover', (e)=>{this.preventDefaults(e);})
        //overlay.addEventListener('dragenter', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        overlay.addEventListener('dragenter', (e)=>{this.preventDefaults(e);})
        overlay.addEventListener('over', (e)=>{this.preventDefaults(e);})
        overlay.addEventListener('dragleave', (e)=>{this.preventDefaults(e);this.disabled(e, overlay);})
        overlay.addEventListener('drop', async(e)=>{this.preventDefaults(e);await this.handleDrop(e) })
        //for (let en of ['dragleave', 'drop']) {this._mask.addEventListener(en, (e)=>{this.preventDefaults(e);this.disabled(null,this.overlay)})}
        console.log(this._mask.el)
        this._mask.el.addEventListener('dragleave', (e)=>{this.preventDefaults(e);this.disabled(e, this._mask.el);})
        this._mask.el.addEventListener('drop', (e)=>{this.preventDefaults(e);this.disabled(e, this._mask.el);})
    }
    preventDefaults(e) {
        console.log(`preventDefaults`)
        console.log(e)
        e.preventDefault();
        e.stopPropagation();
    }
    enabled(e, overlay) {
        console.log(`enabled`)
        /*
        console.log(this)
        console.log(this.overlay)
        console.log(this.target)
        console.log(e)
        console.log(e.target)
        */
        console.log(overlay)
//        this.target.style.filter = 'opacity(1)';
//        this.target.style.visibility = 'visible';
//        this.overlay.style.filter = 'opacity(1)';
//        this.overlay.style.visibility = 'visible';
//        this.showMask()
//        overlay.style.filter = 'opacity(1)';
//        overlay.style.visibility = 'visible';
//        overlay.style.display = 'block';
        this._mask.show()
        this._overlay.show()
    }
    disabled(e, overlay) {
        console.error(`disabled`)
        console.log(e)
//        this.target.style.filter = 'opacity(0)';
//        this.target.style.visibility = 'hidden';
//        this.overlay.style.filter = 'opacity(0)';
//        this.overlay.style.visibility = 'hidden';
//        this.hideMask()
//        overlay.style.filter = 'opacity(0)';
//        overlay.style.visibility = 'hidden';
//        overlay.style.display = 'none';
        this._mask.hide()
        this._overlay.hide()
    }
    /*
    showMask() {
        console.log('showMask')
//        this._display.val='block'
        this._filter.val = 'opacity(1)'
        this._visibility.val = 'visible'
    }
    hideMask() {
        console.error('hideMask')
//        this._display.val='none'
        this._filter.val = 'opacity(0)'
        this._visibility.val = 'hidden'
    }
    */
    async handleDrop(e) {
        console.log(`handleDrop`)
        console.log(e)
        console.log(e.dataTransfer.files[0].name)
        // Remove bellow 3 lines when included this code to your app
        alert('Complete uploading');
//        document.querySelector('#overlay').style.filter = 'opacity(0)';
//        document.querySelector('#overlay').style.visibility = 'hidden';
//        this.disabled(null, document.querySelector('#overlay'))
        this.disabled()
    }
}

document.addEventListener('DOMContentLoaded', e => {
//    acceptDragDrop();
    const dnd = new DnD()
});


})()
