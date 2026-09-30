# your_ip

アクセスしたクライアントの公開IPアドレスを返すVercel APIです。

`GET /api/ip` のレスポンス本文にはIPアドレスと行末の改行だけが入ります。IPv4とIPv6に対応しています。Vercelがアクセス元IPを渡せない場合は `503` を返します。

ルートの `GET /` は使い方を表示します。`Accept` に `text/html` があるブラウザーにはCSS付きのHTMLを、その他のクライアントには簡潔なプレーンテキストを返します。
ブラウザー版のコマンド欄にあるコピーアイコンを押すと、表示されている `curl` コマンドをコピーできます。

どちらもレスポンスはキャッシュされません。`HEAD` は本文なし、その他のメソッドは `405` です。

本番URL: https://yourip-delta.vercel.app/

```sh
curl https://yourip-delta.vercel.app/api/ip
```

Vercelの `x-forwarded-for` ヘッダーを使用します。Vercel上では、このヘッダーはアクセス元の公開IPに上書きされます。Vercelの前に別のプロキシがある場合、表示されるIPはそのプロキシのものになる可能性があります。
