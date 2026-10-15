# PortalMix — redesenho do cadastro

## Escopo aprovado

Criar o novo cadastro com Next.js App Router, TypeScript, Tailwind e GSAP na raiz do projeto. Preservar `index.html` e `AGENTS.md`. O usuário autorizou a execução completa sem novas pausas. Sem servidor, contas reais ou persistência de dados pessoais. A aplicação deve estar preparada para importação na Vercel.

## Direção

Fundo creme, vermelho-alaranjado com detalhes em laranja, contraste acessível, componentes consistentes e textos em português. Fluxo: preencher dados → revisar e editar → concluir simulação. Manter os conceitos de nome, e-mail, data e preferência de compra; nascimento opcional, newsletter desmarcada. Ajuda e privacidade acessíveis em diálogos nativos. GSAP apenas em transformações e opacidade, respeitando movimento reduzido.

## Plano de implementação

1. Configurar Next.js e Tailwind sem modificar o HTML existente.
2. Escrever e executar testes de validação; implementar regras para campos obrigatórios, e-mail, datas reais e tipos conhecidos.
3. Implementar formulário, mensagens por campo, resumo de erros com foco, revisão editável, limpeza confirmada e conclusão honesta.
4. Aplicar layout responsivo, foco visível, alvos de toque e animações GSAP com limpeza automática.
5. Documentar implantação e correspondência das 10 heurísticas. Executar testes, lint, typecheck e build quando as dependências estiverem disponíveis.

## Verificação e limitações

- SHA-256 inicial de `index.html`: `66FD5AAE1DA8183735154BD52A939A982D98002578132560D0941BCEE0DBADBA`.
- O ambiente bloqueou a instalação npm com `EACCES`; não solicitar elevação, pois ela é proibida pela política da sessão.
- Python não está instalado; consultar diretamente os dados e recomendações fornecidos pelo UI/UX Pro Max.
- Sem repositório Git vinculado: não criar commits, repositórios remotos ou publicação sem destino informado.
- Implementação concluída em `src/`, com configuração Next.js/Tailwind e instruções de implantação no README.
- `npm test`: 8 testes passaram após implementação; casos inválidos falharam na execução inicial, antes das regras.
- `node --check`: configurações PostCSS e ESLint passaram na checagem sintática.
- Hash final do HTML idêntico ao inicial; `AGENTS.md` não foi modificado.
- Build, lint e typecheck foram tentados, mas os executáveis não existem sem instalar dependências. Teste visual no navegador não realizado pelo mesmo motivo.
- Revisão final: corrigidos o nome acessível da ajuda no celular, separação das palavras do título e visibilidade da navegação no celular.
