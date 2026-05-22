# AWSデザイン仕様

1. 使用したい図形を検索する
2. 図形のサイズ・配置を決定する
3. `assets/legend.xml`を参考にして凡例を右上に配置する(AWS Cloudから**30px**余白をとり配置する)
4. AWS構成図の検証を行う

## AWS図形検索

利用可能なAWS図形一覧を確認する:

```bash
tsx scripts/shape-catalog.ts list aws
```

特定のAWS図形のstyleを取得する:

```bash
tsx scripts/shape-catalog.ts style aws vpc
tsx scripts/shape-catalog.ts style aws elastic-load-balancing
```

## AWS構成図の検証

```bash
tsx scripts/aws-validate-diagram.ts path/to/diagram.xml
```
