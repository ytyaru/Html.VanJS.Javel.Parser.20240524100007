class ColorScheme {
    constructor() { this._bg = van.state('#000'); this.dark(); }
    get isLight() { return '#EEE'===this._bg.val }
    get isDark()  { return '#000'===this._bg.val }
    get name() { return ((this.isDark) ? '黒' : '白') }
    get nextName() { console.log(((this.isDark) ? '白' : '黒'));return ((this.isDark) ? '白' : '黒') }
    getNextName() { console.log(((this.isDark) ? '白' : '黒'));return ((this.isDark) ? '白' : '黒') }
    get lightColor() { return '#EEE' }
    get darkColor() { return '#000' }
//    get bg() { return Css.get('--background-color') }
//    get fg() { return Css.get('--color') }
    get reverseBg() { return (('#EEE'===Css.get('--background-color')) ? '#000' : '#EEE') }
    get reverseFg() { console.error(Css.get('--color'), Css.get('--background-color'));return (('#EEE'===Css.get('--color')) ? '#000' : '#EEE') }
    toggle() { ((this.isDark) ? this.light() : this.dark()) }
    light() {
        Css.set('--background-color', this._bg.val = '#EEE')
        Css.set('--color', '#000')
        Css.set('--a-color', '#260')
        Css.set('--selection-background-color', '#DD0')
        Css.set('--selection-color', '#000')
        Css.set('--caret-color', '#000')
        Css.set('--outline-color', '#E00')
        Css.set('--button-focus-background-color', '4E0')
        Css.set('--button-focus-color', '#000')
    }
    dark() {
        Css.set('--background-color', this._bg.val = '#000')
        Css.set('--color', '#EEE')
        Css.set('--a-color', '#4E0')
        Css.set('--selection-background-color', '#AA0')
        Css.set('--selection-color', '#000')
        Css.set('--caret-color', '#EEE')
        Css.set('--outline-color', '#A00')
        Css.set('--button-focus-background-color', '2C0')
        Css.set('--button-focus-color', '#111')
    }
}

