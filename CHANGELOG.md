# CHANGELOG - ServicePRO

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.8.0] - 2026-09-09
### Adicionado (Fase 2 - Assinaturas e Planos)
- **Estrutura de Planos SaaS:** Catálogo estruturado com suporte a `TRIAL`, `STARTER`, `PRO` e `BUSINESS`.
- **Máquina de Estados de Assinatura:** Ciclo de vida completo com estados `TRIAL`, `ATIVO`, `EXPIRADO`, `CANCELADO` e `BLOQUEADO`.
- **Painel Master Avançado:** Gestão de usuários enriquecida com seletores rápidos de Plano e Status, filtros por plano e status, e prorrogação de validade.
- **Transparência na Interface:** Badges modernos na aba Empresa/Perfil exibindo o Plano contratado, Status atual e data de vencimento.
- **Bloqueio no Servidor (Defense-in-Depth):** Função `isUserBlocked(userId)` no Cloud Firestore impede leitura e gravação de contas canceladas ou bloqueadas.
- **Retrocompatibilidade Garantida:** Tratamento de fallbacks transparentes para usuários legados, preservando 100% dos dados históricos.

## [2.7.0] - 2026-09-09
### Segurança (Fase 1 - Segurança & Autorização)
- **Isolamento Absoluto Multi-Tenant:** Regras do Cloud Firestore (`firestore.rules`) garantem que o Usuário A jamais possa ler ou gravar dados do Usuário B (`isVerifiedOwner(userId)`).
- **Proteção da Conta Master:** Validação criptográfica do token JWT de `maa.koto@hotmail.com` com exigência de e-mail verificado, bloqueando tentativas de privilege escalation via DevTools ou APIs externas.
- **Prevenção contra Fraude de Assinatura:** Regras bloqueiam mutações (`update`/`delete`) na coleção `/assinaturas` para qualquer usuário não-master e impõem um teto de 8 dias na criação de contas trial via `validadeTimestamp <= request.time + duration.value(8, 'd')`.
- **Governança & Documentação:** Criação do documento oficial `SECURITY.md` e homologação dos itens de segurança no `AUDIT_REPORT.md`.

## [2.6.1] - 2026-09-09
### Corrigido
- **Menu Lateral no Celular (Mobile Drawer):** Restaurada e aperfeiçoada a barra superior mobile (`.mobile-topbar`) com botão hambúrguer, avatar do usuário, backdrop blur com transição suave e botão de fechar dedicado na gaveta lateral.
- **Responsividade Expandida:** Breakpoint mobile ajustado para 991.98px cobrindo celulares, tablets e dispositivos em modo paisagem, com suporte a alturas dinâmicas `100dvh`.
- **Ergonomia Touch:** Alvos de toque ajustados para no mínimo 44px x 44px conforme diretrizes de UX Mobile B2B.
- **Navegação Fluida:** Fechamento automático da gaveta lateral ao selecionar qualquer item do menu, clicar fora (backdrop) ou pressionar Escape.
- **Artefato Visual Eliminado:** Removido vazamento de sombra lateral da sidebar quando recolhida fora da tela.
- Atualização do Service Worker para `servicepro-cache-v7` com recarregamento e atualização imediata nos celulares.

## [2.6.0] - 2026-09-09
### Segurança
- Criação e implantação de `firestore.rules` com isolamento multi-tenant estrito por UID, proteção permanente da conta Master (`maa.koto@hotmail.com`) e bloqueio contra alteração indevida de validade pelo cliente.

### Corrigido
- **Idempotência no Estoque:** Finalização de OS agora utiliza `writeBatch` atômico e flag `estoqueBaixado: true`, impedindo baixas parciais ou deduções duplicadas de estoque.
- **Consistência Financeira:** Orçamentos e OS agora armazenam `totalNumerico` (ponto flutuante puro) e `totalCentavos` (inteiro), além da string visual, garantindo integridade matemática no Dashboard.

### Adicionado
- **Empty States (UX):** Cards informativos e ilustrados para novos usuários quando as listas de Clientes, Estoque ou Orçamentos estiverem vazias, com botões de primeiro passo.
- Atualização do Service Worker para `servicepro-cache-v5` com invalidação automática de cache.

---

## [2.5.0] - 2026-09-09
### Adicionado
- Menu lateral responsivo tipo gaveta (drawer/offcanvas) no celular com botão hambúrguer e backdrop blur.
- Controle financeiro de Ordem de Serviço: status de pagamento (Pendente / Sinal / Quitado), cálculo em tempo real de saldo restante e indicador "A Receber (Pendentes)" no Dashboard.
- Centro de Backup Master (.json) no painel de administração com exportação e restauração completa de todo o banco Firestore.
- Centro de Backup Pessoal (.json) na aba Empresa para os prestadores salvarem seus clientes, estoque e orçamentos.
- Busca e autopreenchimento de endereço por CEP utilizando a API do ViaCEP.
- Integração nativa com a Web Contacts API para importação de contatos da agenda do celular.
- Compartilhamento formatado no WhatsApp com detalhes da proposta, itens e condições de pagamento.
- Notificações modernas e elegantes via SweetAlert2.

### Modificado
- Reformulação visual completa da interface (UI/UX) abandonando a paleta neon verde e adotando design system B2B moderno com Azul Safira (#2563eb), fundo slate suave (#f8fafc) e menu obsidiana (#0f172a).
- Geometria refinada substituindo cantos arredondados de bolha (20px/24px) por cantos de 8px a 12px e soft tinted badges.
- Redesenho do documento impresso/PDF (#area-impressao) para formato de proposta executiva comercial limpa sem faixas pretas pesadas.
- Atualização do Service Worker para cache v4 com invalidação imediata e recarregamento automático.

### Removido
- Anexo de fotos pesadas no banco de dados Firestore para preservar os limites de tamanho de documento (< 1MB) e garantir performance máxima.

---

## [2.0.0] - 2026-09-08
### Adicionado
- Sistema SaaS com período de 7 dias grátis na criação de conta.
- Painel Master para o administrador (maa.koto@hotmail.com) gerenciar a validade das assinaturas dos prestadores.
- Persistência offline com IndexedDB no Cloud Firestore.
- Gráficos interativos via Chart.js para Faturamento Mensal e Distribuição de Status.
- Gerador de PDF via jsPDF + html2canvas.
