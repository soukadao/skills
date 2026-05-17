# AWSデザイン仕様

## 基本ルール

- AWS構成図では `AWS Cloud` 境界を原則として配置し、AWSサービスはその内側、ユーザー・GitHub・オンプレミス・外部SaaSなどはその外側に配置する
- ユーザーやPCなどの表現をする時は`aws-illustrations`から図形を検索する
- `AWS Cloud`、`Region`、`VPC`、`Subnet`、`Availability Zone`は**AWS Group**を使用する
- `AWS Cloud`の外に凡例が配置されるようにする(凡例の右端 + 30px <= AWS Cloudの左端)
- `AWS Cloud`、`Region`、`VPC`、`Subnet`などのAWS境界をまたぐ線は最小限にする
- AWSサービスアイコンのサイズは原則としてすべて `64 x 64` に統一する
- AWSサービスアイコンはラベルがアイコン下部に表示されるため、配置領域は `64 x 96` 以上として扱う
- AWSサービスをカテゴリ別のコンテナや小さな枠で表現する場合、コンテナのラベルはカテゴリ名、サービスアイコンのラベルはサービス名にする
- サービスアイコンへ線を接続する場合は、カテゴリコンテナやAWS Groupではなくサービスアイコン自体をsource/targetにする
- 外部アクター、AWSサービス、AWS Group、凡例はすべて10px単位の座標に揃える
- AWS Groupは `swimlane` ではなくタイトル領域を自動予約しないため、子要素はGroupの上端から最低 `50px` 下げて配置する
- AWS Group内の子要素は、Groupのタイトル文字・グループアイコン・境界線から最低 `30px` 離す
- AWS Groupを入れ子にする場合、内側Groupは外側Groupの上端から最低 `60px` 下げ、左右下に最低 `30px` の余白を取る
- AWS Groupの上部にはタイトル文字とグループアイコンの領域として最低 `50px` を確保し、その領域にはサービスアイコン、線、注釈テキストを配置しない
- AWS Group同士を隣接させる場合、外枠同士の間隔は最低 `30px`、タイトルやラベルが近接する場合は最低 `50px` 取る
- AWS Groupを横断する線は境界線やタイトル文字に沿わせず、境界から最低 `20px` 離して通す
- `fillColor` や `strokeColor` に明示色を使う場合は、可能な範囲で `light-dark()` または `adaptiveColors="auto"` を併用し、ダークモードでも線・文字・境界が読めるようにする

## 表示標準

- タイトルは図の左上に置き、本文領域から最低 `30px` 離す。必要であれば短いサブタイトルを添える
- フォントは原則として `Helvetica` を使用する
- タイトルは `30px` 太字、サブタイトルは `16px`、AWS Groupラベルは `12px`、サービスラベルは `10px`、注釈や線ラベルは `11px` を目安にする
- サービスカテゴリの色分けを使う場合は、以下を目安にする。ただし既存カタログのstyleを優先し、色だけを理由にstyleを手書きで作らない
  - Compute: `#ED7100`
  - Database: `#C925D1`
  - Storage: `#3F8624`
  - Networking / Analytics: `#8C4FFF`
  - App Integration: `#E7157B`
  - AI / ML: `#01A88D`
  - Security: `#DD344C`
  - General / Auxiliary: `#666666`
- 手順を説明する図では、番号バッジと凡例のステップ説明を組み合わせてよい。番号バッジは `28 x 28` を目安にし、主線・アイコン・ラベルと重ならない位置に置く
- API名、イベント名、処理名などが重要な場合だけ短い注釈を置く。プロトコル名だけの線ラベルは置かない
- 絵文字は使わない

## AWS図形検索

AWSサービス、AWS Group、AWS外のユーザー表現は `scripts/shape-catalog.ts` の `aws` カタログから検索して使用する。

利用可能なAWS図形一覧を確認する:

```bash
tsx scripts/shape-catalog.ts list aws
```

特定のAWS図形のstyleを取得する:

```bash
tsx scripts/shape-catalog.ts style aws vpc
tsx scripts/shape-catalog.ts style aws elastic-load-balancing
```

## 図種別の判定

- VPC、Subnet、Availability Zone、Internet Gateway、Load Balancerなどネットワーク境界が主題の場合は「ネットワーク構成図」として扱う
- CodePipeline、CodeBuild、CloudFormation、Lambda、承認、通知、ロールバックなど処理順序が主題の場合は「ワークフロー構成図」として扱う
- サービス間の依存関係やデータ連携が主題の場合は「アプリケーション構成図」として扱う
- 図種別ごとの配置ルールが衝突する場合は、主題にした図種別のルールを優先する

