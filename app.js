const FALLBACK_CONFIG = {
  app: {
    title: 'Blasthole Profile Studio',
    subtitle: 'Workspace técnico para perfis de carga.',
    default_profile_type: 'DOCUMENTO DE USO TÉCNICO',
    default_language: 'pt-BR',
  },
  paths: {
    output_dir: 'output',
    log_dir: 'logs',
    state_dir: 'state',
    logo_path: 'VISUAL/OpenBlast/LOGO OPENBLAST TRANSPARENTE.png',
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
    storage_key: 'openblast.profile-creator.web.state.v6',
    language_storage_key: 'openblast.profile-creator.web.language.v2',
    supported_languages: ['pt-BR', 'es', 'en', 'zh-CN'],
    preview_size: [1920, 1080],
    export_size: [3840, 2160],
  },
  validation: {
    min_profiles: 1,
    max_profiles: 4,
    required_text_fields: ['polygon_name', 'template_name', 'profile_type'],
  },
  defaults: {
    template_name: 'Corporate clean',
    polygon_name: 'PP170526 (220-210)',
    observation: 'Perfil de Carregamento',
    profile_type: 'DOCUMENTO DE USO TÉCNICO',
    profile_count: 1,
    labels: {
      stemming: 'Tampão',
      blastbag: 'Bolsa de Ar',
      airdeck: 'Deck de ar',
      column: 'Carga',
      subdrill: 'Subperfuração',
    },
    profiles: [
      {
        name: 'Perfil A',
        kind: 'produção',
        diametro_furo: 140.0,
        altura_banco: 10.0,
        subperfuracao: 0.6,
        stemming: 2.3,
        air_deck: 0.0,
        air_decks: [],
        blastbag: 0.0,
        blastbags: [],
        segments: [
          { type: 'stemming', height: 2.3 },
          { type: 'column', height: 8.3 },
        ],
        inclinacao: 0.0,
        azimute: 0.0,
        densidade: 1.15,
        initiator: 'brinel',
        has_booster: true,
        booster_weight: 450,
      },
    ],
  },
  templates: {
    'Corporate clean': {
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
    'Boardroom minimal': {
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
    'Executive brief': {
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

const DEFAULT_LANGUAGE = 'pt-BR';
const DEFAULT_LANGUAGE_STORAGE_KEY = 'openblast.profile-creator.web.language.v2';
const DEFAULT_SUPPORTED_LANGUAGES = ['pt-BR', 'es', 'en', 'zh-CN'];

const COPY = {
  'pt-BR': {
    meta: {
      title: 'Blasthole Profile Studio',
      description: 'Workspace profissional para criação, validação e exportação local de perfis de carga.',
    },
    brand: {
      title: 'Blasthole Profile Studio',
      subtitle: 'Charge Profile Workspace',
    },
    topbar: {
      meta: '',
      formats: 'Formatos de exportação',
    },
    hero: {
      eyebrow: 'OPENBLAST / TECHNICAL PROFILES',
      title: 'Perfis de carga com linguagem executiva.',
      subtitle: 'Estruture, valide e exporte lâminas técnicas em um workspace claro, local e pronto para uso em campo.',
      badges: [],
    },
    heroPanel: {
      eyebrow: 'Resumo',
      title: 'Resumo técnico',
      loading: 'Carregando',
      stats: {
        rendering: 'Renderização',
        export: 'Exportação',
        storage: 'Armazenamento',
        storageValue: 'Local',
      },
    },
    controls: {
      language: 'Idioma',
      profileCountWord: { one: 'perfil', many: 'perfis' },
      profileCountAria: 'Quantidade de perfis',
      projectSeed: 'Memória do projeto',
      browserMemory: 'Memória do navegador',
      projectMemory: 'Memória do projeto',
      defaultConfig: 'Configuração padrão',
    },
    buttons: {
      reset: 'Restaurar',
      save: 'Salvar',
      removeProfile: 'Remover perfil',
      addProfile: 'Adicionar perfil',
    },
    preview: {
      eyebrow: 'Pré-visualização',
      title: 'Lâmina ao vivo',
    },
    builderPanel: {
      eyebrow: 'Painel de Controle',
      title: 'Editor',
    },
    sections: {
      config: {
        title: 'Configuração',
        subtitle: 'Logo oficial, observações e imagem da malha.',
      },
      labels: {
        title: 'Rótulos',
        subtitle: 'Terminologia usada na lâmina exportada.',
      },
      profiles: {
        title: 'Perfis',
        subtitle: (max) => `Até ${max} perfis por lâmina.`,
      },
    },
    stateLabels: {
      templateName: 'Modelo',
      polygonName: 'Identificação da malha',
      profileType: 'Tipo de perfil',
    },
    fieldLabels: {
      template: 'Modelo',
      polygonName: 'Identificação da malha',
      observation: 'Observações',
      logo: 'Logo oficial',
      mesh: 'Imagem da malha',
      profileName: 'Nome do perfil',
      kind: 'Categoria visual',
      diameter: 'Diâmetro do furo (mm)',
      height: 'Altura do banco (m)',
      subdrill: 'Subperfuração (m)',
      stemming: 'Tampão (m)',
      blastbag: 'Bolsa de Ar (m)',
      blastbagPosition: 'Posição Bolsa de Ar',
      blastbags: 'Bolsas de Ar',
      addBlastbag: 'Adicionar Bolsa de Ar',
      airdeck: 'Deck de ar (m)',
      airdeckPosition: 'Posição deck de ar',
      airdecks: 'Decks de ar',
      addAirdeck: 'Adicionar deck de ar',
      chargeSequence: 'Sequência do furo',
      segmentType: 'Tipo',
      segmentHeight: 'Altura (m)',
      addSegment: 'Adicionar segmento',
      inclination: 'Inclinação (graus)',
      azimuth: 'Azimute (graus)',
      density: 'Densidade (g/cm3)',
      initiator: 'Iniciador',
      initiatorNone: 'Nenhum',
      initiatorBrinel: 'NonEl (Não Eletrônico)',
      initiatorDVT: 'Eletrônico',
      initiatorBoth: 'NonEl + Eletrônico (Dupla)',
      hasBooster: 'Reforçador (Booster)',
      boosterWeight: 'Peso (g)',
      cartridgeCount: 'Cartuchos (pré-corte)',
    },
    deckPositions: {
      above_stemming: 'Acima do tampão',
      below_stemming: 'Abaixo do tampão',
      mid_charge: 'Meio da carga',
      mid_stemming: 'Meio do tampão',
      lower_charge: 'Fundo da carga',
    },
    segmentTypes: {
      stemming: 'Tampão',
      column: 'Carga',
      cartridge: 'Cartucho',
      blastbag: 'Bolsa de Ar',
      airdeck: 'Deck de ar',
    },
    fieldPlaceholders: {
      observation: 'Observação opcional da exportação.',
    },
    labels: {
      stemming: 'Tampão',
      blastbag: 'Bolsa de Ar',
      airdeck: 'Deck de ar',
      column: 'Coluna de carga',
      subdrill: 'Subperfuração',
    },
    defaults: {
      profileType: 'DOCUMENTO DE USO TÉCNICO',
      observation: 'Perfil de Carregamento',
      profileNames: ['Perfil A', 'Perfil B'],
      profileNamePrefix: 'Perfil',
    },
    fileChips: {
      logoDefault: 'Logo OpenBlast padrão',
      meshDefault: 'Nenhuma malha anexada',
    },
    memory: {
      browserActive: 'Dados salvos',
      projectLoaded: 'Configuração carregada',
      defaultConfig: 'Configuração padrão',
    },
    validation: {
      ready: 'Pronto para exportar. Pré-visualização validada.',
      fixBefore: 'Corrija antes de exportar:',
      required: (label) => `${label} é obrigatório.`,
      modelInvalid: 'Modelo visual inválido.',
      countInvalid: 'Quantidade de perfis inválida.',
      countRange: (min, max) => `Quantidade de perfis deve ficar entre ${min} e ${max}.`,
      profilesMismatch: 'Perfis não correspondem à quantidade selecionada.',
      profileNameRequired: (index) => `Nome do perfil ${index} é obrigatório.`,
      numericRequired: (field, index) => `${field} do perfil ${index} deve ser numérico.`,
      nonNegative: (field, index) => `${field} do perfil ${index} deve ser maior ou igual a zero.`,
      previewError: (message) => `Falha ao gerar pré-visualização: ${message}`,
      pdfUnavailable: 'Biblioteca PDF indisponível no momento.',
      saveSuccess: 'Memória salva no navegador.',
      saveFailure: 'Não foi possível salvar a memória local.',
    },
    svg: {
      title: 'Blasthole Profile Studio',
      desc: 'Perfil de carga editável com composição vetorial.',
      headerTitle: 'PERFIL DE CARGA',
      headerBadge: '',
      meshTitle: 'MALHA DE PERFURAÇÃO',
      meshAttached: 'ARQUIVO ANEXADO',
      meshPrompt: 'Anexe a imagem da malha',
      meshNoAttachment: 'Sem anexo, este painel permanece como referência.',
      referenceMode: 'MODO REFERÊNCIA',
      referenceModeDesc: 'Somente imagem anexada, sem geração sintética da malha.',
      dataTitle: 'DADOS TÉCNICOS',
      dataTitleCompact: 'DADOS',
      bench: 'BANCO',
      benchUnit: 'M',
      footerLegend: {
        production: 'Produção',
        cushioning: 'Amortecimento',
        contour: 'Contorno',
      },
      shortLabels: {
        inclination: 'Incl.',
        azimuth: 'Azim.',
        density: 'Dens.',
      },
    },
    kinds: {
      'produção': 'Produção',
      'amortecimento': 'Amortecimento',
      'contorno': 'Contorno',
      'personalizado': 'Personalizado',
    },
    templates: {
      'Corporate clean': 'Corporate clean',
      'Boardroom minimal': 'Boardroom minimal',
      'Executive brief': 'Executive brief',
    },
    languageNames: {
      'pt-BR': 'Português (Brasil)',
      es: 'Español',
      en: 'English',
      'zh-CN': '中文',
    },
    downloads: {
      baseName: 'openblast-profile-studio',
    },
  },
  en: {
    meta: {
      title: 'Blasthole Profile Studio',
      description: 'Professional workspace for creating, validating, and exporting charge profiles locally.',
    },
    brand: {
      title: 'Blasthole Profile Studio',
      subtitle: 'Charge Profile Workspace',
    },
    topbar: {
      meta: '',
      formats: 'Export formats',
    },
    hero: {
      eyebrow: 'OPENBLAST / TECHNICAL PROFILES',
      title: 'Charge profiles with executive clarity.',
      subtitle: 'Create, validate, and export technical sheets in a clean local workspace built for field teams.',
      badges: ['No install', 'Live SVG', '4K export', 'Local workspace'],
    },
    heroPanel: {
      eyebrow: 'Summary',
      title: 'Technical summary',
      loading: 'Loading',
      stats: {
        rendering: 'Rendering',
        export: 'Export',
        storage: 'Storage',
        storageValue: 'Local',
      },
    },
    controls: {
      language: 'Language',
      profileCountWord: { one: 'profile', many: 'profiles' },
      profileCountAria: 'Profile count',
      projectSeed: 'Project memory',
      browserMemory: 'Browser memory',
      projectMemory: 'Project memory',
      defaultConfig: 'Default configuration',
    },
    buttons: {
      reset: 'Reset',
      save: 'Save',
      removeProfile: 'Remove profile',
      addProfile: 'Add profile',
    },
    preview: {
      eyebrow: 'Preview',
      title: 'Live preview',
    },
    builderPanel: {
      eyebrow: 'Control Panel',
      title: 'Editor',
    },
    sections: {
      config: {
        title: 'Configuration',
        subtitle: 'Official logo, notes, and mesh image.',
      },
      labels: {
        title: 'Labels',
        subtitle: 'Terminology used in the exported sheet.',
      },
      profiles: {
        title: 'Profiles',
        subtitle: (max) => `Up to ${max} profiles per sheet.`,
      },
    },
    stateLabels: {
      templateName: 'Template',
      polygonName: 'Mesh ID',
      profileType: 'Profile type',
    },
    fieldLabels: {
      template: 'Template',
      polygonName: 'Mesh ID',
      observation: 'Notes',
      logo: 'Official logo',
      mesh: 'Mesh image',
      profileName: 'Profile name',
      kind: 'Visual category',
      diameter: 'Hole diameter (mm)',
      height: 'Bench height (m)',
      subdrill: 'Subdrilling (m)',
      stemming: 'Stemming (m)',
      blastbag: 'Air bag (m)',
      blastbagPosition: 'Air bag position',
      blastbags: 'Air bags',
      addBlastbag: 'Add air bag',
      airdeck: 'Air deck (m)',
      airdeckPosition: 'Air deck position',
      airdecks: 'Air decks',
      addAirdeck: 'Add air deck',
      chargeSequence: 'Hole sequence',
      segmentType: 'Type',
      segmentHeight: 'Height (m)',
      addSegment: 'Add segment',
      inclination: 'Inclination (degrees)',
      azimuth: 'Azimuth (degrees)',
      density: 'Density (g/cm3)',
      initiator: 'Initiator',
      initiatorNone: 'None',
      initiatorBrinel: 'NonEl (Non-Electronic)',
      initiatorDVT: 'Electronic',
      initiatorBoth: 'NonEl + Electronic (Dual)',
      hasBooster: 'Booster',
      boosterWeight: 'Weight (g)',
      cartridgeCount: 'Cartridges (pre-cut)',
    },
    deckPositions: {
      above_stemming: 'Above stemming',
      below_stemming: 'Below stemming',
      mid_charge: 'Middle of charge',
      mid_stemming: 'Middle of stemming',
      lower_charge: 'Bottom of charge',
    },
    segmentTypes: {
      stemming: 'Stemming',
      column: 'Charge',
      cartridge: 'Cartridge',
      blastbag: 'Air bag',
      airdeck: 'Air deck',
    },
    fieldPlaceholders: {
      observation: 'Optional note for the export.',
    },
    labels: {
      stemming: 'Stemming',
      blastbag: 'Air bag',
      airdeck: 'Air deck',
      column: 'Charge column',
      subdrill: 'Subdrilling',
    },
    defaults: {
      profileType: 'TECHNICAL USE DOCUMENT',
      observation: 'Standard technical sheet for operational reporting.',
      profileNames: ['Profile A', 'Profile B'],
      profileNamePrefix: 'Profile',
    },
    fileChips: {
      logoDefault: 'Default OpenBlast logo',
      meshDefault: 'No mesh attached',
    },
    memory: {
      browserActive: 'Saved data',
      projectLoaded: 'Configuration loaded',
      defaultConfig: 'Default configuration',
    },
    validation: {
      ready: 'Ready to export. Preview validated.',
      fixBefore: 'Fix before export:',
      required: (label) => `${label} is required.`,
      modelInvalid: 'Invalid visual template.',
      countInvalid: 'Invalid profile count.',
      countRange: (min, max) => `Profile count must be between ${min} and ${max}.`,
      profilesMismatch: 'Profiles do not match the selected count.',
      profileNameRequired: (index) => `Profile ${index} name is required.`,
      numericRequired: (field, index) => `${field} for profile ${index} must be numeric.`,
      nonNegative: (field, index) => `${field} for profile ${index} must be zero or greater.`,
      previewError: (message) => `Preview generation failed: ${message}`,
      pdfUnavailable: 'PDF library is unavailable right now.',
      saveSuccess: 'Browser memory saved.',
      saveFailure: 'Could not save local memory.',
    },
    svg: {
      title: 'Blasthole Profile Studio',
      desc: 'Editable charge profile with vector composition.',
      headerTitle: 'CHARGE PROFILE',
      headerBadge: '',
      meshTitle: 'DRILLING MESH',
      meshAttached: 'ATTACHED FILE',
      meshPrompt: 'Attach the mesh image',
      meshNoAttachment: 'Without an attachment, this panel remains a reference.',
      referenceMode: 'REFERENCE MODE',
      referenceModeDesc: 'Attached image only, no synthetic mesh generation.',
      dataTitle: 'TECHNICAL DATA',
      dataTitleCompact: 'DATA',
      bench: 'BENCH',
      benchUnit: 'M',
      footerLegend: {
        production: 'Production',
        cushioning: 'Cushioning',
        contour: 'Contour',
      },
      shortLabels: {
        inclination: 'Inc.',
        azimuth: 'Az.',
        density: 'Den.',
      },
    },
    kinds: {
      'produção': 'Production',
      'amortecimento': 'Cushioning',
      'contorno': 'Contour',
      'personalizado': 'Custom',
    },
    templates: {
      'Corporate clean': 'Corporate clean',
      'Boardroom minimal': 'Boardroom minimal',
      'Executive brief': 'Executive brief',
    },
    languageNames: {
      'pt-BR': 'Portuguese (Brazil)',
      es: 'Spanish',
      en: 'English',
      'zh-CN': 'Chinese',
    },
    downloads: {
      baseName: 'openblast-profile-studio',
    },
  },
  es: {
    meta: {
      title: 'Blasthole Profile Studio',
      description: 'Workspace profesional para crear, validar y exportar perfiles de carga localmente.',
    },
    brand: {
      title: 'Blasthole Profile Studio',
      subtitle: 'Charge Profile Workspace',
    },
    topbar: {
      meta: '',
      formats: 'Formatos de exportación',
    },
    hero: {
      eyebrow: 'OPENBLAST / TECHNICAL PROFILES',
      title: 'Perfiles de carga con lenguaje ejecutivo.',
      subtitle: 'Cree, valide y exporte láminas técnicas en un workspace claro, local y listo para equipos de campo.',
      badges: [],
    },
    heroPanel: {
      eyebrow: 'Resumen',
      title: 'Resumen técnico',
      loading: 'Cargando',
      stats: {
        rendering: 'Renderizado',
        export: 'Exportación',
        storage: 'Almacenamiento',
        storageValue: 'Local',
      },
    },
    controls: {
      language: 'Idioma',
      profileCountWord: { one: 'perfil', many: 'perfiles' },
      profileCountAria: 'Cantidad de perfiles',
      projectSeed: 'Memoria del proyecto',
      browserMemory: 'Memoria del navegador',
      projectMemory: 'Memoria del proyecto',
      defaultConfig: 'Configuración predeterminada',
    },
    buttons: {
      reset: 'Restaurar',
      save: 'Guardar',
      removeProfile: 'Eliminar perfil',
      addProfile: 'Agregar perfil',
    },
    preview: {
      eyebrow: 'Vista previa',
      title: 'Lámina en vivo',
    },
    builderPanel: {
      eyebrow: 'Panel de Control',
      title: 'Editor',
    },
    sections: {
      config: {
        title: 'Configuración',
        subtitle: 'Logo oficial, notas e imagen de la malla.',
      },
      labels: {
        title: 'Rótulos',
        subtitle: 'Terminología usada en la lámina exportada.',
      },
      profiles: {
        title: 'Perfiles',
        subtitle: (max) => `Hasta ${max} perfiles por lámina.`,
      },
    },
    stateLabels: {
      templateName: 'Modelo',
      polygonName: 'Identificación de la malla',
      profileType: 'Tipo de perfil',
    },
    fieldLabels: {
      template: 'Modelo',
      polygonName: 'Identificación de la malla',
      observation: 'Observaciones',
      logo: 'Logo oficial',
      mesh: 'Imagen de la malla',
      profileName: 'Nombre del perfil',
      kind: 'Categoría visual',
      diameter: 'Diámetro del barreno (mm)',
      height: 'Altura del banco (m)',
      subdrill: 'Subperforación (m)',
      stemming: 'Taco (m)',
      blastbag: 'Bolsa de aire (m)',
      blastbagPosition: 'Posición bolsa de aire',
      blastbags: 'Bolsas de aire',
      addBlastbag: 'Agregar bolsa de aire',
      airdeck: 'Deck de aire (m)',
      airdeckPosition: 'Posición deck de aire',
      airdecks: 'Decks de aire',
      addAirdeck: 'Agregar deck de aire',
      chargeSequence: 'Secuencia del barreno',
      segmentType: 'Tipo',
      segmentHeight: 'Altura (m)',
      addSegment: 'Agregar segmento',
      inclination: 'Inclinación (grados)',
      azimuth: 'Azimut (grados)',
      density: 'Densidad (g/cm3)',
      initiator: 'Iniciador',
      initiatorNone: 'Ninguno',
      initiatorBrinel: 'NonEl (No Electrónico)',
      initiatorDVT: 'Electrónico',
      initiatorBoth: 'NonEl + Electrónico (Doble)',
      hasBooster: 'Reforzador (Booster)',
      boosterWeight: 'Peso (g)',
      cartridgeCount: 'Cartuchos (pre-corte)',
    },
    deckPositions: {
      above_stemming: 'Encima del taco',
      below_stemming: 'Debajo del taco',
      mid_charge: 'Medio de la carga',
      mid_stemming: 'Medio del taco',
      lower_charge: 'Fondo de la carga',
    },
    segmentTypes: {
      stemming: 'Taco',
      column: 'Carga',
      cartridge: 'Cartucho',
      blastbag: 'Bolsa de aire',
      airdeck: 'Deck de aire',
    },
    fieldPlaceholders: {
      observation: 'Observación opcional de la exportación.',
    },
    labels: {
      stemming: 'Taco',
      blastbag: 'Bolsa de aire',
      airdeck: 'Deck de aire',
      column: 'Columna de carga',
      subdrill: 'Subperforación',
    },
    defaults: {
      profileType: 'DOCUMENTO DE USO TÉCNICO',
      observation: 'Lámina técnica estandarizada para reporte operacional.',
      profileNames: ['Perfil A', 'Perfil B'],
      profileNamePrefix: 'Perfil',
    },
    fileChips: {
      logoDefault: 'Logo OpenBlast predeterminado',
      meshDefault: 'Ninguna malla adjunta',
    },
    memory: {
      browserActive: 'Datos guardados',
      projectLoaded: 'Configuración cargada',
      defaultConfig: 'Configuración predeterminada',
    },
    validation: {
      ready: 'Listo para exportar. Vista previa validada.',
      fixBefore: 'Corrija antes de exportar:',
      required: (label) => `${label} es obligatorio.`,
      modelInvalid: 'Modelo visual inválido.',
      countInvalid: 'Cantidad de perfiles inválida.',
      countRange: (min, max) => `La cantidad de perfiles debe estar entre ${min} y ${max}.`,
      profilesMismatch: 'Los perfiles no corresponden a la cantidad seleccionada.',
      profileNameRequired: (index) => `El nombre del perfil ${index} es obligatorio.`,
      numericRequired: (field, index) => `${field} del perfil ${index} debe ser numérico.`,
      nonNegative: (field, index) => `${field} del perfil ${index} debe ser mayor o igual a cero.`,
      previewError: (message) => `Error al generar la vista previa: ${message}`,
      pdfUnavailable: 'La biblioteca PDF no está disponible en este momento.',
      saveSuccess: 'Memoria guardada en el navegador.',
      saveFailure: 'No fue posible guardar la memoria local.',
    },
    svg: {
      title: 'Blasthole Profile Studio',
      desc: 'Perfil de carga editable con composición vectorial.',
      headerTitle: 'PERFIL DE CARGA',
      headerBadge: '',
      meshTitle: 'MALLA DE PERFORACIÓN',
      meshAttached: 'ARCHIVO ADJUNTO',
      meshPrompt: 'Adjunte la imagen de la malla',
      meshNoAttachment: 'Sin adjunto, este panel permanece como referencia.',
      referenceMode: 'MODO REFERENCIA',
      referenceModeDesc: 'Solo imagen adjunta, sin generación sintética de malla.',
      dataTitle: 'DATOS TÉCNICOS',
      dataTitleCompact: 'DATOS',
      bench: 'BANCO',
      benchUnit: 'M',
      footerLegend: {
        production: 'Producción',
        cushioning: 'Amortiguación',
        contour: 'Contorno',
      },
      shortLabels: {
        inclination: 'Incl.',
        azimuth: 'Azim.',
        density: 'Dens.',
      },
    },
    kinds: {
      'produção': 'Producción',
      'amortecimento': 'Amortiguación',
      'contorno': 'Contorno',
      'personalizado': 'Personalizado',
    },
    templates: {
      'Corporate clean': 'Corporate clean',
      'Boardroom minimal': 'Boardroom minimal',
      'Executive brief': 'Executive brief',
    },
    languageNames: {
      'pt-BR': 'Portugués (Brasil)',
      es: 'Español',
      en: 'Inglés',
      'zh-CN': 'Chino',
    },
    downloads: {
      baseName: 'openblast-profile-studio',
    },
  },
  'zh-CN': {
    meta: {
      title: 'Blasthole Profile Studio',
      description: '用于本地创建、验证并导出装药剖面的专业工作区。',
    },
    brand: {
      title: 'Blasthole Profile Studio',
      subtitle: 'Charge Profile Workspace',
    },
    topbar: {
      meta: '',
      formats: '导出格式',
    },
    hero: {
      eyebrow: 'OPENBLAST / TECHNICAL PROFILES',
      title: '具备咨询级表达的装药剖面。',
      subtitle: '在清晰的本地工作区中创建、验证并导出技术装药剖面图。',
      badges: ['无需安装', '实时 SVG', '4K 导出', '本地工作区'],
    },
    heroPanel: {
      eyebrow: '摘要',
      title: '技术摘要',
      loading: '加载中',
      stats: {
        rendering: '渲染',
        export: '导出',
        storage: '存储',
        storageValue: '本地',
      },
    },
    controls: {
      language: '语言',
      profileCountWord: '个剖面',
      profileCountAria: '剖面数量',
      projectSeed: '项目记忆',
      browserMemory: '浏览器记忆',
      projectMemory: '项目记忆',
      defaultConfig: '默认配置',
    },
    buttons: {
      reset: '重置',
      save: '保存',
      removeProfile: '移除剖面',
      addProfile: '添加剖面',
    },
    preview: {
      eyebrow: '预览',
      title: '实时预览',
    },
    builderPanel: {
      eyebrow: '控制面板',
      title: '编辑器',
    },
    sections: {
      config: {
        title: '配置',
        subtitle: '官方 Logo、备注和网格图像。',
      },
      labels: {
        title: '标签',
        subtitle: '导出图中使用的术语。',
      },
      profiles: {
        title: '剖面',
        subtitle: (max) => `每张图最多 ${max} 个剖面。`,
      },
    },
    stateLabels: {
      templateName: '模板',
      polygonName: '网格编号',
      profileType: '剖面类型',
    },
    fieldLabels: {
      template: '模板',
      polygonName: '网格编号',
      observation: '备注',
      logo: '官方 Logo',
      mesh: '网格图片',
      profileName: '剖面名称',
      kind: '可视类别',
      diameter: '孔径 (mm)',
      height: '台阶高度 (m)',
      subdrill: '超深 (m)',
      stemming: '堵塞 (m)',
      blastbag: '缓冲袋 (m)',
      blastbagPosition: '缓冲袋位置',
      blastbags: '缓冲袋',
      addBlastbag: '添加缓冲袋',
      airdeck: '空气间隔 (m)',
      airdeckPosition: '空气间隔位置',
      airdecks: '空气间隔',
      addAirdeck: '添加空气间隔',
      chargeSequence: '炮孔顺序',
      segmentType: '类型',
      segmentHeight: '高度 (m)',
      addSegment: '添加段',
      inclination: '倾角 (度)',
      azimuth: '方位角 (度)',
      density: '密度 (g/cm3)',
      initiator: '起爆器',
      initiatorNone: '无',
      initiatorBrinel: 'NonEl (非电子)',
      initiatorDVT: '电子',
      initiatorBoth: 'NonEl + 电子 (双重)',
      hasBooster: '增强器 (Booster)',
      boosterWeight: '重量 (g)',
      cartridgeCount: '药卷 (预裂)',
    },
    deckPositions: {
      above_stemming: '堵塞上方',
      below_stemming: '堵塞下方',
      mid_charge: '装药中部',
      mid_stemming: '堵塞中部',
      lower_charge: '装药底部',
    },
    segmentTypes: {
      stemming: '堵塞',
      column: '装药',
      cartridge: '药卷',
      blastbag: '缓冲袋',
      airdeck: '空气间隔',
    },
    fieldPlaceholders: {
      observation: '导出时的可选备注。',
    },
    labels: {
      stemming: '堵塞',
      blastbag: '缓冲袋',
      airdeck: '空气间隔',
      column: '装药柱',
      subdrill: '超深',
    },
    defaults: {
      profileType: '技术使用文件',
      observation: '用于运行报告的标准技术页面。',
      profileNames: ['剖面 A', '剖面 B'],
      profileNamePrefix: '剖面',
    },
    fileChips: {
      logoDefault: '默认 OpenBlast Logo',
      meshDefault: '未附加网格',
    },
    memory: {
      browserActive: '数据已保存',
      projectLoaded: '配置已加载',
      defaultConfig: '默认配置',
    },
    validation: {
      ready: '准备导出。预览已验证。',
      fixBefore: '导出前请修正：',
      required: (label) => `${label} 为必填项。`,
      modelInvalid: '无效的可视模板。',
      countInvalid: '无效的剖面数量。',
      countRange: (min, max) => `剖面数量必须在 ${min} 和 ${max} 之间。`,
      profilesMismatch: '剖面与所选数量不一致。',
      profileNameRequired: (index) => `剖面 ${index} 的名称必填。`,
      numericRequired: (field, index) => `剖面 ${index} 的 ${field} 必须为数字。`,
      nonNegative: (field, index) => `剖面 ${index} 的 ${field} 必须大于或等于零。`,
      previewError: (message) => `预览生成失败：${message}`,
      pdfUnavailable: '当前无法使用 PDF 库。',
      saveSuccess: '已保存到浏览器。',
      saveFailure: '无法保存本地记忆。',
    },
    svg: {
      title: 'Blasthole Profile Studio',
      desc: '可编辑的装药剖面，采用矢量组成。',
      headerTitle: '装药剖面',
      headerBadge: '',
      meshTitle: '钻孔网格',
      meshAttached: '已附加文件',
      meshPrompt: '请附加网格图片',
      meshNoAttachment: '未附加时，此面板仅作为参考。',
      referenceMode: '参考模式',
      referenceModeDesc: '仅使用附加图片，不生成合成网格。',
      dataTitle: '技术数据',
      dataTitleCompact: '数据',
      bench: '台阶',
      benchUnit: 'M',
      footerLegend: {
        production: '生产',
        cushioning: '缓冲',
        contour: '轮廓',
      },
      shortLabels: {
        inclination: '倾角',
        azimuth: '方位',
        density: '密度',
      },
    },
    kinds: {
      'produção': '生产',
      'amortecimento': '缓冲',
      'contorno': '轮廓',
      'personalizado': '自定义',
    },
    templates: {
      'Corporate clean': 'Corporate clean',
      'Boardroom minimal': 'Boardroom minimal',
      'Executive brief': 'Executive brief',
    },
    languageNames: {
      'pt-BR': '葡萄牙语（巴西）',
      es: '西班牙语',
      en: '英语',
      'zh-CN': '中文',
    },
    downloads: {
      baseName: 'openblast-profile-studio',
    },
  },
};

const KIND_OPTIONS = ['produção', 'amortecimento', 'contorno', 'personalizado'];
const KIND_ACCENTS = {
  produção: { accent: '#1565C0', soft: '#E3F2FD', title: 'Produção' },
  amortecimento: { accent: '#EF9A3A', soft: '#FFF3E0', title: 'Amortecimento' },
  contorno: { accent: '#D71920', soft: '#FFE3E5', title: 'Contorno' },
  personalizado: { accent: '#223A8D', soft: '#E8ECFA', title: 'Personalizado' },
};

function normalizeLanguage(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return DEFAULT_LANGUAGE;
  const normalized = raw.replace('_', '-').toLowerCase();
  if (normalized.startsWith('pt')) return 'pt-BR';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en';
  return DEFAULT_LANGUAGE;
}

function getSupportedLanguages(currentConfig = config) {
  const source = Array.isArray(currentConfig?.site?.supported_languages)
    ? currentConfig.site.supported_languages
    : DEFAULT_SUPPORTED_LANGUAGES;
  return source.map(normalizeLanguage).filter((value, index, array) => array.indexOf(value) === index);
}

function getLanguageStorageKey(currentConfig = config) {
  return currentConfig?.site?.language_storage_key || DEFAULT_LANGUAGE_STORAGE_KEY;
}

function getActiveLanguage() {
  return normalizeLanguage(state?.language || config?.app?.default_language || DEFAULT_LANGUAGE);
}

function getCopy(lang = getActiveLanguage()) {
  return COPY[normalizeLanguage(lang)] || COPY[DEFAULT_LANGUAGE];
}

function defaultProfileName(lang, index) {
  const copy = getCopy(lang);
  return copy.defaults.profileNames[index] || `${copy.defaults.profileNamePrefix} ${index + 1}`;
}

function profileCountText(count, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  const unit = copy.controls.profileCountWord;
  if (typeof unit === 'string') return `${count} ${unit}`;
  return `${count} ${count === 1 ? unit.one : unit.many}`;
}

function getSeedSourceLabel(source, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  if (source === 'browser') return copy.controls.browserMemory;
  if (source === 'project') return copy.controls.projectMemory;
  return copy.controls.defaultConfig;
}

function getMemoryStatusText(source, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  if (source === 'browser') return copy.memory.browserActive;
  if (source === 'project') return copy.memory.projectLoaded;
  return copy.memory.defaultConfig;
}

function fieldLabel(field, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  return copy.fieldLabels[field] || field;
}

function stateLabel(field, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  return copy.stateLabels[field] || fieldLabel(field, lang);
}

function kindLabel(kind, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  return copy.kinds[normalizeKind(kind)] || copy.kinds.personalizado;
}

function templateDisplayName(templateName, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  return copy.templates[templateName] || templateName;
}

function languageDisplayName(code, lang = getActiveLanguage()) {
  const copy = getCopy(lang);
  return copy.languageNames[normalizeLanguage(code)] || copy.languageNames[DEFAULT_LANGUAGE];
}

function getDownloadBaseName(lang = getActiveLanguage()) {
  return getCopy(lang).downloads.baseName;
}

function readLanguagePreference(currentConfig = config) {
  try {
    const raw = localStorage.getItem(getLanguageStorageKey(currentConfig));
    return raw ? normalizeLanguage(raw) : null;
  } catch {
    return null;
  }
}

function saveLanguagePreference(currentConfig, language) {
  try {
    localStorage.setItem(getLanguageStorageKey(currentConfig), normalizeLanguage(language));
  } catch {
    /* noop */
  }
}

function translateStateDefaults(previousLanguage, nextLanguage) {
  if (!state) return;
  const prev = normalizeLanguage(previousLanguage);
  const next = normalizeLanguage(nextLanguage);
  if (prev === next) return;

  const prevCopy = getCopy(prev);
  const nextCopy = getCopy(next);

  state.profileType = nextCopy.defaults.profileType;

  if (state.observation === prevCopy.defaults.observation) {
    state.observation = nextCopy.defaults.observation;
  }

  if (state.labels && typeof state.labels === 'object') {
    for (const key of Object.keys(nextCopy.labels)) {
      if (state.labels[key] === prevCopy.labels[key]) {
        state.labels[key] = nextCopy.labels[key];
      }
    }
  }

  if (Array.isArray(state.profiles)) {
    state.profiles.forEach((profile, index) => {
      if (!profile || typeof profile !== 'object') return;
      if (profile.name === defaultProfileName(prev, index)) {
        profile.name = defaultProfileName(next, index);
      }
    });
  }

  state.language = next;
}

const PROFILE_FIELDS = [
  'name',
  'kind',
  'diametro_furo',
  'altura_banco',
  'subperfuracao',
  'stemming',
  'blastbag',
  'blastbags',
  'air_deck',
  'air_decks',
  'segments',
  'inclinacao',
  'azimute',
  'densidade',
  'initiator',
  'has_booster',
  'booster_weight',
];

const DECK_POSITIONS = ['above_stemming', 'mid_stemming', 'below_stemming', 'mid_charge', 'lower_charge'];
const SEGMENT_TYPES = ['stemming', 'column', 'cartridge', 'blastbag', 'airdeck'];

const DEFAULT_STORAGE_KEY = 'openblast.profile-creator.web.state.v6';
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
let selectedProfileIndex = 0;
let selectedSegmentKey = null;

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

function normalizeDeckCount(value, fallback = 1) {
  return clamp(Math.round(normalizeNumber(value, fallback)), 0, 8);
}

function normalizeDeckPosition(value, fallback = 'below_stemming') {
  return DECK_POSITIONS.includes(value) ? value : fallback;
}

function normalizeDeckItems(items, legacyTotal, legacyCount, legacyPosition, fallbackItems, fallbackPosition) {
  const fromArray = Array.isArray(items) ? items : null;
  const source = fromArray || (() => {
    const total = Math.max(normalizeNumber(legacyTotal, 0), 0);
    const count = normalizeDeckCount(legacyCount ?? (total > 0 ? 1 : 0), total > 0 ? 1 : 0);
    if (total <= 0 || count <= 0) return [];
    return Array.from({ length: count }, () => ({
      height: total / count,
      position: normalizeDeckPosition(legacyPosition, fallbackPosition),
    }));
  })();
  const fallback = Array.isArray(fallbackItems) ? fallbackItems : [];
  const normalized = source.map((item, index) => {
    const fallbackItem = fallback[index] || fallback[0] || {};
    return {
      height: Math.max(normalizeNumber(item?.height, fallbackItem.height ?? 0), 0),
      position: normalizeDeckPosition(item?.position, fallbackItem.position || fallbackPosition),
    };
  }).filter((item) => item.height > 0);
  return normalized.slice(0, 8);
}

function sumDeckItems(items) {
  return Array.isArray(items) ? items.reduce((total, item) => total + Math.max(normalizeNumber(item?.height, 0), 0), 0) : 0;
}

function normalizeSegmentType(value, fallback = 'column') {
  return SEGMENT_TYPES.includes(value) ? value : fallback;
}

function normalizeSegments(items, profile, fallbackSegments = []) {
  const source = Array.isArray(items) && items.length
    ? items
    : (() => {
      const stem = Math.max(normalizeNumber(profile.stemming, 0), 0);
      const blastbags = normalizeDeckItems(profile.blastbags, profile.blastbag, profile.blastbag_count, profile.blastbag_position, [], 'below_stemming');
      const airdecks = normalizeDeckItems(profile.air_decks, profile.air_deck, profile.air_deck_count, profile.air_deck_position, [], 'mid_charge');
      const accessories = sumDeckItems(blastbags) + sumDeckItems(airdecks);
      const column = Math.max(normalizeNumber(profile.altura_banco, 0) - stem - accessories, 0);
      return [
        ...(stem > 0 ? [{ type: 'stemming', height: stem }] : []),
        ...blastbags.map((item) => ({ type: 'blastbag', height: item.height })),
        ...(column > 0 ? [{ type: 'column', height: column }] : []),
        ...airdecks.map((item) => ({ type: 'airdeck', height: item.height })),
      ];
    })();
  const fallback = Array.isArray(fallbackSegments) ? fallbackSegments : [];
  return source.map((item, index) => {
    const fallbackItem = fallback[index] || fallback[0] || {};
    return {
      type: normalizeSegmentType(item?.type, fallbackItem.type || 'column'),
      height: Math.max(normalizeNumber(item?.height, fallbackItem.height ?? 0), 0),
      has_booster: Boolean(item?.has_booster),
    };
  }).filter((item) => item.height > 0).slice(0, 24);
}

function sumSegmentsByType(segments, type) {
  return Array.isArray(segments)
    ? segments.reduce((total, item) => total + (item.type === type ? Math.max(normalizeNumber(item.height, 0), 0) : 0), 0)
    : 0;
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

function formatDecimal(value, digits = 2, lang = getActiveLanguage()) {
  const num = Number(value);
  const safeValue = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat(normalizeLanguage(lang), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(safeValue);
}

function shortText(text, max = 18) {
  const value = String(text ?? '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

function pluralProfiles(count) {
  return profileCountText(count);
}

function labelSet() {
  return state?.labels || getCopy().labels;
}

function normalizeKind(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return 'personalizado';
  if (KIND_OPTIONS.includes(raw)) return raw;
  for (const language of getSupportedLanguages()) {
    const copy = getCopy(language);
    const match = Object.entries(copy.kinds).find(([, label]) => label.toLowerCase() === raw);
    if (match) return match[0];
  }
  return 'personalizado';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function resolveTemplateName(value, currentConfig = config) {
  const raw = isNonEmptyString(value) ? String(value).trim() : '';
  if (!raw) return '';
  if (currentConfig?.templates?.[raw]) return raw;
  return '';
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

function createDefaultState(currentConfig, language = currentConfig?.app?.default_language || DEFAULT_LANGUAGE) {
  const defaults = currentConfig.defaults;
  const lang = normalizeLanguage(language);
  const copy = getCopy(lang);
  const defaultTemplate = resolveTemplateName(defaults.template_name, currentConfig) || Object.keys(currentConfig.templates || {})[0] || '';
  const profiles = clone(defaults.profiles).map((profile, index) => ({
    ...profile,
    kind: normalizeKind(profile.kind),
    name: copy.defaults.profileNames[index] || `${copy.defaults.profileNamePrefix} ${index + 1}`,
  }));
  return {
    language: lang,
    profileType: copy.defaults.profileType,
    templateName: defaultTemplate,
    polygonName: defaults.polygon_name,
    observation: copy.defaults.observation,
    profileCount: clamp(Number(defaults.profile_count) || 2, currentConfig.validation.min_profiles, currentConfig.validation.max_profiles),
    labels: clone(copy.labels),
    profiles,
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

function normalizeProfile(source, fallback, index, defaultCount, language = DEFAULT_LANGUAGE) {
  const profile = clone(fallback);
  if (source && typeof source === 'object') {
    for (const field of PROFILE_FIELDS) {
      if (field in source) profile[field] = source[field];
    }
  }

  profile.name = isNonEmptyString(profile.name) ? String(profile.name).trim() : defaultProfileName(language, index);
  profile.kind = normalizeKind(profile.kind);
  profile.diametro_furo = normalizeNumber(profile.diametro_furo, fallback.diametro_furo);
  profile.altura_banco = normalizeNumber(profile.altura_banco, fallback.altura_banco);
  profile.subperfuracao = normalizeNumber(profile.subperfuracao, fallback.subperfuracao);
  profile.stemming = normalizeNumber(profile.stemming, fallback.stemming);
  profile.blastbags = normalizeDeckItems(profile.blastbags, profile.blastbag, source?.blastbag_count, source?.blastbag_position, fallback.blastbags, 'below_stemming');
  profile.air_decks = normalizeDeckItems(profile.air_decks, profile.air_deck, source?.air_deck_count, source?.air_deck_position, fallback.air_decks, 'mid_charge');
  profile.segments = normalizeSegments(profile.segments, profile, fallback.segments);
  profile.stemming = sumSegmentsByType(profile.segments, 'stemming');
  profile.blastbag = sumSegmentsByType(profile.segments, 'blastbag');
  profile.air_deck = sumSegmentsByType(profile.segments, 'airdeck');
  profile.inclinacao = normalizeNumber(profile.inclinacao, fallback.inclinacao);
  profile.azimute = normalizeNumber(profile.azimute, fallback.azimute);
  profile.densidade = normalizeNumber(profile.densidade, fallback.densidade);
  profile.initiator = ['none', 'brinel', 'dvt', 'both'].includes(profile.initiator) ? profile.initiator : (fallback.initiator || 'none');
  profile.has_booster = Boolean(profile.has_booster);
  profile.booster_weight = normalizeNumber(profile.booster_weight, fallback.booster_weight || 450);

  if (index >= defaultCount && !isNonEmptyString(source?.name)) {
    profile.name = defaultProfileName(language, index);
  }

  return profile;
}

function mergeLoadedState(currentConfig, savedState) {
  const request = savedState?.request && typeof savedState.request === 'object' ? savedState.request : savedState;
  const requestedLanguage = normalizeLanguage(request?.language || currentConfig.app.default_language || DEFAULT_LANGUAGE);
  const base = createDefaultState(currentConfig, requestedLanguage);
  const validation = currentConfig.validation;
  const defaultCount = base.profiles.length;

  if (!request || typeof request !== 'object') return base;

  const templateName = resolveTemplateName(request.template_name, currentConfig) || base.templateName;

  const polygonName = isNonEmptyString(request.polygon_name) ? String(request.polygon_name).trim() : base.polygonName;
  const observation = typeof request.observation === 'string' ? request.observation : base.observation;
  const profileType = base.profileType;

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
    profiles.push(normalizeProfile(savedProfiles[index], fallback, index, defaultCount, requestedLanguage));
  }

  const state = {
    language: requestedLanguage,
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
  const lang = normalizeLanguage(appState?.language || getActiveLanguage());
  const copy = getCopy(lang);

  for (const field of validation.required_text_fields) {
    if (!isNonEmptyString(appState[fieldToStateKey(field)] ?? appState[field])) {
      issues.push(copy.validation.required(stateLabel(field, lang)));
    }
  }

  if (!resolveTemplateName(appState.templateName, currentConfig)) {
    issues.push(copy.validation.modelInvalid);
  }

  if (!Number.isInteger(appState.profileCount)) {
    issues.push(copy.validation.countInvalid);
  } else if (appState.profileCount < validation.min_profiles || appState.profileCount > validation.max_profiles) {
    issues.push(copy.validation.countRange(validation.min_profiles, validation.max_profiles));
  }

  if (!Array.isArray(appState.profiles) || appState.profiles.length !== appState.profileCount) {
    issues.push(copy.validation.profilesMismatch);
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
    if (!isNonEmptyString(profile.name)) issues.push(copy.validation.profileNameRequired(index + 1));
    for (const field of numericFields) {
      const value = profile[field];
      if (!Number.isFinite(value)) {
        issues.push(copy.validation.numericRequired(fieldLabel(field, lang), index + 1));
      } else if (value < 0) {
        issues.push(copy.validation.nonNegative(fieldLabel(field, lang), index + 1));
      }
    }
    for (const [collection, heightLabel, positionLabel] of [
      ['air_decks', copy.fieldLabels.airdeck, copy.fieldLabels.airdeckPosition],
      ['blastbags', copy.fieldLabels.blastbag, copy.fieldLabels.blastbagPosition],
    ]) {
      if (!Array.isArray(profile[collection])) continue;
      profile[collection].forEach((item, itemIndex) => {
        if (!Number.isFinite(item?.height) || item.height < 0) issues.push(copy.validation.nonNegative(`${heightLabel} ${itemIndex + 1}`, index + 1));
        if (!DECK_POSITIONS.includes(item?.position)) issues.push(copy.validation.required(`${positionLabel} ${itemIndex + 1}`));
      });
    }
    if (!Array.isArray(profile.segments) || !profile.segments.length) {
      issues.push(copy.validation.required(copy.fieldLabels.chargeSequence));
    } else {
      profile.segments.forEach((item, itemIndex) => {
        if (!SEGMENT_TYPES.includes(item?.type)) issues.push(copy.validation.required(`${copy.fieldLabels.segmentType} ${itemIndex + 1}`));
        if (!Number.isFinite(item?.height) || item.height < 0) issues.push(copy.validation.nonNegative(`${copy.fieldLabels.segmentHeight} ${itemIndex + 1}`, index + 1));
      });
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

function serializeForStorage(appState) {
  return {
    language: normalizeLanguage(appState.language || DEFAULT_LANGUAGE),
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
    saveLanguagePreference(currentConfig, appState.language);
    seedSource = 'browser';
    updateMemoryStatus(getMemoryStatusText('browser', appState.language));
    if (dom.projectSeed) dom.projectSeed.textContent = getSeedSourceLabel('browser', appState.language);
  } catch (error) {
    showValidation([getCopy(appState.language).validation.saveFailure]);
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
    dom.validation.innerHTML = `<div class="success">${escapeXml(getCopy().validation.ready)}</div>`;
    toggleDownloads(true);
    if (persist && lastValidState) {
      updateMemoryStatus(getMemoryStatusText(seedSource));
    }
    return;
  }

  toggleDownloads(false);
  const messages = issues.map((issue) => (typeof issue === 'string' ? issue : issue?.message || issue?.text || String(issue)));
  dom.validation.innerHTML = `<div class="error"><strong>${escapeXml(getCopy().validation.fixBefore)}</strong><ul>${messages.map((issue) => `<li>${escapeXml(issue)}</li>`).join('')}</ul></div>`;
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
  const resolved = resolveTemplateName(templateName, config);
  return config.templates[resolved] || config.templates['Corporate clean'];
}

function getLogoFallbackSvg() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 72">
      <rect width="260" height="72" rx="16" fill="#FFFFFF"/>
      <rect x="12" y="12" width="236" height="4" rx="2" fill="#D71920"/>
      <text x="22" y="45" fill="#D71920" font-family="IBM Plex Sans, sans-serif" font-size="22" font-weight="700">OPENBLAST</text>
      <text x="22" y="60" fill="#66707e" font-family="IBM Plex Sans, sans-serif" font-size="10" font-weight="600">PROFILE STUDIO</text>
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
  const iconSize = compact ? 16 : 26;
  const iconX = x + 10;
  const iconY = y + (h - iconSize) / 2;
  const labelX = x + 46;
  const labelY = y + (compact ? 14 : 16);
  const valueFont = compact ? 11 : 13;
  const labelFont = compact ? 9 : 11;
  const valueY = y + (compact ? 18 : 26);
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
      <line x1="${x + 6}" y1="${y + h - 1}" x2="${x + w - 6}" y2="${y + h - 1}" stroke="#E9EBED" stroke-width="0.5"/>
    </g>`;
}

function buildChargeSegments(profile, accent) {
  const normalizedSegments = normalizeSegments(profile.segments, profile, []);
  const stem = sumSegmentsByType(normalizedSegments, 'stemming');
  const sub = Math.max(profile.subperfuracao, 0);
  const bb = sumSegmentsByType(normalizedSegments, 'blastbag');
  const ad = sumSegmentsByType(normalizedSegments, 'airdeck');
  const charge = sumSegmentsByType(normalizedSegments, 'column');
  const segments = normalizedSegments.map((item, itemIndex) => ({
    key: `${item.type}-${itemIndex}`,
    type: item.type,
    value: item.height,
    has_booster: Boolean(item.has_booster),
    color: item.type === 'blastbag' ? '#1F2937' : (item.type === 'stemming' ? '#C8CDD5' : accent),
  }));
  if (sub > 0) segments.push({ key: 'subdrill', type: 'subdrill', value: sub, color: '#4B5563' });

  return { segments, stem, sub, bb, ad, charge };
}

function segmentDisplayLabel(type, lang = getActiveLanguage(), short = false) {
  const copy = getCopy(lang);
  const labels = {
    stemming: copy.labels.stemming,
    column: copy.labels.column,
    blastbag: copy.labels.blastbag,
    airdeck: copy.labels.airdeck,
    subdrill: copy.labels.subdrill,
  };
  if (!short) return labels[type] || type;
  const shortLabels = {
    stemming: 'Tamp.',
    column: 'Carga',
    blastbag: 'B.Air',
    airdeck: 'Deck',
    subdrill: 'Sub.',
  };
  return shortLabels[type] || labels[type] || type;
}

function renderProfileCard(profile, theme, box, compact, index) {
  const lang = getActiveLanguage();
  const copy = getCopy(lang);
  const { x, y, w, h } = box;
  const accentInfo = KIND_ACCENTS[profile.kind] || KIND_ACCENTS.personalizado;
  const accent = accentInfo.accent;
  const accentSoft = accentInfo.soft;
  const name = shortText(profile.name || defaultProfileName(lang, index), compact ? 18 : 22).toUpperCase();
  const badgeLetter = (() => {
    const parts = String(profile.name || '').trim().split(/\s+/);
    if (parts.length && parts[parts.length - 1].length === 1 && parts[parts.length - 1] === parts[parts.length - 1].toUpperCase()) return parts[parts.length - 1];
    return String(profile.name || '?').trim()[0]?.toUpperCase() || '?';
  })();

  const titleSize = compact ? 17 : 20;
  const subSize = compact ? 10 : 12;
  const tagSize = compact ? 9 : 11;
  const badgeR = compact ? 20 : 22;
  const badgeCx = x + (compact ? 44 : 46);
  const badgeCy = y + (compact ? 46 : 50);
  const tagText = kindLabel(profile.kind).toUpperCase();
  const tagWidth = measureTextWidth(tagText, tagSize, `'IBM Plex Sans', sans-serif`, 700);
  const tagX = Math.min(x + w - tagWidth - 34, x + (compact ? 320 : 380) - tagWidth / 2 - 8);
  const tagY = y + (compact ? 22 : 24);
  const tagHeight = compact ? 22 : 24;
  const contentTop = compact ? y + 86 : y + 112;
  const contentBottomPad = compact ? 22 : 32;
  const drawingBox = compact
    ? { x: x + 18, y: contentTop, w: 92, h: h - (contentTop - y) - contentBottomPad }
    : { x: x + 34, y: y + 112, w: 160, h: h - 220 };
  const infoBox = compact
    ? { x: x + 160, y: contentTop, w: w - 184, h: h - (contentTop - y) - contentBottomPad }
    : { x: x + 296, y: y + 112, w: w - 324, h: h - 220 };
  const left = drawingBox.x;
  const top = drawingBox.y;
  const right = drawingBox.x + drawingBox.w;
  const bottom = drawingBox.y + drawingBox.h;
  const cx = left + drawingBox.w / 2;
  const cylW = compact ? 34 : 60;
  const cylX1 = cx - cylW / 2;
  const cylX2 = cx + cylW / 2;
  const holeTop = top + (compact ? 20 : 28);
  const holeBottom = bottom - (compact ? 20 : 28);
  const holeH = holeBottom - holeTop;
  const { segments: segmentData, stem, sub, bb, ad, charge } = buildChargeSegments(profile, accent);
  const total = Math.max(segmentData.reduce((sum, item) => sum + Math.max(item.value, 0), 0), 0.01);

  let yCur = holeTop;
  const segmentMarkup = [];
  const cL = compact ? 1 : 2;
  const gapX = compact ? 1 : 2;
  for (const segment of segmentData) {
    const { key, type, value: segVal, color: segColor } = segment;
    if (segVal <= 0) continue;
    const segH = Math.max(1, holeH * (segVal / total));
    const y2 = type === 'subdrill' ? holeBottom : yCur + segH;
    const midY = (yCur + y2) / 2;
    const segAttrs = `data-profile="${index}" data-segment-key="${key}" data-segment-type="${type}" style="cursor:pointer"`;
    if (type === 'stemming') {
      let dots = '';
      const cols = Math.floor((cylW - gapX * 2) / (compact ? 5 : 6));
      const rows = Math.max(1, Math.floor((y2 - yCur) / (compact ? 4 : 5)));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = cylX1 + gapX + c * (compact ? 5 : 6) + (r % 2 ? (compact ? 2.5 : 3) : 0);
          const dy = yCur + cL + r * (compact ? 4 : 5);
          if (dy < y2 - cL) {
            const shade = r % 4 === 0 ? '#9CA3AF' : (r % 4 === 1 ? '#A8B0BC' : (r % 4 === 2 ? '#B4BCC6' : '#C0C8D0'));
            dots += `<circle cx="${dx}" cy="${dy}" r="${compact ? 1.5 : 2}" fill="${shade}"/>`;
          }
        }
      }
      segmentMarkup.push(`<rect ${segAttrs} x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="#D1D5DB" rx="0"/>${dots}`);
    } else if (type === 'airdeck') {
      let hatch = '';
      const step = compact ? 5 : 6;
      for (let yy = yCur + cL; yy < y2; yy += step) {
        hatch += `<line x1="${cylX1 + gapX}" y1="${yy}" x2="${cylX2 - gapX}" y2="${yy}" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 2"/>`;
      }
      segmentMarkup.push(`<rect ${segAttrs} x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="#F8FAFC" rx="0"/>${hatch}`);
    } else if (type === 'blastbag') {
      segmentMarkup.push(`<rect ${segAttrs} x="${cylX1 + gapX}" y="${yCur}" width="${cylW - gapX * 2}" height="${y2 - yCur}" fill="#1F2937" rx="1"/>`);
    } else if (type === 'column') {
      const colLight = mixHex(accent, '#FFFFFF', 0.25);
      const colDark = mixHex(accent, '#000000', 0.15);
      segmentMarkup.push(`<defs><linearGradient id="grad-${index}-${key}" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="${colLight}"/><stop offset="25%" stop-color="${accent}"/><stop offset="100%" stop-color="${colDark}"/></linearGradient></defs><rect ${segAttrs} x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="url(#grad-${index}-${key})" rx="0"/>`);
    } else if (type === 'cartridge') {
      const innerW = cylW * 0.5;
      const innerH = Math.max(6, y2 - yCur);
      const innerY = yCur;
      segmentMarkup.push(`<rect ${segAttrs} x="${cx - innerW / 2}" y="${innerY}" width="${innerW}" height="${innerH}" rx="${compact ? 3 : 4}" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>`);
    } else {
      segmentMarkup.push(`<rect ${segAttrs} x="${cylX1}" y="${yCur}" width="${cylW}" height="${y2 - yCur}" fill="#6B7280" rx="0"/>`);
    }

    if (y2 - yCur >= (compact ? 8 : 12)) {
      const labelX = cylX2 + (compact ? 6 : 14);
      const labelSize = compact ? 7 : 10;
      const labelValue = `${segmentDisplayLabel(type, lang, compact)} ${formatDecimal(segVal)}m`;
      const safeLabel = shortText(labelValue, compact ? 14 : 22);
      segmentMarkup.push(`<line x1="${cylX2 + 1}" y1="${midY}" x2="${labelX - 2}" y2="${midY}" stroke="${theme.muted}" stroke-width="0.6"/>`);
      segmentMarkup.push(`<text x="${labelX}" y="${midY + 1}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${labelSize}" font-weight="500" dominant-baseline="middle">${escapeXml(safeLabel)}</text>`);
    }
    yCur = y2;
  }

  const labels = labelSet();
  const metricRows = [
    ['diameter', fieldLabel('diameter', lang), `${Math.round(profile.diametro_furo)} mm`, 'diameter'],
    ['height', fieldLabel('height', lang), `${formatDecimal(profile.altura_banco, 2, lang)} m`, 'height'],
    ['subdrill', labels.subdrill, `${formatDecimal(profile.subperfuracao)} m`, 'subdrill'],
    ['stemming', labels.stemming, `${formatDecimal(stem)} m`, 'stemming'],
    ['blastbag', labels.blastbag, `${formatDecimal(profile.blastbag)} m`, 'blastbag'],
    ['airdeck', labels.airdeck, `${formatDecimal(profile.air_deck)} m`, 'airdeck'],
    ['inclination', fieldLabel('inclination', lang), `${formatDecimal(profile.inclinacao, 1, lang)}°`, 'inclination'],
    ['azimuth', fieldLabel('azimuth', lang), `${formatDecimal(profile.azimute, 1, lang)}°`, 'azimuth'],
    ['density', fieldLabel('density', lang), `${formatDecimal(profile.densidade, 2, lang)} g/cm3`, 'density'],
  ];

  const rowHeight = compact ? 26 : 44;
  const rowStart = infoBox.y + (compact ? 32 : 44);
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
    ? []
    : [
      [labels.stemming, `${formatDecimal(stem)} m`],
      [labels.column, `${formatDecimal(charge)} m`],
      [labels.subdrill, `${formatDecimal(sub)} m`],
      [labels.blastbag, `${formatDecimal(bb)} m`],
    ];

  const chipFont = compact ? 9 : 11;
  const chipY = infoBox.y + infoBox.h - 42;
  let chipX = infoBox.x + 12;
  const chipMarkup = [];
  for (const [chipLabel, chipVal] of chips) {
    const text = `${chipLabel}: ${chipVal}`;
    const textWidth = measureTextWidth(text, chipFont, `'IBM Plex Sans', sans-serif`, 700);
    const chipW = textWidth + (compact ? 18 : 20);
    if (chipX + chipW > infoBox.x + infoBox.w - 8) break;
    chipMarkup.push(`
      <g>
        <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${compact ? 24 : 28}" rx="10" fill="#F8FAFC" stroke="#E5E7EB"/>
        <text x="${chipX + 8}" y="${chipY + (compact ? 16 : 18)}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${chipFont}" font-weight="700">${escapeXml(text)}</text>
      </g>`);
    chipX += chipW + 8;
  }

  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
    </g>
    <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="18" fill="none" stroke="#FFFFFF"/>
    <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="5" rx="2.5" fill="${accentSoft}"/>

    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR}" fill="${accent}"/>
    <text x="${badgeCx}" y="${badgeCy + 6}" fill="#FFFFFF" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 18 : 20}" font-weight="700">${escapeXml(badgeLetter)}</text>

    <text x="${x + (compact ? 82 : 82)}" y="${y + (compact ? 36 : 32)}" fill="${accent}" font-family="IBM Plex Sans, sans-serif" font-size="${titleSize}" font-weight="700">${escapeXml(name)}</text>
    <text x="${x + (compact ? 82 : 82)}" y="${y + (compact ? 58 : 58)}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${subSize}" font-weight="700">${escapeXml(`${kindLabel(profile.kind).toUpperCase()}  •  ${Math.round(profile.diametro_furo)} MM`)}</text>
    ${compact ? '' : `<rect x="${tagX}" y="${tagY}" width="${tagWidth + 16}" height="${tagHeight}" rx="8" fill="${accentSoft}"/>
    <text x="${tagX + 8}" y="${tagY + 16}" fill="${accent}" font-family="IBM Plex Sans, sans-serif" font-size="${tagSize}" font-weight="700">${escapeXml(tagText)}</text>`}

    <rect x="${x + 18}" y="${y + (compact ? 80 : 92)}" width="${w - 36}" height="3" rx="1.5" fill="${accent}"/>

    <rect x="${drawingBox.x}" y="${drawingBox.y}" width="${drawingBox.w}" height="${drawingBox.h}" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
    ${segmentMarkup.join('')}
    ${(() => {
      const overlay = [];
      const boostH = compact ? 8 : 12;
      const boostW = cylW * 0.40;
      const boostPositions = [];
      const isContorno = profile.kind === 'contorno';
      if (!isContorno) {
        let accY = holeTop;
        for (let si = 0; si < segmentData.length; si++) {
          const seg = segmentData[si];
          const sv = Math.max(seg.value, 0);
          const segH = holeH * (sv / total);
          const segEnd = accY + segH;
          if ((seg.type === 'column' || seg.type === 'cartridge') && seg.has_booster) {
            boostPositions.push(segEnd - boostH - 2);
          }
          accY = segEnd;
        }
      }
      for (const bp of boostPositions) {
        const bx = cx - boostW / 2;
        overlay.push(`<rect x="${bx}" y="${bp}" width="${boostW}" height="${boostH}" rx="2" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>`);
      }
      if (!compact && boostPositions.length > 0) {
        const lblX = cylX2 + 14;
        const lblY = boostPositions[0] + boostH / 2;
        overlay.push(`<line x1="${cx}" y1="${lblY}" x2="${lblX - 2}" y2="${lblY}" stroke="#E74C3C" stroke-width="0.6"/>`);
        overlay.push(`<text x="${lblX}" y="${lblY + 1}" fill="#E74C3C" font-family="IBM Plex Sans, sans-serif" font-size="9" font-weight="600" dominant-baseline="middle">Reforçador ${profile.booster_weight}g</text>`);
      }
      const drawCable = (color, offsetX, label) => {
        const cableX = cx + offsetX;
        overlay.push(`<line x1="${cableX}" y1="${holeTop - 4}" x2="${cableX}" y2="${holeBottom - 4}" stroke="${color}" stroke-width="${compact ? 1.5 : 2}" stroke-linecap="round"/>`);
        overlay.push(`<circle cx="${cableX}" cy="${holeTop - 4}" r="${compact ? 2 : 3}" fill="${color}"/>`);
        if (!compact && label) {
          const lblX = cylX2 + 14;
          const lblY = (holeTop + holeBottom) / 2;
          overlay.push(`<text x="${lblX}" y="${lblY}" fill="${color}" font-family="IBM Plex Sans, sans-serif" font-size="9" font-weight="600" dominant-baseline="middle">${label}</text>`);
        }
      };
      if (profile.initiator === 'brinel') {
        drawCable('#E67E22', compact ? -2 : -4, 'NonEl');
      } else if (profile.initiator === 'dvt') {
        drawCable('#8E44AD', compact ? -2 : -4, 'Eletrônico');
      } else if (profile.initiator === 'both') {
        drawCable('#E67E22', compact ? -4 : -6, 'NonEl');
        drawCable('#8E44AD', compact ? 0 : 2, 'Eletrônico');
      }
      return overlay.join('\n');
    })()}
    <rect x="${cylX1}" y="${holeTop}" width="${cylW}" height="${holeBottom - holeTop}" rx="${compact ? 12 : 14}" fill="none" stroke="${theme.title}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${holeTop + 1}" rx="${cylW / 2}" ry="${compact ? 5 : 7}" fill="#F0F2F5" stroke="${theme.title}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${holeBottom - 1}" rx="${cylW / 2}" ry="${compact ? 5 : 7}" fill="#2D3748" stroke="${theme.title}" stroke-width="2"/>
    ${!compact ? `
    <line x1="${left - 12}" y1="${holeTop}" x2="${left - 12}" y2="${holeBottom}" stroke="${theme.muted}" stroke-width="0.8"/>
    <line x1="${left - 16}" y1="${holeTop}" x2="${left - 8}" y2="${holeTop}" stroke="${theme.muted}" stroke-width="0.8"/>
    <line x1="${left - 16}" y1="${holeBottom}" x2="${left - 8}" y2="${holeBottom}" stroke="${theme.muted}" stroke-width="0.8"/>
    <text x="${left - 18}" y="${(holeTop + holeBottom) / 2}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="8" font-weight="600" text-anchor="end" transform="rotate(-90, ${left - 18}, ${(holeTop + holeBottom) / 2})">${formatDecimal(profile.altura_banco, 2, lang)} m</text>
    ` : ''}
    <text x="${left + 2}" y="${bottom - 4}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 8 : 9}" font-weight="600">${escapeXml(`${copy.svg.bench} ${formatDecimal(profile.altura_banco, 2, lang)} ${copy.svg.benchUnit}`)}</text>

    <rect x="${infoBox.x}" y="${infoBox.y}" width="${infoBox.w}" height="${infoBox.h}" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
    <rect x="${infoBox.x}" y="${infoBox.y}" width="${infoBox.w}" height="${compact ? 5 : 5}" fill="${accent}" rx="2.5"/>
    <text x="${infoBox.x + 12}" y="${infoBox.y + (compact ? 16 : 18)}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${compact ? 13 : 15}" font-weight="700">${compact ? copy.svg.dataTitleCompact : copy.svg.dataTitle}</text>
    ${rowsMarkup}
    ${chipMarkup.join('')}
  `;
}

function renderMeshPanel(theme, box) {
  const copy = getCopy();
  const { x, y, w, h } = box;
  if (state.mesh?.dataUrl) {
    return `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
      </g>
      <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="18" fill="none" stroke="#FFFFFF"/>
      <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="5" rx="2.5" fill="${theme.accent_red}"/>
      <text x="${x + 26}" y="${y + 42}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="18" font-weight="700">${copy.svg.meshTitle}</text>
      <rect x="${x + 26}" y="${y + 58}" width="48" height="3" rx="1.5" fill="${theme.accent_red}"/>
      <rect x="${x + 26}" y="${y + 78}" width="130" height="26" rx="8" fill="#F8FAFC" stroke="#E5E7EB"/>
      <text x="${x + 38}" y="${y + 96}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="10" font-weight="700">${copy.svg.meshAttached}</text>
      <rect x="${x + 32}" y="${y + 128}" width="${w - 64}" height="${h - 176}" rx="20" fill="#F9FAFB" stroke="#E5E7EB"/>
      <image href="${state.mesh.dataUrl}" x="${x + 44}" y="${y + 140}" width="${w - 88}" height="${h - 200}" preserveAspectRatio="xMidYMid meet"/>
    `;
  }

  const grid = [];
  for (let gx = x + 16; gx <= x + w - 16; gx += 18) {
    grid.push(`<line x1="${gx}" y1="${y + 18}" x2="${gx}" y2="${y + h - 16}" stroke="rgba(29,111,184,0.06)" stroke-width="1"/>`);
  }
  for (let gy = y + 18; gy <= y + h - 16; gy += 18) {
    grid.push(`<line x1="${x + 16}" y1="${gy}" x2="${x + w - 16}" y2="${gy}" stroke="rgba(29,111,184,0.05)" stroke-width="1"/>`);
  }

  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${theme.panel_bg}" stroke="${theme.panel_border}"/>
    </g>
    <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="18" fill="none" stroke="#FFFFFF"/>
    <rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="5" rx="2.5" fill="${theme.accent_red}"/>
    <text x="${x + 26}" y="${y + 42}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="18" font-weight="700">${copy.svg.meshTitle}</text>
    <rect x="${x + 26}" y="${y + 58}" width="48" height="3" rx="1.5" fill="${theme.accent_red}"/>
    <text x="${x + 26}" y="${y + 78}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="13">${escapeXml(state.polygonName)}</text>
    <rect x="${x + 32}" y="${y + 104}" width="${w - 64}" height="${h - 194}" rx="16" fill="#F8FAFC" stroke="#E5E7EB" stroke-dasharray="6 6"/>
    ${grid.join('')}
    <circle cx="${x + w / 2}" cy="${y + 200}" r="30" fill="#F9FAFB" stroke="#D1D5DB"/>
    <path d="M${x + w / 2} ${y + 190} V${y + 210}" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
    <path d="M${x + w / 2} ${y + 190} l-6 9 h12 Z" fill="#9CA3AF"/>
    <text x="${x + w / 2}" y="${y + 248}" text-anchor="middle" fill="${theme.text}" font-family="IBM Plex Sans, sans-serif" font-size="13" font-weight="700">${copy.svg.meshPrompt}</text>
    <text x="${x + w / 2}" y="${y + 270}" text-anchor="middle" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="11">${copy.svg.meshNoAttachment}</text>
    <rect x="${x + w / 2 - 58}" y="${y + h - 92}" width="116" height="26" rx="10" fill="#FFFFFF" stroke="#E5E7EB"/>
    <text x="${x + w / 2}" y="${y + h - 74}" text-anchor="middle" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="10" font-weight="700">${copy.svg.referenceMode}</text>
    <text x="${x + 34}" y="${y + h - 26}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="11">${copy.svg.referenceModeDesc}</text>
  `;
}

function renderHeader(theme, box) {
  const copy = getCopy();
  const { x, y, w, h } = box;
  const title = copy.svg.headerTitle;
  const titleSize = fitFontSize(title, w - 560, 30, `'IBM Plex Sans', sans-serif`, 700, 22);
  const polygonSize = fitFontSize(state.polygonName, w - 560, 24, `'IBM Plex Sans', sans-serif`, 700, 18);
  const logoBox = { x: x + 40, y: y + 14, w: 170, h: 80 };
  const rightBadgeText = String(state.profileType || copy.defaults.profileType).toUpperCase();
  const badgeFont = 17;
  const badgeTextWidth = measureTextWidth(rightBadgeText, badgeFont, `'IBM Plex Sans', sans-serif`, 700);
  const badgeW = Math.max(200, badgeTextWidth + 48);
  const badgeX = x + w - badgeW - 40;

  return `
    <rect x="0" y="0" width="${w}" height="${h}" fill="#FFFFFF"/>
    <rect x="0" y="0" width="${w}" height="5" fill="${theme.accent_red}"/>
    <line x1="${x + 40}" y1="${y + h - 1}" x2="${x + w - 40}" y2="${y + h - 1}" stroke="#EEF2F7" stroke-width="1"/>
    <rect x="${logoBox.x}" y="${logoBox.y}" width="${logoBox.w}" height="${logoBox.h}" rx="14" fill="#FFFFFF" stroke="#E5E7EB"/>
    <rect x="${logoBox.x}" y="${logoBox.y}" width="${logoBox.w}" height="5" rx="2.5" fill="${theme.accent_red}"/>
    ${(() => {
      const logoUrl = state.logo?.dataUrl || logoDataUrl;
      return logoUrl
        ? `<image href="${logoUrl}" x="${logoBox.x + 12}" y="${logoBox.y + 14}" width="${logoBox.w - 24}" height="${logoBox.h - 22}" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="${logoBox.x + 18}" y="${logoBox.y + 56}" fill="${theme.accent_red}" font-family="IBM Plex Sans, sans-serif" font-size="22" font-weight="700">OPENBLAST</text>`;
    })()}
    <text x="${x + 240}" y="${y + 40}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="${titleSize}" font-weight="700">${escapeXml(title)}</text>
    <text x="${x + 240}" y="${y + 74}" fill="${theme.accent_red}" font-family="IBM Plex Sans, sans-serif" font-size="${polygonSize}" font-weight="700">${escapeXml(state.polygonName)}</text>
    <rect x="${badgeX}" y="${y + 28}" width="${badgeW}" height="52" rx="14" fill="${theme.accent_red}"/>
    <text x="${badgeX + badgeW / 2}" y="${y + 60}" text-anchor="middle" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif" font-size="${badgeFont}" font-weight="700">${escapeXml(rightBadgeText)}</text>
  `;
}

function renderFooter(theme, box, showLegend = false) {
  const copy = getCopy();
  const { x, y, w, h } = box;
  const legend = [
    [copy.svg.footerLegend.production, theme.accent_blue],
    [copy.svg.footerLegend.cushioning, theme.accent_orange],
    [copy.svg.footerLegend.contour, theme.accent_red],
  ];

  const legendMarkup = showLegend ? legend.map(([label, color], index) => {
    const posX = x + 48 + legend.slice(0, index).reduce((acc, [previousLabel]) => acc + measureTextWidth(previousLabel, 14, `'IBM Plex Sans', sans-serif`, 700) + 32, 0);
    return `<rect x="${posX}" y="${y + 14}" width="12" height="12" rx="3" fill="${color}"/><text x="${posX + 18}" y="${y + 25}" fill="${theme.muted}" font-family="IBM Plex Sans, sans-serif" font-size="13" font-weight="700">${escapeXml(label)}</text>`;
  }).join('') : '';

  const observationLines = wrapText(state.observation, w - 96, 16, `'IBM Plex Sans', sans-serif`, 400).slice(0, 3);
  const observationMarkup = observationLines.length
    ? textBlock(x + 48, y + (showLegend ? 48 : 24), observationLines, { size: 14, weight: 400, fill: theme.muted })
    : '';

  return `
    <line x1="${x + 48}" y1="${y}" x2="${x + w - 48}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>
    ${legendMarkup}
    ${observationMarkup}
  `;
}

function renderObservationPanel(theme, box) {
  const copy = getCopy();
  const { x, y, w, h } = box;
  const lines = wrapText(state.observation || copy.defaults.observation, w - 52, 15, `'IBM Plex Sans', sans-serif`, 400).slice(0, 4);
  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#FFFFFF" stroke="${theme.panel_border}"/>
    </g>
    <rect x="${x + 16}" y="${y + 14}" width="38" height="3" rx="1.5" fill="${theme.accent_red}"/>
    <text x="${x + 20}" y="${y + 38}" fill="${theme.title}" font-family="IBM Plex Sans, sans-serif" font-size="14" font-weight="700">${escapeXml(copy.fieldLabels.observation)}</text>
    ${textBlock(x + 20, y + 60, lines, { size: 13, weight: 400, fill: theme.muted, lineHeight: 1.4 })}
  `;
}

function renderLayout(currentConfig) {
  const copy = getCopy();
  const theme = getTheme(state.templateName);
  const [viewW, viewH] = currentConfig.site?.preview_size || DEFAULT_PREVIEW_SIZE;
  const margin = 40;
  const headerH = 120;
  const mainTop = headerH + 28;
  const bottom = 32;
  const panelGap = 32;
  const meshW = 500;
  const mainH = viewH - mainTop - bottom;
  const profileAreaW = viewW - (margin * 2) - meshW - panelGap;
  const compact = state.profileCount >= 3;
  const observationH = 160;
  const meshH = mainH - observationH - panelGap;
  const cards = [];

  cards.push({ type: 'mesh', x: margin, y: mainTop, w: meshW, h: meshH });
  cards.push({ type: 'observation', x: margin, y: mainTop + meshH + panelGap, w: meshW, h: observationH });
  if (!compact) {
    const count = Math.max(state.profileCount, 1);
    const gap = count > 1 ? 16 : 0;
    const cardW = (profileAreaW - gap * (count - 1)) / count;
    let x = margin + meshW + panelGap;
    for (let i = 0; i < state.profileCount; i += 1) {
      cards.push({ type: 'profile', x, y: mainTop, w: cardW, h: mainH, index: i });
      x += cardW + gap;
    }
  } else {
    const cols = 2;
    const rows = 2;
    const cardW = (profileAreaW - panelGap) / cols;
    const cardH2 = (mainH - panelGap) / rows;
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (index >= state.profileCount) break;
        cards.push({ type: 'profile', x: margin + meshW + panelGap + col * (cardW + panelGap), y: mainTop + row * (cardH2 + panelGap), w: cardW, h: cardH2, index });
        index += 1;
      }
    }
  }

  const content = cards.map((card) => {
    if (card.type === 'mesh') return renderMeshPanel(theme, card);
    if (card.type === 'observation') return renderObservationPanel(theme, card);
    return renderProfileCard(state.profiles[card.index], theme, card, compact, card.index);
  }).join('');

  const header = renderHeader(theme, { x: 0, y: 0, w: viewW, h: headerH });
  const footer = compact ? '' : renderFooter(theme, { x: 0, y: viewH - bottom, w: viewW, h: bottom }, Boolean(state.mesh?.dataUrl));

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" role="img" aria-labelledby="svgTitle svgDesc">
      <title id="svgTitle">${copy.svg.title}</title>
      <desc id="svgDesc">${copy.svg.desc}</desc>
      <defs>
        <linearGradient id="pageBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${theme.bg}"/>
          <stop offset="100%" stop-color="#F8F9FB"/>
        </linearGradient>
        <filter id="shadow" x="-12%" y="-12%" width="124%" height="124%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${rgbToHex(theme.shadow[0], theme.shadow[1], theme.shadow[2])}" flood-opacity="${(theme.shadow[3] || 35) / 100}"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#pageBg)"/>
      ${header}
      ${content}
      ${footer}
    </svg>`;
}

function renderGlobalSection(currentConfig) {
  const copy = getCopy();
  const templateOptions = Object.keys(currentConfig.templates).map((template) => `<option value="${escapeXml(template)}"${template === state.templateName ? ' selected' : ''}>${escapeXml(templateDisplayName(template))}</option>`).join('');
  const logoName = state.logo?.name ? shortText(state.logo.name, 28) : copy.fileChips.logoDefault;
  const meshName = state.mesh?.name ? shortText(state.mesh.name, 28) : copy.fileChips.meshDefault;
  return `
    <div class="field">
      <label for="observation">${copy.fieldLabels.observation}</label>
      <textarea id="observation" data-path="observation" placeholder="${escapeXml(copy.fieldPlaceholders.observation)}">${escapeXml(state.observation)}</textarea>
    </div>
    <div class="image-upload-row">
      <div class="field">
        <label for="logoFile">${copy.fieldLabels.logo}</label>
        <input id="logoFile" data-role="logo-file" type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml">
      </div>
      <span class="file-chip" id="logoChip">${escapeXml(logoName)}</span>
    </div>
    <div class="image-upload-row">
      <div class="field">
        <label for="meshFile">${copy.fieldLabels.mesh}</label>
        <input id="meshFile" data-role="mesh-file" type="file" accept="image/png,image/jpeg,image/jpg">
      </div>
      <span class="file-chip" id="meshChip">${escapeXml(meshName)}</span>
    </div>`;
}

function renderLabelSection() {
  const copy = getCopy();
  return `
    <div class="form-grid form-grid--three">
      ${renderInput(copy.labels.stemming, 'labels.stemming', state.labels.stemming)}
      ${renderInput(copy.labels.blastbag, 'labels.blastbag', state.labels.blastbag)}
      ${renderInput(copy.labels.airdeck, 'labels.airdeck', state.labels.airdeck)}
      ${renderInput(copy.labels.column, 'labels.column', state.labels.column)}
      ${renderInput(copy.labels.subdrill, 'labels.subdrill', state.labels.subdrill)}
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

function renderDeckItems(title, addLabel, profileIndex, collection, heightLabel, positionLabel, items) {
  const rows = (items || []).map((item, itemIndex) => `
    <div class="deck-item">
      ${renderInput(`${heightLabel} ${itemIndex + 1}`, `profiles.${profileIndex}.${collection}.${itemIndex}.height`, item.height, 'number', { step: 0.05, min: 0 })}
      ${renderSelect(`${positionLabel} ${itemIndex + 1}`, `profiles.${profileIndex}.${collection}.${itemIndex}.position`, item.position, deckPositionOptions(), '')}
      <button class="ghost-button deck-item__remove" type="button" data-action="remove-deck-item" data-profile-index="${profileIndex}" data-collection="${collection}" data-item-index="${itemIndex}">Remover</button>
    </div>`).join('');
  return `
    <div class="deck-editor">
      <div class="deck-editor__head">
        <strong>${escapeXml(title)}</strong>
        <button class="ghost-button" type="button" data-action="add-deck-item" data-profile-index="${profileIndex}" data-collection="${collection}">${escapeXml(addLabel)}</button>
      </div>
      <div class="deck-editor__rows">${rows || `<span class="hint">Nenhum item configurado.</span>`}</div>
    </div>`;
}

function segmentTypeOptions() {
  const types = getCopy().segmentTypes;
  return SEGMENT_TYPES.map((value) => ({ value, label: types[value] || value }));
}

function renderSegmentEditor(profile, index) {
  const copy = getCopy();
  const typeOpts = segmentTypeOptions();
  const isContorno = profile.kind === 'contorno';
  const rows = (profile.segments || []).map((item, itemIndex) => {
    const isHighlighted = selectedSegmentKey !== null && selectedSegmentKey === `${item.type}-${itemIndex}`;
    const showBooster = (item.type === 'column' || item.type === 'cartridge') && !isContorno;
    return `
    <div class="segment-row${isHighlighted ? ' highlighted' : ''}" data-segment-row="${itemIndex}">
      <div class="field segment-row__type">
        <select data-path="profiles.${index}.segments.${itemIndex}.type">${typeOpts.map((opt) => `<option value="${escapeXml(opt.value)}"${opt.value === item.type ? ' selected' : ''}>${escapeXml(opt.label)}</option>`).join('')}</select>
      </div>
      <div class="field segment-row__height">
        <input data-path="profiles.${index}.segments.${itemIndex}.height" type="number" step="0.05" min="0" value="${escapeXml(String(item.height ?? ''))}">
      </div>
      ${showBooster ? `<div class="segment-row__booster"><label class="booster-toggle" title="Reforçador (Booster)"><input type="checkbox" data-path="profiles.${index}.segments.${itemIndex}.has_booster"${item.has_booster ? ' checked' : ''}><span class="booster-toggle__icon"></span></label></div>` : ''}
      <div class="segment-row__btns">
        <button class="segment-row__btn" type="button" data-action="move-segment-up" data-profile-index="${index}" data-item-index="${itemIndex}" title="Subir">&#9650;</button>
        <button class="segment-row__btn" type="button" data-action="move-segment-down" data-profile-index="${index}" data-item-index="${itemIndex}" title="Descer">&#9660;</button>
        <button class="segment-row__btn danger" type="button" data-action="remove-segment" data-profile-index="${index}" data-item-index="${itemIndex}" title="${escapeXml(copy.buttons.removeProfile)}">&#10005;</button>
      </div>
    </div>`;
  }).join('');
  return `
    <div class="segment-editor-card">
      <div class="segment-editor-card__head">
        <p class="segment-editor-card__title">${escapeXml(copy.fieldLabels.chargeSequence)}</p>
        <button class="ghost-button" type="button" data-action="add-segment" data-profile-index="${index}" style="min-height:28px;font-size:0.66rem;">+ ${escapeXml(copy.fieldLabels.addSegment)}</button>
      </div>
      <div class="segment-editor-card__body">
        ${rows}
      </div>
    </div>`;
}

function renderProfileEditor(profile, index) {
  const copy = getCopy();
  const letter = (() => {
    const parts = String(profile.name || '').trim().split(/\s+/);
    const last = parts[parts.length - 1];
    if (last && last.length === 1 && last === last.toUpperCase()) return last;
    return String(profile.name || '?').trim()[0]?.toUpperCase() || '?';
  })();
  const accent = KIND_ACCENTS[profile.kind]?.accent || KIND_ACCENTS.personalizado.accent;
  const stem = sumSegmentsByType(profile.segments, 'stemming');
  const charge = sumSegmentsByType(profile.segments, 'column');
  const bb = sumSegmentsByType(profile.segments, 'blastbag');
  const ad = sumSegmentsByType(profile.segments, 'airdeck');

  return `
    <div class="segment-editor-area">
      <div class="profile-params" style="border-left: 3px solid ${accent};">
        <p class="profile-params__title">${escapeXml(shortText(profile.name || defaultProfileName(getActiveLanguage(), index), 24).toUpperCase())}</p>
        <div class="form-grid form-grid--two">
          ${renderInput(copy.fieldLabels.profileName, `profiles.${index}.name`, profile.name)}
          ${renderSelect(copy.fieldLabels.kind, `profiles.${index}.kind`, profile.kind, KIND_OPTIONS.map((key) => ({ value: key, label: kindLabel(key) })), '')}
          ${renderInput(copy.fieldLabels.diameter, `profiles.${index}.diametro_furo`, profile.diametro_furo, 'number', { step: 1, min: 0 })}
          ${renderInput(copy.fieldLabels.height, `profiles.${index}.altura_banco`, profile.altura_banco, 'number', { step: 0.05, min: 0 })}
          ${renderInput(copy.fieldLabels.subdrill, `profiles.${index}.subperfuracao`, profile.subperfuracao, 'number', { step: 0.05, min: 0 })}
          ${renderInput(copy.fieldLabels.inclination, `profiles.${index}.inclinacao`, profile.inclinacao, 'number', { step: 1, min: 0 })}
          ${renderInput(copy.fieldLabels.azimuth, `profiles.${index}.azimute`, profile.azimute, 'number', { step: 1, min: 0 })}
          ${renderInput(copy.fieldLabels.density, `profiles.${index}.densidade`, profile.densidade, 'number', { step: 0.01, min: 0 })}
          ${renderSelect(copy.fieldLabels.initiator, `profiles.${index}.initiator`, profile.initiator, [
            { value: 'none', label: copy.fieldLabels.initiatorNone },
            { value: 'brinel', label: copy.fieldLabels.initiatorBrinel },
            { value: 'dvt', label: copy.fieldLabels.initiatorDVT },
            { value: 'both', label: copy.fieldLabels.initiatorBoth },
          ], '')}
          ${renderInput(copy.fieldLabels.boosterWeight, `profiles.${index}.booster_weight`, profile.booster_weight, 'number', { step: 10, min: 0 })}
        </div>
      </div>
      ${renderSegmentEditor(profile, index)}
    </div>`;
}

function renderSelect(label, path, value, options, helpText = '') {
  return `
    <div class="field">
      <label>${escapeXml(label)}</label>
      <select data-path="${escapeXml(path)}">${options.map((option) => `<option value="${escapeXml(option.value)}"${option.value === value ? ' selected' : ''}>${escapeXml(option.label)}</option>`).join('')}</select>
      ${helpText ? `<span class="hint">${escapeXml(helpText)}</span>` : ''}
    </div>`;
}

function deckPositionOptions() {
  const positions = getCopy().deckPositions;
  return DECK_POSITIONS.map((value) => ({ value, label: positions[value] || value }));
}

function renderAutoCalcSummary(profile, lang) {
  const copy = getCopy(lang);
  const labels = copy.labels;
  const stem = sumSegmentsByType(profile.segments, 'stemming');
  const charge = sumSegmentsByType(profile.segments, 'column');
  const sub = Math.max(profile.subperfuracao, 0);
  const bb = sumSegmentsByType(profile.segments, 'blastbag');
  const ad = sumSegmentsByType(profile.segments, 'airdeck');
  return `
    <div class="auto-calc-bar">
      <span class="auto-calc-chip" style="border-left: 3px solid var(--accent-blue);"><strong>H:</strong> ${formatDecimal(profile.altura_banco)}</span>
      <span class="auto-calc-chip" style="border-left: 3px solid var(--accent-blue);"><strong>C:</strong> ${formatDecimal(charge)}</span>
      <span class="auto-calc-chip" style="border-left: 3px solid #C8CDD5;"><strong>S:</strong> ${formatDecimal(stem)}</span>
      <span class="auto-calc-chip" style="border-left: 3px solid #2F343B;"><strong>BB:</strong> ${formatDecimal(bb)}</span>
      ${ad > 0 ? `<span class="auto-calc-chip" style="border-left: 3px solid var(--accent-orange);"><strong>AD:</strong> ${formatDecimal(ad)}</span>` : ''}
      ${sub > 0 ? `<span class="auto-calc-chip" style="border-left: 3px solid #4B5563;"><strong>Sub:</strong> ${formatDecimal(sub)}</span>` : ''}
    </div>`;
}

function handleSVGClick(event) {
  const target = event.target;
  if (!(target instanceof SVGElement)) return;
  const rect = target.closest('rect[data-segment-key]');
  if (!rect) return;
  const profileIdx = Number(rect.getAttribute('data-profile'));
  const segKey = rect.getAttribute('data-segment-key');
  const segType = rect.getAttribute('data-segment-type');
  if (!Number.isFinite(profileIdx) || !segKey) return;

  if (profileIdx !== selectedProfileIndex) {
    selectedProfileIndex = profileIdx;
    selectedSegmentKey = segKey;
    renderShell(config);
  } else {
    selectedSegmentKey = selectedSegmentKey === segKey ? null : segKey;
    renderForms();
  }
}

function renderForms() {
  const lang = getActiveLanguage();
  const profile = state.profiles[selectedProfileIndex] || state.profiles[0];

  if (dom.segmentEditorArea) {
    dom.segmentEditorArea.innerHTML = renderProfileEditor(profile, selectedProfileIndex);
  }
  if (dom.autoCalcSummary && profile) {
    dom.autoCalcSummary.innerHTML = renderAutoCalcSummary(profile, lang);
  }
  if (dom.globalFields) {
    dom.globalFields.innerHTML = renderGlobalSection(config);
  }
  if (dom.labelFields) {
    dom.labelFields.innerHTML = renderLabelSection();
  }
  if (dom.logoChip) syncLogoChip();
  if (dom.meshChip) syncMeshChip();
  if (dom.profileCountLabel) dom.profileCountLabel.textContent = profileCountText(state.profileCount, lang);
  syncTopbarInputs();
  renderProfileTabs();
}

function renderProfileTabs() {
  if (!dom.profileTabs) return;
  const letters = [];
  const suffixes = ['º', 'º', 'º', 'º'];
  for (let i = 0; i < state.profileCount; i++) {
    const p = state.profiles[i];
    const label = `${i + 1}${suffixes[i] || 'º'}`;
    const accent = KIND_ACCENTS[p.kind]?.accent || KIND_ACCENTS.personalizado.accent;
    const isActive = i === selectedProfileIndex;
    letters.push(`<button class="profile-tab${isActive ? ' active' : ''}" type="button" data-profile-tab="${i}" style="${isActive ? `--accent:${accent}` : ''}">${escapeXml(label)}</button>`);
  }
  dom.profileTabs.innerHTML = letters.join('');
}

function syncTopbarInputs() {
  if (dom.polygonNameTop) {
    dom.polygonNameTop.value = state.polygonName || '';
  }
  if (dom.templateNameTop) {
    const copy = getCopy();
    const opts = Object.keys(config.templates).map((t) => `<option value="${escapeXml(t)}"${t === state.templateName ? ' selected' : ''}>${escapeXml(templateDisplayName(t))}</option>`).join('');
    dom.templateNameTop.innerHTML = opts;
  }
}

function syncLogoChip() {
  if (!dom.logoChip) return;
  dom.logoChip.textContent = state.logo?.name ? shortText(state.logo.name, 36) : getCopy().fileChips.logoDefault;
}

function syncMeshChip() {
  if (!dom.meshChip) return;
  dom.meshChip.textContent = state.mesh?.name ? shortText(state.mesh.name, 36) : getCopy().fileChips.meshDefault;
}

function adjustProfileCount(delta) {
  const next = clamp(state.profileCount + delta, config.validation.min_profiles, config.validation.max_profiles);
  if (next === state.profileCount) return;
  const defaultProfiles = config.defaults.profiles;
  const lang = getActiveLanguage();
  if (next > state.profileCount) {
    for (let i = state.profileCount; i < next; i += 1) {
      const fallback = state.profiles[state.profiles.length - 1] || defaultProfiles[defaultProfiles.length - 1];
      const cloneProfile = clone(fallback);
      cloneProfile.name = defaultProfileName(lang, i);
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
  const defaults = createDefaultState(currentConfig, getActiveLanguage());
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
  const isNumberField = target?.type === 'number' || ['diametro_furo', 'altura_banco', 'subperfuracao', 'stemming', 'blastbag', 'air_deck', 'height', 'inclinacao', 'azimute', 'densidade', 'booster_weight'].some((field) => path.endsWith(field));
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
      const [, index, field, itemIndex, itemField] = path.split('.');
      if (!state.profiles[Number(index)]) return;
      const currentProfile = state.profiles[Number(index)];
      if ((field === 'blastbags' || field === 'air_decks' || field === 'segments') && currentProfile[field]?.[Number(itemIndex)]) {
        currentProfile[field][Number(itemIndex)][itemField] = target.type === 'number'
          ? (target.value === '' ? Number.NaN : Number(target.value))
          : value;
        if (field === 'segments' && itemField === 'type' && value === 'cartridge') {
          const seg = currentProfile.segments[Number(itemIndex)];
          if (seg && (seg.height === 1 || seg.height === 0)) seg.height = 0.6;
        }
        currentProfile.stemming = sumSegmentsByType(currentProfile.segments, 'stemming');
        currentProfile.blastbag = sumSegmentsByType(currentProfile.segments, 'blastbag');
        currentProfile.air_deck = sumSegmentsByType(currentProfile.segments, 'airdeck');
      } else {
        currentProfile[field] = target.type === 'number'
          ? (target.value === '' ? Number.NaN : Number(target.value))
          : value;
      }
    } else if (path.startsWith('labels.')) {
      const [, key] = path.split('.');
      state.labels[key] = value;
    } else if (path === 'templateName') {
      state.templateName = resolveTemplateName(value, config) || createDefaultState(config, getActiveLanguage()).templateName;
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
  const deckAction = target.getAttribute('data-action');
  if (['add-segment', 'remove-segment', 'move-segment-up', 'move-segment-down'].includes(deckAction)) {
    const profileIndex = Number(target.getAttribute('data-profile-index'));
    const itemIndex = Number(target.getAttribute('data-item-index'));
    const profile = state.profiles[profileIndex];
    if (!profile) return;
    if (!Array.isArray(profile.segments)) profile.segments = [];
    if (deckAction === 'add-segment') {
      profile.segments.push({ type: 'column', height: 1 });
    } else if (deckAction === 'remove-segment') {
      profile.segments.splice(itemIndex, 1);
    } else if (deckAction === 'move-segment-up' && itemIndex > 0) {
      [profile.segments[itemIndex - 1], profile.segments[itemIndex]] = [profile.segments[itemIndex], profile.segments[itemIndex - 1]];
    } else if (deckAction === 'move-segment-down' && itemIndex < profile.segments.length - 1) {
      [profile.segments[itemIndex + 1], profile.segments[itemIndex]] = [profile.segments[itemIndex], profile.segments[itemIndex + 1]];
    }
    profile.stemming = sumSegmentsByType(profile.segments, 'stemming');
    profile.blastbag = sumSegmentsByType(profile.segments, 'blastbag');
    profile.air_deck = sumSegmentsByType(profile.segments, 'airdeck');
    renderForms();
    scheduleUpdate();
    return;
  }
  if (deckAction === 'add-deck-item' || deckAction === 'remove-deck-item') {
    const profileIndex = Number(target.getAttribute('data-profile-index'));
    const collection = target.getAttribute('data-collection');
    const profile = state.profiles[profileIndex];
    if (!profile || (collection !== 'blastbags' && collection !== 'air_decks')) return;
    if (!Array.isArray(profile[collection])) profile[collection] = [];
    if (deckAction === 'add-deck-item') {
      profile[collection].push({ height: 0.1, position: collection === 'blastbags' ? 'below_stemming' : 'mid_charge' });
    } else {
      profile[collection].splice(Number(target.getAttribute('data-item-index')), 1);
    }
    profile.blastbag = sumDeckItems(profile.blastbags);
    profile.air_deck = sumDeckItems(profile.air_decks);
    renderForms();
    scheduleUpdate();
    return;
  }
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
    setStatusMessage(getCopy().validation.saveSuccess);
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
      const copy = getCopy();
      dom.validation.innerHTML = `<div class="error">${escapeXml(copy.validation.previewError(error.message || String(error)))}</div>`;
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

  const copy = getCopy();
  const baseName = getDownloadBaseName();
  const svg = lastValidSvg || renderLayout(config);
  if (type === 'svg') {
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${baseName}.svg`);
    return;
  }

  await document.fonts.ready;
  const [exportW, exportH] = config.site?.export_size || DEFAULT_EXPORT_SIZE;
  const canvas = await svgToCanvas(svg, exportW, exportH);

  if (type === 'png') {
    const blob = await canvasToBlob(canvas, 'image/png');
    downloadBlob(blob, `${baseName}.png`);
    return;
  }

  if (type === 'jpg') {
    const blob = await canvasToBlob(canvas, 'image/jpeg', config.export?.jpg_quality ? config.export.jpg_quality / 100 : 0.96);
    downloadBlob(blob, `${baseName}.jpg`);
    return;
  }

  if (type === 'pdf') {
    const jsPDFCtor = window.jspdf?.jsPDF || window.jsPDF;
    if (!jsPDFCtor) {
      showValidation([copy.validation.pdfUnavailable]);
      return;
    }
    const pdf = new jsPDFCtor({ orientation: 'landscape', unit: 'px', format: [exportW, exportH] });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, exportW, exportH, undefined, 'FAST');
    pdf.save(`${baseName}.pdf`);
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

function renderStaticChrome() {
  const lang = getActiveLanguage();
  const copy = getCopy(lang);
  document.documentElement.lang = lang;
  document.title = copy.meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', copy.meta.description);

  const brandLockup = document.querySelector('.brand-lockup');
  if (brandLockup) brandLockup.setAttribute('aria-label', copy.brand.title);

  const brandTitle = document.querySelector('.brand-text strong');
  if (brandTitle) brandTitle.textContent = copy.brand.title;

  const profileMinus = document.getElementById('profileMinus');
  if (profileMinus) profileMinus.setAttribute('aria-label', copy.buttons.removeProfile);

  const profilePlus = document.getElementById('profilePlus');
  if (profilePlus) profilePlus.setAttribute('aria-label', copy.buttons.addProfile);

  const profileCountLabel = document.getElementById('profileCountLabel');
  if (profileCountLabel) profileCountLabel.textContent = profileCountText(state.profileCount, lang);

  const resetButton = document.getElementById('resetButton');
  if (resetButton) resetButton.textContent = copy.buttons.reset;

  const saveButton = document.getElementById('saveButton');
  if (saveButton) saveButton.textContent = copy.buttons.save;

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    const languages = getSupportedLanguages(config);
    languageSelect.setAttribute('aria-label', copy.controls.language);
    languageSelect.innerHTML = languages.map((code) => `<option value="${escapeXml(code)}"${code === lang ? ' selected' : ''}>${escapeXml(languageDisplayName(code, lang))}</option>`).join('');
    languageSelect.value = lang;
  }

  const toggleBtn = document.getElementById('toggleGlobalSection');
  if (toggleBtn) {
    const firstSpan = toggleBtn.querySelector('span:first-child');
    if (firstSpan) firstSpan.textContent = `${copy.sections.config.title} & ${copy.sections.labels.title}`;
  }
}

function setLanguage(nextLanguage) {
  const normalized = normalizeLanguage(nextLanguage);
  const current = getActiveLanguage();
  if (normalized !== current) {
    translateStateDefaults(current, normalized);
    state.language = normalized;
    saveLanguagePreference(config, normalized);
  }
  renderStaticChrome();
  renderShell(config);
  scheduleUpdate(true);
}

function renderShell(currentConfig) {
  const copy = getCopy();
  const labelCopy = copy.sections.labels.title;
  const configCopy = copy.sections.config.title;

  if (dom.globalSettingsArea) {
    dom.globalSettingsArea.innerHTML = `
      <div id="labelFields"></div>
      <div id="globalFields"></div>`;
    dom.labelFields = document.getElementById('labelFields');
    dom.globalFields = document.getElementById('globalFields');
  }
  renderForms();
}

function updatePreviewStatus(text) {
  if (dom.memoryStatus) dom.memoryStatus.textContent = text;
}

async function init() {
  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready.catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, 1200)),
    ]);
  }
  config = await loadJson('./config.json', FALLBACK_CONFIG);
  const seed = await loadJson('./state/user_preferences.json', null);
  const stored = readStateFromStorage(config);
  const base = stored || seed || null;
  state = mergeLoadedState(config, base);
  const preferredLanguage = readLanguagePreference(config);
  const nextLanguage = normalizeLanguage(preferredLanguage || state.language || config.app.default_language || DEFAULT_LANGUAGE);
  if (state.language !== nextLanguage) {
    translateStateDefaults(state.language, nextLanguage);
    state.language = nextLanguage;
  }
  saveLanguagePreference(config, state.language);
  seedSource = stored ? 'browser' : (seed ? 'project' : 'default');

  dom.sidebar = document.getElementById('sidebar');
  dom.profileTabs = document.getElementById('profileTabs');
  dom.sidebarBody = document.getElementById('sidebarBody');
  dom.segmentEditorArea = document.getElementById('segmentEditorArea');
  dom.autoCalcSummary = document.getElementById('autoCalcSummary');
  dom.globalSettingsArea = document.getElementById('globalSettingsArea');
  dom.globalFields = null;
  dom.labelFields = null;
  dom.previewCanvas = document.getElementById('previewCanvas');
  dom.validation = document.getElementById('validation');
  dom.memoryStatus = null;
  dom.profileCountLabel = document.getElementById('profileCountLabel');
  dom.projectSeed = null;
  dom.logoChip = null;
  dom.meshChip = null;
  dom.polygonNameTop = document.getElementById('polygonNameTop');
  dom.templateNameTop = document.getElementById('templateNameTop');
  dom.downloadButtons = Array.from(document.querySelectorAll('[data-download]'));

  renderStaticChrome();
  renderShell(config);
  logoDataUrl = await loadLogo(config.paths.logo_path || FALLBACK_CONFIG.paths.logo_path);

  dom.polygonNameTop?.addEventListener('input', (event) => {
    state.polygonName = event.target.value;
    scheduleUpdate();
  });

  dom.templateNameTop?.addEventListener('change', (event) => {
    state.templateName = resolveTemplateName(event.target.value, config) || createDefaultState(config, getActiveLanguage()).templateName;
    scheduleUpdate();
  });

  document.getElementById('sidebarBody')?.addEventListener('input', handleInputEvent);
  document.getElementById('sidebarBody')?.addEventListener('change', handleInputEvent);
  document.addEventListener('click', handleClickEvent);

  const toggleGlobalBtn = document.getElementById('toggleGlobalSection');
  toggleGlobalBtn?.addEventListener('click', () => {
    const area = dom.globalSettingsArea;
    if (!area) return;
    const expanded = toggleGlobalBtn.getAttribute('aria-expanded') === 'true';
    toggleGlobalBtn.setAttribute('aria-expanded', String(!expanded));
    area.hidden = expanded;
    if (!expanded && !area.dataset.rendered) {
      area.dataset.rendered = '1';
      renderShell(config);
    }
  });

  dom.profileTabs?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const idx = target.getAttribute('data-profile-tab');
    if (idx === null) return;
    selectedProfileIndex = Number(idx);
    selectedSegmentKey = null;
    renderForms();
    scheduleUpdate();
  });

  dom.previewCanvas?.addEventListener('click', handleSVGClick);

  document.getElementById('languageSelect')?.addEventListener('change', (event) => {
    if (event.target instanceof HTMLSelectElement) setLanguage(event.target.value);
  });

  await updatePreview(true);
}

document.addEventListener('DOMContentLoaded', init);
