# PortalMix

Cadastro de clientes do supermercado **PortalMix**: redesenho acessível de uma tela de cadastro, usando **Next.js App Router, React, TypeScript, Tailwind CSS e GSAP**. Interface em português, responsiva e orientada pelas 10 heurísticas de Nielsen.

O `index.html` original permanece intacto na raiz. A nova aplicação está em `src/`, no mesmo diretório de projeto.

## Figma

[Abrir as 18 telas editáveis do supermercado PortalMix](https://www.figma.com/design/803LT0m1jCqBr1uFxHYHJH?node-id=5-163). O arquivo contém versões desktop e celular, componentes reutilizáveis e navegação de protótipo. Detalhes em [docs/figma/README.md](docs/figma/README.md).

## Executar localmente

Requer Node.js 22.13 ou superior e npm.

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. O HTML anterior continua disponível abrindo `index.html` diretamente no navegador; ele não é a página inicial do Next.js.

## Verificar

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

Os testes de validação usam o executor nativo do Node.js e podem ser executados sem instalar dependências. `npm start` exige um build concluído. O primeiro `npm install` gera `package-lock.json`; inclua esse arquivo no versionamento para instalações reproduzíveis.

## Implantar na Vercel

1. Envie este diretório para seu repositório GitHub.
2. Na Vercel, escolha **Add New → Project** e importe o repositório.
3. Use **Next.js** como framework e `.` como diretório raiz.
4. Mantenha os comandos padrão: instalação `npm install`, build `npm run build` e diretório de saída automático.
5. Selecione Node.js 24.x e faça o deploy.

Não são necessárias variáveis de ambiente ou banco de dados. A publicação não foi realizada nesta sessão.

## Estrutura

- `src/app/`: página, layout, metadados, ícone e estilos com Tailwind.
- `src/components/cadastro.tsx`: formulário, revisão, confirmação e ajuda.
- `src/components/icon.tsx`: ícones SVG consistentes.
- `src/lib/cadastro.ts`: validação compartilhada e opções do formulário.
- `tests/cadastro.test.ts`: campos obrigatórios, e-mail, limites, datas e preferências de compra.
- `docs/heuristicas.md`: correspondência entre o novo fluxo e Nielsen.

## Comportamento e privacidade

O cadastro é uma **simulação acadêmica**, com dados mantidos apenas no estado da página. Não cria contas, não envia e-mails e não salva dados em cookies ou armazenamento local. Recarregar, sair ou reiniciar descarta o preenchimento. A opção de receber novidades também é demonstrativa.

As animações GSAP respeitam `prefers-reduced-motion`. Os diálogos usam `<dialog>` nativo; Tab navega entre controles e Escape fecha a janela.

## Situação da verificação no ambiente de criação

A instalação npm foi bloqueada pela rede do ambiente (`EACCES`). Assim, os testes de domínio podem ser executados, mas build, lint, checagem de tipos e teste real no navegador dependem de uma instalação bem-sucedida. Não há alegação de build ou deploy verificado.

Referências: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Tailwind com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
