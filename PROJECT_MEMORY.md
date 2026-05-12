# Project Memory

## Comportamento Atual

- `app.py` continua como ponto único de entrada.
- `index.html` é o site principal para GitHub Pages.
- A interface estática usa SVG vetorial, exportação local e memória no navegador.
- O app suporta até 4 perfis na mesma lâmina.
- Com 4 perfis, a composição usa cards compactos em grade 2x2.
- A resolução de exportação usa 3840x2160 para manter nitidez.
- O logo principal vem de `VISUAL/Enaex Brasil.png`.
- As últimas preferências válidas ficam salvas em `state/user_preferences.json` e em `localStorage`.

## Regras Importantes

- Validar antes de processar.
- Manter configuração e limites fora da lógica.
- Preservar rastreabilidade por execução.
- Mudanças pequenas e auditáveis.
