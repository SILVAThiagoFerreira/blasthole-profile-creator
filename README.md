# Enaex Profile Creator

Sistema local em Python para compor lâminas técnicas 16:9 com base em perfis de perfuração e referência visual Enaex.

## Fluxo

1. Lê parâmetros em `config.json`.
2. Valida entradas e limites.
3. Processa a composição visual.
4. Exporta `PNG`, `JPG` e `PDF`.
5. Registra um manifesto em `logs/`.

## Execução

```bash
streamlit run app.py
```

## Entradas

- Poligonal
- Perfis técnicos
- Observação final
- Imagem opcional da malha
- Configuração externa em `config.json`

## Saídas

- Imagem em alta resolução
- Arquivos exportados em `output/`
- Manifesto de execução em `logs/`

## Estrutura

- `app.py`: ponto único de execução
- `src/`: orquestração, validação e configuração
- `generator/`: renderização e exportação
- `input/`: insumos operacionais
- `output/`: artefatos gerados
- `logs/`: rastreabilidade
- `tests/`: validação automática
