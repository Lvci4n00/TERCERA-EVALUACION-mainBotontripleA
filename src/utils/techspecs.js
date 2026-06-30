const DATASET_BASE =
  import.meta.env.VITE_PC_PART_DATASET_BASE ||
  'https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json';

const PART_CATEGORIES = [
  'cpu',
  'cpu-cooler',
  'motherboard',
  'memory',
  'internal-hard-drive',
  'video-card',
  'case',
  'power-supply',
  'os',
  'monitor',
  'sound-card',
  'wired-network-card',
  'wireless-network-card',
  'headphones',
  'keyboard',
  'mouse',
  'speakers',
  'webcam',
  'case-accessory',
  'case-fan',
  'fan-controller',
  'thermal-paste',
  'external-hard-drive',
  'optical-drive',
  'ups',
];

const CATEGORY_HINTS = [
  { test: /\b(cpu|procesador|processor|ryzen|intel core|pentium|celeron|xeon|threadripper|athlon|epyc)\b/i, categories: ['cpu'] },
  { test: /\b(cooler|refriger|heatsink|disipador|radiador|water|aio)\b/i, categories: ['cpu-cooler'] },
  { test: /\b(motherboard|mainboard|placa madre|board|socket)\b/i, categories: ['motherboard'] },
  { test: /\b(memory|ram|ddr|sdram|lpddr)\b/i, categories: ['memory'] },
  { test: /\b(ssd|hdd|nvme|m\.2|hard drive|storage|disco duro|almacenamiento)\b/i, categories: ['internal-hard-drive', 'external-hard-drive'] },
  { test: /\b(video card|gpu|graphics card|geforce|nvidia|radeon|rx\b|rtx\b|gtx\b|quadro|arc)\b/i, categories: ['video-card'] },
  { test: /\b(case|gabinete|chassis|tower)\b/i, categories: ['case'] },
  { test: /\b(power supply|psu|fuente|watt|bronze|silver|gold|platinum)\b/i, categories: ['power-supply'] },
  { test: /\b(monitor|display|screen|pantalla)\b/i, categories: ['monitor'] },
  { test: /\b(keyboard|teclado)\b/i, categories: ['keyboard'] },
  { test: /\b(mouse|rat[oó]n)\b/i, categories: ['mouse'] },
  { test: /\b(webcam|c[aá]mara)\b/i, categories: ['webcam'] },
  { test: /\b(headphone|headset|auricular|aud[ií]fonos)\b/i, categories: ['headphones'] },
  { test: /\b(speaker|parlante|altavoz)\b/i, categories: ['speakers'] },
  { test: /\b(sound card|audio card)\b/i, categories: ['sound-card'] },
  { test: /\b(network|ethernet|wifi|wi-fi|wireless|lan)\b/i, categories: ['wired-network-card', 'wireless-network-card'] },
  { test: /\b(case fan|fan controller|thermal paste|pasta t[eé]rmica|ups|no-break|sa[ií]?)\b/i, categories: ['case-fan', 'fan-controller', 'thermal-paste', 'ups'] },
  { test: /\b(os|windows|linux|mac os|macos|software)\b/i, categories: ['os'] },
];

const STOP_WORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'y', 'o', 'para', 'con', 'sin', 'nuevo',
  'nueva', 'modelo', 'producto', 'pc', 'gamer', 'gaming', 'edition', 'edicion',
  'pro', 'series', 'serie', 'hub', 'hardware', 'hub', 'escritorio', 'compact',
  'elite', 'storm', 'alpha', 'nova', 'creator', 'performance', 'premium',
]);

const categoryCache = new Map();

