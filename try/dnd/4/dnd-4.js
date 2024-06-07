(function(){
class DnD {
    constructor() {
//        this._display = van.state('block') // block/none
        this._filter = van.state('opacity(0)') // opacity(0)/opacity(1)
        this._visibility = van.state('hidden') // hidden/visible
        this._mask = van.tags.div({id:`overlay-mask`,style:()=>`filter:${this._filter.val};visibility:${this._visibility};position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;display:none;z-index:9999;`})
        van.add(document.body, this._mask)
        this.overlay.insertAdjacentElement('afterend', this._mask)
        this.setup()
    }
    get overlay() { return document.querySelector('#overlay') }
    setup() {
        const overlay = document.querySelector('#overlay');
        console.log(overlay)
        /*
        for (let en of ['dragenter', 'dragover', 'dragleave', 'drop']) {overlay.addEventListener(en, this.preventDefaults, false)}
        window.addEventListener('dragenter', (e)=>this.enabled(e, overlay));
        overlay.addEventListener('dragleave', (e)=>this.disabled(e, overlay));
        overlay.addEventListener('drop', async(e)=>{ await this.handleDrop(e) });
        */
        window.addEventListener('dragenter', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        //window.addEventListener('dragover', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        window.addEventListener('dragover', (e)=>{this.preventDefaults(e);})
        //overlay.addEventListener('dragenter', (e)=>{this.preventDefaults(e);this.enabled(e, overlay);})
        overlay.addEventListener('dragenter', (e)=>{this.preventDefaults(e);})
        overlay.addEventListener('dragleave', (e)=>{this.preventDefaults(e);this.disabled(e, overlay);})
        overlay.addEventListener('drop', async(e)=>{this.preventDefaults(e);await this.handleDrop(e) })
        //for (let en of ['dragleave', 'drop']) {this._mask.addEventListener(en, (e)=>{this.preventDefaults(e);this.disabled(null,this.overlay)})}
        this._mask.addEventListener('dragleave', (e)=>{this.preventDefaults(e);this.disabled(e, overlay);})
        this._mask.addEventListener('drop', (e)=>{this.preventDefaults(e);this.disabled(e, overlay);})
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
        this.showMask()
        overlay.style.filter = 'opacity(1)';
        overlay.style.visibility = 'visible';
//        overlay.style.display = 'block';
    }
    disabled(e, overlay) {
        console.error(`disabled`)
//        this.target.style.filter = 'opacity(0)';
//        this.target.style.visibility = 'hidden';
//        this.overlay.style.filter = 'opacity(0)';
//        this.overlay.style.visibility = 'hidden';
        this.hideMask()
        overlay.style.filter = 'opacity(0)';
        overlay.style.visibility = 'hidden';
//        overlay.style.display = 'none';
    }
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
    async handleDrop(e) {
        console.log(`handleDrop`)
        console.log(e)
        console.log(e.dataTransfer.files[0].name)
        // Remove bellow 3 lines when included this code to your app
        alert('Complete uploading');
//        document.querySelector('#overlay').style.filter = 'opacity(0)';
//        document.querySelector('#overlay').style.visibility = 'hidden';
        this.disabled(null, document.querySelector('#overlay'))
    }
}

document.addEventListener('DOMContentLoaded', e => {
//    acceptDragDrop();
    const dnd = new DnD()
});


})()
