# SPEC

## Objetivo

Gerar uma lâmina técnica 16:9 a partir de parâmetros operacionais e visuais, com saída reproduzível e auditável.

## Entradas

- Configuração externa (`config.json`)
- Nome da poligonal
- Tipo de perfil
- Template visual
- Observação final
- Perfis técnicos
- Logo da lâmina opcional
- Imagem opcional da malha

## Regras

- Nada é processado sem validação prévia.
- O número de perfis deve respeitar `min_profiles` e `max_profiles`.
- Campos numéricos não podem ser negativos.
- Campos textuais obrigatórios não podem ser vazios.
- Os anexos opcionais de logo e malha devem ser imagens legíveis; `PNG`, `JPG`, `WEBP` e `SVG` são aceitos.
- Arquivos de imagem inválidos interrompem a geração com erro explícito.
- O resultado deve ser identificável por manifesto.

## Saídas

- Imagem renderizada em alta resolução
- Exportações em `PNG`, `JPG` e `PDF`
- Manifesto de execução em `logs/`
