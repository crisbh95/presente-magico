# Presente Mágico — Product Requirements Document (PRD)

> **Status:** Aprovado — Constituição do Produto
> **Data:** 28/06/2026
> **Este documento é a fonte da verdade para todas as decisões de produto.**

---

## 1. Visão do Produto

### Missão
Transformar sentimentos em memórias digitais eternas que emocionam mais que qualquer presente físico.

### Visão
Ser a plataforma global número 1 para criação de presentes emocionais personalizados, reconhecida por fazer as pessoas chorarem de alegria.

### Propósito
Vivemos num mundo onde o tempo escorre pelos dedos. As pessoas amam, mas nem sempre sabem demonstrar. O Presente Mágico existe para dar voz ao que o coração sente mas as palavras não alcançam.

### Valores
- **Emoção acima de tudo** — cada pixel deve servir ao sentimento
- **Simplicição radical** — a avó do usuário precisa conseguir usar
- **Surpresa e Encantamento** — micro-interações que arrancam sorrisos
- **Privacidade primeiro** — dados dos presentes são sagrados
- **Eternidade digital** — um presente nunca expira

### Posicionamento
"O presente mais lindo que alguém pode receber."

Não somos um "site de criar cartão". Somos uma **experiência emocional digital**.

---

## 2. Público-alvo

### Personas Primárias

| Persona | Dor | O que busca |
|---------|-----|-------------|
| **Casal apaixonado** (18-35) | Quer declarar amor de forma única | Uma carta digital que capture a história do casal |
| **Filho(a) de mãe/pai** (25-45) | Quer emocionar os pais no dia deles | Algo mais profundo que um presente comprado |
| **Amigo(a) especial** (20-40) | Quer celebrar uma amizade | Uma forma criativa de dizer "obrigado por existir" |
| **Noivos** (25-40) | Quer convidar de forma inesquecível | Convite digital emocionante para padrinhos |
| **Empresa** (RH/Marketing) | Quer engajar funcionários/cliente | Presente corporativo personalizado em escala |

### Personas Secundárias
- Avós que recebem presentes dos netos
- Pets (donos que homenageiam)
- Formandos
- Pessoas em luto (memorial)
- Professoras (homenagem de alunos)

---

## 3. Jornada Completa do Usuário

### Fase 1: Descoberta
1. Usuário vê link de um presente que recebeu (WhatsApp, Instagram)
2. Abre e tem uma experiência emocional → **primeiro contato com a marca**
3. Impacto emocional gera desejo de criar o seu próprio

### Fase 2: Primeiro Acesso
4. Entra no site → vê landing page que já emociona
5. CTA principal: "Criar Presente Mágico"
6. Pode navegar como visitante (ver exemplos)

### Fase 3: Criação
7. Escolhe template/ocasião
8. Wizard guiado (4-5 passos simples)
9. Upload de fotos + música + mensagem
10. Preview interativo → **"Uau, ficou lindo!"**
11. Gera link único para compartilhar

### Fase 4: Entrega
12. Compartilha via WhatsApp, Instagram, email
13. Quem recebe vê animação de abrir presente
14. Experiência imersiva (música, fotos, texto emocionante)

### Fase 5: Retenção
15. Criador pode editar, ver estatísticas
16. Quem recebeu pode criar o seu próprio (viral)
17. Lembretes de datas especiais

---

## 4. Funcionalidades Atuais

### Implementadas
- [x] Landing page com templates e planos
- [x] Cadastro/login (email + Google)
- [x] Wizards de criação: Amor, Aniversário, Dia das Mães, Dia dos Pais, Memorial, Casamento, Infantil, Pet, Formatura
- [x] Upload de fotos/vídeos/áudio
- [x] Geração de link único (/p/:id)
- [x] Página de visualização com música, fotos, contador regressivo
- [x] Área do usuário (Dashboard)
- [x] Planos: Free (1 presente) e Premium (R$19,90 único)
- [x] Pagamento via Mercado Pago (Pix com QR Code)
- [x] Admin para gerenciar pagamentos
- [x] Geração de mensagem por IA (Qwen)
- [x] Perfil do usuário
- [x] Modo escuro
- [x] Preview modal antes de finalizar
- [x] Rascunho automático (useDraft hook)
- [x] Responsivo (mobile-first)

