const FALLBACK_CONFIG = {
  app: {
    title: 'Blasthole Profile Creator',
    subtitle: 'Geração automática de lâminas técnicas 16:9 no padrão visual Enaex.',
    default_profile_type: 'Perfis técnicos',
  },
  paths: {
    output_dir: 'output',
    log_dir: 'logs',
    state_dir: 'state',
    logo_path: 'VISUAL/Enaex Brasil.png',
  },
  layout: {
    scale: 2,
    panel_scale: 3,
    output_size: [1920, 1080],
    header_height: 168,
    top_margin: 176,
    bottom_margin: 92,
    page_margin: 48,
    panel_gap: 24,
    mesh_panel_width: 500,
    profile_panel_gap: 16,
  },
  export: {
    jpg_quality: 95,
    jpg_subsampling: 0,
    write_png: true,
    write_jpg: true,
    write_pdf: true,
  },
  site: {
    storage_key: 'enaex.profile-creator.web.state.v1',
    preview_size: [1920, 1080],
    export_size: [3840, 2160],
  },
  validation: {
    min_profiles: 1,
    max_profiles: 4,
    required_text_fields: ['polygon_name', 'template_name', 'profile_type'],
  },
  defaults: {
    template_name: 'Enaex clean',
    polygon_name: 'PP170526 (220-210)',
    observation: 'Perfil técnico para reporte operacional.',
    profile_type: 'Perfis técnicos',
    profile_count: 2,
    labels: {
      stemming: 'Tampão',
      blastbag: 'Blastbag',
      airdeck: 'Deck de ar',
      column: 'Carga',
      subdrill: 'Subperf.',
    },
    profiles: [
      {
        name: 'Perfil A',
        kind: 'produção',
        diametro_furo: 140.0,
        altura_banco: 10.5,
        subperfuracao: 0.6,
        stemming: 2.3,
        air_deck: 0.35,
        blastbag: 0.15,
        inclinacao: 0.0,
        azimute: 0.0,
        densidade: 1.15,
      },
      {
        name: 'Perfil B',
        kind: 'amortecimento',
        diametro_furo: 102.0,
        altura_banco: 10.4,
        subperfuracao: 0.0,
        stemming: 3.5,
        air_deck: 0.2,
        blastbag: 0.1,
        inclinacao: 0.0,
        azimute: 0.0,
        densidade: 1.05,
      },
    ],
  },
  templates: {
    'Enaex clean': {
      bg: '#FFFFFF',
      panel_bg: '#FFFFFF',
      panel_alt: '#F9FAFB',
      panel_border: '#E5E7EB',
      title: '#111827',
      text: '#1F2937',
      muted: '#6B7280',
      accent_red: '#D71920',
      accent_blue: '#1D6FB8',
      accent_orange: '#F28C28',
      accent_dark: '#223A8D',
      shadow: [17, 24, 39, 45],
    },
    'Técnico minimalista': {
      bg: '#FFFFFF',
      panel_bg: '#FFFFFF',
      panel_alt: '#F9FAFB',
      panel_border: '#E2E8F0',
      title: '#0F172A',
      text: '#1E293B',
      muted: '#64748B',
      accent_red: '#C81D25',
      accent_blue: '#2563EB',
      accent_orange: '#D97706',
      accent_dark: '#1837B8',
      shadow: [15, 23, 42, 35],
    },
    'Relatório executivo': {
      bg: '#FFFFFF',
      panel_bg: '#FFFFFF',
      panel_alt: '#F8FAFC',
      panel_border: '#CBD5E1',
      title: '#0F2040',
      text: '#1B2B40',
      muted: '#607080',
      accent_red: '#BD1E24',
      accent_blue: '#2D6CDF',
      accent_orange: '#DB7A11',
      accent_dark: '#1C3DB6',
      shadow: [15, 30, 50, 50],
    },
  },
};

const KIND_OPTIONS = ['produção', 'amortecimento', 'contorno', 'personalizado'];
const KIND_LABELS = {
  produção: 'Produção',
  amortecimento: 'Amortecimento',
  contorno: 'Contorno',
  personalizado: 'Personalizado',
};
const KIND_ACCENTS = {
  produção: { accent: '#1D6FB8', soft: '#E9F2FB', title: 'Produção' },
  amortecimento: { accent: '#F28C28', soft: '#FFF1E2', title: 'Amortecimento' },
  contorno: { accent: '#D71920', soft: '#FFE3E5', title: 'Contorno' },
  personalizado: { accent: '#223A8D', soft: '#E8ECFA', title: 'Personalizado' },
};

const PROFILE_FIELDS = [
  'name',
  'kind',
  'diametro_furo',
  'altura_banco',
  'subperfuracao',
  'stemming',
  'blastbag',
  'air_deck',
  'inclinacao',
  'azimute',
  'densidade',
];

const DEFAULT_STORAGE_KEY = 'enaex.profile-creator.web.state.v1';
const DEFAULT_EXPORT_SIZE = [3840, 2160];
const DEFAULT_PREVIEW_SIZE = [1920, 1080];

const dom = {};
let config = null;
let state = null;
let lastValidSvg = '';
let lastValidState = null;
let logoDataUrl = '';
let seedSource = 'default';
let updateTimer = 0;
let saveTimer = 0;

