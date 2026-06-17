const storageKey = "diarium:v1";
const todayKey = dateKey(new Date());
const liturgyApiBase = "https://liturgia.up.railway.app/v3/";
const vaticanBaseUrl = "https://www.vaticannews.va";

const fallbackSaints = {
  "06-15": {
    source: "fallback",
    saints: [
      {
        name: "S. Vito, mártir em Lucânia na Itália",
        isFavorite: "true",
        summary: "O único dado histórico sobre São Vito foi seu martírio na Lucânia. Seu culto vem desde a Idade Média. Talvez, natural da Sicília, é conhecido por prodígios de curas. Por isso, é invocado contra a epilepsia e a coreia, chamadas \"dança de São Vito\", que causam movimentos incontroláveis.",
        image: "",
        link: "https://www.vaticannews.va/content/vaticannews/pt/santo-do-dia/06/15/s--vito--martir-em-lucania-na-italia.html"
      },
      {
        name: "S. Bernardo de Menthon, cônego regular de S. Agostinho",
        summary: "Bernardo nasceu em Aosta por volta de 1020. O agostiniano fundou um mosteiro na Suíça, no alto da montanha, hoje conhecida como Grão São Bernardo, para dar assistência aos peregrinos que ali passavam. Bernardo foi também um grande pregador contra os maus costumes do clero e o abandono dos fiéis.",
        image: "",
        link: "https://www.vaticannews.va/content/vaticannews/pt/santo-do-dia/06/15/s--bernardo-de-menthon--conego-regular-de-s--agostinho.html"
      },
      {
        name: "S. Germana Cousin, virgem",
        summary: "Germana nasceu em Toulouse, em 1570, com uma má-formação física. Com a morte da mãe, o pai a abandona. Passou a vida pastoreando ovelhas, mas, quando podia, ia à igreja. Os jovens extraviados, nas suas mesmas condições, recorriam a ela para ouvir a Palavra. Foi canonizada por Pio IX, em 1867.",
        image: "",
        link: "https://www.vaticannews.va/content/vaticannews/pt/santo-do-dia/06/15/s--germana-cousin--virgem.html"
      }
    ]
  },
  "06-16": {
    source: "fallback",
    saints: [
      {
        name: "SS. Ciríaco e Julita, mártires",
        summary: "Mãe e filho, Julita e Ciríaco sofreram pela perseguição anticristã de Diocleciano, em 305. Presos em Tarso, atual Turquia, ela não quis renunciar à sua fé, mas foi obrigada a ver seu filhinho assassinado. Tendo-se proclamado cristão, ele se encontra entre os mártires mais jovens da Igreja.",
        image: "",
        link: "https://www.vaticannews.va/pt/santo-do-dia/06/16/ss--ciriaco-e-julita--martires.html"
      }
    ]
  }
};

const fallbackLiturgy = {
  source: "fallback",
  liturgy: "Liturgia diária",
  color: "",
  prayer: "Senhor, ordenai meu dia para que minhas obras comecem em Vos e em Vos terminem.",
  gospel: {
    reference: "Jo 15, 1-8",
    title: "Evangelho de Jesus Cristo",
    text: "Eu sou a videira, vos sois os ramos. Aquele que permanece em mim, e eu nele, esse produz muito fruto."
  }
};

const habits = [
  { id: "prayed", label: "Rezei hoje" },
  { id: "bible", label: "Li a Biblia" },
  { id: "penance", label: "Fiz penitencia" },
  { id: "charity", label: "Pratiquei caridade" },
  { id: "mass", label: "Participei da Missa" },
  { id: "examen", label: "Fiz exame de consciencia" }
];

const prayers = [
  { id: "gospel", label: "Evangelho do dia", habit: "bible" },
  { id: "saint", label: "Santo do dia" },
  { id: "rosary", label: "Terço", habit: "prayed" },
  { id: "angelus", label: "Angelus / Regina Coeli", habit: "prayed" },
  { id: "nightExamen", label: "Exame noturno", habit: "examen" }
];

const rosaryPrayers = {
  sign: "Pelo sinal da santa cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai, e do Filho, e do Espírito Santo. Amém.",
  creed: "Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na santa Igreja católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne e na vida eterna. Amém.",
  ourFather: "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
  hailMary: "Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.",
  glory: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
  fatima: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem.",
  hailHolyQueen: "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria."
};

const mysterySets = {
  joyful: {
    label: "Mistérios Gozosos",
    hint: "Segundas-feiras e sábados",
    mysteries: [
      ["1º Mistério Gozoso", "A Anunciação do Anjo a Maria", "Humildade e docilidade à graça."],
      ["2º Mistério Gozoso", "A Visitação de Maria a Santa Isabel", "Caridade fraterna."],
      ["3º Mistério Gozoso", "O Nascimento de Jesus em Belém", "Pobreza de espírito."],
      ["4º Mistério Gozoso", "A Apresentação do Menino Jesus no Templo", "Pureza e obediência."],
      ["5º Mistério Gozoso", "O Encontro do Menino Jesus no Templo", "Busca perseverante de Deus."]
    ]
  },
  luminous: {
    label: "Mistérios Luminosos",
    hint: "Quintas-feiras",
    mysteries: [
      ["1º Mistério Luminoso", "O Batismo de Jesus no Jordão", "Fidelidade às promessas do Batismo."],
      ["2º Mistério Luminoso", "As Bodas de Caná", "Confiança na intercessão de Maria."],
      ["3º Mistério Luminoso", "O Anúncio do Reino de Deus", "Conversão sincera."],
      ["4º Mistério Luminoso", "A Transfiguração de Jesus", "Desejo de santidade."],
      ["5º Mistério Luminoso", "A Instituição da Eucaristia", "Amor à Santíssima Eucaristia."]
    ]
  },
  sorrowful: {
    label: "Mistérios Dolorosos",
    hint: "Terças e sextas-feiras",
    mysteries: [
      ["1º Mistério Doloroso", "A Agonia de Jesus no Horto", "Conformidade à vontade de Deus."],
      ["2º Mistério Doloroso", "A Flagelação de Jesus", "Pureza e penitência."],
      ["3º Mistério Doloroso", "A Coroação de Espinhos", "Mansidão e humildade."],
      ["4º Mistério Doloroso", "Jesus carrega a Cruz", "Paciência nas provações."],
      ["5º Mistério Doloroso", "A Crucifixão e Morte de Jesus", "Amor à Cruz e perseverança final."]
    ]
  },
  glorious: {
    label: "Mistérios Gloriosos",
    hint: "Quartas-feiras e domingos",
    mysteries: [
      ["1º Mistério Glorioso", "A Ressurreição de Jesus", "Fé viva."],
      ["2º Mistério Glorioso", "A Ascensão de Jesus ao Céu", "Esperança do céu."],
      ["3º Mistério Glorioso", "A Vinda do Espírito Santo", "Docilidade ao Espírito Santo."],
      ["4º Mistério Glorioso", "A Assunção de Nossa Senhora", "Devoção filial a Maria."],
      ["5º Mistério Glorioso", "A Coroação de Maria no Céu", "Confiança maternal."]
    ]
  }
};