const LOCAL_GPU_FALLBACKS = [
  {
    match: /\brtx\s*3050\b/i,
    category: 'video-card',
    name: 'NVIDIA GeForce RTX 3050',
    specs: {
      chipset: 'GeForce RTX 3050',
      memory: '8 GB',
      memory_type: 'GDDR6',
      core_clock: '1552 MHz',
      boost_clock: '1777 MHz',
      interface: 'PCIe 4.0 x8',
      length: 'varies by model',
    },
  },
  {
    match: /\brtx\s*3050\s*ti\b/i,
    category: 'video-card',
    name: 'NVIDIA GeForce RTX 3050 Ti',
    specs: {
      chipset: 'GeForce RTX 3050 Ti',
      memory: '4 GB',
      memory_type: 'GDDR6',
      core_clock: 'base clock varies by model',
      boost_clock: 'varies by model',
      interface: 'PCIe',
      length: 'varies by model',
    },
  },
  {
    match: /\brx\s*7600\s*xt\b/i,
    category: 'video-card',
    name: 'AMD Radeon RX 7600 XT',
    specs: {
      chipset: 'Radeon RX 7600 XT',
      memory: '16 GB',
      memory_type: 'GDDR6',
      core_clock: 'base clock varies by model',
      boost_clock: 'up to 2755 MHz',
      interface: 'PCIe 4.0 x8',
      length: 'varies by model',
    },
  },
  {
    match: /\brx\s*7600\b/i,
    category: 'video-card',
    name: 'AMD Radeon RX 7600',
    specs: {
      chipset: 'Radeon RX 7600',
      memory: '8 GB',
      memory_type: 'GDDR6',
      core_clock: '2250 MHz',
      boost_clock: 'up to 2655 MHz',
      interface: 'PCIe 4.0 x8',
      length: 'varies by model',
    },
  },
];

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));
}

function stringifySearchableValue(value) {
  if (Array.isArray(value)) return value.map(stringifySearchableValue).join(' ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value ?? '');
}

function scoreCandidate(query, item) {
  const queryNorm = normalizeText(query);
  const candidateText = normalizeText(Object.values(item).map(stringifySearchableValue).join(' '));

  if (!queryNorm || !candidateText) return 0;
  if (candidateText === queryNorm) return 100;
  if (candidateText.includes(queryNorm)) return 95;
  if (queryNorm.includes(candidateText)) return 90;

  const queryTokens = tokenize(query);
  const candidateTokens = new Set(tokenize(candidateText));

  if (!queryTokens.length || !candidateTokens.size) return 0;

  let hits = 0;
  let numericHits = 0;

  for (const token of queryTokens) {
    if (candidateTokens.has(token)) {
      hits += 1;
      if (/^\d+(?:\.\d+)?$/.test(token)) numericHits += 1;
    }
  }

  const overlap = hits / queryTokens.length;
  return overlap * 80 + numericHits * 5;
}

function inferCategories(query) {
  const normalized = normalizeText(query);
  const categories = [];

  for (const hint of CATEGORY_HINTS) {
    if (hint.test.test(normalized)) {
      categories.push(...hint.categories);
    }
  }

  for (const category of PART_CATEGORIES) {
    if (!categories.includes(category)) categories.push(category);
  }

  return categories;
}

async function loadCategory(category) {
  if (!categoryCache.has(category)) {
    const promise = fetch(`${DATASET_BASE}/${category}.json`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return Array.isArray(json) ? json : null;
      })
      .catch((error) => {
        console.warn(`TechSpecs category load failed (${category})`, error?.message || error);
        return null;
      });

    categoryCache.set(category, promise);
  }

  return categoryCache.get(category);
}

function buildResult(query, category, item) {
  if (!item) return null;

  const { name, ...specs } = item;

  return {
    name: name || query,
    category,
    specs,
    url: `${DATASET_BASE}/${category}.json`,
  };
}

function getLocalFallback(query) {
  const normalizedQuery = normalizeText(query);

  for (const fallback of LOCAL_GPU_FALLBACKS) {
    if (fallback.match.test(normalizedQuery)) {
      return {
        name: fallback.name,
        category: fallback.category,
        specs: fallback.specs,
        url: `${DATASET_BASE}/video-card.json`,
      };
    }
  }

  return null;
}

export async function fetchSpecsByQuery(query) {
  const cleanQuery = String(query ?? '').trim();
  if (!cleanQuery) return null;

  const localFallback = getLocalFallback(cleanQuery);
  if (localFallback) return localFallback;

  const categories = inferCategories(cleanQuery);
  let best = null;

  for (const category of categories) {
    const parts = await loadCategory(category);
    if (!parts?.length) continue;

    let categoryBest = null;

    for (const item of parts) {
      const score = scoreCandidate(cleanQuery, item);
      if (!categoryBest || score > categoryBest.score) {
        categoryBest = { score, item };
      }
    }

    if (categoryBest && (!best || categoryBest.score > best.score)) {
      best = { ...categoryBest, category };
    }

    if (best && best.score >= 95) break;
  }

  if (!best || best.score < 35) {
    return getLocalFallback(cleanQuery);
  }

  return buildResult(cleanQuery, best.category, best.item);
}

export default { fetchSpecsByQuery };