---

## 5. Funcionalidades Futuras

### Curto Prazo (Versão 1.1)
- [ ] Editor de templates (arrastar e soltar)
- [ ] Múltiplas músicas por presente
- [ ] Timer/data para entrega agendada
- [ ] Vídeo mensagem direto na câmera
- [ ] Compartilhar como vídeo (export)
- [ ] Estatísticas de visualização
- [ ] Página pública do criador (portfólio)

### Médio Prazo (Versão 1.5)
- [ ] Templates animados (CSS/GSAP)
- [ ] Colaboração em tempo real (várias pessoas criando juntas)
- [ ] Galeria pública de presentes (com permissão)
- [ ] App mobile (React Native)
- [ ] Integração com Correios (presente físico + digital)
- [ ] Assinatura Premium (recorrente)
- [ ] Temas sazonais (Natal, Dia dos Namorados)

### Longo Prazo (Versão 2.0)
- [ ] IA que gera o presente completo baseado em fotos
- [ ] Realidade Aumentada (AR) para revelação
- [ ] Marketplace de templates (criadores terceiros)
- [ ] API pública para empresas
- [ ] Prints físicos (quadro emoldurado com QR Code)
- [ ] Versionamento de presentes (edições ao longo do tempo)
- [ ] Modo offline (PWA completo)

### Enterprise (Versão 3.0)
- [ ] Portal corporativo (RH criar presentes para times)
- [ ] White-label para agências
- [ ] Integração com CRM, Slack, Teams
- [ ] Relatórios de engajamento
- [ ] API de criação em lote

---

## 6. Funcionalidades Obrigatórias para o MVP

As que já existem são suficientes para o MVP. O foco agora deve ser:

1. **Finalizar pagamento recorrente (assinatura)**
2. **Compartilhamento como vídeo** (maior viralidade)
3. **Estatísticas de visualização** (prova social)
4. **Melhorar onboarding** (não precisa login para começar)

---

## 7. Funcionalidades Premium

### Atuais (R$19,90 pagamento único)
- Presentes ilimitados
- Templates Premium
- Sem marca d'água
- IA ilimitada

### Futuras (assinatura mensal/anual)
- Temas animados
- Múltiplas músicas
- Colaboração
- Estatísticas avançadas
- Templates exclusivos (lançados mensalmente)

---

## 8. Funcionalidades Exclusivas (Diferenciação)

- **Revelação com animação de presente** (toque para abrir)
- **Contagem regressiva personalizada** (dias até o evento)
- **Música ambiente sincronizada com as fotos**
- **Mensagem gerada por IA treinada no contexto emocional**
- **Link vitalício** (nunca expira, diferente de concorrentes)
- **Presente em grupo** (várias pessoas contribuem)

---

## 9. Roadmap

### Versão 1.0 (Atual — Lançada)
- Core funcional
- Free + Premium (pagamento único)
- Wizards básicos
- Visualização emocional

### Versão 1.1 (Próximos 30 dias)
- Assinatura recorrente (R$9,90/mês ou R$99/ano)
- Exportar como vídeo
- Estatísticas de visualização
- Templates sazonais (Dia dos Namorados, Natal)

### Versão 1.5 (90 dias)
- App mobile (React Native)
- Colaboração em grupo
- Galeria pública
- Temas animados

### Versão 2.0 (6 meses)
- IA generativa de presentes completos
- AR Kit para revelação
- Marketplace de templates
- API pública

### Versão Enterprise (12 meses)
- Portal corporativo
- White-label
- Prints físicos (quadros)

---

## 10. Regras de UX