## ネットワーク構成図

- 複数のAvailability Zoneは、原則としてRegion内に横方向の列として並べる
- Availability ZoneはVPCの中に単純に入れ子にせず、Region内の列として表現し、VPCは複数Availability Zoneを横断する境界として配置する
- 各Availability Zone内では、Public Subnet、Private Subnet、Database Subnetの順に上から下へ配置する
- Subnetなど高さが小さいAWS Groupにサービスアイコンを置く場合、Groupの高さは `150px` 以上を目安にし、サービスラベルと境界線が重ならないようにする
- Internet GatewayはVPC境界上または境界付近に配置する
- Load BalancerはPublic Subnet層の中央に配置し、複数Availability Zoneへまたがるサービスとして表現する
- Load Balancerから各Availability Zone内のComputeへは、横方向の幹線を1本引き、各Computeへ縦方向に分岐する
- 同じ宛先種別へ複数本の線を直接引かず、水平の集約線と縦の分岐線で表現する
- ネットワーク構成図やアプリケーション構成図にCI/CD関連サービスを補助的に描く場合、CI/CD用のAWS Groupや囲み枠は作らない
- CI/CD関連サービスは `AWS Cloud` 内の下部または外周寄りの余白に、ラベル込みで境界内に収まるように並べる

## ワークフロー構成図

- ワークフロー構成図では、Availability ZoneやSubnetの縦横配置ルールを適用しない
- Regionは大きな縦長の境界として横方向に並べる
- Primary Regionを中央の主領域、Secondary Regionを右側の従領域として配置する
- GitHub、Users、外部通知などAWS外の要素はRegion外の左側に配置する
- 主処理は左から右へ流し、後続ステージや補助処理は上から下へ段を分けて配置する
- CI/CDの主処理線は凡例のCI/CD線に合わせて紫色にし、`common/ci-cd-arrow` を使用する
- `CI/CD` という名称だけの大きなAWS Groupや囲み枠は作らない
- CodePipelineなどの大きな処理単位は破線のGroupで囲む
- Pipeline内のstage、environment、rollback、approvalなどの論理単位も小さな破線Groupで囲む
- ステージ間の線はできるだけ水平にし、別段へ移る場合だけ垂直に折る
- 複数ステップをまたぐ長い線は外周寄りに逃がす
- CloudWatch EventsやEventBridgeは、rollback、notification、approvalなど関連する処理Group内に配置する
- ワークフロー構成図ではCloudWatchを監視集約先として扱わず、イベント発火元またはイベント制御として表現してよい

## 監視・ログ

- CloudWatchへの監視・ログ線は、各サービスから個別に多数引かず、既存のAWSサービスアイコン、代表サービスノード、または集約線にまとめてからCloudWatchへ1本で接続する
- CloudWatchは主通信経路から外した図の上端、下端、または右外周に配置し、監視・ログ線は破線で主通信経路より目立たないようにする
- CloudWatchへの線が複数必要な場合は、送信元ごとにCloudWatchへ直接接続せず、VPC・Subnet・サービス層ごとの代表線に集約して線の重なりを避ける
- 監視・ログの集約表現に、吹き出し、注釈、ラベルだけの中継図形、雲形、付箋風の図形を使用しない
- 集約用のノードが必要な場合は、CloudWatch Logs、EventBridge、Kinesis Data Firehoseなど実在するAWSサービスアイコンを使い、汎用的な説明図形は使わない

## AWS図の検証

- AWS図のdraw.io XMLを作成した後は、`scripts/aws-validate-diagram.ts` で検証する
- 検証前に、AWS Cloud境界があること、外部アクターがAWS Cloud外にあること、AWSサービスがAWS Cloud内にあること、主経路が一方向に読めることを目視で確認する
- 検証対象は、AWSサービスアイコン同士の重なり、AWS Cloudからのはみ出し、線がAWSサービスアイコンやラベル領域の上を通っていないこと、矢印や線同士が同じ経路上で重なっていないこと
- AWSサービスアイコンの重なり、AWS Cloud境界からのはみ出し、線とサービスアイコンの重なり、線同士の重なりは、この検証結果で判定する
- 検証に失敗した場合は、サービスアイコンの位置、AWS CloudやGroupのサイズ、線の経路を修正してから再検証する
- 検証スクリプトは未圧縮のdraw.io XML（`mxGraphModel`）を入力にする

```bash
tsx scripts/aws-validate-diagram.ts path/to/diagram.xml
```
