class ColorScheme {
    constructor() { this.bg = van.state('#000') }
    get isLight() { return '#EEE'===this.bg.val }
    get isDark()  { return '#000'===this.bg.val }
    get name() { return ((this.isDark) ? '黒' : '白') }
    get nextName() { console.log(((this.isDark) ? '白' : '黒'));return ((this.isDark) ? '白' : '黒') }
    getNextName() { console.log(((this.isDark) ? '白' : '黒'));return ((this.isDark) ? '白' : '黒') }
    toggle() { ((this.isDark) ? this.light() : this.dark()) }
    light() {
        Css.set('--background-color', this.bg.val = '#EEE')
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
        Css.set('--background-color', this.bg.val = '#000')
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

