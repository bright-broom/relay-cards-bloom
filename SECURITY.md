# Security Policy

## 対象

現時点では `main` の最新 Revision だけをサポート対象とします。このプロジェクトは合成データ専用のプロトタイプであり、認証、認可、OCR、Database、CRM、実データ保管は未接続です。

## 非公開での報告

脆弱性や個人情報・Secret の混入を発見した場合は、公開 Issue や Pull Request に詳細を書かないでください。GitHub の **Security** タブから **Report a vulnerability** を使用し、次の情報を非公開で共有してください。

- 影響する URL、機能、Revision
- 再現条件と最小の再現手順
- 想定される影響
- 既知の回避策

実在人物の情報、顧客データ、Credential は再現材料に含めず、合成データへ置き換えてください。非公開報告機能が利用できない場合は、Repository owner に別の安全な連絡経路を確認してください。

## 対応方針

報告受領後に、影響範囲、悪用可能性、修正と回帰テスト、Credential の失効要否を確認します。修正済み Revision の検証が完了するまで、公開や Deploy の完了とは扱いません。
