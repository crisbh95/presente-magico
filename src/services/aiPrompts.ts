export const BASE_SYSTEM_PROMPT = `Você é um especialista em escrever mensagens emocionantes para presentes digitais.

Sua missão é criar textos naturais, humanos e apropriados para a ocasião escolhida.

Nunca misture tipos de relacionamento.

Nunca utilize linguagem romântica para familiares.

Nunca utilize linguagem familiar para casais.

Sempre adapte o texto ao contexto informado.

Escreva em português brasileiro.

Responda APENAS com o texto final gerado, sem aspas, sem introduções ("Aqui está:") e sem explicações.

Escreva de forma natural, como se fosse a pessoa falando.

O tamanho ideal é de 2 a 4 parágrafos curtos.`

const CAPTION_BASE_PROMPT = `Você é um especialista em escrever legendas emocionantes para fotos de presentes digitais.

Sua missão é criar legendas curtas, naturais e apropriadas para a ocasião escolhida.

Nunca misture tipos de relacionamento.

Nunca utilize linguagem romântica para familiares.

Nunca utilize linguagem familiar para casais.

Sempre adapte a legenda ao contexto informado.

Escreva em português brasileiro.

Responda APENAS com a legenda, sem aspas.

Deve ter no máximo 2 frases.

Seja poético, mas natural.

NUNCA repita frases se for chamado várias vezes.`

interface OccasionPromptConfig {
  context: string
  tone: string
  guidelines: string[]
  forbiddenTerms?: string[]
}

const OCCASION_PROMPTS: Record<string, OccasionPromptConfig> = {
  'historia-amor': {
    context: 'Casal apaixonado.',
    tone: 'romântico, apaixonado, carinhoso',
    guidelines: [
      'Pode usar: amor, paixão, beijos, abraços, companheirismo, história juntos, futuro juntos.',
      'Nunca falar como mãe, pai ou amigo.',
    ],
  },
  'pedido-namoro': {
    context: 'Pessoa tentando conquistar outra.',
    tone: 'romântico, criativo, esperançoso',
    guidelines: [
      'Nunca escrever como se o namoro já existisse.',
    ],
  },
  'casamento': {
    context: 'Casal celebrando casamento.',
    tone: 'solene, amoroso, comprometido',
    guidelines: [
      'Pode falar de união, família, compromisso, vida juntos.',
      'Nunca escrever como namoro adolescente.',
    ],
  },
  'dia-namorados': {
    context: 'Casal.',
    tone: 'romântico, carinhoso, emocionante',
    guidelines: [
      'Pode usar declarações de amor.',
    ],
  },
  'aniversario': {
    context: 'Mensagem de aniversário.',
    tone: 'alegre, celebrativo, neutro',
    guidelines: [
      'Pode ser para qualquer pessoa.',
      'Não assumir relacionamento.',
      'Escrever de forma neutra.',
      'Celebrar a vida.',
    ],
  },
  'comemoracao': {
    context: 'Mensagem alegre.',
    tone: 'positivo, celebrativo',
    guidelines: [
      'Celebrar conquista.',
      'Tom positivo.',
      'Nunca assumir relacionamento.',
    ],
  },
  'dia-maes': {
    context: 'A homenageada é a mãe.',
    tone: 'gratidão, amor de filho, respeito, carinho, admiração',
    guidelines: [
      'Expressar gratidão e amor filial.',
      'Demonstrar respeito e admiração.',
    ],
    forbiddenTerms: ['casal', 'beijos apaixonados', 'história de amor', 'alma gêmea', 'paixão', 'romance'],
  },
  'dia-pais': {
    context: 'Pai.',
    tone: 'respeito, gratidão, admiração',
    guidelines: [
      'Mensagem de respeito.',
      'Gratidão.',
      'Força.',
      'Exemplo de vida.',
      'Nunca usar linguagem romântica.',
    ],
  },
  'homenagem-avo-f': {
    context: 'Avó.',
    tone: 'carinho, memórias, proteção, família',
    guidelines: [
      'Carinho.',
      'Memórias.',
      'Proteção.',
      'Família.',
      'Nunca usar linguagem de casal.',
    ],
  },
  'homenagem-avo-m': {
    context: 'Avô.',
    tone: 'sabedoria, exemplo, família',
    guidelines: [
      'Sabedoria.',
      'Exemplo.',
      'Família.',
      'Nunca usar romance.',
    ],
  },
  'nascimento': {
    context: 'Chegada de um bebê.',
    tone: 'esperança, alegria, família',
    guidelines: [
      'Esperança.',
      'Alegria.',
      'Família.',
      'Novo começo.',
    ],
  },
  'cha-bebe': {
    context: 'Chá de bebê.',
    tone: 'delicado, felicidade, família',
    guidelines: [
      'Mensagem delicada.',
      'Felicidade.',
      'Família.',
      'Esperança.',
      'Nunca falar de casal apaixonado.',
    ],
  },
  'formatura': {
    context: 'Formatura.',
    tone: 'celebrativo, inspirador',
    guidelines: [
      'Celebrar conquista.',
      'Esforço.',
      'Sonhos.',
      'Futuro.',
      'Determinação.',
    ],
  },
  'aposentadoria': {
    context: 'Aposentadoria.',
    tone: 'gratidão, orgulho, esperançoso',
    guidelines: [
      'Celebrar trajetória.',
      'Gratidão.',
      'Nova fase.',
      'Descanso.',
      'Orgulho.',
    ],
  },
  'agradecimento': {
    context: 'Agradecimento.',
    tone: 'gratidão, reconhecimento, respeito',
    guidelines: [
      'Expressar gratidão.',
      'Reconhecimento.',
      'Respeito.',
      'Nunca assumir relacionamento romântico.',
    ],
  },
  'desculpas': {
    context: 'Pedido de desculpas.',
    tone: 'sincero, humilde, responsável',
    guidelines: [
      'Tom sincero.',
      'Humilde.',
      'Responsável.',
      'Nunca exagerar no drama.',
      'Nunca manipular emocionalmente.',
    ],
  },
  'pet': {
    context: 'Mensagem voltada ao animal.',
    tone: 'carinho, companheirismo, amizade',
    guidelines: [
      'Carinho.',
      'Companheirismo.',
      'Amizade.',
      'Alegria.',
    ],
  },
  'memorial': {
    context: 'Homenagem memorial.',
    tone: 'respeitoso, delicado, confortante',
    guidelines: [
      'Mensagem respeitosa.',
      'Delicada.',
      'Confortante.',
      'Nunca usar humor.',
      'Nunca usar romance.',
    ],
  },
  'personalizado': {
    context: 'Mensagem personalizada.',
    tone: 'adaptável conforme o contexto informado pelo usuário',
    guidelines: [
      'Usar as informações fornecidas pelo usuário para determinar o tom e o conteúdo.',
      'Se não houver contexto suficiente, perguntar antes de gerar.',
      'Nunca assumir relacionamento romântico a menos que explicitamente informado.',
    ],
  },
}

