# アイデア

　2024年現在のrubyタグは以下のような仕様である。

```html
<ruby>新<rt>あら</rt>垣<rt>がき</rt>結<rt>ゆ</rt>衣<rt>い</rt></ruby>
<ruby>新垣<rt>あらがき</rt>結衣<rt>ゆい</rt></ruby>
<ruby>新垣結衣<rt>あらがきゆい</rt></ruby>
```

　これは両面タグが使えない。そこで次のような旧仕様タグを使って両面タグを考案する。

```html
<ruby>
<rbc><rb>新</rb><rb>垣</rb><rb>結</rb><rb>衣</rb></rbc>
<rtc><rt>あら</rt><rt>がき</rt><rt>ゆ</rt><rt>い</rt></rtc>
<rtc><rt>ガ</rt><rt>ッ</rt><rt>キ</rt><rt>ー</rt></rtc>
</ruby>
```
```html
<ruby>
<rbc><rb>新垣</rb><rb>結衣</rb></rbc>
<rtc><rt>あらがき</rt><rt>ゆい</rt></rtc>
<rtc><rt>ガッ</rt><rt>キー</rt></rtc>
</ruby>
```
```html
<ruby>
<rbc><rb>新垣結衣</rb></rbc>
<rtc><rt>あらがきゆい</rt></rtc>
<rtc><rt>ガッキー</rt></rtc>
</ruby>
```

　しかしこれには表記ゆれが起こりうる。`rbc`がなく`rb`のみ等だ。これが`rtc`/`rt`でも起きる。あまりに面倒だ。

　そこで`data`属性を使うことにしてみる。

```html
<ruby data-rb="あらがきゆい">新垣結衣</ruby>
<ruby data-rb1="あらがきゆい">新垣結衣</ruby>
<ruby data-rb2="ガッキー">新垣結衣</ruby>
<ruby data-rb1="あらがきゆい" data-rb2="ガッキー">新垣結衣</ruby>
```

　これだとルビが二つあるとき冗長なので、次のようにする。

```html
<ruby data-rb="あらがきゆい">新垣結衣</ruby>
<ruby data-rb="｜ガッキー">新垣結衣</ruby>
<ruby data-rb="あらがきゆい｜ガッキー">新垣結衣</ruby>
```

　また、区切り単位は次のようにする。

```html
<ruby data-rb="あら,がき,ゆ,い">新垣結衣</ruby>
<ruby data-rb="|ガッキー">新垣結衣</ruby>
<ruby data-rb="あらがき,ゆい|ガッ,キー">新垣,結衣</ruby>
```

* ルビ字句区切り単位はカンマ`,`で示す
* ルビ前後区切り単位はパイプ`|`で示す
* 親文字にカンマがある場合＆ルビにカンマがある場合
* 親文字にカンマがある場合＆ルビにカンマがない場合
* 親文字にカンマがない場合＆ルビにカンマがある場合
* 親文字にカンマがない場合＆ルビにカンマがない場合

N|親文字|ルビ|ルビ子要素|例
-|------|----|----------|--
1|有|有|親と子で同じ数|`<ruby data-rb="あらがき,ゆい|ガッ,キー">新垣,結衣</ruby>`
2|有|無|ありえない（どの親にかかるルビか不明）|`<ruby data-rb="あらがきゆい|ガッキー">新垣,結衣</ruby>`
3|無|有|親文字と同じ数だけある|`<ruby data-rb="あら,がき,ゆ,い|ガ,ッ,キ,ー">新垣結衣</ruby>`
4|無|無|一つずつ|`<ruby data-rb="あらがきゆい|ガッキー">新垣結衣</ruby>`

* 不正パターン
    * 親にカンマがあり子にない→カンマを無視して一対一とする
    * 両方にカンマあるが数が異なる→カンマを無視して一対一とする


ルビ一つ
```html
<ruby>親<rt></rt>文<rt></rt>字<rt></rt><ruby>
```
ルビ二つ
```html
<ruby>
<rbc><rb></rb></rbc>
<rtc><rt></rt></rbt>
<rtc><rt></rt></rbt>
</ruby>
```

