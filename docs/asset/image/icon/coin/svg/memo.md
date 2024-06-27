# アイコン

1. [CryptoIcons][]から元画像を入手する
2. [IcoMoon][]でフォント化（ttf,woff）する
3. [WOFF→WOFF2][]でWOFF2に変換する
4. style.cssにWOFF2読込コードを追記する
5. index.htmlでstyle.cssを読み込む
6. `<i class="icon-mona"></i>`等で表示確認する

[CryptoIcons]:http://cryptoicons.co/
[IcoMoon]:https://icomoon.io/app/#/select
[WOFF→WOFF2]:https://www.luft.co.jp/cgi/woff-woff2.php

# バグ

　元画像は[CryptoIcons][]から入手し、これを[IcoMoon][]でフォント化したが、その過程でバグる。

　正常にフォント化された画像は次のように特定のキーワード`mona`と文字コード`ea57`が一対一で対応する。

```css
.icon-mona:before {
  content: "\ea57";
}
```

　なのでHTMLでは以下のようにするとアイコンを表示できる。


```html
<i class="icon-mona"></i>
```

　ところがアイコン画像に複数色使われていると、この構造が壊れる。というのも、[IcoMoon][]でフォント化する時、画像に複数色が使われていると、これを再現するために複数の文字コードを使って一つのアイコンを表示しようとする設計思想だから。たとえば以下のようになってしまう。

```css
.icon-eth .path1:before {
  content: "\e9e2";
  color: rgb(0, 0, 0);
}
.icon-eth .path2:before {
  content: "\e9e3";
  margin-left: -1em;
  color: rgb(0, 0, 0);
  opacity: 0.298;
}
.icon-eth .path3:before {
  content: "\e9e4";
  margin-left: -1em;
  color: rgb(0, 0, 0);
  opacity: 0.8010;
}
.icon-eth .path4:before {
  content: "\e9e5";
  margin-left: -1em;
  color: rgb(0, 0, 0);
  opacity: 0.298;
}
```

　こうなると`<i class="icon-eth"></i>`のように使えない。困る。そんな複数色を使ったアイコンが25個あった。そのIDは以下。

```
agi
aion
cix
cnx
drgn
dtr
ela
elix
emc2
etc
eth
ethos
hpb
ins
klown
maid
mod
mth
pink
rdd
ubq
unity
wings
wtc
zil
```

　特に`eth`は人気の暗号通貨なので何とかしたい。

　SVG画像を単色に編集して対応するのが最善。面倒だけど。

　この修正アイコンを`mono`ディレクトリに配置する。

[CryptoIcons]:http://cryptoicons.co/
[IcoMoon]:https://icomoon.io/app/#/select
