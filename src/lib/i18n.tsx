// Simple i18n. English is the source. Portuguese looked up by English string.
// Missing keys fall back to the English source, so untranslated UI still works.

import { useEffect, useState } from "react";

export type Lang = "en" | "pt";

const LANG_KEY = "evenme:lang";
const EVENT = "evenme:lang-change";

const isBrowser = () => typeof window !== "undefined";

export function getLang(): Lang {
  if (!isBrowser()) return "en";
  const v = window.localStorage.getItem(LANG_KEY);
  return v === "pt" ? "pt" : "en";
}

export function setLang(l: Lang) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LANG_KEY, l);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: l }));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(() => getLang());
  useEffect(() => {
    const onChange = () => setLangState(getLang());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return [lang, setLang];
}

/** Translate: t(englishSource). If current lang is 'pt' and a mapping exists, return it. */
export function tr(en: string, lang?: Lang): string {
  const l = lang ?? getLang();
  if (l === "en") return en;
  return DICT[en] ?? en;
}

/** Hook version that re-renders on language change. */
export function useT(): (en: string) => string {
  const [lang] = useLang();
  return (en: string) => tr(en, lang);
}

// ============================================================
// Portuguese (Brazil) dictionary. Key = exact English source.
// ============================================================
export const DICT: Record<string, string> = {
  // ---------- Common UI ----------
  "Skip": "Pular",
  "Okay": "Tudo bem",
  "Continue": "Continuar",
  "Save": "Salvar",
  "Saved": "Salvo",
  "Start": "Começar",
  "Begin": "Começar",
  "Pause": "Pausar",
  "Resume": "Retomar",
  "Reset": "Reiniciar",
  "Again": "De novo",
  "Done": "Pronto",
  "Add": "Adicionar",
  "Another": "Outro",
  "Another prompt": "Outra sugestão",
  "Actually, something else": "Na verdade, outra coisa",
  "← Back": "← Voltar",
  "← Not now": "← Agora não",
  "← Change plan": "← Trocar plano",
  "← Explore": "← Explorar",
  "← Back to your moment": "← Voltar ao seu momento",
  "Settings": "Ajustes",
  "Account": "Conta",
  "Unsubscribe": "Cancelar assinatura",
  "Log out": "Sair",
  "Log out on this device": "Sair neste dispositivo",
  "This clears your name, email and check-ins saved on this device.": "Isso apaga seu nome, e-mail e check-ins salvos neste dispositivo.",
  "You don't have an active subscription.": "Você não tem uma assinatura ativa.",
  "You'll keep access until the end of your paid period.": "Você mantém o acesso até o fim do período já pago.",
  "Go home": "Ir para o início",
  "Try again": "Tentar de novo",
  "Ready?": "Pronta?",
  "Breathe in": "Inspire",
  "Hold": "Segure",
  "Let it out": "Solte",

  // ---------- Onboarding (index) ----------
  "Even Me — A 90-second check-in, for you": "Even Me — Um check-in de 90 segundos, para você",
  "You're not here to log your kid.": "Você não está aqui para registrar seu filho.",
  "You're here for you.": "Você está aqui por você.",
  "90 seconds a day. No charts, no scores, no clinical stuff. Just a moment to notice how you are.":
    "90 segundos por dia. Sem gráficos, sem notas, sem coisas clínicas. Só um momento para notar como você está.",
  "What should we call you?": "Como podemos te chamar?",
  "Totally optional.": "Totalmente opcional.",
  "First name": "Primeiro nome",
  "One gentle nudge a day, whenever you want it.": "Um lembrete gentil por dia, quando você quiser.",
  "Reminder time": "Horário do lembrete",
  "Email (optional)": "E-mail (opcional)",
  "Start with 1 free tip": "Comece com 1 dica grátis",
  "No card required to start. Then $4.99/week or $79/year.":
    "Sem cartão para começar. Depois $4,99/semana ou $79/ano.",
  "See crisis support resources": "Ver recursos de apoio em crise",

  // ---------- Check-in ----------
  "Today's check-in — Even Me": "Check-in de hoje — Even Me",
  "How are you, right now?": "Como você está, agora?",
  "How much do you have in the tank?": "Quanto de energia você tem no tanque?",
  "One word for today?": "Uma palavra para hoje?",
  "Where should we send it?": "Para onde enviamos?",
  "Hi.": "Oi.",
  "Show me something for right now": "Me mostre algo para agora",
  "Skip the word": "Pular a palavra",
  "Optional. One word is plenty.": "Opcional. Uma palavra basta.",
  "foggy, tender, wired, okay…": "nublado, sensível, agitada, ok…",
  "Your email — so we can remember you and send your welcome note. No spam.":
    "Seu e-mail — para lembrarmos de você e enviar sua nota de boas-vindas. Sem spam.",
  "Please enter a valid email so we can remember you.":
    "Digite um e-mail válido para lembrarmos de você.",
  "Your streak →": "Sua sequência →",
  "Explore tools & advice →": "Explorar ferramentas e conselhos →",

  // ---------- Moods ----------
  "Tired": "Cansada",
  "Overwhelmed": "Sobrecarregada",
  "Anxious": "Ansiosa",
  "Low": "Para baixo",
  "Neutral": "Neutra",
  "Content": "Tranquila",
  "Energized": "Com energia",
  "Grateful": "Grata",
  "Angry": "Com raiva",
  "Lonely": "Solitária",
  "Guilty": "Culpada",
  "Numb": "Anestesiada",
  "Running on fumes.": "Funcionando na reserva.",
  "Too much, all at once.": "Muita coisa, tudo de uma vez.",
  "Wired, a little jumpy.": "Agitada, um pouco em alerta.",
  "Heavy, quiet, flat.": "Pesada, quieta, apagada.",
  "Just here.": "Só aqui.",
  "Softly okay.": "Suavemente bem.",
  "A little spark.": "Uma faísca.",
  "Something feels tender-good.": "Algo parece bom e sensível.",
  "Something's hot in your chest.": "Algo está fervendo no peito.",
  "Missing someone, or something.": "Sentindo falta de alguém, ou algo.",
  "That old chewing feeling.": "Aquela sensação que rói por dentro.",
  "Nothing's landing.": "Nada está fazendo sentido.",

  // ---------- Energy ----------
  "Empty": "Vazio",
  "Some, not much.": "Um pouco, não muito.",
  "Steady": "Estável",
  "Enough for now.": "Suficiente por agora.",
  "Bright": "Iluminado",
  "There's something to spend.": "Há algo para gastar.",
  "Barely any left.": "Quase nada sobrando.",

  // ---------- For You page ----------
  "For you, right now — Even Me": "Para você, agora — Even Me",
  "Because you said you're feeling": "Porque você disse que está se sentindo",
  "Give me another": "Me mostre outro",
  "Explore more tools & advice": "Explorar mais ferramentas e conselhos",
  "That's enough for today. Come back tomorrow if you want to.":
    "Já é o bastante por hoje. Volte amanhã se quiser.",
  "If you're in crisis, tap here.": "Se você está em crise, toque aqui.",
  "Your free tip is used. Subscribe to keep going.":
    "Sua dica grátis foi usada. Assine para continuar.",
  "A gentle truth": "Uma verdade gentil",
  "For a moment": "Por um momento",
  "Try this": "Tente isto",
  "Just this": "Só isto",
  "Permission slip": "Autorização para si",
  "A small prompt": "Uma pequena sugestão",
  "An extra kindness": "Uma bondade a mais",
  "Try this next": "Tente isto a seguir",

  // ---------- Explore ----------
  "Explore — Even Me": "Explorar — Even Me",
  "Explore": "Explorar",
  "Small things to reach for. No commitment.": "Pequenas coisas para buscar. Sem compromisso.",
  "By how you feel": "Por como você se sente",
  "Tools": "Ferramentas",
  "Back to explore": "Voltar para explorar",
  "Small warm things to reach for.": "Pequenas coisas quentes para buscar.",

  // ---------- Categories ----------
  "Feeling tired": "Se sentindo cansada",
  "Need a reset": "Precisa de um reset",
  "Need kindness": "Precisa de gentileza",
  "Need energy": "Precisa de energia",
  "Feeling grateful": "Se sentindo grata",
  "Guilt spiral": "Espiral de culpa",

  // ---------- Tools meta ----------
  "60-second breathing": "Respiração de 60 segundos",
  "One minute. Longer out than in.": "Um minuto. Mais tempo soltando do que puxando.",
  "90-second breathing": "Respiração de 90 segundos",
  "The full reset.": "O reset completo.",
  "2-minute reset": "Reset de 2 minutos",
  "Set it down. Do nothing.": "Coloque no chão. Não faça nada.",
  "5-minute reset": "Reset de 5 minutos",
  "A real pause.": "Uma pausa de verdade.",
  "10-minute reset": "Reset de 10 minutos",
  "Somewhere else. Any room but this one.": "Em outro lugar. Qualquer cômodo menos este.",
  "Body scan": "Escaneamento corporal",
  "Head to toes. Soften as you go.": "Da cabeça aos pés. Suavizando aos poucos.",
  "5-4-3-2-1 grounding": "Ancoragem 5-4-3-2-1",
  "For when the room feels too loud inside.": "Para quando o cômodo parece alto demais por dentro.",
  "Name it to tame it": "Nomeie para amansar",
  "Pick the words. They lose some power once named.":
    "Escolha as palavras. Elas perdem força quando nomeadas.",
  "One-sentence journal": "Diário de uma frase",
  "Just one. That's the whole thing.": "Só uma. É só isso.",
  "Write yourself out of the guilt loop.": "Escreva para sair do ciclo de culpa.",
  "What do I need right now?": "Do que eu preciso agora?",
  "A tiny decision helper.": "Uma pequena ajuda para decidir.",
  "Tiny wins": "Pequenas vitórias",
  "The receipts you don't usually keep.": "Os comprovantes que você não costuma guardar.",
  "Gratitude, one line": "Gratidão, uma linha",
  "One thing. Quiet. Yours.": "Uma coisa. Silenciosa. Sua.",

  // ---------- Tools UI ----------
  "Just this. Nothing else.": "Só isto. Nada mais.",
  "Set your phone down. Timer will do the counting.":
    "Coloque o celular no chão. O timer conta.",
  "That's it. Nothing to do next.": "É isto. Nada para fazer depois.",
  "You're here. That's the whole point.": "Você está aqui. É esse o ponto.",
  "Tap what fits. No wrong answers.": "Toque no que se encaixa. Sem respostas erradas.",
  "One sentence. You don't have to write it down.":
    "Uma frase. Você não precisa escrever.",
  "or write your own…": "ou escreva a sua…",
  "The bar is low on purpose. \"Put pants on\" counts.":
    "A barra é baixa de propósito. \"Colocar a calça\" conta.",
  "One small thing I did": "Uma pequena coisa que fiz",
  "You don't have to write it. Just think of one.":
    "Você não precisa escrever. Só pense em uma.",

  // Body scan steps
  "Notice your feet on the floor. Just their weight.":
    "Note seus pés no chão. Só o peso deles.",
  "Soften your calves. Let them be heavy.":
    "Suavize as panturrilhas. Deixe-as pesadas.",
  "Unclench your thighs and hips.": "Solte as coxas e o quadril.",
  "Let your belly be soft. No performance.": "Deixe a barriga macia. Sem performar.",
  "Drop your shoulders away from your ears.":
    "Solte os ombros para longe das orelhas.",
  "Unclench your jaw. Part your teeth slightly.":
    "Solte a mandíbula. Separe os dentes um pouco.",
  "Let the space between your eyebrows go soft.":
    "Deixe o espaço entre as sobrancelhas suave.",
  "One slow breath. You made it through.":
    "Uma respiração lenta. Você conseguiu.",

  // Grounding prompts
  "Name 5 things you can see.": "Nomeie 5 coisas que você pode ver.",
  "Name 4 things you can feel — clothes, chair, air.":
    "Nomeie 4 coisas que você pode sentir — roupas, cadeira, ar.",
  "Name 3 things you can hear, even quiet ones.":
    "Nomeie 3 coisas que você pode ouvir, mesmo baixinhas.",
  "Name 2 things you can smell — or imagine two.":
    "Nomeie 2 coisas que você pode cheirar — ou imagine duas.",
  "Name 1 thing you can taste, or want to.":
    "Nomeie 1 coisa que você pode saborear, ou queira.",

  // Emotions (name-it)
  "tired": "cansada",
  "wired": "agitada",
  "sad": "triste",
  "angry": "com raiva",
  "resentful": "ressentida",
  "guilty": "culpada",
  "lonely": "solitária",
  "numb": "anestesiada",
  "anxious": "ansiosa",
  "afraid": "com medo",
  "hurt": "machucada",
  "grieving": "de luto",
  "disappointed": "decepcionada",
  "ashamed": "envergonhada",
  "overwhelmed": "sobrecarregada",
  "flat": "apagada",
  "tender": "sensível",
  "hopeful": "esperançosa",
  "grateful": "grata",
  "content": "tranquila",
  "proud": "orgulhosa",
  "relieved": "aliviada",

  // Needs
  "Water": "Água",
  "Half a glass. Right now, before you decide anything else.":
    "Meio copo. Agora, antes de decidir qualquer outra coisa.",
  "Food": "Comida",
  "Not a whole meal. A handful of something with protein or fat.":
    "Não uma refeição inteira. Um punhado com proteína ou gordura.",
  "Rest": "Descanso",
  "Even six minutes horizontal counts. Eyes closed if you can.":
    "Até seis minutos deitada contam. Olhos fechados se possível.",
  "Movement": "Movimento",
  "Two minutes of literally any motion. Shake, stretch, stairs.":
    "Dois minutos de qualquer movimento. Sacudir, alongar, escada.",
  "Connection": "Conexão",
  "Two-sentence text to someone safe. That's the whole ask.":
    "Uma mensagem de duas frases para alguém seguro. É só isso.",
  "Alone time": "Tempo sozinha",
  "Any door with a lock. Any bathroom. Any parked car. Five minutes.":
    "Qualquer porta com trava. Qualquer banheiro. Qualquer carro parado. Cinco minutos.",
  "Fresh air": "Ar fresco",
  "Open a window. Or step outside for one full slow breath.":
    "Abra uma janela. Ou saia para uma respiração longa.",
  "Quiet": "Silêncio",
  "Turn one thing off. Screen, light, or voice. Yours counts.":
    "Desligue uma coisa. Tela, luz, ou voz. A sua conta.",

  // ---------- Paywall ----------
  "Keep going — Even Me": "Continue — Even Me",
  "Keep showing up for you.": "Continue aparecendo por você.",
  "Your free tip is used. Pick what works.":
    "Sua dica grátis foi usada. Escolha o que funciona para você.",
  "Your email": "Seu e-mail",
  "Annual": "Anual",
  "35% off": "35% off",
  "$79 / year": "$79 / ano",
  "≈ $1.52 / week": "≈ $1,52 / semana",
  "Weekly": "Semanal",
  "$4.99 / week": "$4,99 / semana",
  "Cancel anytime in Settings.": "Cancele a qualquer momento nos Ajustes.",
  "EvenMe Annual": "EvenMe Anual",
  "EvenMe Weekly": "EvenMe Semanal",
  "Subscription length: 1 year. Billed once per year.":
    "Duração da assinatura: 1 ano. Cobrança uma vez por ano.",
  "Subscription length: 1 week. Billed every week.":
    "Duração da assinatura: 1 semana. Cobrança toda semana.",
  "Auto-renews until canceled. Cancel anytime in Settings.":
    "Renova automaticamente até você cancelar. Cancele quando quiser nos Ajustes.",
  "Email (optional) — to access your subscription on other devices":
    "E-mail (opcional) — para acessar sua assinatura em outros dispositivos",
  "You can subscribe without giving an email.":
    "Você pode assinar sem informar um e-mail.",
  "Delete Account": "Excluir conta",
  "Delete your account?": "Excluir sua conta?",
  "This permanently deletes your account and all data we store about you.":
    "Isso exclui permanentemente sua conta e todos os dados que guardamos sobre você.",
  "Are you sure? This will permanently delete your account and data. Your email, saved check-ins and subscription records will be removed and this can't be undone.":
    "Tem certeza? Isso excluirá permanentemente sua conta e seus dados. Seu e-mail, check-ins salvos e registros de assinatura serão removidos e não será possível desfazer.",
  "Yes, delete my account": "Sim, excluir minha conta",
  "Keep my account": "Manter minha conta",
  "We couldn't delete your account. Please try again.":
    "Não conseguimos excluir sua conta. Tente novamente.",

  "Loading plans…": "Carregando os planos…",
  "Please wait…": "Um momento…",
  "Restore purchases": "Restaurar compras",
  "Please pick a plan.": "Escolha um plano.",
  "No worries — nothing was charged.": "Tudo bem — nada foi cobrado.",
  "Purchase didn't complete. You can try again anytime.":
    "A compra não foi concluída. Você pode tentar de novo quando quiser.",
  "Something went wrong with the purchase. Please try again.":
    "Algo deu errado com a compra. Tente novamente.",
  "We couldn't load the plans right now. Please try again.":
    "Não conseguimos carregar os planos agora. Tente novamente.",
  "We couldn't find an active purchase on this Apple ID.":
    "Não encontramos uma compra ativa neste Apple ID.",
  "Restore didn't work. Please try again.":
    "A restauração não funcionou. Tente novamente.",

  "I already subscribed — refresh my access":
    "Já assinei — atualizar meu acesso",
  "Please enter a valid email so we can remember your subscription.":
    "Digite um e-mail válido para lembrarmos da sua assinatura.",

  // ---------- Settings ----------
  "Settings — Even Me": "Ajustes — Even Me",
  "Your name": "Seu nome",
  "Daily reminder time": "Horário do lembrete diário",
  "Subscription": "Assinatura",
  "You're subscribed. Thank you.": "Você está assinada. Obrigada.",
  "Cancel subscription": "Cancelar assinatura",
  "Resume subscription": "Retomar assinatura",
  "See plans": "Ver planos",
  "You have 1 free tip left.": "Você tem 1 dica grátis restante.",
  "Your free tip is used.": "Sua dica grátis foi usada.",
  "Switch to weekly ($4.99/wk)": "Trocar para semanal ($4,99/sem)",
  "Switch to annual ($79/yr)": "Trocar para anual ($79/ano)",
  "Canceled. You'll keep access until your period ends.":
    "Cancelada. Você mantém o acesso até o fim do período.",
  "Subscription resumed.": "Assinatura retomada.",
  "Plan switched. You'll be prorated for the difference.":
    "Plano trocado. A diferença será proporcional.",
  "Cancel your subscription?": "Cancelar sua assinatura?",
  "Your subscription will be canceled, but you'll keep full access until {{date}}. After that, you can still use your free tip or resubscribe anytime.":
    "Sua assinatura será cancelada, mas você mantém acesso completo até {{date}}. Depois disso, ainda poderá usar sua dica grátis ou assinar novamente a qualquer momento.",
  "Your subscription will be canceled. You'll keep access until the end of your paid period, then you can still use your free tip or resubscribe anytime.":
    "Sua assinatura será cancelada. Você mantém o acesso até o fim do período pago; depois, ainda poderá usar sua dica grátis ou assinar novamente a qualquer momento.",
  "Yes, cancel subscription": "Sim, cancelar assinatura",
  "Keep my subscription": "Manter minha assinatura",

  // ---------- History ----------
  "Your streak — Even Me": "Sua sequência — Even Me",
  "Your streak": "Sua sequência",
  "day you showed up for you": "dia em que você apareceu por você",
  "days you showed up for you": "dias em que você apareceu por você",
  "Last 6 weeks": "Últimas 6 semanas",
  "Just dates. No notes, no exports, no data about your kid. Ever.":
    "Só datas. Sem notas, sem exportações, sem dados sobre seu filho. Nunca.",

  // ---------- Resources ----------
  "If you're in crisis — Even Me": "Se você está em crise — Even Me",
  "If you're in crisis": "Se você está em crise",
  "This app isn't equipped for emergencies. These humans are.":
    "Este app não é para emergências. Estes humanos são.",
  "988 Suicide & Crisis Lifeline (US)": "988 Linha de Vida (EUA)",
  "Call or text 988": "Ligue ou envie 988",
  "Crisis Text Line": "Crisis Text Line",
  "Text HOME to 741741": "Envie HOME para 741741",
  "Postpartum Support International": "Postpartum Support International",
  "Outside the US": "Fora dos EUA",
  "CVV — Centro de Valorização da Vida (Brasil)": "CVV — Centro de Valorização da Vida (Brasil)",
  "Call 188 — 24/7": "Ligue 188 — 24h",

  // ---------- Reset / MeToo / Tiles ----------
  "You picked": "Você escolheu",
  "I'm through it": "Passei por isso",
  "Send this to someone": "Envie isto para alguém",
  "Copied — paste it anywhere": "Copiado — cole em qualquer lugar",
  "Back to check-in": "Voltar ao check-in",
  "Someone else, today — Even Me": "Alguém mais, hoje — Even Me",
  "Someone else, today": "Alguém mais, hoje",
  "Done for today": "Terminado por hoje",
  "See your streak": "Ver sua sequência",
  "Meltdown just happened": "Uma crise acabou de acontecer",
  "School called": "A escola ligou",
  "Sensory overload": "Sobrecarga sensorial",
  "I've been masking all day": "Estive mascarando o dia todo",
  "I lost it": "Eu perdi a paciência",

  // ---------- Checkout return ----------
  "Thanks — Even Me": "Obrigada — Even Me",
  "Confirming your subscription…": "Confirmando sua assinatura…",
  "Just a moment while we save this on our end.":
    "Um momento enquanto salvamos por aqui.",
  "Thank you.": "Obrigada.",
  "You're all set. Taking you back to your check-in.":
    "Está tudo certo. Levando você de volta ao seu check-in.",
  "Almost there.": "Quase lá.",
  "Your payment went through, but we're still syncing. It usually takes a few seconds — try heading back to the app.":
    "Seu pagamento foi processado, mas ainda estamos sincronizando. Geralmente leva alguns segundos — tente voltar ao app.",

  // ---------- 404 / errors ----------
  "Page not found": "Página não encontrada",
  "The page you're looking for doesn't exist or has been moved.":
    "A página que você procura não existe ou foi movida.",
  "This page didn't load": "Esta página não carregou",
  "Something went wrong on our end. You can try refreshing or head back home.":
    "Algo deu errado por aqui. Tente atualizar ou voltar ao início.",

  // ---------- Journal prompts ----------
  "One word for how today felt in my body:": "Uma palavra para como hoje se sentiu no meu corpo:",
  "The moment I was proudest of myself today was…": "O momento em que mais me orgulhei de mim hoje foi…",
  "The thing I want to put down before bed is…": "A coisa que quero deixar de lado antes de dormir é…",
  "If I could give past-me one sentence of relief, it would be…":
    "Se eu pudesse dar à minha versão passada uma frase de alívio, seria…",
  "The smallest kind thing I noticed today was…":
    "A menor gentileza que notei hoje foi…",
  "What am I ready to stop apologizing for?":
    "Pelo que estou pronta para parar de me desculpar?",
  "What would 'enough' look like for the next hour?":
    "Como seria 'suficiente' para a próxima hora?",
  "One thing I did today that no one saw:":
    "Uma coisa que fiz hoje que ninguém viu:",
  "What am I carrying that isn't mine?":
    "O que estou carregando que não é meu?",
  "If today had a color, it would be…":
    "Se hoje tivesse uma cor, seria…",
  "One thing my body is asking for:":
    "Uma coisa que meu corpo está pedindo:",
  "A person I want to thank silently right now:":
    "Uma pessoa a quem quero agradecer em silêncio agora:",
  "Something I did today that took courage nobody noticed:":
    "Algo que fiz hoje que exigiu coragem e ninguém notou:",
  "What would today feel like if I forgave myself right now?":
    "Como seria hoje se eu me perdoasse agora?",
  "The version of me I miss is…":
    "A versão de mim de quem sinto falta é…",
  "One thing I want tomorrow to be a little softer than today:":
    "Uma coisa que quero que amanhã seja um pouco mais suave que hoje:",
  "What's a kind sentence I could say to myself, and mean?":
    "Qual frase gentil eu poderia dizer a mim mesma, e sentir?",
  "Where in my body am I holding today?":
    "Onde no meu corpo estou segurando o hoje?",
  "What did I not say out loud today that I wish I had?":
    "O que não disse em voz alta hoje que gostaria de ter dito?",
  "What would rest look like if it wasn't a reward?":
    "Como seria descansar se não fosse uma recompensa?",

  // ---------- Permission templates ----------
  "I give myself permission to do less today.":
    "Eu me dou permissão para fazer menos hoje.",
  "I give myself permission to be soft with myself.":
    "Eu me dou permissão para ser suave comigo mesma.",
  "I give myself permission to say no without a reason.":
    "Eu me dou permissão para dizer não sem motivo.",
  "I give myself permission to leave it undone.":
    "Eu me dou permissão para deixar sem terminar.",
  "I give myself permission to need what I need.":
    "Eu me dou permissão para precisar do que preciso.",
  "I give myself permission to change my mind.":
    "Eu me dou permissão para mudar de ideia.",
  "I give myself permission to rest before I 'deserve' it.":
    "Eu me dou permissão para descansar antes de 'merecer'.",
  "I give myself permission to take up space.":
    "Eu me dou permissão para ocupar espaço.",
  "I give myself permission to not be inspiring today.":
    "Eu me dou permissão para não ser inspiradora hoje.",
  "I give myself permission to be the one who gets cared for.":
    "Eu me dou permissão para ser cuidada.",
  "I give myself permission to be a person, not a plan.":
    "Eu me dou permissão para ser uma pessoa, não um plano.",
  "I give myself permission to protect my quiet.":
    "Eu me dou permissão para proteger meu silêncio.",

  // ---------- Gratitude prompts (foryou) ----------
  "One thing today that didn't go wrong.": "Uma coisa hoje que não deu errado.",
  "One person I'd thank silently right now.": "Uma pessoa a quem agradeceria em silêncio agora.",
  "One small comfort I have right now.": "Um pequeno conforto que tenho agora.",
  "One thing about my body I don't hate today.": "Uma coisa sobre meu corpo que não odeio hoje.",
  "One tiny moment this week that landed soft.": "Um pequeno momento desta semana que caiu suave.",

  // ---------- CTAs (items) ----------
  "Start breathing": "Começar a respirar",
  "Start 90-second reset": "Começar reset de 90 segundos",
  "Start 2-minute timer": "Começar timer de 2 minutos",
  "Start 5-minute timer": "Começar timer de 5 minutos",
  "Start 10-minute timer": "Começar timer de 10 minutos",
  "Name it": "Nomear",
  "Ground me": "Me ancore",
  "Start body scan": "Começar escaneamento corporal",
  "Get a prompt": "Pegar uma sugestão",
  "Give permission": "Dar permissão",
  "Log a tiny win": "Registrar uma pequena vitória",
  "Gratitude prompt": "Sugestão de gratidão",
  "Help me decide": "Me ajude a decidir",
  "Guide me": "Me guie",

  // ---------- Language toggle ----------
  "Switch to Portuguese": "Mudar para Português",
  "Switch to English": "Mudar para Inglês",

  // ---------- Content: ITEMS (foryou.ts). ~150 lines. ----------
  // affirmations
  "You're allowed to be tired and still be a good parent.": "Você tem o direito de estar cansada e ainda ser uma boa mãe.",
  "Rest is not a reward. It's maintenance.": "Descanso não é recompensa. É manutenção.",
  "You did not fail today. You survived a hard one.": "Você não fracassou hoje. Você sobreviveu a um dia difícil.",
  "Being patient took work today. That counts.": "Ter paciência deu trabalho hoje. Isso conta.",
  "You are more than the worst moment of your day.": "Você é mais do que o pior momento do seu dia.",
  "Your feelings are information, not verdicts.": "Seus sentimentos são informação, não sentenças.",
  "Slow is a legitimate speed.": "Devagar é uma velocidade legítima.",
  "You don't have to earn a break.": "Você não precisa ganhar um descanso.",
  "The love is there, even when the patience isn't.": "O amor está lá, mesmo quando a paciência não está.",
  "You are safe to feel this. It will move.": "É seguro sentir isto. Vai passar.",
  "You are not what your inner critic says right now.": "Você não é o que sua crítica interna diz agora.",
  "Small and consistent is a whole strategy.": "Pequeno e consistente já é uma estratégia inteira.",
  "You are the calm your kid comes back to.": "Você é a calma para onde seu filho volta.",
  "You get to be a person, not just a role.": "Você tem o direito de ser uma pessoa, não só um papel.",
  "Nothing about you is broken for needing help.": "Nada em você está quebrado por precisar de ajuda.",
  "A rough hour is not a rough life.": "Uma hora ruim não é uma vida ruim.",
  "You can love your kid and hate today.": "Você pode amar seu filho e odiar o dia de hoje.",
  "You are doing something invisible and enormous.": "Você está fazendo algo invisível e enorme.",
  "Softness is not weakness.": "Suavidade não é fraqueza.",
  "You are allowed to change your mind about the plan.": "Você tem o direito de mudar de ideia sobre o plano.",
  "Not everything needs a solution today.": "Nem tudo precisa de solução hoje.",
  "You can pause without quitting.": "Você pode pausar sem desistir.",
  "You've done impossible things quietly.": "Você já fez coisas impossíveis em silêncio.",
  "Your nervous system is trying to protect you.": "Seu sistema nervoso está tentando te proteger.",
  "You don't have to be okay to be loved.": "Você não precisa estar bem para ser amada.",
  "Repair is more powerful than perfection.": "Reparar é mais poderoso do que ser perfeita.",
  "You are the parent your kid needs — not a perfect one.": "Você é a mãe que seu filho precisa — não uma perfeita.",
  "You are still growing. Even now.": "Você ainda está crescendo. Mesmo agora.",
  "You are allowed to want your life to be easier.": "Você tem o direito de querer que sua vida seja mais fácil.",
  "You matter in this house too.": "Você também importa nesta casa.",

  // reflections
  "The fact that you're checking in on yourself is already the work. Most people skip this step.":
    "O fato de você fazer check-in consigo já é o trabalho. A maioria pula essa etapa.",
  "Overwhelm often just means: too many open tabs in your head. You don't have to close them all — just pick one to look at.":
    "Sobrecarga geralmente é só: muitas abas abertas na cabeça. Não precisa fechar todas — só escolha uma para olhar.",
  "Tired isn't a character flaw. It's a receipt for what you've been carrying.":
    "Cansada não é um defeito de caráter. É o recibo do que você vem carregando.",
  "Anger is often grief and exhaustion wearing louder clothes. You don't have to interrogate it — just notice it.":
    "Raiva geralmente é luto e exaustão em roupas mais barulhentas. Não precisa interrogá-la — só notar.",
  "Guilt shows up loudest in parents who care the most. That's not proof you failed. It's proof you love.":
    "A culpa é mais alta nas mães que mais se importam. Não é prova de fracasso. É prova de amor.",
  "You don't need a good reason to feel low. Some days are just weather.":
    "Você não precisa de um bom motivo para se sentir para baixo. Alguns dias são só clima.",
  "You can be lonely inside a house full of people. It doesn't mean anything is wrong with you.":
    "Dá para se sentir solitária dentro de uma casa cheia de gente. Isso não significa que há algo errado com você.",
  "Numb is a nervous system doing its job. Not a sign you don't care.":
    "Anestesia é o sistema nervoso fazendo seu trabalho. Não é sinal de que você não se importa.",
  "Contentment is quiet. That's why it's easy to miss. This is what it looks like when things are okay.":
    "A tranquilidade é silenciosa. Por isso é fácil de perder. É assim que parece quando está tudo bem.",
  "A little energy today doesn't have to be spent. You're allowed to bank some.":
    "Um pouco de energia hoje não precisa ser gasto. Você pode guardar um pouco.",
  "You're not behind. You're carrying more than the timeline accounts for.":
    "Você não está atrasada. Você carrega mais do que o cronograma considera.",
  "You are allowed to want a version of this that's easier — and still love the life you have.":
    "Você pode querer uma versão disto que seja mais fácil — e ainda amar a vida que tem.",
  "The bar for a 'good day' can be: everyone's still breathing and someone got a hug.":
    "A barra para um 'bom dia' pode ser: todo mundo ainda respirando e alguém recebeu um abraço.",
  "Anxious brains rehearse. It doesn't mean the thing will happen. It means your brain is being thorough.":
    "Cérebros ansiosos ensaiam. Não significa que a coisa vai acontecer. Significa que seu cérebro está sendo minucioso.",
  "You are not the mood you woke up in.": "Você não é o humor com que acordou.",
  "It's okay if today's plan is 'less than yesterday.'":
    "Tudo bem se o plano de hoje for 'menos que ontem'.",
  "You don't need to be inspired. You just need to be here.":
    "Você não precisa estar inspirada. Só precisa estar aqui.",
  "The right amount of doing today might be very little. That's still doing.":
    "A quantidade certa de fazer hoje pode ser muito pouca. Isso ainda é fazer.",
  "You're allowed to need what you need, even if no one else in the house needs it.":
    "Você pode precisar do que precisa, mesmo que ninguém mais na casa precise.",
  "Being 'on' for someone else's nervous system is real work. Of course you're depleted.":
    "Estar 'ligada' para o sistema nervoso de outra pessoa é trabalho de verdade. Claro que você está esgotada.",
  "You can love hard and still need distance sometimes. Both are true.":
    "Dá para amar muito e ainda precisar de distância às vezes. Ambos são verdade.",
  "Grateful and tired can share a chair.": "Grata e cansada podem dividir a mesma cadeira.",
  "Not every feeling needs a next step. Some just want to be seen.":
    "Nem todo sentimento precisa de um próximo passo. Alguns só querem ser vistos.",
  "You are allowed to be the one who needs care today.":
    "Você pode ser aquela que precisa de cuidado hoje.",
  "You already do the hardest parenting work: the invisible kind.":
    "Você já faz o trabalho mais difícil da maternidade: o invisível.",
  "Some days the win is just: I didn't disappear on myself.":
    "Alguns dias a vitória é só: eu não desapareci de mim.",

  // advice
  "If the day feels big, shrink the frame: what would help the next 20 minutes?":
    "Se o dia parece grande, encolha o quadro: o que ajudaria nos próximos 20 minutos?",
  "Eat something with protein. Half your bad mood might be a snack.":
    "Coma algo com proteína. Metade do mau humor pode ser fome.",
  "Drink a full glass of water before you make any decisions.":
    "Beba um copo cheio de água antes de tomar qualquer decisão.",
  "Lower one standard today on purpose. Pick which one.":
    "Baixe uma exigência hoje de propósito. Escolha qual.",
  "If you can't rest, at least stop adding. Cancel one thing.":
    "Se não pode descansar, pelo menos pare de adicionar. Cancele uma coisa.",
  "Get outside for 3 minutes. Not for a walk — just to change the air.":
    "Saia por 3 minutos. Não para caminhar — só para trocar de ar.",
  "Text the friend you keep meaning to text. Two sentences is a full message.":
    "Mande mensagem para a amiga que você vem tentando. Duas frases já são uma mensagem inteira.",
  "Put your phone in another room for 10 minutes. See what shows up.":
    "Coloque o celular em outro cômodo por 10 minutos. Veja o que aparece.",
  "Pick one micro-task under 2 minutes. Do only that. Stop.":
    "Escolha uma micro-tarefa de menos de 2 minutos. Faça só ela. Pare.",
  "Make the coffee. Sit down while you drink it.":
    "Faça o café. Sente-se enquanto bebe.",
  "Change your shirt. It sounds silly. It works.":
    "Troque de blusa. Parece bobo. Funciona.",
  "Warm your hands under running water for 30 seconds.":
    "Aqueça as mãos sob água corrente por 30 segundos.",
  "If you can, lie flat on the floor for two minutes.":
    "Se puder, deite no chão por dois minutos.",
  "Tomorrow-you does not need a lecture from today-you. Skip the pep talk. Just rest.":
    "A você de amanhã não precisa de sermão da você de hoje. Pule o discurso motivacional. Só descanse.",
  "Say the thing you're dreading out loud, to yourself. It usually shrinks.":
    "Diga em voz alta, para si mesma, a coisa que você está temendo. Geralmente encolhe.",
  "If you're spiraling, name three things you can see. That's it.":
    "Se está em espiral, nomeie três coisas que pode ver. É só isso.",
  "You don't have to answer the message today.":
    "Você não precisa responder a mensagem hoje.",
  "Order the food. Cook tomorrow.": "Peça a comida. Cozinhe amanhã.",
  "Ask for the smallest possible version of help.":
    "Peça a menor versão possível de ajuda.",
  "Turn one light off. Softer light, softer nervous system.":
    "Apague uma luz. Luz mais suave, sistema nervoso mais suave.",
  "Take off your shoes. Feet on the floor for a full minute.":
    "Tire os sapatos. Pés no chão por um minuto inteiro.",
  "Do the dish. Just one. Not because you should — because momentum is kind to you.":
    "Lave o prato. Só um. Não porque deve — porque o impulso é gentil com você.",
  "If everything feels urgent, nothing is. Pick.":
    "Se tudo parece urgente, nada é. Escolha.",
  "Sleep is a decision, not a reward. Go earlier than you think you should.":
    "Dormir é uma decisão, não uma recompensa. Vá mais cedo do que acha que deveria.",
  "Give the guilt a full minute. Then set it down and go do something small and kind for yourself.":
    "Dê à culpa um minuto inteiro. Depois coloque-a de lado e faça algo pequeno e gentil por você.",
  "Being angry doesn't mean you have to do anything with it right now. Let it sit.":
    "Estar com raiva não significa que você precisa fazer algo com ela agora. Deixe-a estar.",
  "If you can't nap, close your eyes for 6 minutes. It's not nothing.":
    "Se não pode tirar um cochilo, feche os olhos por 6 minutos. Não é nada.",
  "Loosen your jaw. Drop your shoulders. Unclench your hands. Repeat every hour.":
    "Solte a mandíbula. Abaixe os ombros. Solte as mãos. Repita a cada hora.",
  "Put on the same song three times. Let your body catch up.":
    "Coloque a mesma música três vezes. Deixe seu corpo acompanhar.",
  "Say 'no' to one small thing today. Practice for the bigger ones.":
    "Diga 'não' para uma pequena coisa hoje. Treino para as maiores.",
  "Praise yourself out loud for something tiny. It feels weird. Do it anyway.":
    "Elogie-se em voz alta por algo minúsculo. Parece estranho. Faça mesmo assim.",
  "Give yourself the same voice you'd use with a scared kid. That's the voice.":
    "Fale consigo com a mesma voz que usaria com uma criança assustada. É essa a voz.",
  "Don't clean up before you rest. Rest first. Clean if you feel like it.":
    "Não arrume antes de descansar. Descanse primeiro. Limpe se tiver vontade.",
  "Your body has been at DEFCON all day. It's allowed to take a while to come down.":
    "Seu corpo esteve em DEFCON o dia todo. Pode demorar um pouco para descer.",

  // actions
  "Take five slow breaths. Longer out than in.":
    "Faça cinco respirações lentas. Mais tempo soltando do que puxando.",
  "Ninety seconds of quiet. Nothing else on the plate.":
    "Noventa segundos de silêncio. Nada mais no prato.",
  "Two-minute reset. Lie down or lean against something.":
    "Reset de dois minutos. Deite ou apoie-se em algo.",
  "Five minutes of nothing. Set the timer, mean it.":
    "Cinco minutos de nada. Coloque o timer, faça sério.",
  "Ten quiet minutes. Somewhere in another room.":
    "Dez minutos de silêncio. Em outro cômodo.",
  "Name what you're feeling. Not the story around it — just the word.":
    "Nomeie o que está sentindo. Não a história em volta — só a palavra.",
  "Try the 5-4-3-2-1 grounding walk.":
    "Tente a ancoragem 5-4-3-2-1.",
  "Quick body scan — head to toes, one minute.":
    "Escaneamento corporal rápido — da cabeça aos pés, um minuto.",
  "Write one sentence in your journal. That's the whole thing.":
    "Escreva uma frase no diário. É só isso.",
  "Write yourself a permission slip.":
    "Escreva para si mesma uma autorização.",
  "Name one tiny win from today.":
    "Nomeie uma pequena vitória de hoje.",
  "One thing you're grateful for. First one that comes.":
    "Uma coisa pela qual você é grata. A primeira que vier.",
  "Ask yourself: what do I actually need right now?":
    "Pergunte-se: do que eu realmente preciso agora?",
  "One minute of loosening — jaw, shoulders, hands.":
    "Um minuto de soltar — mandíbula, ombros, mãos.",
  "Send a two-sentence text to a person who is safe for you.":
    "Envie uma mensagem de duas frases para alguém seguro para você.",

  // oneliners
  "You're not late. You're a person.": "Você não está atrasada. Você é uma pessoa.",
  "Even five deep breaths count.": "Até cinco respirações profundas contam.",
  "You are the safe place. Even now.": "Você é o lugar seguro. Mesmo agora.",
  "This too, is parenting.": "Isto também é maternidade.",
  "You're doing better than the voice in your head says.":
    "Você está indo melhor do que a voz na sua cabeça diz.",
  "You don't have to be fixed to be worthy.":
    "Você não precisa estar consertada para ter valor.",
  "Softness first. Everything else later.":
    "Suavidade primeiro. Todo o resto depois.",
  "It's fine to be a person who needs help.":
    "Tudo bem ser uma pessoa que precisa de ajuda.",
  "Nothing has to be figured out in the next hour.":
    "Nada precisa ser resolvido na próxima hora.",
  "You are allowed to be tired without a reason.":
    "Você pode estar cansada sem motivo.",
  "The house can be messy. You are still whole.":
    "A casa pode estar bagunçada. Você ainda é inteira.",
  "Being seen is a form of rest.":
    "Ser vista é uma forma de descanso.",
  "Your good enough is really good.":
    "Seu suficiente é realmente bom.",
  "Not every hard thing needs to become a lesson.":
    "Nem toda coisa difícil precisa virar lição.",
  "You already are the parent you were looking for.":
    "Você já é a mãe que estava procurando.",
  "Feeling it is doing something.":
    "Sentir isso já é fazer algo.",
  "You are allowed to close the loop tomorrow.":
    "Você pode fechar o ciclo amanhã.",
  "Being a soft place doesn't mean being an empty place.":
    "Ser um lugar suave não é ser um lugar vazio.",
  "One kind thing to yourself is enough for today.":
    "Uma coisa gentil consigo mesma basta para hoje.",
  "You are the best expert on your own tired.":
    "Você é a maior especialista no seu próprio cansaço.",
  "You're allowed to be picky about what you carry.":
    "Você pode ser exigente com o que carrega.",
  "The days that count are almost never the ones that feel like they count.":
    "Os dias que contam quase nunca são os que parecem contar.",
  "You are not the only one. You just feel like it right now.":
    "Você não é a única. Só se sente assim agora.",
  "Being kind to yourself is not a detour.":
    "Ser gentil consigo mesma não é um desvio.",
  "You get to be tired and hopeful at the same time.":
    "Você pode estar cansada e esperançosa ao mesmo tempo.",
  "You are not doing it wrong. You're doing it hard.":
    "Você não está fazendo errado. Você está fazendo o difícil.",

  // permissions (item cards)
  "You have permission to be a B+ parent today.":
    "Você tem permissão para ser uma mãe B+ hoje.",
  "You have permission to leave the dishes.":
    "Você tem permissão para deixar a louça.",
  "You have permission to say 'not now.'":
    "Você tem permissão para dizer 'agora não'.",
  "You have permission to want something for yourself.":
    "Você tem permissão para querer algo para si.",
  "You have permission to cry without a plan.":
    "Você tem permissão para chorar sem plano.",
  "You have permission to skip the shower thoughts and just take the shower.":
    "Você tem permissão para pular os pensamentos e só tomar banho.",
  "You have permission to phone-it-in on one meal today.":
    "Você tem permissão para fazer uma refeição no automático hoje.",
  "You have permission to be less available.":
    "Você tem permissão para estar menos disponível.",
  "You have permission to not enjoy every stage.":
    "Você tem permissão para não gostar de cada fase.",
  "You have permission to be soft with yourself, out loud.":
    "Você tem permissão para ser suave consigo, em voz alta.",
  "You have permission to take the easier route.":
    "Você tem permissão para pegar o caminho mais fácil.",
  "You have permission to not know yet.":
    "Você tem permissão para ainda não saber.",
  "You have permission to stop performing.":
    "Você tem permissão para parar de performar.",
  "You have permission to have needs that inconvenience someone else.":
    "Você tem permissão para ter necessidades que incomodam outra pessoa.",

  // gratitude prompts (in ITEMS)
  "One tiny thing today that didn't go wrong?":
    "Uma coisinha hoje que não deu errado?",
  "One person you're glad exists?":
    "Uma pessoa que você é grata que exista?",
  "One small comfort within reach right now?":
    "Um pequeno conforto ao seu alcance agora?",
  "One thing your body did for you today, no thanks required?":
    "Uma coisa que seu corpo fez por você hoje, sem precisar de agradecimento?",
  "One tiny moment of your kid that made you smile this week?":
    "Um pequeno momento do seu filho que te fez sorrir esta semana?",
  "One thing you'd tell past-you they eventually got right?":
    "Uma coisa que você diria à você do passado que ela acabou acertando?",

  // kindness
  "You showed up today. That's a lot in a world that's often loud and fast.":
    "Você apareceu hoje. Isso é muito num mundo que costuma ser alto e rápido.",
  "Someone, somewhere, feels safer because you exist.":
    "Alguém, em algum lugar, se sente mais segura porque você existe.",
  "You are not the sum of what you got done today.":
    "Você não é a soma do que conseguiu fazer hoje.",
  "If no one has told you this today: you are doing enough.":
    "Se ninguém te disse hoje: você está fazendo o suficiente.",
  "The way you love your kid — quiet, stubborn, tired — is the good kind.":
    "O jeito como você ama seu filho — quieto, teimoso, cansado — é o tipo bom.",
  "You are allowed to take up space in your own life.":
    "Você tem o direito de ocupar espaço na sua própria vida.",
  "The world is easier because you are gentle in it.":
    "O mundo é mais fácil porque você é gentil nele.",
  "You have already survived every worst day so far.":
    "Você já sobreviveu a todos os piores dias até agora.",
  "You don't have to be exceptional to be worth loving.":
    "Você não precisa ser excepcional para ser digna de amor.",
  "You are the one your kid pictures when they picture 'safe.' That's not nothing.":
    "Você é quem seu filho imagina quando imagina 'seguro'. Isso não é pouco.",

  // ---------- Tile content (evenme.ts CONTENT) ----------
  "That was a lot, and it's over now. His nervous system got flooded — not because of anything you did wrong. Take one slow breath. You don't have to analyze it yet. You just have to get through the next five minutes, and you're already doing that.":
    "Foi muita coisa, e agora acabou. O sistema nervoso dele ficou inundado — não por causa de nada que você fez de errado. Respire fundo devagar. Você não precisa analisar ainda. Só precisa passar pelos próximos cinco minutos, e já está fazendo isso.",
  "That was a rough one. I'm pretty depleted right now — can you take the next bit?":
    "Foi puxado. Estou bem esgotada agora — você pode assumir a próxima parte?",
  "Just had one in the cereal aisle. Sitting in my car for a minute before I go back in.":
    "Tive uma no corredor dos cereais. Estou sentada no carro por um minuto antes de voltar.",
  "Second one today. I'm so tired but he's okay now and so am I.":
    "A segunda hoje. Estou muito cansada, mas ele está bem agora e eu também.",
  "A phone call from school can make your whole chest go tight before you even answer. Whatever they said, you can respond later, calmer, in writing if you want to. You don't owe anyone an instant reaction.":
    "Uma ligação da escola aperta o peito antes mesmo de você atender. Seja lá o que disseram, você pode responder depois, mais calma, por escrito se quiser. Você não deve reação imediata a ninguém.",
  "School just called. I need a minute before I talk about it, ok?":
    "A escola acabou de ligar. Preciso de um minuto antes de conversar sobre isso, ok?",
  "Got 'the call' again at 2pm. I used to panic, now I just sigh and go pick him up.":
    "Recebi 'a ligação' de novo às 14h. Eu costumava entrar em pânico, agora só suspiro e vou buscá-lo.",
  "Same. Third time this month. I'm learning to breathe before I call back.":
    "Igual. Terceira vez neste mês. Estou aprendendo a respirar antes de retornar.",
  "Overload isn't dramatic, it's real. Whether it's his or yours, the fix is the same: less input, right now. Dim something, quiet something, sit somewhere plain for two minutes.":
    "Sobrecarga não é drama, é real. Seja dele ou sua, a solução é a mesma: menos estímulo, agora. Diminua uma luz, silencie algo, sente-se em algum lugar simples por dois minutos.",
  "I need five minutes of quiet, no talking, before I can be fully here.":
    "Preciso de cinco minutos de silêncio, sem falar, antes de conseguir estar totalmente aqui.",
  "Both of us were overloaded by 4pm today. We just sat in the dark for a bit.":
    "Nós duas ficamos sobrecarregadas às 16h hoje. Só ficamos sentadas no escuro por um tempo.",
  "I didn't know moms could get sensory overload too until I found this app, honestly.":
    "Sinceramente, eu não sabia que mães também podiam ter sobrecarga sensorial até encontrar este app.",
  "Holding it together all day is its own kind of exhausting, even though nobody sees the effort. You don't have to keep performing calm right now. This is a safe place to stop.":
    "Segurar tudo o dia inteiro é um tipo próprio de exaustão, mesmo que ninguém veja o esforço. Você não precisa continuar performando calma agora. Este é um lugar seguro para parar.",
  "I've been holding it together all day and I'm running on empty. Can we talk tonight?":
    "Estive segurando tudo o dia inteiro e estou na reserva. Podemos conversar hoje à noite?",
  "Smiled through an entire birthday party today while screaming internally. Made it home.":
    "Sorri durante uma festa de aniversário inteira hoje enquanto gritava por dentro. Cheguei em casa.",
  "Masking at work AND at pickup today. I'm so tired of performing fine.":
    "Mascarando no trabalho E na saída da escola hoje. Estou tão cansada de fingir que estou bem.",
  "You are not failing him. You are parenting a kid whose needs are genuinely harder than average, with genuinely less support than you deserve. That's not the same as doing it wrong.":
    "Você não está falhando com ele. Você está criando uma criança cujas necessidades são genuinamente mais difíceis que a média, com muito menos apoio do que você merece. Isso não é o mesmo que fazer errado.",
  "Having a hard guilt day. Not asking you to fix it, just wanted to say it out loud to someone.":
    "Estou tendo um dia difícil de culpa. Não estou pedindo para consertar, só queria dizer em voz alta para alguém.",
  "Cried in the shower about something dumb I said this morning. Still love him more than anything.":
    "Chorei no banho por uma bobagem que disse esta manhã. Ainda o amo mais do que tudo.",
  "Guilt is so loud today. Trying to remember it's not the same as truth.":
    "A culpa está muito alta hoje. Tentando lembrar que ela não é a mesma coisa que a verdade.",
  "You yelled. That's human, not a verdict on you as a mother. Repair matters more than perfection — a short, honest 'I'm sorry I yelled, that wasn't about you' goes a long way, when you're ready.":
    "Você gritou. Isso é humano, não uma sentença sobre você como mãe. Reparar importa mais que ser perfeita — um breve e honesto 'desculpe por ter gritado, não foi sobre você' faz muita diferença, quando estiver pronta.",
  "I lost my temper earlier and I feel bad about it. Just needed to say that out loud.":
    "Perdi a paciência mais cedo e me sinto mal com isso. Só precisava dizer isso em voz alta.",
  "Snapped hard at dinner. Going to go apologize once we've both cooled down.":
    "Explodi no jantar. Vou pedir desculpas quando nós duas nos acalmarmos.",
  "Yelled today. Repaired it after. Still a good mom. Repeating that to myself.":
    "Gritei hoje. Reparei depois. Ainda sou uma boa mãe. Repetindo isso para mim mesma.",

  // ---- Guided flow ----
  Next: "Próximo",
  "Start this": "Começar",
  "Picked for you": "Escolhido para você",
  "Show me a different one": "Me mostre outro",
  "Give me another moment": "Me dê outro momento",
  "Picked for how you felt today": "Escolhido para como você se sentiu hoje",
  "Tools that help with this": "Ferramentas que ajudam nisso",
  "Words for this": "Palavras para isso",
  "All tools": "Todas as ferramentas",
  "Grouped by what they're for.": "Agrupadas pelo que servem.",
  "Let's keep this very small. One thing at a time.":
    "Vamos manter isso bem pequeno. Uma coisa de cada vez.",
  "No rush. One thing at a time.": "Sem pressa. Uma coisa de cada vez.",
  "Here's your moment. One thing at a time.":
    "Este é o seu momento. Uma coisa de cada vez.",
  "You've got a little to spend today. One thing at a time.":
    "Você tem um pouco para gastar hoje. Uma coisa de cada vez.",
  "You showed up for yourself. That counted.":
    "Você apareceu por você mesma. Isso contou.",
  "Nothing else to do now. Put the phone down.":
    "Nada mais a fazer agora. Pode largar o celular.",

  // ---- Tool groups ----
  "Calm down": "Se acalmar",
  "When your body is louder than your thoughts.":
    "Quando o corpo fala mais alto que os pensamentos.",
  "Get unstuck": "Destravar",
  "When everything is a blur of next things.":
    "Quando tudo vira um borrão de próximas coisas.",
  "Feel less alone": "Se sentir menos sozinha",
  "When the day was yours to carry by yourself.":
    "Quando o dia foi só seu para carregar.",
  "Restore energy": "Recuperar energia",
  "When there's nothing left in the tank.": "Quando não sobrou nada no tanque.",

  // ---- New tools ----
  "Three sighs": "Três suspiros",
  "The fastest way down. Twenty seconds.": "O caminho mais rápido. Vinte segundos.",
  "Cool water": "Água fresca",
  "Wrists or face. Forty-five seconds.": "Pulsos ou rosto. Quarenta e cinco segundos.",
  Unclench: "Destravar o corpo",
  "Jaw, shoulders, hands. Let go on purpose.":
    "Mandíbula, ombros, mãos. Solte de propósito.",
  "Hand on heart": "Mão no coração",
  "One minute of the care you give everyone else.":
    "Um minuto do cuidado que você dá a todo mundo.",
  "Shake it out": "Sacudir",
  "Thirty seconds of moving the feeling through.":
    "Trinta segundos para o sentimento atravessar.",
  "Look far away": "Olhar longe",
  "Twenty seconds of distance for tired eyes.":
    "Vinte segundos de distância para olhos cansados.",
  "Sound off": "Desligar um som",
  "Turn one noise off for a minute.": "Desligue um barulho por um minuto.",
  "Count back from five": "Contar de cinco a um",
  "Slow and boring. Interrupts the spiral.":
    "Devagar e sem graça. Interrompe a espiral.",
  "Warm drink": "Bebida quente",
  "Make one. Hold it before you drink it.":
    "Faça uma. Segure antes de beber.",
  "The one thing rule": "A regra da única coisa",
  "Pick the next thing. Everything else waits.":
    "Escolha a próxima coisa. O resto espera.",
  "Text a safe person": "Mande mensagem para alguém seguro",
  "Words already written for you.": "As palavras já estão escritas para você.",
  "Tomorrow's one kindness": "Uma gentileza para amanhã",
  "Choose something small for tomorrow-you.":
    "Escolha algo pequeno para a você de amanhã.",

  // ---- Tool reasons ----
  "Your body is running hot. Three long sighs bring the alarm down faster than talking does.":
    "Seu corpo está a mil. Três suspiros longos baixam o alarme mais rápido do que falar.",
  "You don't have much left, so this asks for one minute and nothing else.":
    "Não sobrou muito em você, então isso pede um minuto e nada mais.",
  "A longer out-breath than in-breath tells your body the emergency is over.":
    "Soltar o ar por mais tempo do que puxar avisa ao corpo que a emergência passou.",
  "You've been holding your jaw and shoulders all day. Letting go is quicker than calming down.":
    "Você segurou a mandíbula e os ombros o dia todo. Soltar é mais rápido do que se acalmar.",
  "When feelings are too big for words, cool water gives your system a different signal to follow.":
    "Quando o sentimento é grande demais para palavras, a água fresca dá outro sinal ao corpo.",
  "That charge in your chest needs somewhere to go. Thirty seconds of movement moves it through.":
    "Aquela carga no peito precisa de saída. Trinta segundos de movimento fazem ela passar.",
  "Your head is somewhere else. Naming what's actually in the room brings you back to it.":
    "Sua cabeça está longe. Nomear o que está no cômodo traz você de volta.",
  "The spiral needs something boring to trip over. Five slow numbers will do it.":
    "A espiral precisa tropeçar em algo sem graça. Cinco números lentos bastam.",
  "You can do this lying down. It asks nothing except noticing.":
    "Dá para fazer deitada. Só pede que você perceba.",
  "Too much at once is the problem, not you. Pick one next thing and let the rest wait.":
    "O problema é tudo ao mesmo tempo, não você. Escolha uma coisa e deixe o resto esperar.",
  "You've been deciding all day. This decides one small thing for you.":
    "Você decidiu o dia inteiro. Isso decide uma coisinha por você.",
  "It's hard to soothe a feeling you haven't named. Naming it takes some of its power.":
    "É difícil acalmar um sentimento sem nome. Nomear tira parte da força dele.",
  "The guilt loop keeps going until someone says it's allowed. Today that's you.":
    "O ciclo de culpa continua até alguém dizer que pode. Hoje esse alguém é você.",
  "One sentence, not a page. Enough to get today out of your head.":
    "Uma frase, não uma página. O bastante para tirar o dia da cabeça.",
  "Reaching out is heavy when you're this tired, so the words are already written for you.":
    "Pedir ajuda pesa quando se está tão cansada, então as palavras já estão prontas.",
  "You give this exact kind of care all day. One minute of it comes back to you.":
    "Você dá exatamente esse cuidado o dia todo. Um minuto dele volta para você.",
  "Nobody saw what you did today. This is where it gets written down anyway.":
    "Ninguém viu o que você fez hoje. Aqui fica registrado mesmo assim.",
  "Something felt tender-good today. Naming it makes it stay a little longer.":
    "Algo foi bom e delicado hoje. Nomear faz durar um pouco mais.",
  "A small warm thing, made only for you. That's the whole point of it.":
    "Uma coisinha quente, feita só para você. É esse o ponto.",
  "Your eyes have been close-up all day. Twenty seconds of distance unwinds more than you'd think.":
    "Seus olhos ficaram de perto o dia todo. Vinte segundos de distância relaxam mais do que parece.",
  "Sensory overload is real for you too. Turning one noise off is one less thing asking for you.":
    "A sobrecarga sensorial também é sua. Desligar um barulho é uma coisa a menos pedindo de você.",
  "Two minutes of nothing. Short enough that you can actually take it.":
    "Dois minutos de nada. Curto o bastante para você conseguir tirar.",
  "A real pause, still short enough to fit in the day you're having.":
    "Uma pausa de verdade, ainda curta o bastante para caber no seu dia.",
  "You have a little to spend. Spend it somewhere that isn't this room.":
    "Você tem um pouco para gastar. Gaste em outro cômodo que não este.",
  "Today's nearly done. Leave one small kindness out for tomorrow-you.":
    "O dia está quase no fim. Deixe uma gentileza para a você de amanhã.",

  // Privacy policy
  "This page is maintained by EvenMe to answer common privacy questions about the EvenMe service.":
    "Esta página é mantida pela EvenMe para responder perguntas comuns sobre privacidade do serviço EvenMe.",
  "Privacy Policy for EvenMe": "Política de Privacidade do EvenMe",
  "Last updated: July 29, 2026.": "Última atualização: 29 de julho de 2026.",
  "This Privacy Policy describes how EvenMe (\"we,\" \"us,\" or \"our\") collects, uses, and protects information when you use our mobile application and website (the \"Service\").":
    "Esta Política de Privacidade descreve como o EvenMe (\"nós,\" \"nos,\" ou \"nosso\") coleta, usa e protege as informações quando você usa nosso aplicativo móvel e site (o \"Serviço\").",
  "1. Information We Collect": "1. Informações que Coletamos",
  "Account Information": "Informações da Conta",
  "When you create an account, we collect information such as your email address and any other details you provide during sign-up. This information is stored and managed through our authentication provider, Supabase.":
    "Quando você cria uma conta, coletamos informações como seu endereço de e-mail e quaisquer outros detalhes fornecidos durante o cadastro. Essas informações são armazenadas e gerenciadas por meio do nosso provedor de autenticação, Supabase.",
  "Payment Information": "Informações de Pagamento",
  "If you make a purchase or subscribe through EvenMe, payment processing is handled entirely by Stripe, a third-party payment processor. We do not directly collect, store, or have access to your full credit card number or sensitive payment credentials. Stripe's own privacy policy governs how they handle this data, available at":
    "Se você fizer uma compra ou assinar o EvenMe, o processamento de pagamentos é feito inteiramente pela Stripe, um processador de pagamentos terceirizado. Não coletamos, armazenamos ou temos acesso ao número completo do seu cartão de crédito ou a dados de pagamento sensíveis. A política de privacidade da Stripe rege como eles tratam esses dados, disponível em",
  "Usage Information": "Informações de Uso",
  "We may collect basic information about how you interact with the Service to help us maintain and improve it.":
    "Podemos coletar informações básicas sobre como você interage com o Serviço para nos ajudar a mantê-lo e melhorá-lo.",
  "2. How We Use Your Information": "2. Como Usamos Suas Informações",
  "We use the information we collect to:": "Usamos as informações que coletamos para:",
  "Create and manage your account": "Criar e gerenciar sua conta",
  "Process payments and subscriptions": "Processar pagamentos e assinaturas",
  "Provide, maintain, and improve the Service": "Fornecer, manter e melhorar o Serviço",
  "Communicate with you about your account or updates to the Service":
    "Comunicar-nos com você sobre sua conta ou atualizações do Serviço",
  "Ensure the security and integrity of the Service": "Garantir a segurança e integridade do Serviço",
  "3. How We Share Your Information": "3. Como Compartilhamos Suas Informações",
  "We do not sell your personal information. We may share information with:":
    "Não vendemos suas informações pessoais. Podemos compartilhar informações com:",
  "Service providers (such as Supabase and Stripe) who help us operate the Service, under their own privacy and security obligations":
    "Provedores de serviços (como Supabase e Stripe) que nos ajudam a operar o Serviço, sob suas próprias obrigações de privacidade e segurança",
  "Legal authorities, if required to comply with the law, protect our rights, or ensure user safety":
    "Autoridades legais, se necessário para cumprir a lei, proteger nossos direitos ou garantir a segurança dos usuários",
  "4. Data Storage and Security": "4. Armazenamento e Segurança de Dados",
  "Your account information is stored securely through Supabase's infrastructure. Payment information is stored and secured by Stripe in accordance with industry-standard security practices (including PCI-DSS compliance). While we take reasonable measures to protect your information, no method of transmission or storage is 100% secure.":
    "As informações da sua conta são armazenadas com segurança por meio da infraestrutura da Supabase. As informações de pagamento são armazenadas e protegidas pela Stripe de acordo com práticas padrão da indústria (incluindo conformidade com PCI-DSS). Embora tomemos medidas razoáveis para proteger suas informações, nenhum método de transmissão ou armazenamento é 100% seguro.",
  "5. Your Choices and Rights": "5. Suas Escolhas e Direitos",
  "You may:": "Você pode:",
  "Access, update, or delete your account information by contacting us":
    "Acessar, atualizar ou excluir as informações da sua conta entrando em contato conosco",
  "Request a copy of the personal data we hold about you": "Solicitar uma cópia dos dados pessoais que mantemos sobre você",
  "Withdraw consent for data processing, where applicable": "Retirar o consentimento para o processamento de dados, quando aplicável",
  "To exercise any of these rights, please contact us at": "Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail",
  "6. Children's Privacy": "6. Privacidade de Crianças",
  "EvenMe is intended for a general adult audience. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.":
    "O EvenMe é destinado a um público adulto em geral. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se você acredita que uma criança nos forneceu informações pessoais, entre em contato para que possamos removê-las.",
  "7. Changes to This Policy": "7. Alterações a Esta Política",
  "We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the \"Last updated\" date above.":
    "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos os usuários sobre mudanças significativas atualizando a data de \"Última atualização\" acima.",
  "8. Contact Us": "8. Entre em Contato",
  "If you have any questions about this Privacy Policy, please contact us at:":
    "Se tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:",
  "Email:": "E-mail:",
  "Website:": "Site:",

  // Terms of Use
  "This page is maintained by EvenMe to set out the rules and expectations for using the EvenMe service.":
    "Esta página é mantida pela EvenMe para estabelecer as regras e expectativas de uso do serviço EvenMe.",
  "Terms of Use for EvenMe": "Termos de Uso do EvenMe",
  "Welcome to EvenMe. These Terms of Use (\"Terms\") govern your access to and use of the EvenMe mobile application and website (together, the \"Service\"), operated by Bruna Raquel Dagostino (\"we,\" \"us,\" or \"our\"). By creating an account or using the Service, you agree to these Terms. If you do not agree, please do not use the Service.":
    "Bem-vinda ao EvenMe. Estes Termos de Uso (\"Termos\") regem seu acesso e uso do aplicativo móvel e site do EvenMe (juntos, o \"Serviço\"), operado por Bruna Raquel Dagostino (\"nós,\" \"nos,\" ou \"nosso\"). Ao criar uma conta ou usar o Serviço, você concorda com estes Termos. Se não concordar, por favor, não use o Serviço.",
  "1. The Service": "1. O Serviço",
  "EvenMe provides mood and energy check-ins along with personalized suggestions intended to support everyday emotional wellbeing. EvenMe is not a substitute for professional medical or mental health care, diagnosis, or treatment. If you are experiencing a crisis or having thoughts of harming yourself, please contact emergency services or a crisis helpline in your area immediately.":
    "O EvenMe oferece check-ins de humor e energia junto com sugestões personalizadas destinadas a apoiar o bem-estar emocional do dia a dia. O EvenMe não substitui cuidados médicos ou de saúde mental profissionais, diagnóstico ou tratamento. Se você estiver em crise ou tendo pensamentos de se machucar, entre em contato imediatamente com os serviços de emergência ou uma linha de crise na sua região.",
  "2. Eligibility": "2. Elegibilidade",
  "The Service is intended for general audiences and adults. By using the Service, you confirm that you are legally able to enter into these Terms in your jurisdiction.":
    "O Serviço é destinado ao público em geral e a adultos. Ao usar o Serviço, você confirma que é legalmente capaz de aceitar estes Termos na sua jurisdição.",
  "3. Accounts": "3. Contas",
  "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Please notify us promptly if you suspect unauthorized use of your account.":
    "Você é responsável por manter a confidencialidade das credenciais da sua conta e por toda atividade realizada sob ela. Por favor, nos avise prontamente se suspeitar de uso não autorizado da sua conta.",
  "4. Free Access and Subscriptions": "4. Acesso Gratuito e Assinaturas",
  "Free access: New users may access one piece of advice or content from EvenMe free of charge before being asked to subscribe.":
    "Acesso gratuito: novos usuários podem acessar uma dica ou conteúdo do EvenMe gratuitamente antes de serem convidados a assinar.",
  "Subscription plans: Continued access to EvenMe's full features requires a paid subscription, offered as either a Weekly Plan or an Annual Plan, at the prices displayed in the app at the time of purchase.":
    "Planos de assinatura: o acesso contínuo a todos os recursos do EvenMe requer uma assinatura paga, oferecida como Plano Semanal ou Plano Anual, nos preços exibidos no app no momento da compra.",
  "Billing: If you subscribe through the iOS app, payment is processed through your Apple ID account, and your subscription automatically renews unless you turn off auto-renewal at least 24 hours before the end of the current period. Payment will be charged to your Apple ID account at confirmation of purchase.":
    "Cobrança: se você assinar pelo app iOS, o pagamento é processado pela sua conta Apple ID, e a assinatura é renovada automaticamente a menos que você desative a renovação automática com pelo menos 24 horas de antecedência antes do fim do período atual. O pagamento será cobrado na sua conta Apple ID na confirmação da compra.",
  "Managing your subscription: You can manage or cancel your subscription at any time through your device's Settings (Settings → [Your Name] → Subscriptions on iOS), or through your account settings if you subscribed via our website.":
    "Gerenciamento da assinatura: você pode gerenciar ou cancelar sua assinatura a qualquer momento pelos Ajustes do dispositivo (Ajustes → [Seu Nome] → Assinaturas no iOS), ou pelas configurações da sua conta se assinou pelo nosso site.",
  "5. Cancellation and Refunds": "5. Cancelamento e Reembolsos",
  "You may cancel your subscription at any time. Cancelling stops future renewal charges, but you will continue to have access to paid features through the end of the period you already paid for.":
    "Você pode cancelar sua assinatura a qualquer momento. O cancelamento interrompe cobranças futuras de renovação, mas você continuará tendo acesso aos recursos pagos até o fim do período já pago.",
  "Annual Plan: The Annual Plan is billed as a single upfront payment covering a full year of access. If you cancel partway through the year, your access continues until the end of the paid annual period, but no partial refund will be issued for the unused portion.":
    "Plano Anual: o Plano Anual é cobrado como um único pagamento antecipado que cobre um ano inteiro de acesso. Se cancelar no meio do ano, seu acesso continua até o fim do período anual pago, mas não será emitido reembolso parcial pela parte não usada.",
  "Weekly Plan: The Weekly Plan renews on a weekly basis. Cancelling stops future weekly charges; the current paid week is non-refundable but remains active until it ends.":
    "Plano Semanal: o Plano Semanal é renovado semanalmente. O cancelamento interrompe cobranças semanais futuras; a semana paga atual não é reembolsável, mas permanece ativa até o fim.",
  "Refund requests for purchases made through the Apple App Store are handled by Apple in accordance with Apple's own refund policies, not by us directly.":
    "Pedidos de reembolso para compras feitas pela Apple App Store são tratados pela Apple de acordo com as próprias políticas de reembolso da Apple, não por nós diretamente.",
  "6. Acceptable Use": "6. Uso Aceitável",
  "You agree not to misuse the Service, including attempting to interfere with its normal operation, reverse-engineer the app, or use it for any unlawful purpose.":
    "Você concorda em não usar o Serviço de forma indevida, incluindo tentar interferir em seu funcionamento normal, fazer engenharia reversa do app ou usá-lo para qualquer finalidade ilícita.",
  "7. Content and Intellectual Property": "7. Conteúdo e Propriedade Intelectual",
  "All content, design, and materials provided through EvenMe are owned by us or our licensors and are protected by applicable intellectual property laws. You may not copy, distribute, or create derivative works from the Service without our permission.":
    "Todo conteúdo, design e materiais fornecidos pelo EvenMe são de nossa propriedade ou de nossos licenciadores e são protegidos pelas leis de propriedade intelectual aplicáveis. Você não pode copiar, distribuir ou criar obras derivadas do Serviço sem nossa permissão.",
  "8. Disclaimer of Warranties": "8. Isenção de Garantias",
  "The Service is provided \"as is\" without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or suitable for any particular purpose.":
    "O Serviço é fornecido \"no estado em que se encontra\" sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o Serviço será ininterrupto, livre de erros ou adequado a qualquer finalidade específica.",
  "9. Limitation of Liability": "9. Limitação de Responsabilidade",
  "To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.":
    "No máximo permitido por lei, não nos responsabilizamos por quaisquer danos indiretos, incidentais ou consequenciais decorrentes do uso do Serviço por você.",
  "10. Changes to These Terms": "10. Alterações a Estes Termos",
  "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.":
    "Podemos atualizar estes Termos periodicamente. O uso contínuo do Serviço após as alterações entrarem em vigor constitui aceitação dos Termos revisados.",
  "11. Contact": "11. Contato",
  "Questions about these Terms can be sent to": "Dúvidas sobre estes Termos podem ser enviadas para",
  "This document is a general starting template and does not constitute legal advice. If you want full legal certainty for your specific business, consider having it reviewed by a lawyer.":
    "Este documento é um modelo inicial geral e não constitui aconselhamento jurídico. Se quiser total segurança jurídica para o seu negócio específico, considere revisá-lo com um advogado.",

  // Paywall footer links
  "By subscribing, you agree to our": "Ao assinar, você concorda com nossos",
  "Terms of Use": "Termos de Uso",
  "Privacy Policy": "Política de Privacidade",
  "and": "e",
  // Sign in + paywall copy (new)
  "Keep becoming the best version of yourself.": "Continue se tornando a melhor versão de você mesma.",
  "Full access to all tools, unlimited advices, unlimited exercises.": "Acesso completo a todas as ferramentas, conselhos ilimitados, exercícios ilimitados.",
  "Pay weekly or annually.": "Pague semanalmente ou anualmente.",
  "Already using Even Me?": "Já usa o Even Me?",
  "Sign in": "Entrar",
  "Welcome back.": "Bem-vinda de volta.",
  "Enter the email you used before and we'll bring your access back.":
    "Digite o e-mail que você usou antes e traremos seu acesso de volta.",
  "Please enter the email you used before.": "Digite o e-mail que você usou antes.",
  "We remembered your email, but we couldn't find an active subscription for it.":
    "Guardamos seu e-mail, mas não encontramos uma assinatura ativa para ele.",
  "We saved your email on this device. You can continue.":
    "Salvamos seu e-mail neste dispositivo. Você pode continuar.",
  "Continue to my check-in": "Ir para o meu check-in",
  "Subscribe instead": "Prefiro assinar",

  // Three-at-a-time
  "Three at a time. That's on purpose.": "Três de cada vez. Isso é de propósito.",
  "Show me three more": "Mostre outras três",
  "Carry one word with you": "Leve uma palavra com você",

  // New motherhood tools
  "Mental-load dump": "Descarregar a carga mental",
  "Ninety seconds. Name what isn't yours to carry.":
    "Noventa segundos. Diga o que não é seu para carregar.",
  "Where the tired lives": "Onde mora o cansaço",
  "Jaw, shoulders, lower back, hands.": "Mandíbula, ombros, lombar, mãos.",
  "Permission phrases": "Frases de permissão",
  "One line at a time. Nothing to do.": "Uma frase por vez. Nada a fazer.",
  "One-breath reset": "Reinício de uma respiração",
  "Twenty seconds between demands.": "Vinte segundos entre as demandas.",
  "5-4-3-2-1 at home": "5-4-3-2-1 em casa",
  "Ground with what's actually around you.": "Se ancore no que está realmente ao seu redor.",
  "Tiny reclamation": "Pequena retomada",
  "One small thing that's just for you.": "Uma coisinha que é só sua.",
  "Still here": "Ainda aqui",
  "A person underneath the roles.": "Uma pessoa debaixo dos papéis.",
  "Carry one word": "Leve uma palavra",
  "Pick a calm word for the rest of today.": "Escolha uma palavra calma para o resto do dia.",

  // New tool reasons
  "Your head is holding things that aren't yours to carry tonight. Naming three of them is enough.":
    "Sua cabeça guarda coisas que não são suas para carregar hoje à noite. Nomear três já basta.",
  "The work you did today doesn't show up anywhere except your body. This just asks where it went.":
    "O trabalho que você fez hoje só aparece no seu corpo. Isso só pergunta onde ele ficou.",
  "One line at a time, for the part of you that keeps asking whether this is allowed.":
    "Uma frase por vez, para a parte de você que sempre pergunta se isso é permitido.",
  "Twenty seconds, standing where you are. It fits between one demand and the next.":
    "Vinte segundos, onde você está. Cabe entre uma demanda e a próxima.",
  "You don't have to go anywhere. Ground using the room you're already standing in.":
    "Você não precisa ir a lugar nenhum. Se ancore no lugar onde você já está.",
  "One small thing in the next hour that belongs to you and nobody else.":
    "Uma coisinha na próxima hora que pertence a você e a mais ninguém.",
  "The roles have been loud today. This is a minute of being a person underneath them.":
    "Os papéis estaram altos hoje. Este é um minuto de ser a pessoa debaixo deles.",
  "Nothing to do or finish. Just one calm word to keep for the rest of today.":
    "Nada para fazer ou terminar. Só uma palavra calma para guardar hoje.",

  // Motherhood phrases
  "I can be a good mother and still need a minute.":
    "Eu posso ser uma boa mãe e ainda precisar de um minuto.",
  "My nervous system matters too.": "Meu sistema nervoso também importa.",
  "This feeling doesn't make me a bad mom.": "Este sentimento não me faz uma mãe ruim.",
  "I don't have to earn rest.": "Eu não preciso merecer o descanso.",
  "I'm allowed to be interrupted and still come back to myself.":
    "Eu posso ser interrompida e ainda voltar para mim.",
  "I can love this life and still miss the person I was in it.":
    "Eu posso amar esta vida e ainda sentir falta da pessoa que eu era nela.",
  "You showed up for yourself for 90 seconds. That's not nothing.":
    "Você apareceu por você mesma por 90 segundos. Isso não é pouco.",
  "The mother is also someone's whole person.": "A mãe também é uma pessoa inteira.",
  "Nobody claps for the invisible parts. They still count.":
    "Ninguém aplaude as partes invisíveis. Elas contam do mesmo jeito.",
  "You are still a person underneath the roles. She didn't leave. She's just been busy.":
    "Você ainda é uma pessoa debaixo dos papéis. Ela não foi embora. Só andou ocupada.",
  "The load nobody sees is still a load. Appointments, textures, who needs what at 4pm — that's work.":
    "A carga que ninguém vê ainda é carga. Consultas, texturas, quem precisa do quê às 16h — isso é trabalho.",
  "You are the one holding the whole map in your head. Of course you're tired by evening.":
    "É você que guarda o mapa inteiro na cabeça. Claro que você está cansada à noite.",
  "Some of what's in your head right now isn't yours to carry tonight. You're allowed to set it down without solving it.":
    "Parte do que está na sua cabeça agora não é sua para carregar hoje. Você pode colocar no chão sem resolver.",
  "Motherhood changed who you are. Grieving part of that isn't ingratitude.":
    "A maternidade mudou quem você é. Sentir luto por isso não é ingratidão.",
  "You get interrupted mid-sentence, mid-thought, mid-need. That's not a focus problem. That's the job.":
    "Você é interrompida no meio da frase, do pensamento, da necessidade. Não é falta de foco. É o trabalho.",
  "Being the calm one all day doesn't mean you were calm. It means you did it anyway.":
    "Ser a calma o dia todo não quer dizer que você estava calma. Quer dizer que você fez isso mesmo assim.",
  "You have been someone's whole world today. You're allowed to be your own for a minute.":
    "Você foi o mundo inteiro de alguém hoje. Você pode ser o seu por um minuto.",
  "Nobody handed you a manual for this kid. You've been writing it as you go.":
    "Ninguém te deu um manual para esta criança. Você vem escrevendo ele no caminho.",
  "The bathroom, the car, the kitchen sink — a reset doesn't need a nice room.":
    "O banheiro, o carro, a pia da cozinha — um reinício não precisa de um lugar bonito.",
  "If a child is nearby, do it anyway. Quiet and one long exhale is enough.":
    "Se tem uma criança por perto, faça de qualquer forma. Silêncio e uma expiração longa bastam.",
  "Name three things living in your head that aren't yours to carry right now. Don't solve them. Just name them.":
    "Diga três coisas que moram na sua cabeça e não são suas para carregar agora. Não resolva. Só nomeie.",
  "Ask where the tired is living in your body today — jaw, shoulders, lower back, hands.":
    "Pergunte onde o cansaço mora no seu corpo hoje — mandíbula, ombros, lombar, mãos.",
  "Pick one small thing in the next hour that's just for you. Thirty seconds of silence counts.":
    "Escolha uma coisinha na próxima hora que seja só sua. Trinta segundos de silêncio contam.",
  "One long exhale. The 20-second reset between demands.":
    "Uma expiração longa. O reinício de 20 segundos entre as demandas.",
  "Ground with what's actually around you: five things in this room…":
    "Se ancore no que está ao seu redor: cinco coisas nesta sala…",
  "Carry one calm word with you for the rest of today.":
    "Leve uma palavra calma com você pelo resto do dia.",
};