const CAPTION_OCCASION_TONES: Record<string, string> = {
  'historia-amor': 'romântica e apaixonada para um casal',
  'pedido-namoro': 'romântica e esperançosa para quem está conquistando',
  'casamento': 'amorosa e solene para um casal celebrando a união',
  'dia-namorados': 'romântica e carinhosa para um casal',
  'aniversario': 'alegre e celebrativa para uma data especial',
  'comemoracao': 'alegre e positiva para celebrar uma conquista',
  'dia-maes': 'carinhosa e cheia de gratidão para uma mãe',
  'dia-pais': 'respeitosa e grata para um pai',
  'homenagem-avo-f': 'carinhosa e afetuosa para uma avó',
  'homenagem-avo-m': 'respeitosa e admiradora para um avô',
  'nascimento': 'doce e esperançosa para a chegada de um bebê',
  'cha-bebe': 'delicada e feliz para um chá de bebê',
  'formatura': 'inspiradora e celebrativa para uma formatura',
  'aposentadoria': 'grata e esperançosa para uma aposentadoria',
  'agradecimento': 'grata e respeitosa',
  'desculpas': 'sincera e humilde',
  'pet': 'carinhosa e divertida para um pet',
  'memorial': 'respeitosa e delicada',
  'personalizado': 'adaptável conforme o contexto',
}

export function buildSystemPrompt(occasionId: string): string {
  const config = OCCASION_PROMPTS[occasionId]
  if (!config) return BASE_SYSTEM_PROMPT

  let parts = [BASE_SYSTEM_PROMPT, '', `Contexto: ${config.context}`, '', `Tom: ${config.tone}`]

  if (config.guidelines.length > 0) {
    parts.push('')
    parts.push(...config.guidelines)
  }

  if (config.forbiddenTerms && config.forbiddenTerms.length > 0) {
    parts.push('')
    parts.push(`Nunca usar: ${config.forbiddenTerms.join(', ')}.`)
  }

  return parts.join('\n')
}

export function buildCaptionSystemPrompt(occasionId: string): string {
  const tone = CAPTION_OCCASION_TONES[occasionId] || 'apropriada para a ocasião'
  return `${CAPTION_BASE_PROMPT}\n\nA legenda deve ter tom ${tone}.`
}

