# Design Spec — Redesign Visual Clean White
**Data:** 2026-05-07
**Projeto:** Profile Creator — Enaex Brasil
**Status:** Aprovado pelo usuário

---

## Objetivo

Redesenhar o sistema de renderização de lâminas técnicas para atingir nível comercial/premium, mantendo estética clean com dominância do branco. O resultado deve servir tanto para apresentações executivas a clientes quanto para uso operacional por engenheiros de campo.

---

## 1. Paleta e Fundação Visual

| Token | Valor | Uso |
|---|---|---|
| `bg` | `#F0F2F5` | Fundo geral da lâmina |
| `panel_bg` | `#FFFFFF` | Fundo dos cards/painéis |
| `panel_alt` | `#F9FAFB` | Linhas alternadas na tabela de métricas |
| `panel_border` | removido | Substituído por sombra |
| `shadow` | `rgba(0,0,0,0.07)` com blur gaussiano real | Profundidade dos cards |
| `title` | `#111827` | Texto de título e valores |
| `text` | `#1F2937` | Texto de corpo |
| `muted` | `#6B7280` | Rótulos secundários, cabeçalhos de coluna |
| `accent_red` | `#D71920` | Stripe topo, nome poligonal, badge contorno |
| `accent_blue` | `#1D6FB8` | Perfil produção |
| `accent_orange` | `#F28C28` | Perfil amortecimento |

Borda dos cards eliminada. Sombra suave substitui outline — efeito mais moderno e arejado.

---

## 2. Header (redesenho completo)

**Antes:** fundo escuro `#2F3136` com blocos internos escuros.
**Depois:** fundo branco com stripe vermelha de 6px no topo.

### Estrutura do header (esquerda → direita):
- **Stripe vermelha**: 6px no topo, largura total
- **Logo Enaex**: direto no branco sem caixa de fundo; com mais respiro vertical
- **Bloco de título** (ao lado da logo):
  - "PERFIL DE CARGA" — fonte bold, `#111827`, tamanho grande
  - Nome da poligonal — vermelho `#D71920`, bold, tamanho médio-grande
  - "Lâmina técnica 16:9" — `#9CA3AF`, pequeno, discreto
- **Badge tipo** (direita): pílula vermelha com texto branco, mais padding, bordas mais arredondadas
- **Linha inferior**: `#E5E7EB`, 1px, delimita sem peso visual

### Diferença chave:
Header passa de "visual de software" para "visual de documento técnico premium".

---

## 3. Layout de Painéis

Estrutura geral mantida (mesh + perfis lado a lado), com estas mudanças:

- Cards sem borda `outline` — apenas sombra gaussiana (`blur=18px, offset=(0,4), color=rgba(0,0,0,0.07)`)
- `border-radius` aumentado para `32px` escalado — cantos mais suaves
- Gap entre cards reduzido: mais próximos, mais coesos

---

## 4. Card de Perfil — Nova Estrutura Interna

### 4.1 Cabeçalho do card
```
[  A  ]  PERFIL A                    PRODUÇÃO • 140 MM
          ─────────────────────────── (linha acento)
```
- Badge é a **letra** do perfil extraída do nome: busca a primeira letra maiúscula isolada no nome (ex: "Perfil A" → "A", "Perfil B" → "B"); se não encontrar, usa o primeiro caractere do nome
- Círculo do badge: fill `accent_color`, letra branca bold
- Nome em maiúsculas bold, acento
- Categoria + diâmetro em muted, menor

**Fix de bug:** hoje ambos os perfis mostram "1". Após o fix, cada perfil mostra sua letra identificadora.

### 4.2 Layout interno (duas zonas)
```
┌─ Cilindro (38% da largura) ─┬─ Parâmetros (62%) ─┐
│  Renderização 3D             │  Tabela de métricas  │
│  com labels laterais         │  9 linhas alternadas │
└─────────────────────────────┴──────────────────────┘
└─ Chips de resumo (largura total, fundo levemente colorido) ─┘
```

### 4.3 Tabela de métricas
- **9 linhas**: Diâmetro, Banco, Subperfuração, Tampão, Blastbag, Deck de Ar, Inclinação, Azimute, Densidade
- Linhas alternadas: branco / `#F9FAFB`
- Cada linha: ícone (26×26px) | rótulo uppercase muted | valor bold direita
- Novo ícone de densidade: gota `◈` desenhada com arcos PIL
- Padding vertical generoso: `10px` por linha