const rosaryTrail = [
  { key: "start", label: "Início" },
  { key: "mystery-1", label: "1º Mistério" },
  { key: "mystery-2", label: "2º Mistério" },
  { key: "mystery-3", label: "3º Mistério" },
  { key: "mystery-4", label: "4º Mistério" },
  { key: "mystery-5", label: "5º Mistério" },
  { key: "end", label: "Final" }
];

const exams = {
  commandments: [
    ["Amar a Deus sobre todas as coisas", ["Tenho rezado com fidelidade?", "Coloquei algo acima de Deus?", "Fui negligente no domingo?"]],
    ["Não tomar seu santo nome em vão", ["Usei o nome de Deus sem reverencia?", "Fiz juramentos levianos?", "Falei da fé com desprezo?"]],
    ["Guardar domingos e festas", ["Participei da Missa dominical?", "Guardei tempo para Deus e a familia?", "Trabalhei sem necessidade grave?"]],
    ["Honrar pai e mãe", ["Fui ingrato ou impaciente?", "Cumpri meus deveres familiares?", "Rezei pelos meus familiares?"]],
    ["Não matar", ["Alimentei odio ou desejo de vinganca?", "Feri alguem com palavras?", "Cuidei da minha saude e da vida alheia?"]],
    ["Não pecar contra a castidade", ["Guardei os olhos e pensamentos?", "Usei mal internet ou entretenimento?", "Respeitei a dignidade do outro?"]],
    ["Não furtar", ["Tomei o que nao era meu?", "Fui justo no trabalho e nos compromissos?", "Reparei danos quando necessario?"]],
    ["Não levantar falso testemunho", ["Menti?", "Fiz fofoca ou calunia?", "Guardei segredos confiados?"]],
    ["Não desejar a mulher do proximo", ["Cultivei desejos desordenados?", "Protegi meu matrimonio ou vocacao?", "Fugi das ocasioes proximas?"]],
    ["Não cobiçar as coisas alheias", ["Fui invejoso?", "Fui grato pelo que recebi?", "Usei bens materiais com liberdade interior?"]]
  ],
  capital: [
    ["Soberba", ["Busquei reconhecimento acima da verdade?", "Fui incapaz de pedir perdao?", "Desprezei conselhos?"]],
    ["Avareza", ["Fui apegado ao dinheiro?", "Neguei ajuda possivel?", "Usei bens como fim ultimo?"]],
    ["Luxuria", ["Consenti pensamentos impuros?", "Usei pessoas como objeto?", "Procurei ocasioes de pecado?"]],
    ["Ira", ["Perdi o dominio de mim?", "Guardei ressentimento?", "Fui duro sem caridade?"]],
    ["Gula", ["Comi ou bebi sem temperanca?", "Fugi do sacrificio?", "Usei prazer para evitar responsabilidades?"]],
    ["Inveja", ["Entristeci-me com o bem alheio?", "Comparei-me sem gratidao?", "Desejei que alguem fracassasse?"]],
    ["Preguica", ["Adiei o bem que devia fazer?", "Fui negligente na oracao?", "Fugi do dever por comodismo?"]]
  ],
  state: [
    ["Solteiro", ["Tenho vivido a castidade?", "Uso bem meu tempo?", "Sirvo minha familia e comunidade?"]],
    ["Casado", ["Amei meu conjuge com paciencia?", "Fui fiel em palavras e atos?", "Eduquei os filhos na fe?"]],
    ["Pais e mães", ["Rezei pelos filhos?", "Corrigi com justica e ternura?", "Dei exemplo cristao em casa?"]],
    ["Trabalho", ["Fui honesto e diligente?", "Tratei colegas com respeito?", "Ofereci meu trabalho a Deus?"]],
    ["Vida paroquial", ["Participei com humildade?", "Evitei criticas destrutivas?", "Colaborei conforme minhas possibilidades?"]]
  ]
};

const defaultState = {
  days: {},
  prayers: {},
  notes: "",
  lastConfession: "",
  liturgyByDate: {},
  saintsByDate: {},
  calendarByMonth: {},
  intentions: [],
  lectioByDate: {},
  onboardingDone: false,
  settings: {
    angelusTime: "12:00",
    examenTime: "21:30",
    notifications: false,
    darkMode: false,
    installDismissed: false
  }
};

let state = loadState();
let rosaryStepIndex = 0;
let deferredInstallPrompt = null;

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return structuredClone(defaultState);
  const parsed = JSON.parse(saved);
  return {
    ...structuredClone(defaultState),
    ...parsed,
    settings: {
      ...structuredClone(defaultState.settings),
      ...(parsed.settings ?? {})
    }
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function cleanupSentNotifications() {
  const sent = state.sentNotifications ?? {};
  const keepAfter = new Date();
  keepAfter.setDate(keepAfter.getDate() - 7);
  keepAfter.setHours(0, 0, 0, 0);
  const cleaned = {};

  Object.entries(sent).forEach(([key, value]) => {
    const datePart = key.split(":")[0];
    const sentDate = new Date(`${datePart}T00:00:00`);
    if (!Number.isNaN(sentDate.getTime()) && sentDate >= keepAfter) {
      cleaned[key] = value;
    }
  });

  state.sentNotifications = cleaned;
  saveState();
}

function ensureToday() {
  state.days[todayKey] ??= {};
  state.prayers[todayKey] ??= {};
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(date);
}

function dateParts(date) {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear())
  };
}

function monthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getSaintUrl(date = new Date()) {
  const { day, month } = dateParts(date);
  return `${vaticanBaseUrl}/pt/santo-do-dia/${month}/${day}.saints.js`;
}

function absoluteVaticanUrl(value) {
  if (!value) return "";
  const absolute = value.startsWith("http") ? value : `${vaticanBaseUrl}${value}`;
  return encodeURI(absolute);
}

function vaticanImageUrl(value) {
  const absolute = absoluteVaticanUrl(value);
  if (!absolute) return "";
  if (!absolute.includes("/content/dam/") || absolute.includes("/_jcr_content/renditions/")) return absolute;
  return `${absolute}/_jcr_content/renditions/cq5dam.thumbnail.cropped.250.141.jpeg`;
}

function saintFallbackKey(date = new Date()) {
  const { day, month } = dateParts(date);
  return `${month}-${day}`;
}

function liturgicalColorInfo(color) {
  const normalized = (color ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const colors = {
    verde: { className: "color-green", label: "Verde", hex: "#166534", meaning: "esperança, crescimento espiritual e tempo ordinário" },
    branco: { className: "color-white", label: "Branco", hex: "#f8f5e9", meaning: "alegria, pureza, festas do Senhor, de Maria e dos santos" },
    vermelho: { className: "color-red", label: "Vermelho", hex: "#991b1b", meaning: "caridade, martírio, Espírito Santo e Paixão do Senhor" },
    roxo: { className: "color-purple", label: "Roxo", hex: "#6b21a8", meaning: "penitência, preparação e conversão" },
    rosa: { className: "color-rose", label: "Rosa", hex: "#be185d", meaning: "alegria discreta no Advento ou na Quaresma" },
    preto: { className: "color-black", label: "Preto", hex: "#1c1917", meaning: "luto e sufrágio pelos fiéis defuntos" }
  };
  return colors[normalized] ?? { className: "color-neutral", label: color || "Cor litúrgica", hex: "#166534", meaning: "cor própria desta celebração" };
}

function normalizeLiturgy(payload) {
  const celebrations = payload?.celebracoes ?? [];
  const celebration = celebrations.find((item) => item.principal) ?? celebrations[0];
  const readings = celebration?.leituras ?? [];
  const gospel = readings.find((reading) => reading.tipo === "evangelho");
  const gospelOption = gospel?.opcoes?.[0];

  if (!celebration || !gospelOption) {
    throw new Error("Resposta da liturgia sem celebracao principal ou evangelho.");
  }

  return {
    source: "api",
    date: payload.data,
    liturgy: celebration.liturgia,
    color: celebration.cor,
    prayer: celebration.oracoes?.coleta ?? fallbackLiturgy.prayer,
    gospel: {
      reference: gospelOption.referencia,
      title: gospelOption.titulo,
      text: gospelOption.texto
    }
  };
}

function normalizeSaint(payload) {
  const saints = payload?.saints ?? [];
  if (!saints.length) throw new Error("Santo do dia ausente na resposta.");
  return {
    source: "api",
    saints: saints.map((saint) => ({
      name: saint.name,
      isFavorite: saint.isFavorite === true || saint.isFavorite === "true",
      summary: saint.summary,
      image: vaticanImageUrl(saint.image),
      imageOriginal: absoluteVaticanUrl(saint.image),
      link: absoluteVaticanUrl(saint.link)
    })),
    cachedAt: new Date().toISOString()
  };
}

function parseSaintResponse(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }
  throw new Error("Resposta do santo do dia não contém JSON.");
}

function saintRecordItems(record) {
  if (!record) return [];
  if (Array.isArray(record.saints)) return record.saints;
  if (record.name) {
    return [{
      name: record.name,
      summary: record.summary,
      image: record.image,
      link: record.link
    }];
  }
  return [];
}

function getLiturgyUrl(date = new Date()) {
  const { day, month, year } = dateParts(date);
  const params = new URLSearchParams({ dia: day, mes: month, ano: year });
  return `${liturgyApiBase}?${params.toString()}`;
}

function currentLiturgy() {
  return state.liturgyByDate?.[todayKey] ?? latestCachedLiturgy() ?? fallbackLiturgy;
}

function latestCachedLiturgy() {
  const entries = Object.entries(state.liturgyByDate ?? {}).filter(([, value]) => value?.source === "api");
  if (!entries.length) return null;
  entries.sort((a, b) => {
    const aTime = Date.parse(a[1].cachedAt ?? a[0]);
    const bTime = Date.parse(b[1].cachedAt ?? b[0]);
    return bTime - aTime;
  });
  const [cacheKey, liturgy] = entries[0];
  return { ...liturgy, source: "cache", cacheKey };
}