const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizeNumber(value, fallback = 0) {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(a, b, t) {
  const start = hexToRgb(a);
  const end = hexToRgb(b);
  return rgbToHex(
    start.r + (end.r - start.r) * t,
    start.g + (end.g - start.g) * t,
    start.b + (end.b - start.b) * t,
  );
}

function formatDecimal(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return `0,${'0'.repeat(digits)}`;
  return num.toFixed(digits).replace('.', ',');
}

function shortText(text, max = 18) {
  const value = String(text ?? '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

function pluralProfiles(count) {
  return count === 1 ? 'perfil' : 'perfis';
}

function kindLabel(kind) {
  return KIND_LABELS[normalizeKind(kind)] || KIND_LABELS.personalizado;
}

function labelSet() {
  return config?.defaults?.labels || FALLBACK_CONFIG.defaults.labels;
}

function normalizeKind(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return 'personalizado';
  if (raw in KIND_LABELS) return raw;
  const match = Object.entries(KIND_LABELS).find(([, label]) => label.toLowerCase() === raw);
  return match ? match[0] : 'personalizado';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function loadJson(path, fallback = null) {
  return fetch(path, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`${path} ${response.status}`);
      return response.json();
    })
    .catch(() => clone(fallback));
}

function getStorageKey(currentConfig) {
  return currentConfig?.site?.storage_key || DEFAULT_STORAGE_KEY;
}

function createDefaultState(currentConfig) {
  const defaults = currentConfig.defaults;
  return {
    profileType: currentConfig.app.default_profile_type,
    templateName: defaults.template_name,
    polygonName: defaults.polygon_name,
    observation: defaults.observation,
    profileCount: clamp(Number(defaults.profile_count) || 2, currentConfig.validation.min_profiles, currentConfig.validation.max_profiles),
    labels: clone(defaults.labels),
    profiles: clone(defaults.profiles),
    logo: {
      name: '',
      type: '',
      dataUrl: '',
    },
    mesh: {
      name: '',
      type: '',
      dataUrl: '',
    },
  };
}

function normalizeProfile(source, fallback, index, defaultCount) {
  const profile = clone(fallback);
  if (source && typeof source === 'object') {
    for (const field of PROFILE_FIELDS) {
      if (field in source) profile[field] = source[field];
    }
  }

  profile.name = isNonEmptyString(profile.name) ? String(profile.name).trim() : `Perfil ${index + 1}`;
  profile.kind = normalizeKind(profile.kind);
  profile.diametro_furo = normalizeNumber(profile.diametro_furo, fallback.diametro_furo);
  profile.altura_banco = normalizeNumber(profile.altura_banco, fallback.altura_banco);
  profile.subperfuracao = normalizeNumber(profile.subperfuracao, fallback.subperfuracao);
  profile.stemming = normalizeNumber(profile.stemming, fallback.stemming);
  profile.blastbag = normalizeNumber(profile.blastbag ?? 0, fallback.blastbag ?? 0);
  profile.air_deck = normalizeNumber(profile.air_deck ?? 0, fallback.air_deck ?? 0);
  profile.inclinacao = normalizeNumber(profile.inclinacao, fallback.inclinacao);
  profile.azimute = normalizeNumber(profile.azimute, fallback.azimute);
  profile.densidade = normalizeNumber(profile.densidade, fallback.densidade);

  if (index >= defaultCount && !isNonEmptyString(source?.name)) {
    profile.name = `Perfil ${index + 1}`;
  }

  return profile;
}

function mergeLoadedState(currentConfig, savedState) {
  const base = createDefaultState(currentConfig);
  const validation = currentConfig.validation;
  const defaultCount = base.profiles.length;
  const request = savedState?.request && typeof savedState.request === 'object' ? savedState.request : savedState;

  if (!request || typeof request !== 'object') return base;

  const templateName = isNonEmptyString(request.template_name) && currentConfig.templates[request.template_name]
    ? request.template_name
    : base.templateName;

  const polygonName = isNonEmptyString(request.polygon_name) ? String(request.polygon_name).trim() : base.polygonName;
  const observation = typeof request.observation === 'string' ? request.observation : base.observation;
  const profileType = isNonEmptyString(request.profile_type) ? String(request.profile_type).trim() : base.profileType;

  const labels = clone(base.labels);
  if (request.labels && typeof request.labels === 'object') {
    for (const key of Object.keys(labels)) {
      if (isNonEmptyString(request.labels[key])) labels[key] = String(request.labels[key]).trim();
    }
  }

  const savedProfiles = Array.isArray(request.profiles) ? request.profiles : [];
  const requestedCount = Number.isInteger(request.profile_count) ? request.profile_count : savedProfiles.length || base.profileCount;
  const profileCount = clamp(requestedCount, validation.min_profiles, validation.max_profiles);
  const profiles = [];

  for (let index = 0; index < profileCount; index += 1) {
    const fallback = base.profiles[index] || base.profiles[base.profiles.length - 1];
    profiles.push(normalizeProfile(savedProfiles[index], fallback, index, defaultCount));
  }

  const state = {
    profileType,
    templateName,
    polygonName,
    observation,
    profileCount,
    labels,
    profiles,
    logo: (() => {
      const asset = request.logo && typeof request.logo === 'object' ? request.logo : {};
      return {
        name: isNonEmptyString(asset.name) ? String(asset.name).trim() : '',
        type: isNonEmptyString(asset.type) ? String(asset.type).trim() : '',
        dataUrl: isNonEmptyString(asset.dataUrl) ? String(asset.dataUrl) : '',
      };
    })(),
    mesh: clone(base.mesh),
  };

  const errors = validateState(state, currentConfig);
  if (errors.length) return base;
  return state;
}

function validateState(appState, currentConfig) {
  const issues = [];
  const validation = currentConfig.validation;

  for (const field of validation.required_text_fields) {
    if (!isNonEmptyString(appState[fieldToStateKey(field)] ?? appState[field])) {
      issues.push(`${stateLabel(field)} é obrigatório.`);
    }
  }

  if (!isNonEmptyString(appState.templateName) || !currentConfig.templates[appState.templateName]) {
    issues.push('Template visual inválido.');
  }

  if (!Number.isInteger(appState.profileCount)) {
    issues.push('Quantidade de perfis inválida.');
  } else if (appState.profileCount < validation.min_profiles || appState.profileCount > validation.max_profiles) {
    issues.push(`Quantidade de perfis deve ficar entre ${validation.min_profiles} e ${validation.max_profiles}.`);
  }

  if (!Array.isArray(appState.profiles) || appState.profiles.length !== appState.profileCount) {
    issues.push('Perfis não correspondem à quantidade selecionada.');
  }

  const numericFields = [
    'diametro_furo',
    'altura_banco',
    'subperfuracao',
    'stemming',
    'air_deck',
    'blastbag',
    'inclinacao',
    'azimute',
    'densidade',
  ];

  appState.profiles?.forEach((profile, index) => {
    if (!isNonEmptyString(profile.name)) issues.push(`Nome do perfil ${index + 1} é obrigatório.`);
    for (const field of numericFields) {
      const value = profile[field];
      if (!Number.isFinite(value)) {
        issues.push(`${fieldLabel(field)} do perfil ${index + 1} deve ser numérico.`);
      } else if (value < 0) {
        issues.push(`${fieldLabel(field)} do perfil ${index + 1} deve ser maior ou igual a zero.`);
      }
    }
  });

  return issues;
}

function fieldToStateKey(field) {
  const map = {
    polygon_name: 'polygonName',
    template_name: 'templateName',
    profile_type: 'profileType',
  };
  return map[field] || field;
}

function stateLabel(field) {
  const map = {
    polygon_name: 'Nome da poligonal',
    template_name: 'Template',
    profile_type: 'Tipo de perfil',
  };
  return map[field] || fieldLabel(field);
}

function fieldLabel(field) {
  const map = {
    name: 'Nome',
    kind: 'Categoria visual',
    diametro_furo: 'Diâmetro do furo',
    altura_banco: 'Altura do banco',
    subperfuracao: 'Subperfuração',
    stemming: 'Stemming / tampão',
    blastbag: 'Blastbag',
    air_deck: 'Deck de ar',
    inclinacao: 'Inclinação',
    azimute: 'Azimute',
    densidade: 'Densidade',
  };
  return map[field] || field;
}

function serializeForStorage(appState) {
  return {
    profileType: appState.profileType,
    templateName: appState.templateName,
    polygonName: appState.polygonName,
    observation: appState.observation,
    profileCount: appState.profileCount,
    labels: clone(appState.labels),
    profiles: clone(appState.profiles),
    logo: clone(appState.logo),
  };
}

function saveStateToStorage(currentConfig, appState) {
  const storageKey = getStorageKey(currentConfig);
  const payload = {
    savedAt: new Date().toISOString(),
    request: serializeForStorage(appState),
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    seedSource = 'browser';
    updateMemoryStatus('Memória local ativa');
  } catch (error) {
    showValidation(['Não foi possível salvar a memória local.']);
  }
}

function readStateFromStorage(currentConfig) {
  const storageKey = getStorageKey(currentConfig);
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearStateStorage(currentConfig) {
  try {
    localStorage.removeItem(getStorageKey(currentConfig));
  } catch {
    /* noop */
  }
}

function updateMemoryStatus(text) {
  if (dom.memoryStatus) dom.memoryStatus.textContent = text;
}

function showValidation(issues, persist = false) {
  if (!dom.validation) return;
  if (!issues.length) {
    dom.validation.innerHTML = '<div class="success">Lâmina pronta para exportação. A memória foi validada e o preview está atualizado.</div>';
    toggleDownloads(true);
    if (persist && lastValidState) {
      updateMemoryStatus(seedSource === 'browser' ? 'Memória local ativa' : 'Memória do projeto carregada');
    }
    return;
  }

  toggleDownloads(false);
  const messages = issues.map((issue) => (typeof issue === 'string' ? issue : issue?.message || issue?.text || String(issue)));
  dom.validation.innerHTML = `<div class="error"><strong>Corrija antes de exportar:</strong><ul>${messages.map((issue) => `<li>${escapeXml(issue)}</li>`).join('')}</ul></div>`;
}

function toggleDownloads(enabled) {
  dom.downloadButtons?.forEach((button) => {
    button.disabled = !enabled;
  });
}

function setStatusMessage(message) {
  if (dom.validation) {
    dom.validation.innerHTML = `<div class="success">${escapeXml(message)}</div>`;
  }
}

function getTheme(templateName) {
  return config.templates[templateName] || config.templates['Enaex clean'];
}

function getLogoFallbackSvg() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 72">
      <rect width="260" height="72" rx="16" fill="#FFFFFF"/>
      <rect x="12" y="12" width="236" height="4" rx="2" fill="#D71920"/>
      <text x="22" y="45" fill="#D71920" font-family="IBM Plex Sans, sans-serif" font-size="26" font-weight="700">ENAEX</text>
      <text x="120" y="45" fill="#66707e" font-family="IBM Plex Sans, sans-serif" font-size="16" font-weight="600">BRASIL</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function loadLogo(path) {
  try {
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) throw new Error('logo not found');
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return getLogoFallbackSvg();
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function fitFontSize(text, maxWidth, startSize, family = `'IBM Plex Sans', sans-serif`, weight = 700, minSize = 12) {
  for (let size = startSize; size >= minSize; size -= 1) {
    if (measureTextWidth(text, size, family, weight) <= maxWidth) return size;
  }
  return minSize;
}

function measureTextWidth(text, size, family, weight = 400) {
  if (!measureCtx) return text.length * size * 0.55;
  measureCtx.font = `${weight} ${size}px ${family}`;
  return measureCtx.measureText(text).width;
}

function wrapText(text, maxWidth, size, family = `'IBM Plex Sans', sans-serif`, weight = 400) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (measureTextWidth(candidate, size, family, weight) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function textBlock(x, y, lines, options = {}) {
  const { size = 16, weight = 400, fill = '#1F2937', family = `'IBM Plex Sans', sans-serif`, lineHeight = 1.28, anchor = 'start', italic = false } = options;
  const dy = size * lineHeight;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''} text-anchor="${anchor}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : dy}">${escapeXml(line)}</tspan>`).join('')}</text>`;
}

function iconDiameter(x, y, size, color) {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="${cx}" cy="${cy}" r="${r - 2}"/><path d="M${cx - r + 6} ${cy} H${cx + r - 6}"/><path d="M${cx} ${cy - r + 6} V${cy + r - 6}"/></g>`;
}

function iconHeight(x, y, size, color) {
  const r = size / 2;
  const cx = x + r;
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M${cx} ${y + 2} V${y + size - 2}"/><path d="M${cx} ${y + 2} l-5 8 h10 Z" fill="${color}" stroke="none"/><path d="M${cx} ${y + size - 2} l-5 -8 h10 Z" fill="${color}" stroke="none"/></g>`;
}

function iconSubdrill(x, y, size, color) {
  const cx = x + size / 2;
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M${cx} ${y + 2} V${y + size - 5}"/><path d="M${cx} ${y + size - 5} l-5 -8 h10 Z" fill="${color}" stroke="none"/></g>`;
}

function iconStem(x, y, size, color) {
  return `<rect x="${x + 3}" y="${y + 5}" width="${size - 6}" height="${size - 10}" rx="3" fill="none" stroke="${color}" stroke-width="2"/>`;
}

function iconBlastbag(x, y, size, color) {
  return `<rect x="${x + 3}" y="${y + 7}" width="${size - 6}" height="${size - 14}" rx="7" fill="#2F343B" stroke="${color}" stroke-width="1.5"/>`;
}

function iconAirdeck(x, y, size, color) {
  const lines = [];
  for (let yy = y + 8; yy <= y + size - 8; yy += 4) lines.push(`<line x1="${x + 6}" y1="${yy}" x2="${x + size - 6}" y2="${yy}" stroke="${color}" stroke-width="1"/>`);
  return `<rect x="${x + 3}" y="${y + 6}" width="${size - 6}" height="${size - 12}" rx="3" fill="none" stroke="${color}" stroke-width="2"/>${lines.join('')}`;
}

function iconInclination(x, y, size, color) {
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M${x + 3} ${y + size - 3} H${x + size - 3}"/><path d="M${x + 3} ${y + size - 3} L${x + size - 5} ${y + 5}"/></g>`;
}

function iconAzimuth(x, y, size, color) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="${cx}" cy="${cy}" r="${size / 2 - 3}"/><path d="M${cx} ${cy} L${cx + 7} ${cy - 6}"/><path d="M${cx} ${cy} L${cx - 4} ${cy + 7}"/></g>`;
}

function iconDensity(x, y, size, color) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  return `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M${cx} ${y + 3} C${cx + 8} ${y + 14}, ${cx + 8} ${y + 20}, ${cx} ${y + size - 3} C${cx - 8} ${y + 20}, ${cx - 8} ${y + 14}, ${cx} ${y + 3} Z" fill="${color}" stroke="none"/></g>`;
}

function renderMetricRow({ x, y, w, h, label, value, kind, color, theme, alternate, compact }) {
  const rowFill = alternate ? '#F9FAFB' : 'transparent';
  const iconSize = compact ? 18 : 24;
  const iconX = x + 10;
  const iconY = y + (h - iconSize) / 2;
  const labelX = x + 44;
  const labelY = y + (compact ? 14 : 16);
  const valueFont = compact ? 10 : 12;
  const labelFont = compact ? 9 : 10;
  const valueY = y + (compact ? 22 : 24);
  const rightValue = value;
  const valueWidth = measureTextWidth(rightValue, valueFont, `'IBM Plex Sans', sans-serif`, 700);
  const valueX = x + w - 14 - valueWidth;

  const icons = {
    diameter: iconDiameter(iconX, iconY, iconSize, color),
    height: iconHeight(iconX, iconY, iconSize, color),
    subdrill: iconSubdrill(iconX, iconY, iconSize, color),
    stemming: iconStem(iconX, iconY, iconSize, color),
    blastbag: iconBlastbag(iconX, iconY, iconSize, color),
    airdeck: iconAirdeck(iconX, iconY, iconSize, color),
    inclination: iconInclination(iconX, iconY, iconSize, color),
    azimuth: iconAzimuth(iconX, iconY, iconSize, color),
    density: iconDensity(iconX, iconY, iconSize, color),
    column: iconStem(iconX, iconY, iconSize, color),
  };

  return `
    <g>
      ${rowFill !== 'transparent' ? `<rect x="${x}" y="${y}" width="${w}" height="${h - 1}" fill="${rowFill}"/>` : ''}
      ${icons[kind] || iconStem(iconX, iconY, iconSize, color)}
      <text x="${labelX}" y="${labelY}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${labelFont}" font-weight="700" letter-spacing="0.08em">${escapeXml(label.toUpperCase())}</text>
      <text x="${valueX}" y="${valueY}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${valueFont}" font-weight="700">${escapeXml(rightValue)}</text>
      <line x1="${x + 6}" y1="${y + h - 1}" x2="${x + w - 6}" y2="${y + h - 1}" stroke="#E5E7EB" stroke-width="1"/>
    </g>`;
}

function renderProfileCard(profile, theme, box, compact, index) {
  const { x, y, w, h } = box;
  const accentInfo = KIND_ACCENTS[profile.kind] || KIND_ACCENTS.personalizado;
  const accent = accentInfo.accent;
  const accentSoft = accentInfo.soft;
  const name = shortText(profile.name, compact ? 18 : 22).toUpperCase();
  const badgeLetter = (() => {
    const parts = String(profile.name || '').trim().split(/\s+/);
    if (parts.length && parts[parts.length - 1].length === 1 && parts[parts.length - 1] === parts[parts.length - 1].toUpperCase()) return parts[parts.length - 1];
    return String(profile.name || '?').trim()[0]?.toUpperCase() || '?';
  })();

  const titleSize = compact ? 17 : 18;
  const subSize = compact ? 10 : 11;
  const tagSize = compact ? 9 : 10;
  const badgeR = compact ? 20 : 22;
  const badgeCx = x + (compact ? 44 : 46);
  const badgeCy = y + (compact ? 46 : 50);
  const tagText = kindLabel(profile.kind).toUpperCase();
  const tagWidth = measureTextWidth(tagText, tagSize, `'IBM Plex Sans', sans-serif`, 700);
  const tagX = x + (compact ? 320 : 380) - tagWidth / 2 - 8;
  const tagY = y + (compact ? 22 : 24);
  const tagHeight = compact ? 22 : 24;
  const drawingBox = compact
    ? { x: x + 18, y: y + 96, w: 132, h: h - 186 }
    : { x: x + 34, y: y + 108, w: 144, h: h - 218 };
  const infoBox = compact
    ? { x: x + 178, y: y + 96, w: w - 202, h: h - 186 }
    : { x: x + 190, y: y + 108, w: w - 218, h: h - 218 };
  const left = drawingBox.x;
  const top = drawingBox.y;
  const right = drawingBox.x + drawingBox.w;
  const bottom = drawingBox.y + drawingBox.h;
  const cx = left + drawingBox.w / 2;
  const cylW = compact ? 46 : 52;
  const cylX1 = cx - cylW / 2;
  const cylX2 = cx + cylW / 2;
  const holeTop = top + (compact ? 20 : 28);
  const holeBottom = bottom - (compact ? 20 : 28);
  const holeH = holeBottom - holeTop;
  const total = Math.max(profile.altura_banco + profile.subperfuracao, 0.01);
  const stem = clamp(profile.stemming, 0, profile.altura_banco);
  const sub = Math.max(profile.subperfuracao, 0);
  const bb = Math.max(profile.blastbag, 0);
  const ad = Math.max(profile.air_deck, 0);
  const charge = Math.max(profile.altura_banco - stem - bb - ad, 0);

  const segmentData = [
    ['stemming', stem, '#C8CDD5'],
    ['blastbag', bb, '#1F2937'],
    ['airdeck', ad, null],
    ['column', charge, accent],
    ['subdrill', sub, '#4B5563'],
  ];

  let yCur = holeTop;
  const segmentMarkup = [];
  for (const [key, segVal, segColor] of segmentData) {
    if (segVal <= 0) continue;
    const segH = Math.max(1, holeH * (segVal / total));
    const y2 = key === 'subdrill' ? holeBottom : yCur + segH;
    const midY = (yCur + y2) / 2;
    if (key === 'airdeck') {
      let hatch = '';
      for (let yy = yCur + (compact ? 2 : 3); yy < y2; yy += compact ? 5 : 6) {
        hatch += `<line x1="${cylX1 + (compact ? 2 : 3)}" y1="${yy}" x2="${cylX2 - (compact ? 2 : 3)}" y2="${yy}" stroke="${accent}" stroke-width="1"/>`;
      }
      segmentMarkup.push(`<rect x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="#FFFFFF"/>${hatch}`);
    } else if (key === 'blastbag') {
      const darker = mixHex(segColor, '#000000', 0.1);
      const lighter = mixHex(segColor, '#FFFFFF', 0.18);
      segmentMarkup.push(`<defs><linearGradient id="grad-${index}-${key}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${lighter}"/><stop offset="100%" stop-color="${darker}"/></linearGradient></defs><rect x="${cylX1 + 2}" y="${yCur}" width="${cylW - 4}" height="${y2 - yCur}" fill="url(#grad-${index}-${key})"/>`);
    } else if (key === 'column') {
      const light = mixHex(segColor, '#FFFFFF', 0.36);
      const dark = mixHex(segColor, '#1b2430', 0.12);
      segmentMarkup.push(`<defs><linearGradient id="grad-${index}-${key}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${light}"/><stop offset="18%" stop-color="${segColor}"/><stop offset="100%" stop-color="${dark}"/></linearGradient></defs><rect x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="url(#grad-${index}-${key})"/>`);
      segmentMarkup.push(`<rect x="${cylX1 + 4}" y="${yCur}" width="${Math.max(1, cylW * 0.12)}" height="${y2 - yCur}" fill="rgba(255,255,255,0.22)"/>`);
    } else {
      const light = mixHex(segColor, '#FFFFFF', 0.22);
      const dark = mixHex(segColor, '#1b2430', 0.14);
      segmentMarkup.push(`<defs><linearGradient id="grad-${index}-${key}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${light}"/><stop offset="100%" stop-color="${dark}"/></linearGradient></defs><rect x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="url(#grad-${index}-${key})"/>`);
    }

    const labelX = cylX2 + (compact ? 8 : 8);
    const labelSize = compact ? 9 : 10;
    const labelValue = `${formatDecimal(segVal)}m`;
    segmentMarkup.push(`<line x1="${cylX2 + 4}" y1="${midY}" x2="${cylX2 + 10}" y2="${midY}" stroke="${theme.muted}" stroke-width="1" stroke-dasharray="4 4"/>`);
    segmentMarkup.push(`<text x="${labelX + 10}" y="${midY - 2}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${labelSize}" font-weight="400">${escapeXml(labelValue)}</text>`);
    yCur = y2;
  }

  const labels = labelSet();
  const metricRows = compact
    ? [
      ['diameter', 'Diâmetro do furo', `${Math.round(profile.diametro_furo)} mm`, 'diameter'],
      ['height', 'Altura do banco', `${formatDecimal(profile.altura_banco)} m`, 'height'],
      ['subdrill', labels.subdrill, `${formatDecimal(profile.subperfuracao)} m`, 'subdrill'],
      ['stemming', labels.stemming, `${formatDecimal(stem)} m`, 'stemming'],
      ['column', labels.column, `${formatDecimal(charge)} m`, 'column'],
    ]
    : [
      ['diameter', 'Diâmetro do furo', `${Math.round(profile.diametro_furo)} mm`, 'diameter'],
      ['height', 'Altura do banco', `${formatDecimal(profile.altura_banco)} m`, 'height'],
      ['subdrill', labels.subdrill, `${formatDecimal(profile.subperfuracao)} m`, 'subdrill'],
      ['stemming', labels.stemming, `${formatDecimal(profile.stemming)} m`, 'stemming'],
      ['blastbag', labels.blastbag, `${formatDecimal(profile.blastbag)} m`, 'blastbag'],
      ['airdeck', labels.airdeck, `${formatDecimal(profile.air_deck)} m`, 'airdeck'],
      ['inclination', 'Inclinação', `${formatDecimal(profile.inclinacao, 1)}°`, 'inclination'],
      ['azimuth', 'Azimute', `${formatDecimal(profile.azimute, 1)}°`, 'azimuth'],
      ['density', 'Densidade', `${formatDecimal(profile.densidade, 2)} g/cm³`, 'density'],
    ];

  const rowHeight = compact ? 28 : 40;
  const rowStart = infoBox.y + (compact ? 34 : 44);
  const rowsMarkup = metricRows.map((row, idx) => renderMetricRow({
    x: infoBox.x + 8,
    y: rowStart + idx * rowHeight,
    w: infoBox.w - 16,
    h: rowHeight,
    label: row[1],
    value: row[2],
    kind: row[3],
    color: accent,
    theme,
    alternate: idx % 2 === 1,
    compact,
  })).join('');

  const chips = compact
    ? [
      [labels.blastbag, `${formatDecimal(bb)} m`],
      [labels.airdeck, `${formatDecimal(ad)} m`],
      ['Incl.', `${formatDecimal(profile.inclinacao, 1)}°`],
      ['Azim.', `${formatDecimal(profile.azimute, 1)}°`],
      ['Dens.', `${formatDecimal(profile.densidade, 2)}`],
    ]
    : [
      [labels.stemming, `${formatDecimal(stem)} m`],
      [labels.column, `${formatDecimal(charge)} m`],
      [labels.subdrill, `${formatDecimal(sub)} m`],
      [labels.blastbag, `${formatDecimal(bb)} m`],
    ];

  const chipFont = compact ? 9 : 11;
  const chipY = infoBox.y + infoBox.h - (compact ? 62 : 64);
  let chipX = infoBox.x + 12;
  const chipMarkup = [];
  for (const [chipLabel, chipVal] of chips) {
    const text = `${chipLabel}: ${chipVal}`;
    const textWidth = measureTextWidth(text, chipFont, `'IBM Plex Sans', sans-serif`, 700);
    const chipW = textWidth + (compact ? 18 : 20);
    if (chipX + chipW > infoBox.x + infoBox.w - 12) break;
    chipMarkup.push(`
      <g>
        <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${compact ? 24 : 28}" rx="10" fill="#F8FAFC" stroke="#E5E7EB"/>
        <text x="${chipX + 8}" y="${chipY + (compact ? 16 : 18)}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${chipFont}" font-weight="700">${escapeXml(text)}</text>
      </g>`);
    chipX += chipW + 8;
  }

  const footerBar = {
    x: infoBox.x + 10,
    y: infoBox.y + infoBox.h - (compact ? 28 : 28),
    w: infoBox.w - 20,
    h: 24,
  };
  const footerText = `${shortText(profile.name, compact ? 18 : 20)} | ${kindLabel(profile.kind)}`;

  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
    </g>
    <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="26" fill="none" stroke="#FFFFFF"/>
    <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="6" rx="3" fill="${accentSoft}"/>

    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR}" fill="${accent}"/>
    <text x="${badgeCx}" y="${badgeCy + 6}" fill="#FFFFFF" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 18 : 20}" font-weight="700">${escapeXml(badgeLetter)}</text>

    <text x="${x + (compact ? 82 : 82)}" y="${y + (compact ? 36 : 30)}" fill="${accent}" font-family="IBM Plex Sans, sans-serif" font-size="${titleSize}" font-weight="700">${escapeXml(name)}</text>
    <text x="${x + (compact ? 82 : 82)}" y="${y + (compact ? 58 : 58)}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${subSize}" font-weight="700">${escapeXml(`${kindLabel(profile.kind).toUpperCase()}  •  ${Math.round(profile.diametro_furo)} MM`)}</text>
    <rect x="${tagX}" y="${tagY}" width="${tagWidth + 16}" height="${tagHeight}" rx="10" fill="${accentSoft}"/>
    <text x="${tagX + 8}" y="${tagY + (compact ? 14 : 16)}" fill="${accent}" font-family="IBM Plex Sans, sans-serif" font-size="${tagSize}" font-weight="700">${escapeXml(tagText)}</text>

    <rect x="${x + 18}" y="${y + (compact ? 80 : 88)}" width="${w - 36}" height="4" rx="2" fill="${accent}"/>

    <rect x="${drawingBox.x}" y="${drawingBox.y}" width="${drawingBox.w}" height="${drawingBox.h}" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
    ${segmentMarkup.join('')}
    <rect x="${cylX1}" y="${holeTop}" width="${cylW}" height="${holeBottom - holeTop}" rx="${compact ? 16 : 20}" fill="none" stroke="${theme.title}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${holeTop + 2}" rx="${cylW / 2}" ry="7" fill="#E9EEF4" stroke="${theme.title}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${holeBottom - 2}" rx="${cylW / 2}" ry="7" fill="#374151" stroke="${theme.title}" stroke-width="2"/>
    <line x1="${cylX1 + 5}" y1="${holeTop + 14}" x2="${cylX1 + 5}" y2="${holeBottom - 14}" stroke="rgba(255,255,255,0.75)" stroke-width="2"/>
    <text x="${left + 4}" y="${bottom - 4}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 9 : 10}" font-weight="700">${escapeXml(`BANCO ${formatDecimal(profile.altura_banco)} M`)}</text>

    <rect x="${infoBox.x}" y="${infoBox.y}" width="${infoBox.w}" height="${infoBox.h}" rx="16" fill="#FFFFFF" stroke="#E5E7EB"/>
    <rect x="${infoBox.x}" y="${infoBox.y}" width="${infoBox.w}" height="${compact ? 5 : 6}" fill="${accent}" rx="3"/>
    <text x="${infoBox.x + 12}" y="${infoBox.y + (compact ? 16 : 18)}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 13 : 15}" font-weight="700">${compact ? 'PARÂMETROS' : 'PARÂMETROS TÉCNICOS'}</text>
    ${rowsMarkup}
    ${chipMarkup.join('')}
    <rect x="${footerBar.x}" y="${footerBar.y}" width="${footerBar.w}" height="${footerBar.h}" rx="10" fill="${accent}"/>
    <text x="${footerBar.x + 12}" y="${footerBar.y + 16}" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 10 : 11}" font-weight="700">${escapeXml(footerText)}</text>
  `;
}

function renderMeshPanel(theme, box) {
  const { x, y, w, h } = box;
  if (state.mesh?.dataUrl) {
    return `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
      </g>
      <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="26" fill="none" stroke="#FFFFFF"/>
      <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="6" rx="3" fill="${theme.accent_red}"/>
      <text x="${x + 28}" y="${y + 42}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="20" font-weight="700">MALHA DE PERFURAÇÃO</text>
      <rect x="${x + 28}" y="${y + 60}" width="52" height="4" rx="2" fill="${theme.accent_red}"/>
      <rect x="${x + 28}" y="${y + 84}" width="140" height="28" rx="10" fill="#F8FAFC" stroke="#E5E7EB"/>
      <text x="${x + 40}" y="${y + 102}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="10" font-weight="700">ARQUIVO ANEXADO</text>
      <rect x="${x + 32}" y="${y + 128}" width="${w - 64}" height="${h - 176}" rx="20" fill="#F9FAFB" stroke="#E5E7EB"/>
      <image href="${state.mesh.dataUrl}" x="${x + 44}" y="${y + 140}" width="${w - 88}" height="${h - 200}" preserveAspectRatio="xMidYMid meet"/>
      <text x="${x + 28}" y="${y + h - 20}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="13" font-weight="700">${escapeXml(`Imagem anexada: ${shortText(state.mesh.name || 'sem nome', 40)}`)}</text>
    `;
  }

  const grid = [];
  for (let gx = x + 16; gx <= x + w - 16; gx += 18) {
    grid.push(`<line x1="${gx}" y1="${y + 18}" x2="${gx}" y2="${y + h - 16}" stroke="rgba(29,111,184,0.10)" stroke-width="1"/>`);
  }
  for (let gy = y + 18; gy <= y + h - 16; gy += 18) {
    grid.push(`<line x1="${x + 16}" y1="${gy}" x2="${x + w - 16}" y2="${gy}" stroke="rgba(29,111,184,0.08)" stroke-width="1"/>`);
  }

  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
    </g>
    <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="26" fill="none" stroke="#FFFFFF"/>
    <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="6" rx="3" fill="${theme.accent_red}"/>
    <text x="${x + 28}" y="${y + 42}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="20" font-weight="700">MALHA DE PERFURAÇÃO</text>
    <rect x="${x + 28}" y="${y + 60}" width="52" height="4" rx="2" fill="${theme.accent_red}"/>
    <text x="${x + 28}" y="${y + 78}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="14">${escapeXml(state.polygonName)}</text>
    <rect x="${x + 32}" y="${y + 104}" width="${w - 64}" height="${h - 194}" rx="20" fill="#F8FAFC" stroke="#E5E7EB" stroke-dasharray="8 8"/>
    ${grid.join('')}
    <circle cx="${x + w / 2}" cy="${y + 200}" r="34" fill="#F9FAFB" stroke="#D1D5DB"/>
    <path d="M${x + w / 2} ${y + 188} V${y + 210}" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
    <path d="M${x + w / 2} ${y + 188} l-7 10 h14 Z" fill="#9CA3AF"/>
    <text x="${x + w / 2}" y="${y + 250}" text-anchor="middle" fill="${theme.text}" font-family="IBM Plex Sans, sans-serif" font-size="14" font-weight="700">Anexe a imagem da malha</text>
    <text x="${x + w / 2}" y="${y + 276}" text-anchor="middle" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="12">Se não houver anexo, o painel fica apenas como referência.</text>
    <rect x="${x + w / 2 - 62}" y="${y + h - 98}" width="124" height="28" rx="12" fill="#FFFFFF" stroke="#E5E7EB"/>
    <text x="${x + w / 2}" y="${y + h - 78}" text-anchor="middle" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="11" font-weight="700">MODO REFERÊNCIA</text>
    <text x="${x + 36}" y="${y + h - 26}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="12">Somente imagem anexada, sem geração sintética da malha.</text>
  `;
}

