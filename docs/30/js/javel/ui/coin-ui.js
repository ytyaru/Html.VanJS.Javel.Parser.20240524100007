class CoinUi {
    constructor(state) { // manuscript.head.author.coin
        this._coin = state
        this._address = van.state('')
    }
    make() {
        console.error(this._coin.val)
        //return [...[...Object.entries(this._coin)].filter(([k,v])=>v.val).map(([k,v])=>this.#makeIcon(k, v.val)), this.#makeAddress()]
        return [...[...Object.entries(this._coin.val)].filter(([k,v])=>v.val).map(([k,v])=>this.#makeIcon(k, v.val)), this.#makeDeleteAddress(), this.#makeAddress()]
        //return [this.#makeIcon('mona', this._coin.mona.val), this.#makeAddress()]
    }
    #makeIcon(id, address) {
        return van.tags.button(
        //return van.tags.span(
            {
                tabindex:0, 'data-crypto-id':id,
                //style:()=>`width:3rem;height:3rem;padding:0;margin:0;`,
                onclick:(e)=>{
                    console.log(id)
                    console.log(address)
                    this._address.val = address
                    //document.querySelector('#crypto-address').value = address
                    //this.#writeClipboard(address)
                    this.#writeClipboard()
                    if ('mona'===id) { this.#sendFromMpurse(address) }
                },
            },
            //van.tags.i({class:`icon-${id}`, style:()=>`width:2rem;height:2rem;`})
            //van.tags.i({class:`icon-${id}`, style:()=>`width:2em;height:2em;`})
            van.tags.i({class:`icon-${id}`, style:()=>`font-size:2rem;`})
        )
    }
    //await #sendFromMpurse(address, value=0.114114) {
    #sendFromMpurse(address, value=0.114114) {
        if ('mpurse' in window) {
            /*
            const txHash = await window.mpurse.sendAsset(
                address,
                'MONA', 
                value,  // 0.114114
                'plain',
                ''
            );
            console.log(txHash)
            */
            window.mpurse.sendAsset(
                address,
                'MONA', 
                value,  // 0.114114
                'plain',
                ''
            ).then(()=>{
                console.log('送金成功：', txHash)
            },
            (e)=>{
                console.error('送金失敗：', e)
            })

        }
    }
    #makeAddress() {
    //#makeAddress(address) {
        /*
        return van.tags.p({id:`crypto-address`, readonly:true, contenteditable:true, value:()=>address,
            onfocus:(e)=>{
                this.#writeClipboard(address)
            },
        }, ()=>address)
        */
        /*
        return van.tags.p({id:`crypto-address`, readonly:true, disabled:true, contenteditable:true,
            onfocus:(e)=>{
                //this.#writeClipboard(address)
                this.#writeClipboard()
            },
        }, ()=>this._address.val)
        */
        if (0===Object.entries(this._coin.val).filter(([k,v])=>v.val).length) { return null }
        return van.tags.span({id:`crypto-address`, style:`font-size:12px;font-family:var(--font-family-mono);letter-spacing:0;line-height:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`}, ()=>this._address.val)
    }
    /*
    #makeAddress(address) {
        return van.tags.input({id:`crypto-address`, value:address, readonly:true,
            onfocus:(e)=>{
                this.#writeClipboard(address)
            },
        })
    }
    #writeClipboard(text) {
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log("Success!");
                },
                () => {
                   console.log("Ops, something went wrong...");
                });
        }
    }
    */
    #writeClipboard() {
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(this._address.val)
                .then(() => {
                    console.log("Success!");
                },
                () => {
                   console.log("Ops, something went wrong...");
                });
        }
    }
    #makeDeleteAddress() {
        if (0===Object.entries(this._coin.val).filter(([k,v])=>v.val).length) { return null }
        return van.tags.button({
            onclick:()=>{
                this._address.val = ''
            }
        }, '×')
    }
}
