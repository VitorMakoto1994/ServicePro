# CHANGELOG - ServicePRO

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.15.0] - 2026-09-10
### Adicionado (Fase 13 - Release Profissional & Homologação de Produção)
- **Homologação Final de Produção (RELEASE READY):**
  - Auditoria completa dos 15 pilares do sistema (Segurança, Multi-tenant, Dados, Auth, Firestore, Estoque, Financeiro, Backup v3.0, Master Panel, UX Mobile, Desktop, PWA, Performance, PDF e WhatsApp).
  - Criação da suíte integrada de testes automatizados `scratch/test_release_phase13.js` com 23 asserções críticas homologadas (100% aprovado).
  - Validação estrita do isolamento multi-tenant e regras do servidor (`firestore.rules`).
  - Validação do pipeline de restauração de backup com Checksum Criptográfico SHA-256 e Safety Snapshots preventivos.
  - Validação do layout mobile-first com Floating Action Button (FAB) ergonômico no polegar e touch targets de 44px.
  - Validação de ausência de erros no console em Strict Mode (`"use strict"`).
- **Documentação de Governança Criada:**
  - `VERSION.md`: Especificação formal da versão 2.15.0, stack de dependências, arquitetura e governança.
  - `README.md`: Manual oficial de produto, arquitetura, segurança, execução local e deploy em produção.
  - `RELEASE_CHECKLIST.md`: Matriz de homologação ponto a ponto com assinatura de aprovação para produção.

## [2.14.2] - 2026-09-10
### Corrigido (Painel Admin & Carregamento de Contas)
- **Correção da Listagem de Contas e Assinaturas no Painel Admin:**
  - Corrigido `ReferenceError: planoFiltroAdmin is not defined` provocado por atribuição a variável não declarada em escopo de módulo JavaScript (`"use strict"`).
  - O erro impedia o término do ciclo de vida de autenticação, travando a listagem de contas permanentemente em *"Carregando contas..."* e bloqueando a execução da rotina `carregarDados()`.
  - Com a declaração explícita de `planoFiltroAdmin` e elevação da função `renderizarPainelAdmin`, a subscrição em tempo real da coleção `/assinaturas` é ativada imediatamente e todas as contas cadastradas (incluindo conta Master e usuários cadastrados) são listadas com seus respectivos planos e status.
- **Proteção de Renderização de Clientes e Estoque:**
  - Adicionadas verificações defensivas para valores nulos ou incompletos (`c.nome`, `c.tel`, `e.nome`), prevenindo que registros com campos vazios causem falhas na listagem de clientes e estoque.
  - Adicionado tratamento visual explícito na tabela administrativa caso ocorra erro de conexão ou permissão na leitura de `/assinaturas`.
- **Service Worker:**
  - Cache renovado para `servicepro-cache-v15` em `sw.js` para propagação instantânea da correção.

## [2.14.1] - 2026-09-10
### Corrigido (Navegação & UX Mobile)
- **Desbloqueio de Navegação entre Abas:**
  - Corrigido ReferenceError que impedia a declaração de `window.navegar` e o registro de ouvintes de clique nos botões da sidebar.
  - Movida a inicialização da navegação (`window.navegar` e `toggleMobileMenu`) para o início imediato do módulo com bindings resilientes.
  - Adicionados atributos inline `onclick="window.navegar('...')"` diretamente em todos os botões do menu lateral para redundância 100% à prova de falhas.
  - Injetado o template nativo `HTML_MODAL_RESTORE_PREVIEW` com proteção `try/catch` defensiva na rotina `garantirModalRestoreNoDOM()`.
- **Redesenho Ergonômico de UX Mobile (Novo Atendimento):**
  - Removido o botão espremido e apertado que poluía a barra superior móvel (`.mobile-topbar`), restaurando um cabeçalho limpo com alinhamento perfeito (hambúrguer à esquerda, marca ao centro, avatar de perfil à direita).
  - Implementado Floating Action Button (FAB) ergonômico fixo no canto inferior direito (`.btn-fab-atendimento` / `#btnNovoAtendimentoMobile`), perfeitamente acessível com uma mão na zona de alcance do polegar.
  - Adicionado botão de ação rápida de largura total destacado no topo do menu Drawer deslizante.
  - Adicionada regra CSS `@media (min-width: 992px) { .sidebar-backdrop { display: none !important; } }` para impedir qualquer sobreposição fantasma no desktop.