function renderHeader(theme, box) {
  const { x, y, w, h } = box;
  const title = 'PERFIL DE CARGA';
  const titleSize = fitFontSize(title, w - 560, 34, `'IBM Plex Sans', sans-serif`, 700, 24);
  const polygonSize = fitFontSize(state.polygonName, w - 560, 30, `'IBM Plex Sans', sans-serif`, 700, 20);
  const logoBox = { x: x + 36, y: y + 18, w: 200, h: 124 };
  const rightBadgeText = state.profileType;
  const badgeFont = 19;
  const badgeTextWidth = measureTextWidth(rightBadgeText, badgeFont, `'IBM Plex Sans', sans-serif`, 700);
  const badgeW = Math.max(210, badgeTextWidth + 52);
  const badgeX = x + w - badgeW - 36;

  return `
    <rect x="0" y="0" width="${w}" height="${h}" fill="#FFFFFF"/>
    <rect x="0" y="0" width="${w}" height="6" fill="${theme.accent_red}"/>
    <line x1="${x + 36}" y1="${y + 154}" x2="${x + w - 36}" y2="${y + 154}" stroke="#EEF2F7" stroke-width="1"/>
    <rect x="${logoBox.x}" y="${logoBox.y}" width="${logoBox.w}" height="${logoBox.h}" rx="18" fill="#FFFFFF" stroke="#E5E7EB"/>
    <rect x="${logoBox.x}" y="${logoBox.y}" width="${logoBox.w}" height="6" rx="3" fill="${theme.accent_red}"/>
    ${(() => {
      const logoUrl = state.logo?.dataUrl || logoDataUrl;
      return logoUrl
        ? `<image href="${logoUrl}" x="${logoBox.x + 14}" y="${logoBox.y + 16}" width="${logoBox.w - 28}" height="${logoBox.h - 26}" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="${logoBox.x + 20}" y="${logoBox.y + 64}" fill="${theme.accent_red}" font-family="IBM Plex Sans, sans-serif" font-size="28" font-weight="700">ENAEX</text>`;
    })()}
    <text x="${x + 262}" y="${y + 36}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${titleSize}" font-weight="700">${escapeXml(title)}</text>
    <text x="${x + 262}" y="${y + 82}" fill="${theme.accent_red}" font-family="IBM Plex Sans, sans-serif" font-size="${polygonSize}" font-weight="700">${escapeXml(state.polygonName)}</text>
    <text x="${x + 262}" y="${y + 118}" fill="#9CA3AF" font-family="IBM Plex Sans, sans-serif" font-size="14">Lâmina técnica 16:9</text>
    <rect x="${x + 262}" y="${y + 146}" width="182" height="24" rx="10" fill="#F8FAFC" stroke="#E5E7EB"/>
    <text x="${x + 276}" y="${y + 162}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="12" font-weight="700">Entrega técnica</text>
    <rect x="${badgeX}" y="${y + 38}" width="${badgeW}" height="70" rx="20" fill="${theme.accent_red}"/>
    <text x="${badgeX + badgeW / 2}" y="${y + 60}" text-anchor="middle" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif" font-size="${badgeFont}" font-weight="700">${escapeXml(rightBadgeText)}</text>
    <text x="${badgeX + badgeW / 2}" y="${y + 80}" text-anchor="middle" fill="#FFCDD0" font-family="IBM Plex Sans, sans-serif" font-size="12" font-weight="700">16:9</text>
  `;
}