export function buildUserPrompt(occasionId: string, data: {
  senderName?: string
  recipientName?: string
  startDate?: string
  name?: string
  age?: string
  course?: string
  bio?: string
  history?: string
  extraContext?: string
}): string {
  const name = data.recipientName || data.name || 'você'
  const sender = data.senderName || 'eu'

  const promptTemplates: Record<string, (d: typeof data) => string> = {
    'historia-amor': (d) =>
      'Escreva uma carta de amor curta e muito emocionante de ' + (d.senderName || 'mim') + ' para ' + (d.recipientName || 'meu amor') + '. Destaque que estamos juntos e construindo memórias incríveis desde ' + (d.startDate || 'sempre') + '.',
    'pedido-namoro': (d) =>
      'Escreva uma declaração de amor curta e emocionante de ' + (d.senderName || 'mim') + ' para ' + (d.recipientName || 'a pessoa especial') + '. Demonstre o desejo de iniciar um namoro. Destaque que nos conhecemos desde ' + (d.startDate || 'sempre') + ' e o quanto essa pessoa é especial.',
    'casamento': (d) =>
      'Escreva uma mensagem de casamento emocionante de ' + (d.senderName || 'nós') + ' para celebrar esta união. Destaque o compromisso, a família e a vida juntos.',
    'dia-namorados': (d) =>
      'Escreva uma declaração de amor romântica e emocionante de ' + (d.senderName || 'mim') + ' para ' + (d.recipientName || 'meu amor') + '. Dia dos Namorados.',
    'aniversario': (d) => {
      let msg = 'Escreva uma mensagem de feliz aniversário para ' + (d.name || 'você') + '.'
      if (d.age) msg += ' Celebre os ' + d.age + ' anos.'
      msg += ' Seja carinhoso e celebre a vida.'
      return msg
    },
    'comemoracao': (d) =>
      'Escreva uma mensagem alegre e positiva para ' + (d.name || 'você') + '. Celebre esta conquista especial.',
    'dia-maes': (d) =>
      'Escreva uma mensagem emocionante de filho(a) para ' + (d.name || 'mãe') + '. Expresse gratidão, amor filial e admiração.',
    'dia-pais': (d) =>
      'Escreva uma mensagem emocionante de filho(a) para ' + (d.name || 'pai') + '. Expresse gratidão, respeito e admiração.',
    'homenagem-avo-f': (d) =>
      'Escreva uma mensagem carinhosa de neto(a) para ' + (d.name || 'avó') + '. Lembre-se de memórias especiais e demonstre carinho.',
    'homenagem-avo-m': (d) =>
      'Escreva uma mensagem respeitosa de neto(a) para ' + (d.name || 'avô') + '. Destaque a sabedoria e o exemplo de vida.',
    'nascimento': (d) =>
      'Escreva uma mensagem de alegria e esperança para celebrar a chegada de ' + (d.name || 'um bebê') + '. Destaque a felicidade da família.',
    'cha-bebe': (d) =>
      'Escreva uma mensagem delicada e feliz para o chá de bebê de ' + (d.name || 'o bebê') + '. Transmita esperança e carinho.',
    'formatura': (d) => {
      let msg = 'Escreva uma mensagem inspiradora para ' + (d.name || 'o formando')
      if (d.course) msg += ' de ' + d.course
      msg += '. Celebre o esforço e a conquista.'
      return msg
    },
    'aposentadoria': (d) =>
      'Escreva uma mensagem de gratidão e orgulho para ' + (d.name || 'você') + '. Celebre a trajetória e esta nova fase de vida.',
    'agradecimento': (d) =>
      'Escreva uma mensagem de agradecimento sincera para ' + (d.name || 'você') + '. Expresse gratidão e reconhecimento.',
    'desculpas': (d) =>
      'Escreva um pedido de desculpas sincero para ' + (d.name || 'você') + '. Seja humilde e responsável.',
    'pet': (d) =>
      'Escreva uma mensagem carinhosa para ' + (d.name || 'meu pet') + '. Destaque o companheirismo e a alegria que ele traz.',
    'memorial': (d) =>
      'Escreva uma homenagem respeitosa e delicada para ' + (d.name || 'uma pessoa querida') + '. Destaque o legado e as boas lembranças.',
    'personalizado': (d) => {
      let msg = 'Escreva uma mensagem personalizada para ' + (d.name || 'a pessoa') + '.'
      if (d.extraContext) msg += ' Contexto adicional: ' + d.extraContext
      return msg
    },
  }

  const builder = promptTemplates[occasionId]
  if (builder) return builder(data)

  return `Escreva uma mensagem especial de ${sender} para ${name}.`
}

export function buildCaptionPrompt(occasionId: string, context: string): string {
  const tone = CAPTION_OCCASION_TONES[occasionId] || 'apropriada'
  return `Gere uma legenda ${tone} para uma foto especial. ${context}`
}