### 4.4 Chips de resumo (rodapé do card)
- Fundo `#F3F4F6`, bordas arredondadas, texto bold
- Exibem: Tampão | Carga | Subperfuração
- Se blastbag ou airdeck > 0: também exibidos
- Separador "|" em muted entre chips

---

## 5. Cilindro 3D — Técnica de Renderização

### Princípio
Renderização por **faixas verticais de pixel**: cada coluna do cilindro recebe luminosidade calculada por sua posição horizontal, simulando superfície cilíndrica iluminada da esquerda.

### Curva de luminosidade
```
Posição (0=esquerda, 1=direita):  0.0  0.15  0.30  0.60  1.0
Luminosidade adicional:           +20% +35%  +15%   0%  -20%
```
- Pico de highlight em `t=0.15` (15% da largura a partir da esquerda)
- Queda gradual para sombra na borda direita

### Por segmento
| Segmento | Cor base | Comportamento |
|---|---|---|
| `stemming` | `#C8CDD5` | Gradiente 3D standard |
| `blastbag` | `#1F2937` | Highlight muito sutil (material escuro) |
| `airdeck` | `#FFFFFF` | Hachura diagonal fina na cor do acento; sem gradiente |
| `column` | `accent_color` | Gradiente 3D intenso — elemento principal |
| `subdrill` | `#4B5563` | Gradiente 3D escuro |

### Extremidades
- **Boca (topo)**: elipse fill `#E9EEF4` com outline escuro — superfície de corte
- **Fundo**: elipse fill `#374151` com outline — profundidade
- **Contorno externo**: linha dupla suave (2px outline + 1px highlight interno)

### Labels laterais
- Cada segmento > 0 recebe label à direita com seta indicadora e linha tracejada
- Texto: valor em metros, fonte pequena bold, cor muted

---

## 6. Painel de Malha

Mantém estrutura atual com ajustes:
- Sem borda de outline — sombra como os demais cards
- Área de upload redesenhada: borda tracejada 2px `#D1D5DB` em vez de caixa sólida
- Ícone de upload mais refinado (círculo outline + cruz)
- Texto de instrução mais generoso em espaçamento

---

## 7. Footer

- Linha separadora `#E5E7EB` 1px (mais sutil que hoje)
- Legenda das cores: bullets coloridos arredondados + texto muted
- Observação: tipografia ligeiramente maior para campo (`16px` → `18px` scaled)

---

## 8. Fontes

**Ordem de preferência (Windows):**
1. `Montserrat` — fonte geométrica premium, instalada no sistema (`C:\Windows\Fonts\Montserrat-*.ttf`)
2. `Calibri` — fallback elegante
3. `Arial` — fallback final

Mapeamento de pesos Montserrat:
- Títulos / valores: `Montserrat-Bold.ttf`
- Rótulos de tabela: `Montserrat-SemiBold.ttf`
- Texto normal / muted: `Montserrat-Regular.ttf`

---

## 9. Arquivos a Modificar

| Arquivo | Mudança |
|---|---|
| `generator/layout.py` | Header branco, sombra gaussiana, footer refinado, paleta |
| `generator/profile.py` | Badge letra, tabela alternada, chips, cilindro 3D |
| `generator/mesh.py` | Upload area tracejada, sombra |
| `config.json` | Templates atualizados com nova paleta (bg, shadow, panel_border removido) |

Nenhum arquivo novo criado. Nenhuma interface do `src/` alterada.

---

## 10. Critérios de Sucesso

- [ ] Header é branco — não tem fundo escuro
- [ ] Cards não têm borda outline visível — sombra suave faz a delimitação
- [ ] Cilindro tem gradiente lateral visível (highlight + sombra)
- [ ] Badge mostra letra (A/B/C) correta para cada perfil
- [ ] Tabela de métricas tem linhas alternadas legíveis
- [ ] Densidade tem ícone próprio (não fallback retângulo)
- [ ] Output 3840×2160 mantido (scale 2 no config)
- [ ] Exportação JPG/PNG/PDF continua funcionando
