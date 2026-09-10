# ServicePRO — Especificação de Versão

## Versão Atual: `2.15.0` (Release Profissional)
**Data de Homologação:** 10 de Setembro de 2026  
**Status de Produção:** ✅ `RELEASE READY` (Aprovado em todas as 15 categorias de auditoria)  
**Ambiente de Deploy:** Firebase Hosting (`servicepro-155a6`)  
**URL de Produção:** [https://servicepro-155a6.web.app](https://servicepro-155a6.web.app)

---

## 1. Identificação do Sistema

| Atributo | Especificação |
|---|---|
| **Nome do Produto** | ServicePRO Cloud SaaS |
| **Identificador Interno** | `servicepro-core-v2` |
| **Arquitetura** | Single Page Application (SPA) PWA Multi-tenant |
| **Target Viewport** | 320px (Mobile pequeno) até 4K (Desktop ultra-wide) |
| **Service Worker Cache** | `servicepro-cache-v15` |
| **Schema de Backup** | `3.0` (com Checksum Criptográfico SHA-256) |
| **Superadministrador Master** | `maa.koto@hotmail.com` |

---

## 2. Stack Tecnológica & Dependências Homologadas

| Camada | Tecnologia / Biblioteca | Versão | Função |
|---|---|---|---|
| **Core Frontend** | HTML5 / Vanilla ES Modules (`"use strict"`) | ECMAScript 2022 | Aplicação principal livre de overhead de frameworks pesados |
| **Estilização** | CSS3 Custom Properties / Design System Safira | v2.4 | Paleta safira/obsidiana corporativa, alvos touch de 44px |
| **CSS Framework** | Bootstrap | 5.3.0 | Grid responsivo, componentes modais e utilitários |
| **Iconografia** | Bootstrap Icons | 1.11.1 | Ícones SVG semânticos e nítidos |
| **Backend / DB** | Firebase Firestore | 10.7.1 | Banco de dados NoSQL em tempo real com regras multi-tenant |
| **Autenticação** | Firebase Authentication | 10.7.1 | Gestão de sessões, verificação de e-mail e recuperação de senha |
| **Hosting & PWA** | Firebase Hosting + Cache Storage | HTTP/2 SSL | Hospedagem estática ultrarrápida com Service Worker offline |
| **Gráficos** | Chart.js | 4.x | 4 dashboards interativos (Faturamento, OS por Status, Recebimentos, Lucro) |
| **Alertas & Modais** | SweetAlert2 | 11.x | Confirmações críticas de dois fatores e toasts não intrusivos |
| **Máscaras de Input** | IMask | 7.x | Máscaras de CNPJ, CPF, Telefone/WhatsApp e moeda |
| **Exportação PDF** | jsPDF + html2canvas | 2.5.1 / 1.4.1 | Geração vetorial e raster de propostas e OS em A4 oficial |
| **Criptografia** | Web Crypto API (`crypto.subtle`) | Nativa W3C | Checksum SHA-256 para integridade e verificação anti-adulteração de backups |

---

## 3. Matriz de Fases Concluídas e Consolidadas

- **Fase 1:** Arquitetura de Segurança, Firestore Rules e Isolamento Multi-tenant
- **Fase 2:** Sistema de Assinaturas, Trial, Planos e Prevenção de Bloqueio Falso
- **Fase 3:** Motor Financeiro, Aritmética Centesimal e Margens de Lucro
- **Fase 4:** Motor de Estoque, Idempotência de Baixas e Rastreabilidade
- **Fase 5:** Fluxo Orçamento $\to$ Aprovação $\to$ OS Aberta $\to$ Concluída
- **Fase 6:** Auditoria e Rastreabilidade das 13 Operações Críticas (Append-Only)
- **Fase 7:** Dashboard Executivo de Gestão com 9 KPIs e 4 Gráficos
- **Fase 8:** UX Mobile-First, FAB Ergonômico de Atendimento e Touch 44px
- **Fase 9:** Backup e Restauração Profissional v3.0 com Checksum SHA-256
- **Fase 10:** Master Panel Administrativo com Gestão de Usuários e MRR
- **Fase 11:** Performance, Prevenção de Memory Leaks e Índices Compostos
- **Fase 12:** Inteligência Competitiva e Análise de Mercado B2B
- **Fase 13:** Homologação Final de Produção, Checklist e Release Profissional (`v2.15.0`)

---

## 4. Governança e Regras de Segurança

1. **Segurança no Servidor:** O frontend é tratado como camada não confiável. Todas as permissões são garantidas em `firestore.rules`.
2. **Dados Sagrados:** Nenhuma migração ou restore destrutivo é executado sem a geração prévia automática do *Safety Snapshot*.
3. **Multi-tenant Inviolável:** Usuários regulares possuem acesso estritamente restrito a `/usuarios/{auth.uid}/**`.
4. **Proteção Master:** Ações de liberação, bloqueio e extensão de licenças são exclusivas de `maa.koto@hotmail.com`.
