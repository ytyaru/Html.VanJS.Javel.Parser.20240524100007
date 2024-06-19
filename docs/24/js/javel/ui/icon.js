class Icon {
    constructor() { this._color = van.state(Css.get(`--color`)) }
    get color( ) { return this._color.val }
    set color(v) { this._color.val = v }
       
    }
    get(id, isColor=false, size=64) {

    }
    use(id, size) { // use('sns-github')
        const {svg, use} = van.tags('http://www.w3.org/2000/svg')
        return ()=>svg(use({xlink:`#svg-icon-${id}`}))
    }
    #add() {
        const {svg, defs, symbol, use, path, circle} = van.tags('http://www.w3.org/2000/svg')
        return ()=> svg({xmlns:'http://www.w3.org/2000/svg', width:size.val, height:size.val, viewBox:`0 0 ${size.val} ${size.val}`},
            defs(
                symbol({id:`svg-icon-sns-github`, width:()=>size.val, height:()=>size.val, viewBox:()=>`0 0 ${size.val} ${size.val}`}
                    path({fill:()=>this._color.val, d:`M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.53-18.586L22.105 7l-2.797 4.414a14.096 14.096 0 00-6.617 0L9.902 7l-1.43 6.414C6.937 14.642 6 16.247 6 18.009c0 3.86 4.476 6.989 9.997 6.989s9.997-3.13 9.997-6.989c-.001-1.762-.93-3.367-2.465-4.595zM10.442 16.35h-.666l1.627-1.876h1.184l-2.145 1.876zm5.504 4.584l-2.766-4.872.683-.39.617 1.085h3.021l.644-1.09.676.402-2.875 4.865zm5.613-4.584l-2.146-1.876h1.192l1.625 1.876h-.671zm-5.6 3.015l1.075-1.82h-2.108l1.033 1.82z`}, ),
                ),
            ),
        )
/tmp/work/Html.VanJS.Javel.Parser.20240524100007/docs/asset/image/icon/sns/youtube.svg
/tmp/work/Html.VanJS.Javel.Parser.20240524100007/docs/asset/image/icon/sns/twitter.svg
/tmp/work/Html.VanJS.Javel.Parser.20240524100007/docs/asset/image/icon/sns/misskey.svg
/tmp/work/Html.VanJS.Javel.Parser.20240524100007/docs/asset/image/icon/sns/mastodon.svg
/tmp/work/Html.VanJS.Javel.Parser.20240524100007/docs/asset/image/icon/sns/github.svg

    van.jjj
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor"/>
</svg>
    }
}
