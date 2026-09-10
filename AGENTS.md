# SERVICEPRO — AGENT RULES

## IDENTIDADE

Este projeto é um SaaS real chamado ServicePRO.

Não trate o projeto como protótipo descartável.

Todas as alterações devem considerar usuários reais, dados reais e evolução futura.

---

## REGRA 1 — NÃO QUEBRAR O EXISTENTE

Antes de modificar:

* leia o código;
* identifique dependências;
* identifique chamadas;
* identifique dados usados;
* identifique telas afetadas.

Não apagar funcionalidades existentes sem justificativa.

---

## REGRA 2 — SEGURANÇA PRIMEIRO

Nunca confiar no frontend.

Toda autorização importante deve ser protegida por Firebase Rules ou backend.

---

## REGRA 3 — DADOS SÃO SAGRADOS

Nunca apagar dados reais durante desenvolvimento.

Nunca executar migração destrutiva sem backup.

---

## REGRA 4 — MOBILE É PRIORIDADE

Toda nova funcionalidade deve funcionar corretamente no celular.

---

## REGRA 5 — NÃO DUPLICAR CÓDIGO

Antes de criar função nova:

procurar se já existe função equivalente.

---

## REGRA 6 — NÃO CRIAR COMPLEXIDADE DESNECESSÁRIA

Evitar:

* frameworks desnecessários;
* bibliotecas duplicadas;
* abstrações exageradas;
* arquitetura complexa sem necessidade.

---

## REGRA 7 — FINANCEIRO

Todos os valores internos devem utilizar representação numérica segura.

Nunca utilizar "R$ 100,00" como valor matemático.

---

## REGRA 8 — ESTOQUE

Toda alteração de estoque deve possuir rastreabilidade.

---

## REGRA 9 — OPERAÇÕES CRÍTICAS

Utilizar transações/batches quando necessário.

Operações críticas devem ser idempotentes.

---

## REGRA 10 — TESTAR ANTES DE CONCLUIR

Após alteração:

1. testar;
2. verificar console;
3. verificar Firestore;
4. verificar mobile;
5. verificar desktop;
6. verificar permissões;
7. verificar regressões.

---

## REGRA 11 — ERROS

Nunca mostrar erro técnico ao usuário final.

Converter erros em mensagens amigáveis.

---

## REGRA 12 — DOCUMENTAR

Alterações arquiteturais devem ser documentadas.

---

## REGRA 13 — VERSIONAMENTO

Toda mudança relevante deve atualizar CHANGELOG.

---

## REGRA 14 — PRODUTO

Sempre perguntar:

"Isso torna o ServicePRO mais útil para um prestador de serviços?"

Se a resposta for não, reconsiderar a implementação.

---

## REGRA FINAL

ServicePRO deve ser:

SIMPLES PARA O USUÁRIO.

ROBUSTO POR DENTRO.

SEGURO.

RÁPIDO.

ESCALÁVEL.

PROFISSIONAL.

---

# COMPORTAMENTO GLOBAL DAS SKILLS

Antes de qualquer implementação importante:

1. identificar quais Skills são relevantes;
2. consultar as Skills;
3. analisar o código;
4. criar plano;
5. implementar;
6. testar;
7. revisar;
8. documentar.

Nunca considerar uma tarefa concluída apenas porque o código compila.

A tarefa só está concluída quando:

* funciona;
* é segura;
* não quebra funcionalidades existentes;
* funciona no mobile;
* funciona no desktop;
* possui tratamento de erro;
* possui estado de loading;
* possui estado vazio;
* possui validação;
* possui documentação quando necessária.