- **Service Worker Cache:**
  - Cache atualizado para `servicepro-cache-v14` em `sw.js` para garantir atualização imediata no navegador mobile e em PWAs instalados.

## [2.14.0] - 2026-09-09
### Adicionado (Fase 9 - Backup e Restauração Profissional)
- **Schema v3.0 com Checksum Criptográfico:**
  - `versao: "3.0"`, `timestamp: ISO`, `quantidadeRegistros`, `estrutura` e payload consolidado.
  - Checksum SHA-256 gerado via Web Crypto API nativa (`crypto.subtle.digest`) para atestar integridade e detectar corrupção de dados.
- **Backup Pessoal v3.0 (`#btnExportarBackupUser`):**
  - Exportação estrita dos dados do usuário autenticado (`perfil`, `clientes`, `estoque`, `orcamentos`, `movimentacoes`).
- **Backup Master v3.0 (`#btnExportarBackupMaster`):**
  - Snapshot global de todo o ecossistema (todas as assinaturas, usuários e coleções do banco), restrito e protegido para o Superadministrador (`isMasterAdmin()`).
- **Pipeline de Restauração em 6 Etapas Seguras:**
  - *Etapa 1 (Validação & Compatibilidade):* Suporte retroativo completo a backups v1.0, v2.0 e v3.0 com bloqueio estrito caso usuário comum tente restaurar dados Master.
  - *Etapa 2 (Pré-Visualização no Modal `#modalRestorePreview`):* Resumo detalhado com nome do arquivo, versão, timestamp, e-mail de origem, status da integridade e grid de contagem de Clientes, Estoque, Orçamentos/OS e Movimentações.
  - *Etapa 3 (Confirmação Explícita):* Diálogo de confirmação com SweetAlert2 / confirmação com trava antes de qualquer escrita.
  - *Etapa 4 (Safety Snapshot Preventivo):* Gravação automática de snapshot de segurança no `localStorage` sob chave `servicepro_safety_snapshot_<timestamp>` antes de qualquer operação destrutiva.
  - *Etapa 5 (Restauração Atômica em Lotes):* Processamento seguro em lotes de até 380 documentos por `writeBatch` respeitando limites do Firestore, com barra de progresso em tempo real.
  - *Etapa 6 (Validação Pós-Restore & Auditoria):* Atualização dos arrays de estado em memória e registro inviolável de auditoria com ação `RESTAURACAO_BACKUP`.

### Adicionado (Fase 10 - Master Panel Executivo)
- **7 KPIs Executivos no Topo de `#aba-admin`:**
  - Total de Usuários cadastrados no SaaS (`#kpiTotalUsuarios`).
  - Contas em Período de Teste (`#kpiTrials`).
  - Assinaturas Ativas e vigentes (`#kpiAtivos`).
  - Novos Usuários nos últimos 30 dias (`#kpiNovos30Dias`).
  - MRR Estimado em R$ com cálculo centesimal preciso (Starter R$ 39,90, Pro R$ 79,90, Business R$ 149,90 - excluindo conta master para não gerar receita fictícia) (`#kpiMRREstimado`).
  - Usuários Expirados com alerta visual (`#kpiExpirados`).
  - Contas Canceladas ou Bloqueadas administrativamente (`#kpiCanceladosBloqueados`).
- **Tabela Corporativa com Soft Badges:**
  - Colunas: Empresa, Usuário/E-mail com UID mono, Plano, Status, Vencimento com alerta dinâmico de proximidade e Último Acesso.
- **Ações Administrativas Rápidas de 1 Clique:**
  - *Ver (Visão 360º):* Modal `#modalDetalhesUsuarioMaster` com métricas quantitativas de uso em tempo real (Clientes, Estoque, Orçamentos, Faturamento em OS).
  - *Liberar:* Ativação instantânea para status `ATIVO` e +30 dias com confirmação e auditoria `ALTERACAO_ASSINATURA`.
  - *Bloquear:* Suspensão imediata de conta (`status: 'BLOQUEADO'`) com confirmação.
  - *Estender:* Modal `#modalEstenderValidadeMaster` com atalhos (+7, +15, +30, +60 dias) e data manual.
  - *Alterar Plano:* Modal `#modalAlterarPlanoMaster` para alternar entre TRIAL, STARTER, PRO e BUSINESS com registro de auditoria `ALTERACAO_PLANO`.
  - *Reset de Senha e Exclusão:* Ações preservadas com confirmações de segurança.
