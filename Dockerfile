# Imagem oficial do OWASP Juice Shop, com a VERSÃO FIXADA (e não "latest").
# Motivo: com "latest", cada deploy podia baixar uma versão nova (até instável/SNAPSHOT)
# e quebrar os testes sem nenhuma mudança no nosso código.
# Para atualizar: trocar o número numa branch própria, rodar os testes e só então fazer o merge.
FROM bkimminich/juice-shop:v20.2.0

# Porta em que o Juice Shop atende dentro do container
EXPOSE 3000