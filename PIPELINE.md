# PIPELINE

1. Carregar `config.json`.
2. Ler defaults e parâmetros do usuário.
3. Ler e normalizar os anexos opcionais de logo e malha.
4. Validar poligonal, perfis, limites e imagens anexadas.
5. Normalizar dados para os modelos internos.
6. Renderizar a imagem principal.
7. Exportar artefatos.
8. Escrever manifesto em `logs/`.
