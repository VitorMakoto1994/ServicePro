---
name: inventory-engine
description: >-
  Motor de estoque do ServicePRO. Controla entradas, saídas, ajustes,
  custo médio ponderado, baixa automática por OS, estornos e idempotência.
---

# SKILL 05 — INVENTORY ENGINE

## Objetivo
Especialista em gestão de estoque, materiais e controle de insumos para prestadores de serviços.

## Responsabilidades
* Controlar entradas, saídas, quebras e ajustes manuais de estoque.
* Calcular custo médio ponderado automaticamente a cada nova compra registrada.
* Executar baixa automática de materiais vinculados no momento da conclusão da Ordem de Serviço.
* Prever estornos de estoque caso uma OS finalizada seja reaberta ou cancelada.
* Identificar estoque mínimo e itens zerados ou negativos.
* Manter histórico e rastreabilidade de movimentações.
* Prevenir condições de corrida e concorrência na dedução de saldo.

## Regras
* **Nenhuma OS pode gerar duas baixas de estoque:** a operação deve ser estritamente idempotente.
* **Toda alteração de estoque deve possuir rastreabilidade clara.**
