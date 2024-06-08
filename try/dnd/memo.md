# Window全体にDnDできなかった

## 情報源

　Window全体にDnDした時にオーバーレイ表示したい。

* https://autovice.jp/articles/159

　だが一瞬表示されたあとすぐ消えてしまう。上記URLのCodePenでは動作するが、ローカルで同じHTMLファイルを作ったら表示されない。デバッグモードを起動してDnDすれば一瞬表示されるが、すぐ消える。

* https://qiita.com/yaegaki/items/b7ea40490b06bd4f8e4f
* https://kazuki-nagasawa.hatenablog.com/entry/memo_20150319_d3

　すぐ消える原因は`dragenter`の直後になぜか`dragleave`まで実行されてしまうかららしい。それを回避するためにマスク要素を作ればいいようだが、実装しても同じくすぐ消えるか表示されない。色々変えて試したがダメ。

## 結論

　もうWindow全体もオーバーレイも諦める。

　TextareaにDnDしたらファイルを読み込む。それだけでいい。

https://gorogoronyan.web.fc2.com/htmlsample/src/TestJS_dnd_text_file01.html

