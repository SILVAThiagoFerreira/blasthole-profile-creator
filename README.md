# Blasthole Profile Creator

Site estático para construção de perfil de carga, pronto para GitHub Pages, com preview vetorial e exportação local.

## O que entrega

1. Interface web para montar perfis técnicos.
2. Preview vetorial em alta resolução no navegador.
3. Exportação em `SVG`, `PNG`, `JPG` e `PDF`.
4. Memória persistida no navegador, seed do projeto em `state/user_preferences.json` e logo substituível por upload.
5. Base pronta para hospedagem no GitHub Pages.

## Execução local

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Publicação no GitHub Pages

1. Faça `git push` do projeto.
2. Ative GitHub Pages usando a raiz do repositório.
3. Aponte para `index.html` na branch principal.

## Deploy online

Este formato funciona em GitHub Pages sem backend.

O app Python original continua no repositório como referência, mas o site principal agora é o `index.html`.

## Entradas

- Poligonal
- Perfis técnicos
- Observação final
- Imagem opcional da malha
- Template visual

## Saídas

- Preview em alta resolução
- Arquivos exportados em `output/`
- Manifesto de execução em `logs/`

## Estrutura

- `app.py`: versão Python legada
- `index.html`: entrada do site estático
- `app.js`: renderização vetorial, validação e exportação
- `styles.css`: interface e layout
- `src/`: orquestração, validação e configuração
- `generator/`: renderização e exportação
- `input/`: insumos operacionais
- `output/`: artefatos gerados
- `logs/`: rastreabilidade
- `state/`: preferências persistidas da última execução válida
- `tests/`: validação automática