function formatCacheDate(cacheKey) {
  if (!cacheKey) return "data anterior";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${cacheKey}T00:00:00`));
}

function mysteryKeyForDate(date) {
  const day = date.getDay();
  if (day === 1 || day === 6) return "joyful";
  if (day === 2 || day === 5) return "sorrowful";
  if (day === 4) return "luminous";
  return "glorious";
}

function buildRosarySteps() {
  const set = mysterySets[mysteryKeyForDate(new Date())];
  const steps = [
    { id: "sign", trail: "start", label: "Abertura", title: "Sinal da Cruz", subtitle: "Inicie em recolhimento.", prayer: rosaryPrayers.sign },
    { id: "creed", trail: "start", label: "Profissão de Fé", title: "Creio", subtitle: "Professe a fé da Igreja.", prayer: rosaryPrayers.creed },
    { id: "initial-our-father", trail: "start", label: "Pai Nosso", title: "Pai Nosso inicial", subtitle: "Reze na primeira conta maior.", prayer: rosaryPrayers.ourFather, count: 1 },
    { id: "initial-hail-mary", trail: "start", label: "3 Ave-Marias", title: "Três Ave-Marias iniciais", subtitle: "Peça fé, esperança e caridade.", prayer: rosaryPrayers.hailMary, count: 3 },
    { id: "initial-glory", trail: "start", label: "Glória", title: "Glória inicial", subtitle: "Louve a Santíssima Trindade.", prayer: rosaryPrayers.glory }
  ];

  set.mysteries.forEach((mystery, index) => {
    const number = index + 1;
    const trail = `mystery-${number}`;
    steps.push(
      { id: `mystery-${number}`, trail, label: `${number}º Mistério`, title: mystery[0], subtitle: mystery[1], mystery },
      { id: `our-father-${number}`, trail, label: "Pai Nosso", title: `Pai Nosso do ${number}º Mistério`, subtitle: mystery[1], prayer: rosaryPrayers.ourFather, count: 1, mystery },
      { id: `decade-${number}`, trail, label: "Dezena", title: `${number}ª Dezena`, subtitle: "Reze dez Ave-Marias contemplando o mistério.", prayer: rosaryPrayers.hailMary, count: 10, mystery },
      { id: `glory-${number}`, trail, label: "Glória", title: `Glória do ${number}º Mistério`, subtitle: "Reze o Glória e a jaculatória de Fátima.", prayer: `${rosaryPrayers.glory}\n\n${rosaryPrayers.fatima}`, mystery }
    );
  });

  steps.push(
    { id: "hail-holy-queen", trail: "end", label: "Salve Rainha", title: "Salve Rainha", subtitle: "Confie a oração à intercessão de Nossa Senhora.", prayer: rosaryPrayers.hailHolyQueen },
    { id: "finish", trail: "end", label: "Conclusão", title: "Terço concluído", subtitle: "Permaneça um momento em silêncio e agradeça.", prayer: "Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém." }
  );

  return { set, steps };
}

async function loadTodayLiturgy() {
  const status = document.querySelector("#liturgyStatus");
  try {
    status.textContent = state.liturgyByDate?.[todayKey] ? "salvo offline" : "atualizando em segundo plano";
    const response = await fetch(getLiturgyUrl(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Liturgia indisponivel: ${response.status}`);
    const payload = await response.json();
    state.liturgyByDate ??= {};
    state.liturgyByDate[todayKey] = {
      ...normalizeLiturgy(payload),
      cacheKey: todayKey,
      cachedAt: new Date().toISOString()
    };
    saveState();
    renderLiturgy();
  } catch (error) {
    console.warn(error);
    renderLiturgy("offline");
  }
}

async function loadTodaySaint() {
  try {
    renderSaint(saintRecordItems(state.saintsByDate?.[todayKey]).length ? "salvo offline" : "");
    const response = await fetch(getSaintUrl(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Santo indisponivel: ${response.status}`);
    const payload = parseSaintResponse(await response.text());
    state.saintsByDate ??= {};
    state.saintsByDate[todayKey] = normalizeSaint(payload);
    saveState();
    renderSaint("atualizado");
  } catch (error) {
    console.warn(error);
    if (!saintRecordItems(state.saintsByDate?.[todayKey]).length && fallbackSaints[saintFallbackKey()]) {
      state.saintsByDate ??= {};
      state.saintsByDate[todayKey] = {
        ...fallbackSaints[saintFallbackKey()],
        cachedAt: new Date().toISOString()
      };
      saveState();
      renderSaint("fallback local");
      return;
    }
    renderSaint(state.saintsByDate?.[todayKey] ? "salvo offline" : "sem conexão");
  }
}

async function loadLiturgicalCalendar() {
  const key = monthKey();
  const cached = state.calendarByMonth?.[key];
  renderCalendar(cached ? "salvo offline" : "mês em preparação");

  try {
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const entries = await Promise.all(
      Array.from({ length: days }, async (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth(), index + 1);
        const response = await fetch(getLiturgyUrl(date), { cache: "no-store" });
        if (!response.ok) throw new Error(`Dia ${index + 1}: ${response.status}`);
        const payload = await response.json();
        const celebration = payload?.celebracoes?.find((item) => item.principal) ?? payload?.celebracoes?.[0];
        return {
          key: dateKey(date),
          day: index + 1,
          liturgy: celebration?.liturgia ?? "Liturgia diária",
          color: celebration?.cor ?? "",
          principal: Boolean(celebration?.principal)
        };
      })
    );
    state.calendarByMonth ??= {};
    state.calendarByMonth[key] = { cachedAt: new Date().toISOString(), entries };
    saveState();
    renderCalendar("atualizado");
  } catch (error) {
    console.warn(error);
    renderCalendar(cached ? "salvo offline" : "calendário indisponível");
  }
}

function setHabit(id, value = true) {
  ensureToday();
  state.days[todayKey][id] = value;
  saveState();
  render();
}

function toggleHabit(id) {
  ensureToday();
  state.days[todayKey][id] = !state.days[todayKey][id];
  saveState();
  render();
}

function togglePrayer(id, habit) {
  ensureToday();
  state.prayers[todayKey][id] = !state.prayers[todayKey][id];
  if (habit && state.prayers[todayKey][id]) state.days[todayKey][habit] = true;
  saveState();
  render();
}

function monthKeys() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(year, month, index + 1);
    return dateKey(date);
  });
}

function percentageFor(habit) {
  const keys = monthKeys().filter((key) => key <= todayKey);
  const done = keys.filter((key) => state.days[key]?.[habit]).length;
  return keys.length ? Math.round((done / keys.length) * 100) : 0;
}

function prayerStreak() {
  let streak = 0;
  const date = new Date();
  while (true) {
    const key = dateKey(date);
    if (!state.days[key]?.prayed) break;
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function renderPrayerActions() {
  const root = document.querySelector("#prayerActions");
  root.innerHTML = "";
  const todayPrayers = state.prayers[todayKey] ?? {};

  prayers.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-row ${todayPrayers[item.id] ? "is-done" : ""}`;
    const trailing = item.id === "rosary"
      ? '<span class="row-actions"><span class="quiet">feito?</span><span class="mini-button" data-rosary-open="true">Caminho</span></span>'
      : `<span class="quiet">${todayPrayers[item.id] ? "feito" : "abrir"}</span>`;
    button.innerHTML = `
      <span class="check-dot">${todayPrayers[item.id] ? "✓" : ""}</span>
      <span>${item.label}</span>
      ${trailing}
    `;
    button.addEventListener("click", (event) => {
      if (event.target.closest("[data-rosary-open]")) {
        togglePrayer(item.id, item.habit);
        navigateToView("rosary");
        return;
      }
      togglePrayer(item.id, item.habit);
    });
    root.append(button);
  });

  const done = prayers.filter((item) => todayPrayers[item.id]).length;
  document.querySelector("#dailyProgress").textContent = `${done}/${prayers.length}`;
}

function renderHabits() {
  const root = document.querySelector("#habitList");
  root.innerHTML = "";
  const today = state.days[todayKey] ?? {};

  habits.forEach((habit) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `habit-row ${today[habit.id] ? "is-done" : ""}`;
    button.innerHTML = `
      <span class="check-dot">${today[habit.id] ? "✓" : ""}</span>
      <span>${habit.label}?</span>
      <span class="quiet">${today[habit.id] ? "sim" : "não"}</span>
    `;
    button.addEventListener("click", () => toggleHabit(habit.id));
    root.append(button);
  });
}

