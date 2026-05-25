---
name: hidden-unicode-scanner
description: ソースコードやテキストファイルに含まれる不可視・制御・疑わしいUnicode文字を検出する。Trojan Source、GlassWorm、ゼロ幅文字、Unicode tag、variation selectorの検査が必要な時に使用する
---

## 実行方法

```bash
python3 scripts/hidden_unicode_scanner.py <path>
```

## 使用例

```bash
python3 scripts/hidden_unicode_scanner.py .
python3 scripts/hidden_unicode_scanner.py src tests
python3 scripts/hidden_unicode_scanner.py $(git diff --relative --name-only --diff-filter=ACMR)
python3 scripts/hidden_unicode_scanner.py $(git diff --cached --relative --name-only --diff-filter=ACMR)
```

## 検出範囲

- Trojan Sourceのbidi制御文字
- GlassWormで使われる `U+FE00..U+FE0F` と `U+E0100..U+E01EF`
- Unicode tag文字 `U+E0001` と `U+E0020..U+E007F`
- ゼロ幅文字、BOM/ZWNBSP、soft hyphen、Hangul filler
- Unicode category `Cf`
- タブ、LF、CRを除くUnicode category `Cc`
