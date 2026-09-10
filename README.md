# ServicePRO — Cloud SaaS para Prestadores de Serviços

> **Sistema de Gestão Profissional (SaaS B2B)** desenvolvido especificamente para técnicos, autônomos e empresas de serviços. Focado em agilidade no celular, controle financeiro em centavos, rastreabilidade de estoque e integridade absoluta de dados.

[![Versão](https://img.shields.io/badge/vers%C3%A3o-2.15.0-blue.svg)](VERSION.md)
[![Status](https://img.shields.io/badge/status-RELEASE%20READY-success.svg)](RELEASE_CHECKLIST.md)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-brightgreen.svg)](sw.js)
[![Segurança](https://img.shields.io/badge/seguran%C3%A7a-Multi--Tenant%20Estrito-orange.svg)](firestore.rules)
[![Hospedagem](https://img.shields.io/badge/deploy-Firebase%20Hosting-yellow.svg)](https://servicepro-155a6.web.app)

---

## 🌟 Principais Funcionalidades

### 1. Dashboard Executivo de Gestão
- **9 KPIs em Tempo Real:** Clientes, OS Abertas, OS Concluídas, Ticket Médio, Faturamento, A Receber, Custos Operacionais, Lucro Líquido e Margem Percentual.
- **4 Gráficos Corporativos (Chart.js):** Evolução de Faturamento, Status de OS, Recebimentos vs. Pendências e Lucro Operacional.
- **Filtros Dinâmicos de Período:** Hoje, 7 dias, 30 dias, Mês Atual, Mês Anterior e Personalizado.

### 2. Orçamentos & Ordens de Serviço (OS)
- Fluxo de trabalho linear e idempotente:  
  $$\text{Orçamento} \longrightarrow \text{Aprovado} \longrightarrow \text{OS Aberta} \longrightarrow \text{Em Execução} \longrightarrow \text{Concluída}$$
- Vínculo rastreável entre orçamentos e OS (`orcamentoOrigemId`).
- Numeração sequencial protegida e histórico visual completo por cliente.
- Geração de Propostas em **PDF oficial (A4)** e **PNG de alta resolução** para envio direto no WhatsApp com link sanitizado (`https://wa.me/55...`).

### 3. Motor Financeiro Centesimal
- Cálculo monetário em inteiros de centavos para eliminar erros de ponto flutuante do JavaScript:
  - Controle de Sinal / Entrada (`valorPagoCentavos`).
  - Saldo Restante calculado automaticamente (`saldoCentavos`).
  - Margem de lucro de materiais e mão de obra calculadas individualmente.

### 4. Controle de Estoque & Peças
- Baixa de estoque automática e idempotente acionada estritamente na conclusão da OS (`FINALIZADA`).
- Estorno automático em caso de cancelamento da ordem.
- Cálculo de Custo Médio Ponderado e alertas visuais de reposição mínima.
- Histórico completo de movimentações com limite de performance (`limit(100)`).

### 5. Backup & Restauração Profissional v3.0
- **Backup Pessoal:** Cópia de segurança JSON dos dados estritos do usuário com Checksum SHA-256 anti-adulteração.
- **Backup Master:** Snapshot global consolidado do ecossistema, protegido e exclusivo do Superadministrador.
- **Restauração em 6 Etapas:** Validação $\to$ Pré-visualização com grid de contagem $\to$ Confirmação $\to$ Safety Snapshot automático $\to$ Gravação em lotes atômicos (`writeBatch`) com barra de progresso $\to$ Validação pós-restore.

### 6. Master Panel Administrativo
- Visão executiva de todas as contas cadastradas com MRR Recorrente Estimado.
- Ações rápidas de 1 clique: Visão 360º de uso, Liberação rápida (+30d), Bloqueio, Extensão de validade, Troca de plano, Redefinição de senha e Exclusão com confirmação.
- Acesso estritamente protegido pelo Firestore Rules e restrito a `maa.koto@hotmail.com`.

### 7. Auditoria & Rastreabilidade
- Registro append-only e imutável de 13 operações críticas no sistema: `LOGIN`, `CRIACAO_CLIENTE`, `ALTERACAO_CLIENTE`, `EXCLUSAO_CLIENTE`, `CRIACAO_ORCAMENTO`, `ALTERACAO_ORCAMENTO`, `CRIACAO_OS`, `FINALIZACAO_OS`, `BAIXA_ESTOQUE`, `PAGAMENTO`, `RESTAURACAO_BACKUP`, `ALTERACAO_ASSINATURA`, `ALTERACAO_PLANO`.

### 8. Ergonomia Mobile-First & PWA
- **Floating Action Button (FAB):** Botão ergonômico no polegar para abertura de Novo Atendimento Express em menos de 30 segundos.
- Barra superior limpa com alinhamento simétrico e drawer lateral deslizante.
- Alvos de toque touch mínimos de 44px x 44px.
- PWA instalável com Service Worker v15 e manifesto completo.

---

## 🏗️ Arquitetura & Segurança

### Isolamento Multi-tenant
O ServicePRO adota arquitetura multi-tenant onde cada usuário possui seu próprio documento raiz:
```
/usuarios/{userId}/
  ├── config/perfil (dados da empresa, logo, cor primária)
  ├── clientes/{clienteId}
  ├── estoque/{produtoId}
  ├── orcamentos/{orcamentoId}
  └── movimentacoes/{movId}
```
As regras de segurança (`firestore.rules`) garantem que um usuário jamais consiga ler ou gravar dados de outro usuário.

### Proteção da Coleção `/assinaturas`
- Apenas a conta Master pode alterar planos (`plano`) ou prorrogar vigências (`validade`).
- No cadastro (signup), o usuário só pode criar o documento inicial com teto máximo de 8 dias de teste gratuito (`TRIAL`).
- Contas bloqueadas ou canceladas têm seu acesso revogado instantaneamente via `isUserBlocked()`.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
- Navegador moderno com suporte a ES Modules (Chrome, Edge, Safari, Firefox).

### Passo a Passo
1. Clone o repositório ou acesse a pasta raiz do projeto:
   ```bash
   cd meu-app
   ```
2. Inicie o servidor local de desenvolvimento:
   ```bash
   node server.js
   # ou dê duplo clique em iniciar_servicepro.bat
   ```
3. Abra o navegador em:
   ```
   http://localhost:3000
   ```

---

## 📦 Deploy em Produção (Firebase Hosting)

O deploy é gerenciado através do Firebase CLI:
```bash
firebase deploy --only hosting
# ou dê duplo clique em publicar_firebase.bat
```
As regras do Firestore são implantadas via:
```bash
firebase deploy --only firestore:rules
```

---

## 🧪 Suíte de Testes Automatizados

Para rodar todos os testes de homologação e auditoria:
```bash
node scratch/test_release_phase13.js
```
Todos os 23 critérios de auditoria devem retornar `[PASS]`.

---

## 📄 Governança e Regras do Produto

Consulte os manuais de governança do projeto:
- [VERSION.md](VERSION.md): Especificação detalhada da versão `2.15.0`.
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md): Checklist oficial de homologação de produção.
- [CHANGELOG.md](CHANGELOG.md): Histórico completo de alterações por versão.
- [PERFORMANCE.md](PERFORMANCE.md): Estudo de capacidade e custo de escalabilidade.
- [SECURITY.md](SECURITY.md): Auditoria e modelo de ameaças.
