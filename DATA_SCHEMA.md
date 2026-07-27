# DATA_SCHEMA

## config.json

- `app.title`: nome da aplicação
- `paths.*`: diretórios e recursos externos
- `layout.*`: parâmetros de renderização
- `export.*`: política de exportação
- `validation.*`: regras mínimas
- `defaults.*`: valores iniciais do formulário
- `templates.*`: paletas e presets visuais

## Perfil técnico

- `name`: texto
- `kind`: `produção`, `amortecimento`, `contorno` ou `personalizado`
- `diametro_furo`: número >= 0
- `altura_banco`: número >= 0
- `subperfuracao`: número >= 0
- `stemming`: número >= 0
- `air_deck`: número >= 0
- `blastbag`: número >= 0
- `inclinacao`: número >= 0
- `azimute`: número >= 0
- `densidade`: número >= 0
- `segments`: lista ordenada de trechos do furo (`stemming`, `column`, `cartridge`, `blastbag`, `airdeck`)
- `segments[].height`: altura do trecho em metros, número >= 0
- `segments[].has_booster`: booleano opcional para marcar reforçador no trecho de carga/cartucho
- `segments[].cartridge_count`: quantidade de cartuchos no mesmo intervalo quando `type = cartridge`; inteiro de 1 a 6

## Anexos opcionais do formulário

- `logo_bytes`: bytes de uma imagem legível para o logo da lâmina; aceitos `PNG`, `JPG`, `WEBP` e `SVG`
- `mesh_bytes`: bytes de uma imagem legível para a malha; aceitos `PNG`, `JPG`, `WEBP` e `SVG`
- Anexos inválidos devem falhar explicitamente na geração, sem fallback silencioso