function renderStats() {
  const streak = prayerStreak();
  const prayerRate = percentageFor("prayed");
  const massRate = percentageFor("mass");
  const lastConfessionLabel = state.lastConfession
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${state.lastConfession}T00:00:00`))
    : "--";

  document.querySelector("#streakCount").textContent = streak;
  document.querySelector("#prayerRate").textContent = `${prayerRate}%`;
  document.querySelector("#massRate").textContent = `${massRate}%`;
  document.querySelector("#lastConfession").textContent = lastConfessionLabel;
  document.querySelector("#confessionLastInline").textContent = state.lastConfession
    ? `Última: ${lastConfessionLabel}`
    : "Última: não registrada";
  document.querySelector("#streakInsight").textContent =
    streak >= 7 ? "Perseverança concreta" : streak > 0 ? "Retomada fiel" : "Comece hoje";
  document.querySelector("#prayerInsight").textContent =
    prayerRate >= 80 ? "Ritmo firme de oração" : prayerRate >= 40 ? "Constância em formação" : "Pequenos atos fiéis";
  document.querySelector("#massInsight").textContent =
    massRate >= 80 ? "Frequência sacramental alta" : massRate > 0 ? "Caminho sacramental" : "Desejo de altar";
  document.querySelector("#confessionInsight").textContent =
    state.lastConfession ? "Memória da reconciliação" : "Prepare o retorno";
}

function renderBibleReadButton() {
  const button = document.querySelector("#markBibleButton");
  const hasRead = Boolean(state.days[todayKey]?.bible || state.prayers[todayKey]?.gospel);
  button.textContent = hasRead ? "Leitura marcada" : "Marcar leitura";
  button.classList.toggle("is-done", hasRead);
}

function renderMonthBars() {
  const root = document.querySelector("#monthBars");
  root.innerHTML = "";
  monthKeys().forEach((key) => {
    const day = state.days[key] ?? {};
    const score = ["prayed", "bible", "mass"].filter((habit) => day[habit]).length;
    const bar = document.createElement("span");
    bar.className = "month-bar";
    bar.dataset.score = String(Math.min(score, 3));
    bar.style.height = `${18 + score * 24}px`;
    bar.title = `${key}: ${score}/3`;
    root.append(bar);
  });
}

function renderExam(type = document.querySelector(".exam-tab.is-active")?.dataset.exam ?? "commandments") {
  const root = document.querySelector("#examContent");
  root.innerHTML = "";
  exams[type].forEach(([title, questions]) => {
    const group = document.createElement("section");
    group.className = "exam-group";
    group.innerHTML = `
      <h3>${title}</h3>
      <ul>${questions.map((question) => `<li>${question}</li>`).join("")}</ul>
    `;
    root.append(group);
  });
}

function renderSettings() {
  document.querySelector("#angelusTime").value = state.settings.angelusTime;
  document.querySelector("#examenTime").value = state.settings.examenTime;
  document.querySelector("#notificationsToggle").checked = state.settings.notifications;
  document.querySelector("#darkModeToggle").checked = Boolean(state.settings.darkMode);
}

function isStandaloneDisplay() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIosSafari() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.navigator.standalone;
}

function renderInstallBanner() {
  const banner = document.querySelector("#installBanner");
  const installButton = document.querySelector("#installAppButton");
  const hint = document.querySelector("#installHint");
  const shouldShow = !isStandaloneDisplay() && !state.settings.installDismissed;

  banner.hidden = !shouldShow;
  installButton.hidden = !deferredInstallPrompt;
  hint.textContent = isIosSafari()
    ? "No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início."
    : "Instale o Diarium na tela inicial para voltar à oração sem procurar o endereço.";
}

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.darkMode ? "dark" : "light";
}

function createSaintPlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.className = "saint-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.textContent = "✠";
  return placeholder;
}

function renderSaint(statusText = "buscando") {
  const record = state.saintsByDate?.[todayKey];
  const saints = saintRecordItems(record);
  const root = document.querySelector("#saintList");
  document.querySelector("#saintStatus").textContent = statusText === "buscando" ? "" : statusText;
  root.innerHTML = "";

  if (!saints.length) {
    root.innerHTML = '<p class="quiet">Não foi possível carregar a memória do santo do dia. Tente novamente quando houver conexão.</p>';
    return;
  }

  saints.forEach((saint) => {
    const article = document.createElement("article");
    article.className = `saint-entry ${saint.isFavorite ? "is-favorite" : ""}`;
    const saintImage = saint.image ? vaticanImageUrl(saint.image) : vaticanImageUrl(saint.imageOriginal);

    if (saintImage) {
      const image = document.createElement("img");
      image.src = saintImage;
      image.alt = saint.name ? `Imagem de ${saint.name}` : "Imagem do santo do dia";
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => image.replaceWith(createSaintPlaceholder()), { once: true });
      article.append(image);
    } else {
      article.append(createSaintPlaceholder());
    }

    const content = document.createElement("div");
    if (saint.isFavorite) {
      const badge = document.createElement("span");
      badge.className = "saint-badge";
      badge.textContent = "Destaque do dia";
      content.append(badge);
    }

    const title = document.createElement("h3");
    title.textContent = saint.name;
    content.append(title);

    const summary = document.createElement("p");
    summary.textContent = saint.summary;
    content.append(summary);

    article.append(content);
    root.append(article);
  });
}

function renderCalendar(statusText = "carregando") {
  const key = monthKey();
  const calendar = state.calendarByMonth?.[key];
  const root = document.querySelector("#liturgicalCalendar");
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  document.querySelector("#calendarTitle").textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(now);
  document.querySelector("#calendarStatus").textContent = statusText;
  root.innerHTML = "";

  const entries = calendar?.entries ?? Array.from({ length: days }, (_, index) => ({
    key: dateKey(new Date(now.getFullYear(), now.getMonth(), index + 1)),
    day: index + 1,
    liturgy: "Carregando liturgia",
    color: ""
  }));

  entries.forEach((entry) => {
    const color = liturgicalColorInfo(entry.color);
    const cell = document.createElement("div");
    cell.className = `calendar-day ${entry.key === todayKey ? "is-today" : ""}`;
    cell.style.setProperty("--day-color", color.hex);
    cell.innerHTML = `
      <strong>${entry.day}</strong>
      <span>${entry.liturgy}</span>
    `;
    cell.title = entry.liturgy;
    root.append(cell);
  });
}

function renderIntentions() {
  const root = document.querySelector("#intentionList");
  const intentions = state.intentions ?? [];
  root.innerHTML = "";
  document.querySelector("#intentionsCount").textContent = `${intentions.length} ${intentions.length === 1 ? "intenção" : "intenções"}`;

  if (!intentions.length) {
    root.innerHTML = '<p class="quiet">Nenhuma intenção salva ainda.</p>';
    return;
  }

  intentions.forEach((intention) => {
    const item = document.createElement("div");
    item.className = "intention-item";
    item.innerHTML = `
      <span>${intention.text}</span>
      <button class="text-button" type="button" data-intention-remove="${intention.id}">Remover</button>
    `;
    root.append(item);
  });
}

function renderLectioPurpose() {
  const input = document.querySelector("#lectioPurposeInput");
  const status = document.querySelector("#lectioSavedStatus");
  if (!input || !status) return;
  input.value = state.lectioByDate?.[todayKey]?.purpose ?? "";
  status.textContent = input.value ? "salvo para hoje" : "";
}

function renderHighlightedText(element, text) {
  const verseRegex = /(\b\d{1,3}(?:,\s*\d{1,3}[a-z]?)?)(?=[A-Za-zÀ-ÿ"“”'’])/g;
  element.innerHTML = "";
  text.split("\n").forEach((paragraph, paragraphIndex) => {
    if (paragraphIndex > 0) element.append(document.createElement("br"));
    let lastIndex = 0;
    paragraph.replace(verseRegex, (match, _verse, offset) => {
      element.append(document.createTextNode(paragraph.slice(lastIndex, offset)));
      const badge = document.createElement("span");
      badge.className = "verse-badge";
      badge.textContent = match;
      badge.title = `Versículo ${match}`;
      element.append(badge);
      lastIndex = offset + match.length;
      return match;
    });
    element.append(document.createTextNode(paragraph.slice(lastIndex)));
  });
}

function renderLiturgy(statusOverride) {
  const liturgy = currentLiturgy();
  const color = liturgicalColorInfo(liturgy.color);
  document.querySelector("#heroDateLabel").textContent = formatDate(new Date());
  document.querySelector("#dailyTitle").textContent = liturgy.liturgy;
  document.querySelector("#dailyExcerpt").textContent = liturgy.color ? color.meaning : "Liturgia e Evangelho salvos localmente.";
  const heroBadge = document.querySelector("#heroColorBadge");
  heroBadge.className = `color-badge ${color.className}`;
  heroBadge.textContent = `Cor: ${color.label}`;
  document.querySelector("#gospelReference").textContent = liturgy.gospel.reference;
  document.querySelector("#gospelTitle").textContent = liturgy.gospel.title;
  renderHighlightedText(document.querySelector("#gospelText"), liturgy.gospel.text);
  document.querySelector("#heroPanel").style.setProperty("--liturgical-color", color.hex);
  document.querySelector("#dailyPrayerTitle").textContent = "Oração coleta";
  document.querySelector("#dailyPrayerText").textContent = liturgy.prayer;

  const status = document.querySelector("#liturgyStatus");
  if (statusOverride === "offline") {
    if (liturgy.source === "cache") {
      status.textContent = `API indisponível; usando cache de ${formatCacheDate(liturgy.cacheKey)}`;
    } else if (liturgy.source === "api") {
      status.textContent = "salvo offline";
    } else {
      status.textContent = "fallback estático; nenhum cache encontrado";
    }
  } else {
    if (liturgy.source === "cache") {
      status.textContent = `cache de ${formatCacheDate(liturgy.cacheKey)} enquanto busca a API`;
    } else {
      status.textContent = liturgy.source === "api" ? "atualizado pela API" : "buscando liturgia";
    }
  }
}

async function shareGospel() {
  const liturgy = currentLiturgy();
  const text = `${liturgy.liturgy}\n${liturgy.gospel.reference}\n\n${liturgy.gospel.text}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Evangelho do dia", text });
      return;
    }
    await navigator.clipboard.writeText(text);
    alert("Evangelho copiado para a área de transferência.");
  } catch (error) {
    console.warn(error);
  }
}

