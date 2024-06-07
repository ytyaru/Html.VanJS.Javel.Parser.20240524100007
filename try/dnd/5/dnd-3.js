(function(){
/*
function preventDefaults (e) {
  console.log(`preventDefaults`)
  e.preventDefault();
  e.stopPropagation();
}

function enabled (e) {
  console.log(`enabled`)
  console.log(this)
  console.log(this.overlay)
  console.log(this.target)
  this.target.style.filter = 'opacity(1)';
  this.target.style.visibility = 'visible';
//  this.target.style.display = 'block';
}

function disabled (e) {
  console.log(`disabled`)
  this.target.style.filter = 'opacity(0)';
  this.target.style.visibility = 'hidden';
//  this.target.style.display = 'none';
}

function setErrorMessage (message) {
  console.log(`setErrorMessage`)
  let messages = document.createElement('p');
  messages.id = 'error';
  messages.textContent = message;

  const importFile = document.querySelector('#form');
  if (importFile.lastChild) {
    importFile.lastChild.remove();
  }
  importFile.appendChild(messages);
}

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

async function handleDrop (e) {
  console.log(`handleDrop`)
  console.log(e)
  console.log(e.dataTransfer.files[0].name)
  // Remove bellow 3 lines when included this code to your app
  alert('Complete uploading');
  document.querySelector('#overlay').style.filter = 'opacity(0)';
  document.querySelector('#overlay').style.visibility = 'hidden';
}
const acceptDragDrop = () => {
  const overlay = document.querySelector('#overlay');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    overlay.addEventListener(eventName, preventDefaults, false);
  });  

  window.addEventListener('dragenter', { handleEvent: enabled, target: overlay });
  overlay.addEventListener('dragleave', { handleEvent: disabled, target: overlay });
  //overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
  overlay.addEventListener('drop', async(e)=>{ await handleDrop(e) });
}
*/
class DnD {
    constructor() {
//        this._display = van.state('block') // block/none
        this._filter = van.state('opacity(0)') // opacity(0)/opacity(1)
        this._visibility = van.state('hidden') // hidden/visible
        //this._mask = van.tags.div({id:`overlay-mask`,style:()=>`filter:${this._filter.val};visibility:${this._visibility};position:'fixed',top:0,left:0,width:'100%',height:'100%',opacity:0,display:'none','z-index':9999`})
        this._mask = van.tags.div({id:`overlay-mask`,style:()=>`filter:${this._filter.val};visibility:${this._visibility};position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;display:none;z-index:9999;`})
        van.add(document.body, this._mask)
        this.overlay.insertAdjacentElement('afterend', this._mask)
        //this._mask = van.tags.div({style:()=>`display:${this._display.val};position:'fixed',top:0,left:0,width:'100%',height:'100%',opacity:0,display:'none','z-index':9999`},
        this.setup()
    }
    get overlay() { return document.querySelector('#overlay') }
    setup() {
        const overlay = document.querySelector('#overlay');
        console.log(overlay)
        //['dragenter', 'dragover', 'dragleave', 'drop'].forEach(en=>overlay.addEventListener(en, this.preventDefaults.apply(this), false))
        //['dragenter', 'dragover', 'dragleave', 'drop'].forEach(en=>overlay.addEventListener(en, this.preventDefaults, false))
        //['dragenter', 'dragover', 'dragleave', 'drop'].forEach(en=>{console.log(en, overlay);overlay.addEventListener(en, this.preventDefaults, false)})
        //['dragenter', 'dragover', 'dragleave', 'drop'].forEach(en=>{console.log(en, overlay);overlay.addEventListener(en, this.preventDefaults, false)})
        for (let en of ['dragenter', 'dragover', 'dragleave', 'drop']) {overlay.addEventListener(en, this.preventDefaults, false)}
//        window.addEventListener('dragenter', { handleEvent: this.enabled, target: overlay });
//        overlay.addEventListener('dragleave', { handleEvent: this.disabled, target: overlay });
        //overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
//        overlay.addEventListener('drop', async(e)=>{ await this.handleDrop(e) });
        window.addEventListener('dragenter', (e)=>this.enabled(e, overlay));
        overlay.addEventListener('dragleave', (e)=>this.disabled(e, overlay));
        //overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
        overlay.addEventListener('drop', async(e)=>{ await this.handleDrop(e) });

        for (let en of ['dragleave', 'drop']) {this._mask.addEventListener(en, (e)=>{e.stopPropagation();e.preventDefault();this.hideMask();this.disabled(null,this.overlay)})}
//        this._mask.addEventListener('dragleave', (e)=>{e.stopPropagation();e.preventDefault();this._display.val='none';this.disabled(null,this.overlay)})
//        this._mask.addEventListener('drop', (e)=>{e.stopPropagation();e.preventDefault();this._display.val='none';this.disabled(null,this.overlay)})
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
        console.log(`disabled`)
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
        console.log('hideMask')
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