function renderFooter(theme, box, showLegend = false) {
  const { x, y, w, h } = box;
  const legend = [
    ['Produção', theme.accent_blue],
    ['Amortecimento', theme.accent_orange],
    ['Contorno', theme.accent_red],
  ];

  const legendMarkup = showLegend ? legend.map(([label, color], index) => {
    const posX = x + 48 + legend.slice(0, index).reduce((acc, [previousLabel]) => acc + measureTextWidth(previousLabel, 15, `'IBM Plex Sans', sans-serif`, 700) + 36, 0);
    return `<rect x="${posX}" y="${y + 16}" width="14" height="14" rx="4" fill="${color}"/><text x="${posX + 20}" y="${y + 28}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="15" font-weight="700">${escapeXml(label)}</text>`;
  }).join('') : '';

  const observationLines = wrapText(state.observation, w - 96, 17, `'IBM Plex Sans', sans-serif`, 400).slice(0, 3);
  const observationMarkup = observationLines.length
    ? textBlock(x + 48, y + (showLegend ? 54 : 28), observationLines, { size: 16, weight: 400, fill: theme.muted })
    : '';

  return `
    <line x1="${x + 48}" y1="${y}" x2="${x + w - 48}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>
    ${legendMarkup}
    ${observationMarkup}
  `;
}

