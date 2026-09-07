# Projeto de Automação de Testes de API - QA Portfolio

Este repositório demonstra a implementação de um pipeline completo de **Continuous Integration (CI)** e **Testes Automatizados de API** utilizando **Newman**, **Postman** e **GitHub Actions**, tendo como aplicação alvo a **OWASP Juice Shop**.

O objetivo deste projeto foi estruturar um ambiente de testes automatizados ponta a ponta, simulando um cenário real de entrega contínua onde testes de API são executados automaticamente a cada alteração no código.

---

## 🚀 Tecnologias e Ferramentas Utilizadas

* **Linguagem/Plataforma:** Node.js
* **Testes de API:** Postman & Newman (CLI)
* **Containerização:** Docker (para subida isolada da aplicação alvo)
* **CI/CD:** GitHub Actions (Automação de pipelines)
* **Versionamento:** Git e GitHub

---

## 🛠️ O Desafio e a Solução

Durante a configuração do pipeline, enfrentei e resolvi um desafio comum em ambientes de CI/CD: **garantir que a aplicação estivesse disponível antes da execução dos testes**. 

* **Problema inicial:** O Newman executava os testes, mas a API falhava por erro de conexão (`ECONNREFUSED 127.0.0.1:3000`) porque o servidor não estava rodando no container efêmero do GitHub Actions.
* **Solução aplicada:** Configurei o workflow para subir a imagem oficial da Juice Shop via **Docker** em segundo plano, adicionei um tempo de espera estratégico (`sleep`) para estabilização da porta e, em seguida, executei a suíte de testes do Newman com sucesso total.

---

## ⚙️ Como o Pipeline Funciona

O fluxo automatizado configurado no GitHub Actions (`.github/workflows/postman-test.yml`) executa os seguintes passos a cada `git push` na branch `main`:
1. Faz o checkout do código do repositório.
2. Configura o ambiente Node.js.
3. Inicia o container Docker da aplicação na porta `3000`.
4. Aguarda a inicialização completa do servidor.
5. Instala o Newman globalmente e executa a collection de testes automatizados.

---

## 💡 Sobre Mim

Sou um profissional focado em **Qualidade de Software (QA)**, apaixonado por automação, melhoria contínua e resolução de problemas técnicos. Este projeto reflete minha capacidade de estruturar processos de testes automatizados integrados a pipelines modernos de desenvolvimento.

📫 **Contato:**
* [Seu LinkedIn]
* [Seu E-mail]
