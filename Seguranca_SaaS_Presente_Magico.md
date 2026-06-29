# Arquitetura de Planos e Segurança SaaS - Presente Mágico

## 1. O que acontece em cada Plano?

**No Plano Free (Gratuito):**
- O cliente só pode criar **1 único presente**.
- Ele só tem acesso às categorias básicas (Amor, Aniversário, Mães, Pais, etc).
- Se ele tentar clicar em um presente Premium (Casamento, Pet, etc.) ou tentar criar o 2º presente, o sistema **bloqueia o clique** e o redireciona para a tela de Planos e Pagamentos.

**No Plano Premium (Pago):**
- O botão de bloqueio (cadeado dourado) desaparece.
- O cliente pode criar **infinitos presentes**.
- Todas as categorias bloqueadas (Casamento, Formatura, Nascimento) ficam abertas.

---

## 2. Qual é a Segurança atual do Sistema?

No momento, o sistema utiliza uma **Segurança Baseada em Interface (Frontend)**. 

### Como funciona?
O próprio site da aplicação web esconde os botões e impede fisicamente que clientes do plano Free avancem no fluxo de criação ou selecionem templates exclusivos.

### Nível de Proteção:
Para 99% das pessoas comuns (o público-alvo), isso é **100% seguro**, pois elas interagem apenas com a interface visual e não possuem conhecimento técnico para contornar o bloqueio visual do site.

### Qual é o risco?
Se um usuário mal-intencionado (hacker ou programador experiente) ignorar a interface visual do site e enviar requisições de código diretamente para o Banco de Dados (Supabase), ele poderia contornar o bloqueio visual. Isso ocorre porque o banco de dados atualmente aceita inserções desde que a pessoa tenha uma conta válida (autenticada).

---

## 3. Próximo Passo: Segurança Nível Banco de Dados (RLS)

Para transformar a segurança atual em uma barreira **100% impenetrável**, a recomendação técnica é implementar Políticas de Segurança em Nível de Linha (RLS - Row Level Security) diretamente no banco de dados.

**Regra de Negócio Impenetrável:**
> Se o perfil do usuário na tabela \profiles\ constar como \ree\ e ele já possuir 1 registro na tabela \pages\, o Supabase deverá rejeitar qualquer nova tentativa de \INSERT\ na tabela \pages\, não importando a origem do comando.

Essa arquitetura garante que, mesmo que o sistema de Frontend seja contornado, o núcleo dos dados (Backend) protegerá a rentabilidade do modelo SaaS.