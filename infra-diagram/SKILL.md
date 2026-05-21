---
name: infra-diagram
description: AWSやGoogle Cloudなどのクラウドアーキテクチャ図をdraw.ioで作成する。クラウドサービス、クラウド内の境界、データフローや通信経路を表現する図を作るときに使用する。
---

## 共通仕様

- `drawio` の `open_drawio_xml` toolを使用する
- タイトル、コメントを付けない
- 矢印は図形検索から選択をする
- 線上にテキストを付けない

## 共通図形検索

```bash
tsx scripts/shape-catalog.ts list common
```

## プロバイダー仕様

- AWS: `references/aws/specification.md`