function navigateToView(view) {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("is-active"));
  document.querySelector(`#view-${view}`).classList.add("is-active");
  if (view === "rosary") renderRosary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function rosaryProgress(steps) {
  state.rosaryByDate ??= {};
  state.rosaryByDate[todayKey] ??= { counts: {} };
  const counts = state.rosaryByDate[todayKey].counts;
  const total = steps.reduce((sum, step) => sum + (step.count || 0), 0);
  const done = steps.reduce((sum, step) => sum + Math.min(counts[step.id] || 0, step.count || 0), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function renderRosary() {
  const { set, steps } = buildRosarySteps();
  const step = steps[rosaryStepIndex] ?? steps[0];
  state.rosaryByDate ??= {};
  state.rosaryByDate[todayKey] ??= { counts: {} };
  const counts = state.rosaryByDate[todayKey].counts;
  const completed = counts[step.id] || 0;
  const progress = rosaryProgress(steps);

  document.querySelector("#rosaryMysteryHint").textContent = set.hint;
  document.querySelector("#rosaryMysteryName").textContent = set.label;
  document.querySelector("#rosaryMysteryIntro").textContent = "Acompanhe cada passo e marque as contas rezadas.";
  document.querySelector("#rosaryProgress").textContent = `${progress}%`;
  document.querySelector("#rosaryProgressBar").style.width = `${progress}%`;
  document.querySelector("#rosaryStepLabel").textContent = step.label;
  document.querySelector("#rosaryStepTitle").textContent = step.title;
  document.querySelector("#rosaryStepSubtitle").textContent = step.subtitle;
  document.querySelector("#rosaryStepCounter").textContent = `passo ${rosaryStepIndex + 1} de ${steps.length}`;

  const trailRoot = document.querySelector("#rosaryTrail");
  trailRoot.innerHTML = "";
  rosaryTrail.forEach((trail) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `trail-button ${trail.key === step.trail ? "is-active" : ""}`;
    button.textContent = trail.label;
    button.addEventListener("click", () => {
      rosaryStepIndex = steps.findIndex((candidate) => candidate.trail === trail.key);
      renderRosary();
    });
    trailRoot.append(button);
  });

  const mysteryBox = document.querySelector("#rosaryMysteryBox");
  mysteryBox.innerHTML = "";
  if (step.mystery) {
    mysteryBox.hidden = false;
    mysteryBox.innerHTML = `<p class="eyebrow">Caminho contemplativo</p><h3>${step.mystery[1]}</h3><p>Fruto espiritual: <strong>${step.mystery[2]}</strong></p>`;
  } else {
    mysteryBox.hidden = true;
  }

  const prayerText = document.querySelector("#rosaryPrayerText");
  prayerText.innerHTML = "";
  if (step.prayer) {
    step.prayer.split("\n\n").forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      prayerText.append(p);
    });
  }

  const beads = document.querySelector("#rosaryBeads");
  beads.innerHTML = "";
  beads.hidden = !step.count;
  if (step.count) {
    const label = document.createElement("p");
    label.className = "quiet";
    label.textContent = `${completed} de ${step.count} contas concluídas`;
    beads.append(label);
    const beadGrid = document.createElement("div");
    beadGrid.className = "bead-grid";
    for (let index = 0; index < step.count; index += 1) {
      const bead = document.createElement("button");
      bead.type = "button";
      bead.className = `bead ${index < completed ? "is-filled" : ""}`;
      bead.title = `Conta ${index + 1}`;
      bead.addEventListener("click", () => {
        counts[step.id] = completed === index + 1 ? index : index + 1;
        saveState();
        renderRosary();
      });
      beadGrid.append(bead);
    }
    beads.append(beadGrid);
  }

  document.querySelector("#previousRosaryStepButton").disabled = rosaryStepIndex === 0;
  document.querySelector("#completeRosaryStepButton").textContent =
    step.count && completed < step.count ? "Concluir esta conta" : rosaryStepIndex === steps.length - 1 ? "Terço concluído" : "Avançar";
  document.querySelector("#completeRosaryStepButton").disabled = rosaryStepIndex === steps.length - 1 && (!step.count || completed >= step.count);
}

