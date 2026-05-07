# AGENTS

- Use `app.py` como único ponto de entrada.
- Valide antes de processar qualquer dado.
- Mantenha configuração, caminhos e limites fora da lógica.
- Preserve rastreabilidade com manifesto por execução.
- Separe leitura, validação, processamento e saída.
- Não introduza lógica monolítica em `app.py`.
- Não remova arquivos existentes sem necessidade explícita.
- Prefira mudanças pequenas, auditáveis e reversíveis.