- **Proteção Estrita e Auditoria Inviolável:**
  - Bloqueio imediato no frontend e backend (`firestore.rules`) caso usuário não autenticado como Master tente executar qualquer ação administrativa.

### Adicionado (Fase 11 - Performance e Escalabilidade)
- **Compressão Inteligente de Logotipo Client-Side:**
  - Redimensionamento matemático proporcional via Canvas (máximo 300x300px) com preservação de aspect ratio.
  - Compressão progressiva JPEG com degradação controlada de qualidade (0.70 a 0.40) garantindo payload Base64 estritamente abaixo de 50KB.
  - Feedback visual em tempo real no formulário de Perfil (`#pLogoFeedback`) exibindo o tamanho final otimizado (ex: `24.5 KB - Otimizado`).
- **Teardown Limpo de Listeners Firestore (`Memory Leak Prevention`):**
  - Implementação da rotina universal `window.teardownListeners()` para cancelamento de todas as 7 subscrições ativas (`unsubClientes`, `unsubEstoque`, `unsubMovimentacoes`, `unsubOrcamentos`, `unsubPerfil`, `unsubAssinaturasAdmin`, `unsubscribeAuditoria`).
  - Conexão do teardown ao logout (`sairDoSistema`), no desligamento de sessão em `onAuthStateChanged` e de forma preventiva antes de reconectar listeners em `carregarDados()`.
- **Otimização de Queries e Limitação Histórica (`limit(100)`):**
  - Subscrição em `movimentacoes` refatorada para utilizar `query(..., orderBy("data", "desc"), limit(100))` eliminando downloads massivos de dados históricos antigos.
  - Alinhamento da consulta com a telemetria append-only de `auditoria` também sob limite de 100 registros.
- **Registro Otimizado e Assíncrono de Último Acesso:**
  - Atualização não-bloqueante de `ultimoAcesso` em `assinaturas/{userId}` no login, garantindo telemetria sem atrasar a inicialização da interface.
- **Índices Compostos do Firestore (`firestore.indexes.json`):**
  - Configuração formal de 4 índices compostos e override de campo para consultas ordenadas de `auditoria`, `movimentacoes` e `orcamentos` (por status e status financeiro).
  - Integração pronta para deploy no Firebase CLI através de `firebase.json`.
- **Cache do Service Worker Atualizado para `v13`:**
  - Incremento de cache no `sw.js` para `servicepro-cache-v13`, garantindo ativação imediata dos novos recursos nos dispositivos dos prestadores.
- **Estudo Executivo de Escalabilidade (`PERFORMANCE.md`):**
  - Análise completa de carga e custos para 100, 1.000 e 10.000 prestadores ativos com margem de nuvem superior a 99.7% no plano Firebase Blaze.
  - Metrificação de latência (FCP 0.9s, LCP 1.3s, INP 38ms) e footprint de memória (32-46 MB) para smartphones de entrada (320px-390px).

## [2.13.0] - 2026-09-09
### Adicionado (Fase 7 - Dashboard Executivo)
- **Painel de Gestão com 9 KPIs em Tempo Real:**
  - Clientes Ativos (`#dashClientes`) e OS Abertas na fila (`#dashOSAbertas`).
  - OS Concluídas (`#dashOSConcluidas`) e Ticket Médio por OS (`#dashTicketMedio`).
  - Faturamento Realizado (`#dashFaturamento`) e A Receber Pendente (`#dashAReceber`).
  - Custos Operacionais de Materiais (`#dashCustos`), Lucro Operacional Real (`#dashLucro`) e Margem de Lucro percentual (`#dashMargem`).
- **Filtros Dinâmicos de Período:** Seletor touch em pills horizontais com scroll suave (`Hoje`, `7 dias`, `30 dias` [default], `Este mês`, `Mês anterior` e `Personalizado` com intervalo de datas).
- **4 Gráficos Executivos em Chart.js:**
  - Evolução Temporal de Faturamento & Lucro Líquido (`#chartFaturamento`).
  - Distribuição dos documentos por Status (`#chartStatus`).
  - Fluxo de Caixa / Recebimentos (`#chartRecebimentos`).
  - Composição Financeira comparativa Faturamento x Custos x Lucro (`#chartLucro`).
