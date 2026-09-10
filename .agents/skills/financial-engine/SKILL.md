---
name: financial-engine
description: >-
  Motor financeiro do ServicePRO. Garante consistência matemática, cálculos em
  centavos, sinal/entrada, saldo restante, lucro bruto, custos e faturamento.
---

# SKILL 04 — FINANCIAL ENGINE

## Objetivo
Garantir consistência financeira, precisão matemática e integridade monetária em todo o ServicePRO.

## Responsabilidades
* Armazenar e processar valores internos em centavos ou formato numérico de ponto flutuante seguro (nunca strings).
* Processar pagamentos, entradas, sinais e saldos a receber com precisão.
* Calcular saldo restante devedor automaticamente (`restante = max(0, total - sinal)`).
* Apurar lucro bruto real subtraindo o custo médio dos materiais utilizados.
* Gerenciar margens de lucro padrão da empresa e preços finais de venda.
* Consolidar métricas de faturamento realizado e valores a receber no Dashboard.

## Regras
* **Nunca utilizar strings monetárias ("R$ 100,00") como fonte de verdade matemática.** Máscaras servem exclusivamente para exibição visual ao usuário.
* **Toda operação financeira deve ser matematicamente consistente e rastreável.**