1. **Lei de Jakob**: O usuário passa a maior parte do tempo em outros sites. Siga padrões conhecidos.
2. **Lei de Fitts**: Botões de ação principais devem ser grandes e de fácil acesso.
3. **Lei de Hick**: Quanto mais opções, mais tempo para decidir. Máximo 5 opções por tela.
4. **Efeito Zeigarnik**: Pessoas lembram mais de tarefas incompletas. Usar progresso visual.
5. **Regra dos 3 cliques**: Usuário deve chegar ao objetivo em no máximo 3 cliques.
6. **Feedback imediato**: Toda ação deve ter reação visual em <100ms.
7. **Estado zero**: Nunca mostrar tela vazia. Sempre ter mensagem amigável.
8. **Onboarding progressivo**: Não pedir tudo de uma vez. Revelar conforme necessário.
9. **Modo visitante**: Permitir navegar e até começar a criar sem login.
10. **Undo visível**: Toda ação destrutiva deve ter confirmação ou undo.

---

## 11. Regras de UI

1. **Hierarquia visual clara**: Um elemento principal por tela.
2. **Tipografia**: Inter para corpo, Playfair Display para títulos, Great Vibes para toque emocional.
3. **Paleta de cores**: Rosa (#ec4899) como primary, fundo escuro (#0f172a) ou claro (#ffffff).
4. **Espaçamento generoso**: Mínimo 16px de padding em elementos tocáveis.
5. **Botões**: Mínimo 48px de altura para touch targets.
6. **Contraste**: Todo texto deve atender WCAG AA (4.5:1).
7. **Animações**: Suaves, duração 200-500ms, easing suave. Nunca atrapalhar o fluxo.
8. **Modo escuro**: Todo componente deve ter variante escura testada.
9. **Responsivo**: Mobile-first. Testar em 320px, 768px, 1024px, 1440px.
10. **Loading states**: Toda operação assíncrona deve ter skeleton ou spinner.

---

## 12. Regras da Inteligência Artificial

1. **IA é assistente, não substituta**: Usuário sempre pode editar o que a IA gerou.
2. **Contexto emocional**: IA deve conhecer o destinatário e a ocasião.
3. **Tom adequado**: Nunca genérico. Deve soar pessoal e genuíno.
4. **Múltiplas opções**: IA deve oferecer 3 variações de tom (romântico, engraçado, emocionante).
5. **Aprimoramento contínuo**: Usuário pode avaliar a sugestão para melhorar o modelo.
6. **Privacidade**: Dados dos usuários NUNCA usados para treinar modelo público.
7. **Fallback**: Se IA estiver offline, oferecer sugestões pré-escritas.

---

## 13. Regras de Segurança

1. **Autenticação**: Supabase Auth com Google OAuth + email/password.
2. **Autorização**: RLS policies no banco. Usuário só vê seus próprios dados.
3. **Upload seguro**: Validar tipo e tamanho. Máximo 30MB por arquivo.
4. **Rate limiting**: Proteger endpoints de criação contra abuso.
5. **Dados sensíveis**: NUNCA logar tokens, senhas ou chaves de API.
6. **Webhook seguro**: Validar origem das requisições (Mercado Pago).
7. **HTTPS**: Obrigatório em toda comunicação.
8. **Sanitização**: Todo input de usuário sanitizado antes de renderizar.

---

## 14. Regras de Monetização

1. **Freemium é o motor de crescimento**: 1 presente grátis é suficiente para criar desejo.
2. **Pagamento único funciona para Brasil** (R$19,90). Assinatura para mercado internacional.
3. **Upgrade deve ser inevitável**: Usuário free deve sentir o limite naturalmente.
4. **Preço justo**: R$19,90 único ou R$9,90/mês. Precificar por valor entregue, não por custo.
5. **Templates Premium**: Criação de templates exclusivos como receita adicional.
6. **Presentes corporativos**: Margem maior, venda em lote.
7. **Impressão física**: Quadro com QR Code embutido — margem de 70%+.

---

## 15. Regras da Marca

1. **Tom de voz**: Caloroso, emocional, íntimo. Como uma carta de amor.
2. **Nunca usar**: "Clique aqui" — usar "Abrir seu presente" / "Criar magia".
3. **Cores**: Primary rosa. Secundários: tons quentes (dourado, vinho).
4. **Símbolo**: Fita de presente como ícone principal.
5. **Nome**: "Presente Mágico" — nunca abreviar, nunca traduzir literalmente.
6. **Presença**: Instagram com stories de pessoas abrindo presentes.
7. **Comunidade**: Incentivar compartilhamento com #PresenteMagico.

---

## 16. O que NUNCA deve existir

1. **Anúncios dentro do presente** (o presente é sagrado)
2. **Marca d'água em planos pagos**
3. **Link quebrado / presente que expira**
4. **Coleta de dados sem consentimento claro**
5. **Notificações push abusivas**
6. **Spam automático para contatos do usuário**
7. **Conteúdo gerado por IA sem supervisão humana**
8. **Remoção de conteúdo sem aviso**
9. **Preços em dólar sem adaptação local**
10. **Redirecionamentos durante a experiência do presente**

---

## 17. Checklist para Lançamento

- [ ] Todos os links funcionando
- [ ] Fluxo de pagamento testado (Pix + cartão)
- [ ] Webhook de confirmação testado
- [ ] Fallbacks para IA offline
- [ ] Página 404 personalizada
- [ ] SEO meta tags em todas as páginas
- [ ] Open Graph tags para compartilhamento
- [ ] Google Analytics / Plausible configurado
- [ ] Monitoramento de erros (Sentry)
- [ ] Teste em Chrome, Safari, Firefox, Edge
- [ ] Teste em iOS e Android (navegador)
- [ ] Teste em 3G/4G
- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Contato/suporte visível

---

## 18. Checklist para Internacionalização

- [ ] i18n com next-intl ou react-i18next
- [ ] Detecção automática de idioma (navegador)
- [ ] Tradutor para: EN, ES, FR, IT, DE, JP, KR
- [ ] Adaptação de preços (moeda + poder de compra)
- [ ] Pagamento local (Stripe para exterior, Pix para Brasil)
- [ ] Conteúdo gerado por IA no idioma do usuário
- [ ] Templates culturalmente relevantes (Dia das Mães em cada país)
- [ ] CDN global para assets estáticos
- [ ] Domínio .com (internacional) + .com.br (Brasil)
- [ ] Suporte a fusos horários

---

## 19. Checklist para Escalabilidade

- [ ] Banco com índices adequados
- [ ] Cache de queries frequentes (Redis)
- [ ] CDN para imagens e assets
- [ ] Lazy loading de componentes
- [ ] Code splitting por rota
- [ ] Compressão de imagens no upload
- [ ] Limite de taxa por IP (rate limiting)
- [ ] Ready para picos sazonais (Dia das Mães, Natal)
- [ ] Banco com replicação de leitura
- [ ] Testes de carga periódicos

---

## 20. Ordem Correta de Implementação

### Fase 1 — Fundação (dias 1-7)
1. Corrigir contraste de cores (modo escuro)
2. Corrigir placeholder e inputs escuros
3. Testar fluxo de pagamento completo

### Fase 2 — Conversão (dias 8-14)
4. Onboarding sem login (modo visitante)
5. Exportar presente como vídeo
6. Melhorar CTAs da landing page

### Fase 3 — Retenção (dias 15-30)
7. Estatísticas de visualização
8. Notificações de "seu presente foi visto"
9. Lembretes de datas especiais

### Fase 4 — Monetização (dias 31-45)
10. Assinatura mensal/anual
11. Templates Premium mensais
12. Upgrade paths inteligentes

### Fase 5 — Escala (dias 46-90)
13. App mobile
14. Colaboração em grupo
15. Internacionalização
