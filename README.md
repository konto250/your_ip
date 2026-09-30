# your_ip

アクセスしたクライアントの公開IPアドレスをプレーンテキストで返すVercel APIです。

`GET /` または `GET /api/ip` のレスポンス本文にはIPアドレスだけが入ります。IPv4とIPv6に対応しています。レスポンスはキャッシュされません。`HEAD` は本文なし、その他のメソッドは `405` です。Vercelがアクセス元IPを渡せない場合は `503` を返します。

本番URL: https://yourip-delta.vercel.app/

```sh
curl https://yourip-delta.vercel.app/
```

Vercelの `x-forwarded-for` ヘッダーを使用します。Vercel上では、このヘッダーはアクセス元の公開IPに上書きされます。Vercelの前に別のプロキシがある場合、表示されるIPはそのプロキシのものになる可能性があります。
