# ソースコード解析

1. コード最下端で読込後ルビ作成実行（`ruby_enabler.execute`）
2. `execute()`でOS,ブラウザ,バージョンごとに実行関数振り分け

## 関数一覧

　`ruby_enabler`オブジェクトの関数一覧。

* `execute`
* `seekNode`
* `dsRuby_detect`
* `dsRuby_detect_ie`
* `dsRuby_detector`
* `measure`
* `measure_s6`
* `measure_ie`
* `getTop`
* `createSS`
* `createSS_moz`
* `createSS_moz_old`
* `createSS_ie`
* `_ds`
* `_ds_moz`
* `loose`
* `loose_ie`
* `strict`
* `strict_ie`
* `getByTag`
* `newEle`
* `getChild`
* `getById`


`dsRuby_detect()`|実行関数|条件|例|意味
-----------------|--------|----|--|----
`_ds`|`_ds()`|`<rtc>`なし／`<rtc>`1個＆`<rt>`なし|`<ruby></ruby>`,`<ruby><rtc></rtc></ruby>`|一つルビがある
`ds_loose`|`loose()`|`<rtc>`1個＆`<rt>`1個以上|`<ruby><rtc></rtc><rt></rt></ruby>`|？
`ds_strict`|`strict()`|`<rtc>`2個＆`<rt>`なし|`<ruby><rtc></rtc><rtc></rtc></ruby>`|二つルビがある


`_ds()`
```
<ruby><rbc>親文字</rbc><rtc>...</rtc></ruby>
<ruby><rbc><rb>親文字</rb></rbc><rtc>...</rtc></ruby>
```

* 親文字
    * `<rbc>...</rbc>`
    * `<rbc><rb>...</rb></rbc>`


```html
<ruby data-rt="おやもじ">親文字</ruby>
<ruby data-rt="おや|も|じ">親文字</ruby>
<ruby data-rt1="おや|も|じ" data-rt2="ベ|ー|ス">親文字</ruby>
```

# 対象OS

* IE/Opera
* Webkit
* Mozilla

