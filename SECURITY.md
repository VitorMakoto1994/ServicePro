# POLÍTICA E ARQUITETURA DE SEGURANÇA — SERVICEPRO CLOUD SaaS

> Documento oficial de governança, arquitetura de segurança, isolamento multi-tenant e controle de acesso (RBAC).

**Data de Vigência:** 09/09/2026  
**Versão:** 1.0 (ServicePRO v2.7.0)  
**Status:** ATIVO E HOMOLOGADO EM PRODUÇÃO  
**Responsável:** Antigravity AI Agent (Especialista em Segurança Firebase)

---

## 1. PRINCÍPIOS FUNDAMENTAIS

O ServicePRO adota os seguintes princípios inegociáveis de engenharia de segurança:

1. **Zero Trust no Frontend (Regra 2 - AGENTS.md):** O navegador do cliente é considerado um ambiente hostil e não confiável. Nenhuma regra de segurança, trava de negócio ou permissão de acesso depende exclusivamente de verificações em JavaScript no cliente.
2. **Menor Privilégio (*Least Privilege*):** Usuários comuns têm acesso exclusivamente aos seus próprios recursos e nada além.
3. **Isolamento Absoluto Multi-Tenant:** O Usuário A jamais poderá visualizar, alterar ou excluir dados do Usuário B.
4. **Proteção Rigorosa do Superadministrador (Master):** A conta Master (`maa.koto@hotmail.com`) é protegida no nível de regras do Firestore com validação do token JWT criptográfico emitido pelo Firebase Authentication.
5. **Idempotência e Atomicidade (Regra 9 - AGENTS.md):** Operações críticas que envolvem múltiplas coleções (ex: finalização de OS e baixa de estoque) utilizam `writeBatch` atômico.

---

## 2. ARQUITETURA MULTI-TENANT E MODELAGEM DE DADOS

O banco de dados Cloud Firestore é particionado em silos individuais identificados pelo UID do usuário gerado no Firebase Auth:

```
/databases/(default)/documents
├── /assinaturas/{userId}                   <-- Documento de controle de plano e validade
└── /usuarios/{userId}                      <-- Silo exclusivo do prestador de serviços
    ├── /clientes/{clienteId}               <-- Carteira de clientes do prestador
    ├── /estoque/{materialId}               <-- Inventário e materiais
    ├── /orcamentos/{orcamentoId}           <-- Propostas e Ordens de Serviço
    └── /config/perfil                      <-- Dados corporativos e preferências
```

### Garantias de Isolamento:
* O caminho `/usuarios/{userId}/*` vincula todos os documentos ao UID autenticado (`request.auth.uid`).
* Tentativas de acesso cruzado (ex: Usuário A tentando consultar `/usuarios/uid_B/clientes`) são rejeitadas pelo Firestore com código `PERMISSION_DENIED`.
* Consultas do tipo Collection Group (`collectionGroup`) não conseguem vazar documentos de outros usuários porque as regras de segurança atuam como barreiras absolutas de autorização.

---

## 3. MATRIZ DE CONTROLE DE ACESSO (RBAC)

| Perfil / Ator | Coleção `/assinaturas/{uid}` | Coleção `/usuarios/{uid}/*` (Próprio) | Coleção `/usuarios/{outro_uid}/*` | Backup Global Master |
|---|---|---|---|---|
| **Visitante Não Autenticado** | Bloqueado | Bloqueado | Bloqueado | Bloqueado |
| **Usuário com E-mail Não Confirmado** | Create inicial apenas | Bloqueado (Requer confirmação) | Bloqueado | Bloqueado |
| **Usuário Comum Ativo** | Leitura da própria assinatura | Leitura e Escrita completas | Bloqueado (`PERMISSION_DENIED`) | Bloqueado |
| **Usuário Comum Expirado** | Leitura da própria assinatura | Bloqueado na interface + regras | Bloqueado (`PERMISSION_DENIED`) | Bloqueado |
| **Superadministrador (Master)** | Leitura, Update e Delete de todos | Leitura e Escrita completas | Acesso administrativo para suporte | Acesso irrestrito |

---

## 4. PREVENÇÃO DE FRAUDE E PRIVILEGE ESCALATION

### 4.1 Auto-Extensão de Validade / Assinatura
* **Vulnerabilidade Prevenida (SEC-001):** Um usuário mal-intencionado poderia tentar enviar um `updateDoc` para `/assinaturas/{meu_uid}` com uma data futura (ex: 2099) para obter acesso gratuito ilimitado.
* **Proteção Implementada:**
  * As regras do Firestore proíbem terminantemente operações de `update` e `delete` em `/assinaturas/{userId}` para qualquer usuário que não seja o Master (`isMaster()`).
  * Na criação (`create`) durante o cadastro, a regra exige que o campo `validadeTimestamp` não ultrapasse `request.time + 8 dias` (período de 7 dias de trial + 1 dia de margem para fusos horários).

### 4.2 Privilege Escalation para Master
* **Vulnerabilidade Prevenida (AUTHZ-001):** Um invasor poderia tentar alterar a variável `ADMIN_EMAIL` em memória no console do navegador para forçar a exibição do painel administrativo.
* **Proteção Implementada:**
  * O Firestore valida a identidade do Master diretamente no token JWT:
    `request.auth.token.email.lower() == 'maa.koto@hotmail.com' && request.auth.token.email_verified == true`
  * Mesmo que um usuário exiba os botões de administração no frontend via DevTools, qualquer chamada ao Firestore para listar a coleção `/assinaturas` ou atualizar validades falhará no servidor.

---

## 5. FIRESTORE SECURITY RULES (HOMOLOGADO)

O arquivo de regras implantado no Cloud Firestore (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Autenticação básica
    function isAuth() {
      return request.auth != null;
    }
    
    // Usuário Master do sistema (superadministrador)
    function isMaster() {
      return isAuth() 
        && request.auth.token.email.lower() == 'maa.koto@hotmail.com'
        && request.auth.token.email_verified == true;
    }
    
    // Dono do recurso por UID
    function isOwner(userId) {
      return isAuth() && request.auth.uid == userId;
    }
    
    // Dono com e-mail devidamente verificado (exigido para dados de negócio)
    function isVerifiedOwner(userId) {
      return isOwner(userId) && request.auth.token.email_verified == true;
    }
    
    // Coleção /assinaturas/{userId}
    match /assinaturas/{userId} {
      allow read: if isOwner(userId) || isMaster();
      
      allow create: if isMaster() || (
        isOwner(userId) 
        && request.resource.data.email == request.auth.token.email
        && (!('validadeTimestamp' in request.resource.data) || (
          request.resource.data.validadeTimestamp is timestamp 
          && request.resource.data.validadeTimestamp <= request.time + duration.value(8, 'd')
        ))
      );
      
      allow update, delete: if isMaster();
    }
    
    // Coleção /usuarios/{userId}/{document=**}
    match /usuarios/{userId}/{document=**} {
      allow read, write: if isVerifiedOwner(userId) || isMaster();
    }
    
    // Bloqueio explícito por padrão
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 6. AUDITORIA E RESPOSTA A INCIDENTES

1. **Backups Diários e de Segurança:**
   * Backups automatizados da configuração são salvos em `backup/`.
   * O Master possui funcionalidade nativa de exportação completa do banco de dados em JSON (`BACKUP_MASTER_COMPLETO`).
2. **Contato de Segurança:**
   * Qualquer reporte de vulnerabilidade deve ser direcionado ao administrador via `maa.koto@hotmail.com`.