function render() {
  applyTheme();
  ensureToday();
  document.querySelector("#todayLabel").textContent = formatDate(new Date());
  document.querySelector("#checklistDate").textContent = new Intl.DateTimeFormat("pt-BR").format(new Date());
  document.querySelector("#monthLabel").textContent = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  document.querySelector("#confessionNotes").value = state.notes;
  renderPrayerActions();
  renderBibleReadButton();
  renderHabits();
  renderStats();
  renderMonthBars();
  renderSettings();
  renderInstallBanner();
  renderLiturgy();
  renderSaint();
  renderCalendar(state.calendarByMonth?.[monthKey()] ? "salvo offline" : "mês em preparação");
  renderIntentions();
  renderLectioPurpose();
  if (document.querySelector("#view-rosary").classList.contains("is-active")) renderRosary();
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToView(button.dataset.view);
    });
  });
}

function completeOnboarding(view = "today") {
  state.onboardingDone = true;
  saveState();
  document.querySelector("#onboardingDialog").close();
  navigateToView(view);
}

function setupOnboarding() {
  const dialog = document.querySelector("#onboardingDialog");
  document.querySelectorAll("[data-onboarding-view]").forEach((button) => {
    button.addEventListener("click", () => completeOnboarding(button.dataset.onboardingView));
  });
  document.querySelector("#skipOnboardingButton").addEventListener("click", () => completeOnboarding("today"));

  if (!state.onboardingDone) {
    window.setTimeout(() => dialog.showModal(), 500);
  }
}

function setupInstallBanner() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    renderInstallBanner();
  });

  document.querySelector("#installAppButton").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    state.settings.installDismissed = true;
    saveState();
    renderInstallBanner();
  });

  document.querySelector("#dismissInstallButton").addEventListener("click", () => {
    state.settings.installDismissed = true;
    saveState();
    renderInstallBanner();
  });
}