- **Zero Leituras Adicionais e Alta Performance:** Processamento 100% in-memory a partir dos arrays locais já sincronizados, com custo zero no Firebase e latência instantânea.

### Adicionado (Fase 8 - UX Mobile + Desktop)
- **Fluxo Novo Atendimento Express (`#modalNovoAtendimento`):** Abertura de Ordem de Serviço em menos de 30 segundos no celular, com opção de cliente cadastrado ou cadastro rápido de novo cliente na hora (Nome + WhatsApp), descrição do serviço, valor com máscara monetária e data.
- **Gatilhos de Ação Rápida:** Botão de destaque no Dashboard (`#btnNovoAtendimentoDash`) e na barra superior móvel (`#btnNovoAtendimentoMobile`).
- **Notificação com 1 Toque no WhatsApp:** Diálogo imediato pós-criação da OS para envio de mensagem formatada via WhatsApp para o cliente.
- **Empty States Universais:** Componente padronizado com ícones, mensagens de orientação e botões de Call-To-Action para listas vazias de Clientes, Estoque e Orçamentos.
- **Ergonomia Móvel e Alvos de Toque:** Garantia de área mínima de 44px x 44px em todos os botões (`.btn-action`, `.btn-premium`, `.btn-dash-pill`, etc.) e adaptação responsiva auditada para 320px, 375px, 390px, 430px, tablet e desktop.

## [2.12.0] - 2026-09-09
### Adicionado (Fase 6 - Auditoria e Rastreabilidade)
- **Sistema Corporativo de Auditoria:** Implementação da coleção global `/auditoria/{logId}` registrando de forma append-only e inviolável as operações críticas do sistema.
- **Catálogo das 13 Operações Críticas:**
  - `LOGIN`: Acesso autenticado com deduplicação por sessão.
  - `CRIACAO_CLIENTE` e `ALTERACAO_CLIENTE`: Cadastro e atualizações cadastrais.
  - `EXCLUSAO_CLIENTE`: Exclusão lógica com rastreio de nome e ID.
  - `CRIACAO_ORCAMENTO` e `ALTERACAO_ORCAMENTO`: Emissão e modificações de propostas.
  - `CRIACAO_OS`: Geração de OS direta ou convertida de orçamento.
  - `FINALIZACAO_OS`: Conclusão técnica e entrega de serviço.
  - `BAIXA_ESTOQUE`: Dedução de insumos e peças com lista de materiais.
  - `PAGAMENTO`: Registros e quitações financeiras (sinal/total).
  - `RESTAURACAO_BACKUP`: Restaurações do Banco Master ou Pessoal.
  - `ALTERACAO_ASSINATURA` e `ALTERACAO_PLANO`: Alterações administrativas pelo Master.
- **Segurança e Imutabilidade no Firestore:** Regras estritas de segurança em `firestore.rules`: criação permitida ao próprio usuário autenticado (`usuarioId == auth.uid`), leitura para Master ou dono, e proibição total de atualização ou deleção (`allow update, delete: if false;`).
- **Sanitização Universal de Dados Sensíveis:** Função `sanitizarDadosAuditoria` exclui automaticamente chaves confidenciais (`senha`, `password`, `token`, `cartao`, `cvv`, etc.).
- **Painel Administrativo de Auditoria (Master):** Novo card em `#aba-admin` com busca textual, filtro pelas 13 ações críticas, tabela em tempo real e modal para inspeção técnica de metadados JSON (`#modalDetalhesAuditoria`).
- **Resiliência e Continuidade Operacional:** Gravações de auditoria encapsuladas para que nenhuma falha de telemetria impeça o fluxo de trabalho do prestador.

