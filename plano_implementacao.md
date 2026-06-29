# Plano de Implementação — Presente Mágico

> Cada etapa é independente. Nenhuma quebra o projeto. Cada uma termina com teste antes da próxima.

---

## 🟢 Fase 0: Correções Críticas (Rápido, Alto Impacto)

### Etapa 0.1 — Contraste de Cores no Modo Escuro
**Status:** ✅ Parcialmente feito (precisa validar)

**O que fazer:** Garantir que TODO texto em modo escuro seja branco ou cinza claro (slate-200+). Remover dependência de `.dark` class e usar `@media (prefers-color-scheme: dark)`.

**Teste:** Navegar por TODAS as telas em modo escuro. Nenhum texto deve estar ilegível.

### Etapa 0.2 — Placeholders e Inputs Visíveis
**O que fazer:** Todos os inputs, textareas e selects com texto e placeholder visíveis em ambos os modos.

**Teste:** Preencher formulário completo em modo claro e escuro.

### Etapa 0.3 — Loading States e Erros
**O que fazer:** Toda operação assíncrona deve ter feedback visual (loading, erro, sucesso).

**Teste:** Desligar internet durante criação de presente → ver mensagem de erro amigável.

---

## 🟡 Fase 1: Experiência do Usuário (Prioridade Alta)

### Etapa 1.1 — Modo Visitante
**O que fazer:** Usuário pode começar a criar o presente sem fazer login. Login é solicitado apenas ao final, antes de compartilhar.

**Por que:** Reduz atrito de entrada. A pessoa já investiu emocionalmente no presente quando chega na hora de criar conta.

**Teste:** Criar presente completo sem estar logado. Ao clicar "Compartilhar", pedir login.

### Etapa 1.2 — Navegação Mobile Melhorada
**O que fazer:** Bottom navigation no mobile com ícones + labels. Melhorar touch targets (mín 48px).

**Teste:** Navegar por todo o app em iPhone SE (320px) e Android.

### Etapa 1.3 — Onboarding Emocional
**O que fazer:** Primeira vez que usuário acessa, mostrar 3 slides rápidos:
1. "Alguém especial merece algo especial"
2. "Fotos + Música + Palavras = 💝"
3. "Em 5 minutos você cria magia"

**Teste:** Novo usuário vê onboarding apenas na primeira vez.

---

## 🟠 Fase 2: Conversão e Monetização

### Etapa 2.1 — Upgrade no Fluxo de Pagamento
**O que fazer:**
- Ao tentar criar segundo presente (free), levar para plans
- Na plans page, destacar benefício emocional, não funcional
- "R$19,90 para emocionar quem você ama para sempre"

**Teste:** Usuário free tenta segundo presente → vê página de upgrade → paga → consegue criar.

### Etapa 2.2 — Prova Social no Plans
**O que fazer:** Mostrar na página de planos:
- "X pessoas já criaram presentes hoje"
- "Y presentes foram abertos esta semana"
- Depoimentos reais com nome e foto

**Teste:** Página de planos carrega com dados dinâmicos.

### Etapa 2.3 — Gatilho de Urgência
**O que fazer:** "Preço de lançamento — R$19,90 (de R$49,90)" com timer.
Não precisa ser real — apenas mostrar que o valor é promocional.

**Teste:** Timer aparece e ao expirar, muda mensagem (mas preço continua).

---

## 🔴 Fase 3: Assinatura Recorrente

### Etapa 3.1 — Plano Mensal e Anual
**O que fazer:**
- R$9,90/mês ou R$99/ano
- Benefícios: presentes ilimitados, todos os templates, estatísticas
- Cancelar a qualquer momento

**Teste:** Assinar mensal → usar por 1 mês → cancelar → plano volta para free.

### Etapa 3.2 — Webhook de Cancelamento
**O que fazer:** Mercado Pago envia webhook quando assinatura é cancelada.
Sistema rebaixa para free.

**Teste:** Cancelar assinatura → perfil volta para free em minutos.

---

## 🟣 Fase 4: Retenção e Viralidade

### Etapa 4.1 — Exportar como Vídeo
**O que fazer:** Gerar vídeo do presente (fotos + música + texto) para compartilhar em qualquer rede.
Usar API de renderização (Remotion ou similar).

**Teste:** Presente é exportado como MP4. Abre em qualquer player.

### Etapa 4.2 — Estatísticas de Visualização
**O que fazer:** Criador vê: quantas vezes foi aberto, quanto tempo viram, em qual dispositivo.

**Teste:** Compartilhar link → abrir 3 vezes → estatísticas mostram 3 visualizações.

### Etapa 4.3 — Notificação "Seu presente foi aberto"
**O que fazer:** Quando destinatário abre o presente, criador recebe notificação (push ou email).

**Teste:** Abrir presente → criador recebe notificação em <30 segundos.

---

## 🟢 Fase 5: Templates e Conteúdo

### Etapa 5.1 — Templates Sazonais
**O que fazer:** Templates para Dia dos Namorados, Dia das Mães, Natal, Ano Novo.
Cada um com design, música e tom específicos.

**Teste:** Template de Natal tem tema natalino (vermelho, verde, música de Natal).

### Etapa 5.2 — Editor de Templates
**O que fazer:** Usuário pode personalizar cores, fontes, layout do presente.
Arrastar e soltar simples.

**Teste:** Mudar cor de fundo → presente reflete mudança em tempo real.

---

## Fase 6: Produto Físico (Alta Margem)

### Etapa 6.1 — Parceria com Gráfica
**O que fazer:** Integrar com API de gráfica (Sol Gráfica, 99Impressão) para imprimir quadros com QR Code.

**Fluxo:** Usuário cria presente → clica "Transformar em Quadro" → escolhe moldura → paga → gráfica produz e envia.

**Teste:** Pedido de teste → quadro chega → QR Code funciona.

---

## 📊 Ordem de Implementação (Priorizada)

```
1.  🟢 Contraste de cores (CRÍTICO - já em andamento)
2.  🟢 Placeholders e inputs
3.  🟢 Loading states e erros
4.  🟡 Modo visitante (sem login)
5.  🟡 Onboarding emocional
6.  🟡 Upgrade no fluxo de pagamento
7.  🟡 Prova social no plans
8.  🟡 Gatilho de urgência
9.  🔴 Assinatura mensal/anual
10. 🔴 Webhook de cancelamento
11. 🔴 Exportar como vídeo
12. 🔴 Estatísticas de visualização
13. 🔴 Notificação de abertura
14. 🟣 Templates sazonais
15. 🟣 Produto físico (quadros)
16. 🟣 Internacionalização
```

Cada etapa é deployada e testada individualmente. Nenhuma etapa depende de outra para ser lançada.
