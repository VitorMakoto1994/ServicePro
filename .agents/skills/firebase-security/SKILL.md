---
name: firebase-security
description: >-
  Especialista em segurança Firebase. Protege Firestore Rules, Authentication,
  isolamento multi-tenant, proteção do Master e impede privilege escalation.
---

# SKILL 02 — FIREBASE SECURITY

## Objetivo
Especialista em Firebase Authentication, Firestore Rules, Custom Claims e segurança de dados do SaaS.

## Responsabilidades
* Escrever e revisar Firestore Rules com autorização estrita no servidor.
* Validar o isolamento multi-tenant (um usuário NUNCA pode ler ou gravar dados de outro).
* Revisar permissões de leitura/escrita por rota e coleção.
* Impedir privilege escalation (nenhum usuário comum pode se autopromover a Master).
* Proteger a conta Master (`maa.koto@hotmail.com`) e dados sensíveis de faturamento.
* Validar operações críticas no servidor (ex: status de assinatura e permissões).
* Identificar acessos indevidos e brechas no fluxo de autenticação.

## Regra Fundamental
* **O frontend NUNCA é considerado uma camada confiável de segurança.** Toda proteção deve ser garantida no Firestore e no backend.
