# Short Links

> [!NOTE]
> [Yusuke4869/URL-Shortener](https://github.com/Yusuke4869/URL-Shortener) に移行しました。

fastify と mongodb を使った短縮 URL

## 使い方

`.env` などを用いて環境変数を設定してください。

設定可能な環境変数は `.env.sample` を参照してください。

必須の環境変数は以下の通りです。

- `MONGODB_URI`: MongoDB の URI
- `TOKEN`: API へのアクセスを許可するトークン（ , 区切りで複数指定可能）

```sh
pnpm install
```

```sh
pnpm build
pnpm start
```

## License

MIT