function renderLayout(currentConfig) {
  const theme = getTheme(state.templateName);
  const [viewW, viewH] = currentConfig.site?.preview_size || DEFAULT_PREVIEW_SIZE;
  const margin = 48;
  const top = currentConfig.layout?.header_height || 168;
  const bottom = currentConfig.layout?.bottom_margin || 92;
  const panelGap = currentConfig.layout?.panel_gap || 24;
  const meshW = currentConfig.layout?.mesh_panel_width || 500;
  const cardH = viewH - top - bottom;
  const profileAreaW = viewW - (margin * 2) - meshW - panelGap;
  const compact = state.profileCount > 3;
  const cards = [];

  cards.push({ type: 'mesh', x: margin, y: top + 8, w: meshW, h: cardH });
  if (!compact) {
    const count = Math.max(state.profileCount, 1);
    const gap = count > 1 ? 16 : 0;
    const cardW = (profileAreaW - gap * (count - 1)) / count;
    let x = margin + meshW + panelGap;
    for (let i = 0; i < state.profileCount; i += 1) {
      cards.push({ type: 'profile', x, y: top + 8, w: cardW, h: cardH, index: i });
      x += cardW + gap;
    }
  } else {
    const cols = 2;
    const rows = 2;
    const cardW = (profileAreaW - panelGap) / cols;
    const cardH2 = (cardH - panelGap) / rows;
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (index >= state.profileCount) break;
        cards.push({ type: 'profile', x: margin + meshW + panelGap + col * (cardW + panelGap), y: top + 8 + row * (cardH2 + panelGap), w: cardW, h: cardH2, index });
        index += 1;
      }
    }
  }

  const content = cards.map((card) => {
    if (card.type === 'mesh') return renderMeshPanel(theme, card);
    return renderProfileCard(state.profiles[card.index], theme, card, compact, card.index);
  }).join('');

  const header = renderHeader(theme, { x: 0, y: 0, w: viewW, h: 168 });
  const footer = renderFooter(theme, { x: 0, y: viewH - bottom, w: viewW, h: bottom }, Boolean(state.mesh?.dataUrl));

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" role="img" aria-labelledby="svgTitle svgDesc">
      <title id="svgTitle">Blasthole Profile Creator</title>
      <desc id="svgDesc">Lâmina técnica para perfil de carga com dados editáveis e composição vetorial.</desc>
      <defs>
        <linearGradient id="pageBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${theme.bg}"/>
          <stop offset="100%" stop-color="#F8F9FB"/>
        </linearGradient>
        <filter id="shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="${rgbToHex(theme.shadow[0], theme.shadow[1], theme.shadow[2])}" flood-opacity="${(theme.shadow[3] || 45) / 100}"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#pageBg)"/>
      ${header}
      ${content}
      ${footer}
    </svg>`;
}

function renderGlobalSection(currentConfig) {
  const templateOptions = Object.keys(currentConfig.templates).map((template) => `<option value="${escapeXml(template)}"${template === state.templateName ? ' selected' : ''}>${escapeXml(template)}</option>`).join('');
  const logoName = state.logo?.name ? shortText(state.logo.name, 32) : 'Logo Enaex padrão';
  const meshName = state.mesh?.name ? shortText(state.mesh.name, 32) : 'Nenhum arquivo anexado';
  return `
    <div class="form-grid form-grid--two">
      <div class="field">
        <label for="templateName">Template</label>
        <select id="templateName" data-path="templateName">${templateOptions}</select>
      </div>
      <div class="field">
        <label for="polygonName">Nome da poligonal</label>
        <input id="polygonName" data-path="polygonName" type="text" value="${escapeXml(state.polygonName)}" placeholder="Nome da poligonal">
      </div>
      <div class="field" style="grid-column: 1 / -1;">
        <label for="observation">Observação final</label>
        <textarea id="observation" data-path="observation" placeholder="Observação final">${escapeXml(state.observation)}</textarea>
      </div>
    </div>
    <div class="image-upload-row" style="margin-top: 14px;">
      <div class="field" style="flex: 1 1 300px; min-width: 260px;">
        <label for="logoFile">Logo do cabeçalho</label>
        <input id="logoFile" data-role="logo-file" type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml">
      </div>
      <span class="file-chip" id="logoChip">${escapeXml(logoName)}</span>
    </div>
    <p class="hint" style="margin-top: 10px;">O logo anexado substitui o Enaex padrão no cabeçalho e nas exportações.</p>
    <div class="image-upload-row" style="margin-top: 14px;">
      <div class="field" style="flex: 1 1 300px; min-width: 260px;">
        <label for="meshFile">Anexar imagem da malha</label>
        <input id="meshFile" data-role="mesh-file" type="file" accept="image/png,image/jpeg,image/jpg">
      </div>
      <span class="file-chip" id="meshChip">${escapeXml(meshName)}</span>
    </div>
    <p class="hint" style="margin-top: 12px;">O anexo da malha permanece apenas na sessão atual por segurança e tamanho de armazenamento.</p>`;
}

function renderLabelSection() {
  return `
    <div class="form-grid form-grid--three">
      ${renderInput('Tampão / stemming', 'labels.stemming', state.labels.stemming)}
      ${renderInput('Blastbag', 'labels.blastbag', state.labels.blastbag)}
      ${renderInput('Deck de ar', 'labels.airdeck', state.labels.airdeck)}
      ${renderInput('Carga / coluna', 'labels.column', state.labels.column)}
      ${renderInput('Subperfuração', 'labels.subdrill', state.labels.subdrill)}
    </div>`;
}

function renderProfilesSection() {
  const cards = state.profiles.slice(0, state.profileCount).map((profile, index) => renderProfileEditor(profile, index)).join('');
  return `<div class="profile-list">${cards}</div>`;
}

function renderInput(label, path, value, type = 'text', extra = {}) {
  const attrs = [];
  if (extra.step != null) attrs.push(`step="${extra.step}"`);
  if (extra.min != null) attrs.push(`min="${extra.min}"`);
  if (extra.max != null) attrs.push(`max="${extra.max}"`);
  if (extra.placeholder != null) attrs.push(`placeholder="${escapeXml(extra.placeholder)}"`);
  return `
    <div class="field">
      <label>${escapeXml(label)}</label>
      <input data-path="${escapeXml(path)}" type="${type}" value="${escapeXml(value ?? '')}" ${attrs.join(' ')}>
    </div>`;
}

function renderProfileEditor(profile, index) {
  const letter = (() => {
    const parts = String(profile.name || '').trim().split(/\s+/);
    const last = parts[parts.length - 1];
    if (last && last.length === 1 && last === last.toUpperCase()) return last;
    return String(profile.name || '?').trim()[0]?.toUpperCase() || '?';
  })();
  const accent = KIND_ACCENTS[profile.kind]?.accent || KIND_ACCENTS.personalizado.accent;
  const accentSoft = KIND_ACCENTS[profile.kind]?.soft || KIND_ACCENTS.personalizado.soft;

  return `
    <article class="profile-card" style="--accent: ${accent};">
      <div class="profile-card__head">
        <div class="profile-headline">
          <div class="profile-badge">${escapeXml(letter)}</div>
          <div>
            <div class="profile-title">${escapeXml(shortText(profile.name || `Perfil ${index + 1}`, 28).toUpperCase())}</div>
            <div class="profile-subtitle">${escapeXml(`${kindLabel(profile.kind).toUpperCase()} • ${Math.round(profile.diametro_furo)} MM`)}</div>
          </div>
        </div>
        <span class="profile-chip" style="background:${accentSoft}; color:${accent};">${escapeXml(kindLabel(profile.kind))}</span>
      </div>
      <div class="profile-grid">
        ${renderInput('Nome do perfil', `profiles.${index}.name`, profile.name)}
        ${renderSelect('Categoria visual', `profiles.${index}.kind`, profile.kind, KIND_OPTIONS.map((key) => ({ value: key, label: KIND_LABELS[key] })), '')}
        ${renderInput('Diâmetro do furo (mm)', `profiles.${index}.diametro_furo`, profile.diametro_furo, 'number', { step: 1, min: 0 })}
        ${renderInput('Altura do banco (m)', `profiles.${index}.altura_banco`, profile.altura_banco, 'number', { step: 0.05, min: 0 })}
        ${renderInput('Subperfuração (m)', `profiles.${index}.subperfuracao`, profile.subperfuracao, 'number', { step: 0.05, min: 0 })}
        ${renderInput('Stemming / tampão (m)', `profiles.${index}.stemming`, profile.stemming, 'number', { step: 0.05, min: 0 })}
        ${renderInput('Blastbag (m)', `profiles.${index}.blastbag`, profile.blastbag, 'number', { step: 0.05, min: 0 })}
        ${renderInput('Deck de ar (m)', `profiles.${index}.air_deck`, profile.air_deck, 'number', { step: 0.05, min: 0 })}
        ${renderInput('Inclinação (°)', `profiles.${index}.inclinacao`, profile.inclinacao, 'number', { step: 1, min: 0 })}
        ${renderInput('Azimute (°)', `profiles.${index}.azimute`, profile.azimute, 'number', { step: 1, min: 0 })}
        ${renderInput('Densidade (g/cm³)', `profiles.${index}.densidade`, profile.densidade, 'number', { step: 0.01, min: 0 })}
      </div>
      <div class="profile-footer">
        <span class="summary-chip"><strong>H</strong> ${formatDecimal(profile.altura_banco)} m</span>
        <span class="summary-chip"><strong>C</strong> ${formatDecimal(Math.max(profile.altura_banco - profile.stemming - profile.blastbag - profile.air_deck, 0))} m</span>
        <span class="summary-chip"><strong>S</strong> ${formatDecimal(profile.subperfuracao)} m</span>
      </div>
    </article>`;
}

function renderSelect(label, path, value, options, helpText = '') {
  return `
    <div class="field">
      <label>${escapeXml(label)}</label>
      <select data-path="${escapeXml(path)}">${options.map((option) => `<option value="${escapeXml(option.value)}"${option.value === value ? ' selected' : ''}>${escapeXml(option.label)}</option>`).join('')}</select>
      ${helpText ? `<span class="hint">${escapeXml(helpText)}</span>` : ''}
    </div>`;
}

function renderForms() {
  dom.globalFields.innerHTML = renderGlobalSection(config);
  dom.labelFields.innerHTML = renderLabelSection();
  dom.profilesFields.innerHTML = renderProfilesSection();
  dom.logoChip = document.getElementById('logoChip');
  dom.meshChip = document.getElementById('meshChip');
  dom.profileCountLabel.textContent = `${state.profileCount} ${pluralProfiles(state.profileCount)}`;
  syncLogoChip();
  syncMeshChip();
}

function syncLogoChip() {
  if (!dom.logoChip) return;
  dom.logoChip.textContent = state.logo?.name ? shortText(state.logo.name, 36) : 'Logo Enaex padrão';
}

function syncMeshChip() {
  if (!dom.meshChip) return;
  dom.meshChip.textContent = state.mesh?.name ? shortText(state.mesh.name, 36) : 'Nenhum arquivo anexado';
}

function adjustProfileCount(delta) {
  const next = clamp(state.profileCount + delta, config.validation.min_profiles, config.validation.max_profiles);
  if (next === state.profileCount) return;
  const defaultProfiles = config.defaults.profiles;
  if (next > state.profileCount) {
    for (let i = state.profileCount; i < next; i += 1) {
      const fallback = state.profiles[state.profiles.length - 1] || defaultProfiles[defaultProfiles.length - 1];
      const cloneProfile = clone(fallback);
      cloneProfile.name = `Perfil ${i + 1}`;
      if (!isNonEmptyString(cloneProfile.kind)) cloneProfile.kind = 'personalizado';
      state.profiles.push(cloneProfile);
    }
  } else {
    state.profiles = state.profiles.slice(0, next);
  }
  state.profileCount = next;
  renderForms();
  scheduleUpdate();
}

function resetState(currentConfig) {
  const defaults = createDefaultState(currentConfig);
  state = defaults;
  clearStateStorage(currentConfig);
  seedSource = 'default';
  renderForms();
  scheduleUpdate(true);
}

function setNestedValue(path, rawValue, target) {
  const parts = path.split('.');
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    cursor = key.match(/^\d+$/) ? cursor[Number(key)] : cursor[key];
  }
  const last = parts[parts.length - 1];
  const isNumberField = target?.type === 'number' || ['diametro_furo', 'altura_banco', 'subperfuracao', 'stemming', 'blastbag', 'air_deck', 'inclinacao', 'azimute', 'densidade'].some((field) => path.endsWith(field));
  const value = isNumberField ? (rawValue === '' ? Number.NaN : Number(rawValue)) : rawValue;

  if (parts.length === 1) {
    cursor[last] = value;
  } else {
    const parentPath = parts.slice(0, -1);
    let parent = state;
    for (const key of parentPath) {
      parent = key.match(/^\d+$/) ? parent[Number(key)] : parent[key];
    }
    parent[last] = value;
  }
}

function handleInputEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.matches('[data-path]')) {
    const path = target.getAttribute('data-path');
    if (!path) return;

    const value = target.tagName === 'SELECT' ? target.value : target.value;
    if (path.startsWith('profiles.')) {
      const [, index, field] = path.split('.');
      if (!state.profiles[Number(index)]) return;
      const currentProfile = state.profiles[Number(index)];
      currentProfile[field] = target.type === 'number'
        ? (target.value === '' ? Number.NaN : Number(target.value))
        : value;
    } else if (path.startsWith('labels.')) {
      const [, key] = path.split('.');
      state.labels[key] = value;
    } else if (path === 'templateName') {
      state.templateName = value;
    } else if (path === 'polygonName') {
      state.polygonName = value;
    } else if (path === 'observation') {
      state.observation = value;
    } else if (path === 'profileType') {
      state.profileType = value;
    }
    scheduleUpdate();
  }

  if (target.matches('[data-role="mesh-file"]')) {
    const file = target.files?.[0];
    if (!file) {
      state.mesh = { name: '', type: '', dataUrl: '' };
      syncMeshChip();
      scheduleUpdate();
      return;
    }
    blobToDataUrl(file).then((dataUrl) => {
      state.mesh = {
        name: file.name,
        type: file.type,
        dataUrl,
      };
      syncMeshChip();
      scheduleUpdate();
    });
  }

  if (target.matches('[data-role="logo-file"]')) {
    const file = target.files?.[0];
    if (!file) {
      state.logo = { name: '', type: '', dataUrl: '' };
      syncLogoChip();
      scheduleUpdate();
      return;
    }
    blobToDataUrl(file).then((dataUrl) => {
      state.logo = {
        name: file.name,
        type: file.type,
        dataUrl,
      };
      syncLogoChip();
      scheduleUpdate();
    });
  }
}

function handleClickEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === 'profilePlus') adjustProfileCount(1);
  if (target.id === 'profileMinus') adjustProfileCount(-1);
  if (target.id === 'resetButton') resetState(config);
  if (target.id === 'saveButton') {
    const issues = validateState(state, config);
    if (issues.length) {
      showValidation(issues);
      return;
    }
    saveStateToStorage(config, state);
    setStatusMessage('Memória salva no navegador.');
  }

  const downloadType = target.getAttribute('data-download');
  if (downloadType) {
    downloadArtifact(downloadType);
  }
}

function scheduleUpdate(force = false) {
  if (updateTimer) window.clearTimeout(updateTimer);
  updateTimer = window.setTimeout(() => {
    updatePreview(force).catch((error) => {
      dom.validation.innerHTML = `<div class="error">Falha ao gerar preview: ${escapeXml(error.message || String(error))}</div>`;
    });
  }, force ? 0 : 80);
}

async function updatePreview(force = false) {
  const issues = validateState(state, config);
  if (issues.length) {
    showValidation(issues);
    return;
  }

  const svg = renderLayout(config);
  lastValidSvg = svg;
  lastValidState = clone(state);
  dom.previewCanvas.innerHTML = svg;
  showValidation([],
    true,
  );

  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveStateToStorage(config, state), force ? 0 : 300);
}

async function downloadArtifact(type) {
  const issues = validateState(state, config);
  if (issues.length) {
    showValidation(issues);
    return;
  }

  const svg = lastValidSvg || renderLayout(config);
  if (type === 'svg') {
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), 'blasthole-profile-creator.svg');
    return;
  }

  await document.fonts.ready;
  const [exportW, exportH] = config.site?.export_size || DEFAULT_EXPORT_SIZE;
  const canvas = await svgToCanvas(svg, exportW, exportH);

  if (type === 'png') {
    const blob = await canvasToBlob(canvas, 'image/png');
    downloadBlob(blob, 'blasthole-profile-creator.png');
    return;
  }

  if (type === 'jpg') {
    const blob = await canvasToBlob(canvas, 'image/jpeg', config.export?.jpg_quality ? config.export.jpg_quality / 100 : 0.96);
    downloadBlob(blob, 'blasthole-profile-creator.jpg');
    return;
  }

  if (type === 'pdf') {
    const jsPDFCtor = window.jspdf?.jsPDF || window.jsPDF;
    if (!jsPDFCtor) {
      showValidation(['Biblioteca PDF indisponível no momento.']);
      return;
    }
    const pdf = new jsPDFCtor({ orientation: 'landscape', unit: 'px', format: [exportW, exportH] });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, exportW, exportH, undefined, 'FAST');
    pdf.save('blasthole-profile-creator.pdf');
  }
}

function downloadBlob(blob, fileName) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

async function svgToCanvas(svgString, width, height) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context unavailable');
    context.drawImage(image, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function renderShell(currentConfig) {
  dom.builderForm.innerHTML = `
    <section class="section">
      <div class="section__head">
        <div>
          <p class="section__title">Contexto</p>
          <p class="section__subtitle">Configuração global do documento e anexo opcional da malha.</p>
        </div>
      </div>
      <div id="globalFields"></div>
    </section>
    <section class="section">
      <div class="section__head">
        <div>
          <p class="section__title">Terminologia</p>
          <p class="section__subtitle">Rótulos editáveis usados na lâmina final.</p>
        </div>
      </div>
      <div id="labelFields"></div>
    </section>
    <section class="section">
      <div class="section__head">
        <div>
          <p class="section__title">Perfis</p>
          <p class="section__subtitle">Até ${currentConfig.validation.max_profiles} perfis por lâmina. A pré-visualização se adapta automaticamente.</p>
        </div>
        <span class="helper-pill" id="profileSectionCount">${state.profileCount} ${pluralProfiles(state.profileCount)}</span>
      </div>
      <div id="profilesFields"></div>
    </section>`;

  dom.globalFields = document.getElementById('globalFields');
  dom.labelFields = document.getElementById('labelFields');
  dom.profilesFields = document.getElementById('profilesFields');
  dom.profileSectionCount = document.getElementById('profileSectionCount');
  renderForms();
}

function updatePreviewStatus(text) {
  if (dom.memoryStatus) dom.memoryStatus.textContent = text;
}

async function init() {
  await document.fonts.ready;
  config = await loadJson('./config.json', FALLBACK_CONFIG);
  const seed = await loadJson('./state/user_preferences.json', null);
  const stored = readStateFromStorage(config);
  const base = stored || seed || null;
  state = mergeLoadedState(config, base);
  seedSource = stored ? 'browser' : (seed ? 'project' : 'default');

  dom.builderForm = document.getElementById('builderForm');
  dom.previewCanvas = document.getElementById('previewCanvas');
  dom.validation = document.getElementById('validation');
  dom.memoryStatus = document.getElementById('memoryStatus');
  dom.profileCountLabel = document.getElementById('profileCountLabel');
  dom.projectSeed = document.getElementById('projectSeed');
  dom.logoChip = null;
  dom.meshChip = null;
  dom.downloadButtons = Array.from(document.querySelectorAll('[data-download]'));

  renderShell(config);
  logoDataUrl = await loadLogo(config.paths.logo_path || FALLBACK_CONFIG.paths.logo_path);
  updateMemoryStatus(seedSource === 'browser' ? 'Memória local ativa' : seedSource === 'project' ? 'Memória do projeto carregada' : 'Padrão do projeto');
  if (dom.projectSeed) dom.projectSeed.textContent = seedSource === 'browser' ? 'Memória do navegador' : seedSource === 'project' ? 'Memória do projeto' : 'Configuração padrão';

  document.getElementById('builderForm').addEventListener('input', handleInputEvent);
  document.getElementById('builderForm').addEventListener('change', handleInputEvent);
  document.addEventListener('click', handleClickEvent);

  renderForms();
  await updatePreview(true);
}

document.addEventListener('DOMContentLoaded', init);
