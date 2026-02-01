# Build Android (TWA)

Este diretório contém a configuração para gerar o aplicativo Android (APK/AAB) usando Bubblewrap.

## Pré-requisitos

1. **Node.js** (instalado)
2. **Bubblewrap CLI** (instalado via `npm install -g @bubblewrap/cli`)
3. **Java Development Kit (JDK)** (para o Android SDK)
4. **Android SDK** (será baixado pelo Bubblewrap se não existir)

## Arquivos

- `twa-manifest.json`: Configuração do aplicativo (Nome, Cores, URL).
- `android.keystore`: Chave de assinatura gerada automaticamente (Senha: `mecanica123`).

## Como Gerar o APK

1. Abra o terminal nesta pasta (`android`).
2. Execute o comando de build:
   ```powershell
   bubblewrap build --manifest twa-manifest.json
   ```
3. Na primeira execução, o Bubblewrap pedirá para aceitar licenças e configurar o caminho do JDK/Android SDK.
4. Após o build, o arquivo `.apk` (para teste) e `.aab` (para a Play Store) estarão na pasta.

## Importante

- Antes de gerar a versão final, **atualize o campo `host`** no arquivo `twa-manifest.json` com a URL real do seu deploy na Vercel (ex: `seu-app.vercel.app`).
- A URL deve ser HTTPS e ter o `assetlinks.json` configurado (o Bubblewrap ajuda nisso).
