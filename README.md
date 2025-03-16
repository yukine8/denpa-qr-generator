## 電波人間用QRコードランダム生成ツール
ページ: [https://yukine8.github.io/denpa-qr-generator](https://yukine8.github.io/denpa-qr-generator)
長さが126のランダムな文字列をQRコードに変換するツールです
文字列の長さを127以上にすると、iOSとAndroidで出現する電波人間が異なります

### 使い方
-   **QRコードの再生成**: EnterキーまたはSpaceキーを押すと、新しいQRコードが生成されます
-   **画像の保存**: Sキーを押すと、表示されているQRコードの画像を保存できます
-   **履歴の表示**: 右側の履歴リストから文字列をクリックすると、対応するQRコードが表示されます

### その他
- 左側に表示される体格テーブルは、[https://kokorogu.com/new-denpa-11](https://kokorogu.com/new-denpa-11) を参考にしています
-   スマートフォンにも対応しています
-   良い電波人間が出たら、ぜひTwitterやDiscordでシェアしてください

### 貢献
バグ報告や機能追加のリクエストは、GitHubのIssue、Pull Request、Twitterでも受け付けています

### ライセンス
MITライセンス

### 使用ライブラリ
[nayuki/QR-Code-generator](https://github.com/nayuki/QR-Code-generator)を使用してQRコードを生成しています