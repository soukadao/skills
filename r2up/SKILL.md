---
name: r2up
description: Cloudflare R2 Storageをr2up CLIで操作する。R2バケットの一覧取得、バケット作成、ファイルアップロードが必要な時に使用する
---

# r2up

Cloudflare R2 Storageを操作するためのCLI `r2up` を使うSkill。

## 共通仕様

- `r2up --help` で利用可能なコマンドを確認してから実行する
- サブコマンドの詳細は `r2up help <command>` で確認する
- 実行結果は要点だけをユーザーに伝える
- Cloudflare認証や設定不足で失敗した場合は、CLIのエラー内容をそのまま伝える
- `r2up` に存在しない操作は実行できないことを伝える

## 対応操作

- バケット一覧取得: `references/get-buckets.md`
- バケット作成: `references/create-bucket.md`
- ファイルアップロード: `references/upload-object.md`

## 注意点

- `r2up` はR2バケット削除やファイル削除には使えない