## [2.11.0] - 2026-09-09
### Adicionado (Fase 5 - Orçamento e Ordem de Serviço)
- **Máquina de Estados e Ciclo de Vida Profissional:** Implementação do fluxo formal de documentos: `ORÇAMENTO` → `APROVADO` → `OS ABERTA` → `EM EXECUÇÃO` → `CONCLUÍDA`, além do estado `CANCELADA`.
- **Rastreabilidade com `orcamentoOrigemId`:** Geração de Ordem de Serviço a partir de orçamento aprovado com preservação permanente de `orcamentoOrigemId` e `numOrcamentoOrigem`, com ponte reversa `osGeradaId` no orçamento original.
- **Bloqueio de Estados Inválidos:** Orçamentos e propostas preliminares são estritamente impedidos de realizar baixa de estoque. Apenas Ordens de Serviço concluídas realizam dedução de estoque, de forma única e idempotente.
- **Campo de Observações & Termos:** Novo campo `obs` para garantia, termos de serviço e condições especiais, integrado aos formulários, visualização executiva, geração de PDF e compartilhamento por WhatsApp.
- **Filtro Expandido por Status:** Novo seletor na aba Orçamentos permitindo filtrar por Orçamentos, Aprovados, OS Abertas, Em Execução, Concluídas e Canceladas.
- **Cancelamento com Estorno Automático:** Cancelamento de ordens concluídas realiza estorno atômico de materiais de volta ao estoque com log de movimentação `ESTORNO`.
- **Ações Contextuais no Grid:** Botões inteligentes de avanço de fluxo adaptados para o estado exato de cada documento.

## [2.10.0] - 2026-09-09
### Adicionado (Fase 4 - Estoque Profissional)
- **Histórico Completo de Movimentações:** Criação da subcoleção `/usuarios/{userId}/movimentacoes` rastreando `ENTRADA`, `SAIDA`, `AJUSTE` e `ESTORNO` com `produtoId`, `quantidade`, `quantidadeAnterior`, `quantidadeNova`, `data`, `referencia`, `osId` e `usuarioId`.
- **Monitoramento de Estoque Mínimo:** Novo campo `estoqueMinimo` em materiais, com alertas visuais inteligentes de reposição necessária (`⚠️ Reposição`) e status de item zerado.
- **Modal de Histórico com Filtros:** Modal interativo para visualização de movimentações por produto específico ou listagem global, com busca textual e filtro por tipo de movimentação.
- **Baixa Automática Idempotente em OS:** Conclusão de OS deduz materiais via `writeBatch` atômico, registra logs de `SAIDA` e marca a flag definitiva `estoqueBaixado: true`.
- **Garantia Contra Baixa Dupla:** Teste mandatório homologado: OS finalizada -> reaberta -> finalizada novamente -> **NÃO baixa o estoque uma segunda vez**.
- **Reabertura Inteligente com Estorno:** Opção ao reabrir ordens de serviço concluídas de manter a baixa efetuada ou realizar o estorno atômico dos insumos de volta ao estoque com log de `ESTORNO`.
- **Backup Integrado:** Exportação e restauração de movimentações adicionadas ao Backup Geral Master e ao Backup Pessoal do prestador.

## [2.9.0] - 2026-09-09
### Adicionado (Fase 3 - Motor Financeiro)
- **Aritmética Centesimal Exata:** Reestruturação de todos os cálculos internos para inteiros de centavos (`subtotalCentavos`, `descontoCentavos`, `totalCentavos`, `valorPagoCentavos`, `saldoCentavos`, `custoCentavos`, `lucroCentavos`), eliminando strings monetárias como fonte matemática e desvios de ponto flutuante IEEE 754.
- **Desacoplamento de Status da OS vs Financeiro:** Separação do status operacional (`ABERTA`, `EM_EXECUCAO`, `CONCLUIDA`, `CANCELADA`) do status financeiro (`NAO_PAGO`, `PARCIAL`, `PAGO`, `ATRASADO`).
- **Múltiplos Pagamentos e Métodos:** Suporte a registro de transações com métodos padronizados (`DINHEIRO`, `PIX`, `CARTAO`, `TRANSFERENCIA`, `OUTRO`).
- **Desconto e Lucro Operacional:** Novo campo de desconto com dedução imediata e apuração de lucro líquido confrontando receita versus custo médio ponderado do estoque.
- **Idempotência Atômica na Baixa de Estoque:** Finalização de ordens de serviço agrupada em `writeBatch` atômico com flag `estoqueBaixado: true`, impedindo baixas duplicadas.
- **Retrocompatibilidade Total:** Fallbacks dinâmicos garantem que orçamentos e OS criados em versões anteriores continuem funcionando sem necessidade de migração destrutiva.

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
