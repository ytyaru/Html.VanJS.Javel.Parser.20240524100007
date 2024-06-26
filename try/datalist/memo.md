# `<datalist>`の背景色をCSSでセットできない問題

　ライト／ダークモードに合わせて次のようにセットしたかった。のに`<datalist>`だけ背景白固定でCSSで`backgorund-color`セットできず……。

　標準HTML/CSSはフォームに対して多くの不備がある。そのうちの一つがこれ。しかも矢印キーでスクロールできない。カーソルだけは移動しているようだが、スクロールされないため、何が選択されているか見えない……。

```css
:root {
  --fg-color:white;
  --bg-color:black;
}
body, input,datalist {
  color: var(--fg-color);
  background-color: var(--bg-color);
}
```
```html
<input type="text" id="product" name="product" list="mylist">
<datalist id="mylist">
  <option value="a">A</option>
  <option value="b">B</option>
  <option value="c">C</option>
</datalist>
```

* [フォームコントロール向けの CSS プロパティの互換性一覧表][]
* [ウェブフォームへのスタイル設定][]

[ウェブフォームへのスタイル設定]:https://developer.mozilla.org/ja/docs/Learn/Forms/Styling_web_forms
[フォームコントロール向けの CSS プロパティの互換性一覧表]:https://developer.mozilla.org/ja/docs/Learn/Forms/Property_compatibility_table_for_form_controls

* https://stackoverflow.com/questions/13693482/is-there-a-way-to-apply-a-css-style-on-html5-datalist-options
