class DragAndDrop {
    constructor() {
        console.error(`constructor`)
        this._id = 'dnd-overlay'
        this._msg = van.state(`Drop CSV file here`) // message on overlay 
        this.acceptDragDrop()
    }
    get overlay() { return document.querySelector(`#${this._id}`) }
    #preventDefaults (e) {
        console.error(`#preventDefaults`)
        e.preventDefault();
        e.stopPropagation();
    }
    enabled(e) {
        console.error(`enabled`)
        const overlay = this.overlay
        console.error(overlay)
        Css.set('filter', 'opacity(1)', overlay);
        Css.set('visibility', 'visible', overlay);
    }
    #enabled(e) {
        console.error(`#enabled`)
        const overlay = this.overlay
        console.error(overlay)
        Css.set('filter', 'opacity(1)', overlay);
        Css.set('visibility', 'visible', overlay);
    }
    #disabled(e) {
        console.error(`#disabled`)
        const overlay = this.overlay
        console.error(overlay)
        Css.set('filter', 'opacity(0)', overlay);
        Css.set('visibility', 'hidden', overlay);
    }
    #setErrorMessage(message) {
        console.error(`#setErrorMessage`)
        const messages = document.createElement('p');
        messages.id = 'error';
        messages.textContent = message;

        const importFile = document.querySelector('#form');
        if (importFile.lastChild) {
            importFile.lastChild.remove();
        }
        importFile.appendChild(messages);
    }
    #getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    async #handleDrop(e) {
        console.error('D&DDDDDDDDDDDDDDDDDDDDD')
        await DropFile.readFile(e, textarea, htmlViewer) 
        // Remove bellow 3 lines when included this code to your app
        alert('Complete uploading');
        this.#disabled()
        //const overlay = this.overlay
        //document.querySelector('#overlay').style.filter = 'opacity(0)';
        //document.querySelector('#overlay').style.visibility = 'hidden';
    }
    acceptDragDrop() {
        if (this.overlay) { console.error('EEEEEEEEEEEE'); return }
        else {
            document.body.prepend(van.tags.div({id:this._id, style:`display:flex;justify-content:center;align-items:center;position:fixed;z-index:32;top:0;left:0;width:100vw;height:100vh;filter:opacity(0);visibility:hidden;color:#fff;font-size:1rem;background-color:rgba(#000,.75);transition:.25s;`}, this._msg))
            const overlay = this.overlay
            console.log(overlay)
            for (let en of ['dragenter', 'dragover', 'dragleave', 'drop']) {overlay.addEventListener(en, this.#preventDefaults, false)}
            //window.addEventListener('dragenter', { handleEvent: this.#enabled.apply(this), target: overlay });
            window.addEventListener('dragenter', { handleEvent: this.enabled.apply(this), target: overlay });
            overlay.addEventListener('dragleave', { handleEvent: this.#disabled.apply(this), target: overlay });
            //overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
            overlay.addEventListener('drop', async(e)=>{await this.#handleDrop(e)});
            console.error('FFFFFFFFFFFFFFFFFFFFFFF')
        }
    }
}

