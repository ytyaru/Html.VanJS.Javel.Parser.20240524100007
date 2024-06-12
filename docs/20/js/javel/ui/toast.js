class Toast {
    constructor(colorScheme) {
        this._toast = new PopToast();
    }
    get defaultOptions() { return {
        type: 'success',
        position: 'top-right',
        style:{
            backgroundColor: window.ColorScheme.reverseBg,
            color: window.ColorScheme.reverseFg,
            fontFamily: ['Noto Sans JP', 'Source Han Sans JP', 'Noto Color Emoji', 'sans-serif'],
        },
    }}
    show(msg, options={}) {
        const op = {...options, ...this.defaultOptions}
        this._toast.show(msg, op)
    }
}
