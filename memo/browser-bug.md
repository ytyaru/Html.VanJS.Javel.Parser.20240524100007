# ブラウザによる不具合

## 実行環境

項目|値
----|--
マシン|Raspberry Pi 4B (4GB)
ブラウザ|Chromium 92.0.4515.98（Official Build）Built on Raspbian , running on Raspbian 10 （32 ビット）

## 不具合一覧

1. ファイルをダウンロードするとフォーカスが奪われキーボード操作できなくなる

### 1. ファイルをダウンロードするとフォーカスが奪われキーボード操作できなくなる

　対象ブラウザ(Chromium 92)で実行すると表題の問題が起きる。ただし最近のブラウザはUIが変更されて解決または別の解消方法が必要になる。

1. 対象ブラウザでファイルをダウンロードする
2. 画面下部にダウンロードシェルフが表示される
3. 2にフォーカスを奪われキー操作できなくなる

　これを解決するためには次の二通りある。

* Chromeのバージョンを102以降にする[※][「Google Chrome」のダウンロードUIが一新、邪魔にならず操作性が向上]
* ダウンロードシェルフを消す拡張機能をインストールする[AutoHideDownloadsBar][]

[「Google Chrome」のダウンロードUIが一新、邪魔にならず操作性が向上]:https://forest.watch.impress.co.jp/docs/news/1521612.html
[AutoHideDownloadsBar]:https://chromewebstore.google.com/detail/autohidedownloadsbar/gkmndgjgpolmikgnipipfekglbbgjcel
[Chrome拡張機能のソースコードを見る方法]:https://nullnull.dev/f1df8b70-fac8-4d43-8cc4-2cd9af80f6e0
[crxviewer]:https://robwu.nl/crxviewer/
[crxviewer example]:https://robwu.nl/crxviewer/?crx=https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2Fautohidedownloadsbar%2Fgkmndgjgpolmikgnipipfekglbbgjcel
[手動でのChrom機能拡張インストール]:https://note.com/id_helpdesk/n/naa2ca000c3e5

　システム更新したくない。ラズパイなどLinuxマシンはシステム更新するとクラッシュして起動しなくなることがよくあるため、怖くて更新できない。セキュリティ不安もあるが、とにかく更新してはクラッシュを何度も経験しているので更新したくない。

　拡張機能のインストールを試みる。しかしラズパイのChromiumバージョンが古くてインストールできない。Googleストアが入手を妨害してくる。インストールしたい拡張機能[AutoHideDownloadsBar][]のページを開くと”このアイテムを Chrome に追加するには、ブラウザを更新してください”と怒られ、”Chromeに追加”ボタンがグレーアウトされてインストールできない……。クソが。

　私は考えた。Googleストアを介さず、拡張機能のソースコードを入手して、ブラウザ経由でコードをインストールすればいいのでは？

　まずは拡張機能のソースコードを入手する。

* [Chrome拡張機能のソースコードを見る方法][]
* [crxviewer][]
    * [crxviewer example][]

1. [crxviewer][]にアクセスする
1. 1のUIに欲しい拡張機能のGoogleストアURLを入力する([AutoHideDownloadsBar][])
1. `Open this viewer`ボタンを押す
1. `Download`リンクを押す
1. zipファイルがダウンロードできる（拡張機能ソースコード）

　次に拡張機能をソースコードからインストールする。（[手動でのChrom機能拡張インストール][]）

1. zipファイルの名前で新しいフォルダを作る
1. zipファイルをそのフォルダ内で展開する
1. Chromiumの右上にあるメニューボタン`︙`＞`その他のツール`＞`拡張機能`を押す
1. 拡張機能ページが開くので、右上の`デベロッパモード`のトグルをオンにする
1. 左上に`パッケージ化されていない拡張機能を読み込む`ボタンが表示されるので押す
1. フォルダ選択ダイアログが開くので、1のフォルダを選ぶ
1. 拡張機能がインストールされる

　以降はデベロッパモードをオフにしてもよい。

　これでファイルをダウンロードしたとき、ダウンロードシェルフが表示されなくなった。

