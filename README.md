# Diarium

MVP de aplicativo católico gratuito para oração diária, acompanhamento espiritual e preparação para confissão.

## O que já existe

- Tela Hoje com Evangelho, santo, oração do dia e atalhos de oração.
- Cabeçalho com dia, liturgia, cor própria e breve explicação da cor.
- Evangelho e oração coleta carregados pela API `https://liturgia.up.railway.app/v3/`.
- Cache local da liturgia para continuar mostrando a última liturgia salva se a API falhar.
- Versículos do Evangelho destacados visualmente.
- Santo do dia com múltiplos santos/beatos, imagem, link, destaque do dia e cache local.
- Terço do Dia com mistérios próprios, trilha de passos, contas e progresso local.
- Checklist diário salvo localmente no aparelho/navegador.
- Calendário litúrgico mensal com cor do dia e festas principais.
- Intenções de oração locais.
- Modo escuro nas configurações.
- Compartilhamento do Evangelho do dia pela Web Share API ou cópia para área de transferência.
- Exportação e importação de backup JSON sem servidor.
- Onboarding de primeira visita e chamada para instalação na tela inicial.
- Exame de consciência por 10 Mandamentos, pecados capitais e estado de vida.
- Notas privadas para confissão, sem nuvem.
- Manifest, ícones Apple/Android e service worker para instalação como PWA.

## Como abrir localmente

Por ser um app estático, basta servir a pasta com qualquer servidor local:

```powershell
python -m http.server 4173
```

Depois acesse:

```text
http://localhost:4173
```

Os dados ficam no `localStorage` do navegador.

## GitHub Pages

Publique a branch principal apontando para a raiz do repositório:

```text
Settings > Pages > Deploy from a branch > main > / (root)
```

O arquivo `.nojekyll` evita processamento desnecessário do GitHub Pages. Nenhuma variável de ambiente ou build command é necessária.

## Instalação no celular

### iPhone e iPad

1. Abra a URL publicada no Safari.
2. Toque em Compartilhar.
3. Escolha Adicionar à Tela de Início.
4. Confirme o nome Diarium.

O iOS usa `apple-touch-icon.png`, as metatags Apple e o modo `standalone` para abrir como app sem a barra do navegador.

### Android

1. Abra a URL publicada no Chrome.
2. Toque no banner Instalar, quando aparecer, ou no menu do Chrome.
3. Escolha Instalar app ou Adicionar à tela inicial.

O Android usa `manifest.webmanifest`, os ícones PNG e o service worker.

## IPA para iPhone

GitHub Pages publica um PWA, não gera IPA. Para testar como aplicativo iOS nativo, é preciso criar um wrapper nativo, por exemplo com Capacitor, apontando para a URL do GitHub Pages ou empacotando os arquivos web.

Um IPA não assinado pode ser produzido em um workflow com runner macOS ou no Xcode, mas ele não instala no iPhone sem assinatura válida. Como você tem conta Apple Developer, o caminho prático é assinar localmente no Xcode com seu certificado e provisioning profile.

Este repositório inclui o workflow manual `Build unsigned iOS IPA`. Ele cria um wrapper Capacitor temporário, aponta para a URL do GitHub Pages por padrão e publica o artifact `Diarium-unsigned-ipa`. Para instalar no iPhone, assine o app com sua conta Apple Developer antes da instalação.