function setupExamTabs() {
  document.querySelectorAll(".exam-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".exam-tab").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderExam(button.dataset.exam);
    });
  });
}

function setupSettings() {
  const dialog = document.querySelector("#settingsDialog");
  document.querySelector("#settingsButton").addEventListener("click", () => dialog.showModal());
  document.querySelector("#saveSettingsButton").addEventListener("click", async () => {
    const wantsNotifications = document.querySelector("#notificationsToggle").checked;
    if (wantsNotifications && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    state.settings = {
      ...state.settings,
      angelusTime: document.querySelector("#angelusTime").value,
      examenTime: document.querySelector("#examenTime").value,
      notifications: wantsNotifications,
      darkMode: document.querySelector("#darkModeToggle").checked
    };
    saveState();
    applyTheme();
    dialog.close();
  });
}

function exportBackup() {
  const payload = {
    app: "Diarium",
    version: 1,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `diarium-backup-${todayKey}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importBackupFile(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(reader.result);
      const importedState = payload?.state ?? payload;
      if (!importedState || typeof importedState !== "object") {
        throw new Error("Arquivo sem estado valido.");
      }

      state = {
        ...structuredClone(defaultState),
        ...importedState,
        settings: {
          ...structuredClone(defaultState.settings),
          ...(importedState.settings ?? {})
        }
      };
      cleanupSentNotifications();
      saveState();
      renderExam();
      render();
      alert("Backup importado com sucesso.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível importar este backup.");
    }
  });
  reader.readAsText(file);
}

function setupActions() {
  document.querySelector("#startExamButton").addEventListener("click", () => navigateToView("confession"));
  document.querySelector("#markBibleButton").addEventListener("click", () => {
    ensureToday();
    state.days[todayKey].bible = true;
    state.prayers[todayKey].gospel = true;
    saveState();
    render();
  });
  document.querySelector("#shareGospelButton").addEventListener("click", shareGospel);
  document.querySelector("#saveLectioPurposeButton").addEventListener("click", () => {
    const input = document.querySelector("#lectioPurposeInput");
    const status = document.querySelector("#lectioSavedStatus");
    state.lectioByDate ??= {};
    state.lectioByDate[todayKey] = {
      purpose: input.value.trim(),
      updatedAt: new Date().toISOString()
    };
    saveState();
    status.textContent = state.lectioByDate[todayKey].purpose ? "propósito salvo" : "propósito limpo";
  });
  document.querySelector("#resetTodayButton").addEventListener("click", () => {
    state.days[todayKey] = {};
    state.prayers[todayKey] = {};
    saveState();
    render();
  });
  document.querySelector("#confessionDoneButton").addEventListener("click", () => {
    state.lastConfession = todayKey;
    saveState();
    render();
    const button = document.querySelector("#confessionDoneButton");
    button.textContent = "Confissão registrada";
    setTimeout(() => {
      button.textContent = "Registrar confissão de hoje";
    }, 2200);
  });
  document.querySelector("#confessionNotes").addEventListener("input", (event) => {
    state.notes = event.target.value;
    saveState();
  });
  document.querySelector("#intentionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#intentionInput");
    const text = input.value.trim();
    if (!text) return;
    state.intentions ??= [];
    state.intentions.push({ id: `${Date.now()}`, text, createdAt: new Date().toISOString() });
    input.value = "";
    saveState();
    renderIntentions();
  });
  document.querySelector("#intentionList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-intention-remove]");
    if (!button) return;
    state.intentions = (state.intentions ?? []).filter((item) => item.id !== button.dataset.intentionRemove);
    saveState();
    renderIntentions();
  });
  document.querySelector("#backToTodayButton").addEventListener("click", () => navigateToView("today"));
  document.querySelector("#previousRosaryStepButton").addEventListener("click", () => {
    rosaryStepIndex = Math.max(0, rosaryStepIndex - 1);
    renderRosary();
  });
  document.querySelector("#completeRosaryStepButton").addEventListener("click", () => {
    const { steps } = buildRosarySteps();
    const step = steps[rosaryStepIndex];
    state.rosaryByDate ??= {};
    state.rosaryByDate[todayKey] ??= { counts: {} };
    const counts = state.rosaryByDate[todayKey].counts;
    const completed = counts[step.id] || 0;
    if (step.count && completed < step.count) {
      counts[step.id] = completed + 1;
    } else {
      rosaryStepIndex = Math.min(steps.length - 1, rosaryStepIndex + 1);
    }
    setHabit("prayed");
    saveState();
    renderRosary();
  });
  document.querySelector("#exportBackupButton").addEventListener("click", exportBackup);
  document.querySelector("#importBackupButton").addEventListener("click", () => {
    document.querySelector("#importBackupInput").click();
  });
  document.querySelector("#importBackupInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importBackupFile(file);
    event.target.value = "";
  });
}

function setupNotifications() {
  if (!("Notification" in window)) return;
  setInterval(() => {
    if (!state.settings.notifications || Notification.permission !== "granted") return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const sentKey = `${todayKey}:${hhmm}`;
    state.sentNotifications ??= {};
    if (state.sentNotifications[sentKey]) return;
    if (hhmm === state.settings.angelusTime) {
      new Notification("Diarium", { body: "Hora do Angelus ou Regina Coeli." });
      state.sentNotifications[sentKey] = true;
      saveState();
    }
    if (hhmm === state.settings.examenTime) {
      new Notification("Diarium", { body: "Hora do exame de consciencia." });
      state.sentNotifications[sentKey] = true;
      saveState();
    }
  }, 30000);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("service-worker.js");
}

cleanupSentNotifications();
applyTheme();
setupNavigation();
setupExamTabs();
setupSettings();
setupActions();
setupInstallBanner();
setupOnboarding();
setupNotifications();
renderExam();
render();
loadTodayLiturgy();
loadTodaySaint();
loadLiturgicalCalendar();
