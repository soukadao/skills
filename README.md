# Skills

Codex やエージェントに特定の作業手順、判断基準、ツールの使い方を追加するためのスキル集です。

各スキルは独立したディレクトリとして管理され、中心になる `SKILL.md` に「いつ使うか」「どう進めるか」「どの成果を目指すか」を記述しています。必要に応じて `references/`、`scripts/`、`assets/` を含み、複雑な作業でも毎回同じ基準で実行できるようにします。

## What These Skills Do

このリポジトリのスキルは、エージェントが次のような作業をより安定して行うためのものです。

- 曖昧な依頼を整理し、必要な確認質問を作る
- 仕様、要件、受け入れ条件の不足や矛盾を見つける
- フロントエンド、アクセシビリティ、UI レイアウトを確認する
- テストシナリオ、負荷試験、セキュリティ検査を設計・実行する
- Cloudflare、R2、k6、Marp、draw.io など特定ツールの作業手順を再利用する
- リポジトリ調査、コミット、タスク分解など開発作業を標準化する
- 日常の計画、料理、学習、創作練習など個人用途の支援を行う

## What You Can Do

代表的には以下のような依頼に使えます。

- 「この仕様の曖昧な点を洗い出して」
- 「不明確なところがあれば質問してから進めて」
- 「このフロントエンドをデスクトップとモバイルで QA して」
- 「アクセシビリティ監査レポートを作って」
- 「この HAR から k6 スクリプトを作って」
- 「既存の k6 スクリプトで負荷試験を実行して」
- 「AWS 構成図を draw.io で作って」
- 「このリポジトリを把握して、変更前の実装方針をまとめて」
- 「複雑な作業を 1 時間以内のタスクに分解して」
- 「余っている食材で作れる料理を提案して」

## Skill List

| Skill | What It Does |
|---|---|
| `ask-clarifying-questions` | 曖昧な依頼に対して、作業前に確認すべき質問を作る。自由入力を優先しつつ、選択肢は仮説として提示する。 |
| `spec-ambiguity-finder` | 仕様、PRD、受け入れ条件、API 契約などの曖昧さ、不足、矛盾、テスト不能な点を洗い出す。 |
| `frontend-qa-checker` | フロントエンド実装をデスクトップ・モバイルで確認し、レイアウト崩れ、文字あふれ、操作不具合などを探す。 |
| `accessibility-auditor` | WCAG と WCAG-EM に沿って Web サイトやアプリのアクセシビリティを監査する。 |
| `ui-build-assistant` | Playwright で UI のスクリーンショットを取得し、DOM、余白、境界、レイアウトを確認する。 |
| `test-scenario-design` | 自然言語のテスト要望から、再利用しやすいテストシナリオや HAR 記録用 Playwright コードを作る。 |
| `test-oracle-designer` | 自動テストしづらい振る舞いに対して、合否判定基準、期待結果、不変条件、評価ルーブリックを設計する。 |
| `api-contract-reviewer` | OpenAPI や API 仕様をレビューし、契約の曖昧さ、破壊的変更、実装差分、テスト観点を洗い出す。 |
| `browser-to-k6-load-testing` | 既存 HAR や Playwright HAR 記録仕様から、保守しやすい k6 スクリプトへ変換する。 |
| `k6-load-testing` | 既存 k6 スクリプトを実行・調整し、結果や失敗原因をまとめる。 |
| `nuclei-security-testing` | HTTP リクエストや API 情報から Nuclei テンプレートを作成・実行し、結果を分析する。 |
| `repo-onboarding` | 未知のリポジトリを素早く調査し、構造、重要ファイル、セットアップ、テスト方法を把握する。 |
| `task-decomposer` | 複雑または曖昧な作業を、1-60 分で完了できる観測可能なタスクに分解する。 |
| `critical-thinking-reviewer` | 提案、計画、分析、判断を批判的に確認し、弱い前提、証拠不足、反例、代替案、失敗モードを洗い出す。 |
| `commit-message` | 関連変更を適切にまとめ、lowercase conventional prefix のコミットメッセージを作る。 |
| `test-commit-revert` | Test && Commit || Revert の流れで、小さく検証済みの実装を進める。 |
| `create-marp-slides` | Marp / Markdown スライドを作成・修正・レンダリング・視覚確認する。 |
| `infra-diagram` | AWS や Google Cloud などのクラウド構成図を draw.io で作る。 |
| `deploy-cloudflare-temporarily` | Wrangler の一時 Cloudflare デプロイを使って、ログインなしの公開プレビューを作る。 |
| `r2up` | r2up CLI で Cloudflare R2 のバケット一覧、作成、アップロードを行う。 |
| `glossary-builder` | 業務用語集、データ項目辞書、セマンティックレイヤー用語表を作成する。 |
| `database-modeling` | 業務データを Resource / Event に分類し、正規化されたデータベースモデルを作る。 |
| `hidden-unicode-scanner` | 不可視 Unicode、制御文字、ゼロ幅文字、Trojan Source 系の疑わしい文字を検出する。 |
| `art-imitation-practice` | 個人向けの絵の模写練習、観察課題、オリジナル参考画像プロンプトを作る。 |
| `suggest-recipes` | 手元の食材を優先して、家庭で作りやすい料理、レシピ、完成イメージを提案する。 |
| `micro-adventure-planner` | 低コストで気分転換できる小さな外出、寄り道、日常の冒険を計画する。 |
| `mbti-action-advisor` | MBTI タイプから、日常行動、学習、仕事、環境選びの実践的な助言を行う。 |

## Skill Structure

基本構成は次の通りです。

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── scripts/
└── assets/
```

- `SKILL.md`: スキルの説明と実行手順。
- `agents/openai.yaml`: UI 表示用の名前、短い説明、デフォルトプロンプト。
- `references/`: 必要な時だけ読む詳細資料。
- `scripts/`: 再利用可能な実行スクリプト。
- `assets/`: 出力物に使うテンプレート、画像、設定ファイルなど。

## Adding A Skill

新しいスキルはこのリポジトリ直下にディレクトリとして作成します。

作成後、必要に応じて `.agents/skills/<skill-name>` からスキルディレクトリへシンボリックリンクを追加します。

```bash
ln -s ../../<skill-name> .agents/skills/<skill-name>
```

既存リンクがある場合は、上書きせず、先にリンク先を確認してください。
