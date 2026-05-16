# Aula Angular CRUD

Projeto didático para uma aula curta de CRUD com Angular 21, Reactive Forms e uma API fake com `json-server`.

## O que o projeto faz

A aplicação é um gerenciador simples de produtos com:

- listagem de produtos;
- cadastro de novo produto;
- edição de produto existente;
- exclusão de produto;
- validação básica de formulário.

## Pré-requisitos

- Node.js `20.19+`, `22.12+` ou `24+`
- npm
- Angular CLI

Para conferir as versões:

```bash
node --version
npm --version
ng version
```

Caso precise instalar o Angular CLI:

```bash
npm install -g @angular/cli
```

## Como rodar

Instale as dependências:

```bash
npm install
```

Rode o Angular e a API fake ao mesmo tempo:

```bash
npm run start:all
```

Depois acesse:

- Aplicacao Angular: `http://localhost:4200`
- API fake: `http://localhost:3000/produtos`

## Scripts principais

```bash
npm start          # roda apenas o Angular
npm run api        # roda apenas o json-server
npm run start:all  # roda Angular e API juntos
npm run build      # gera o build de produção
```

## Estrutura principal

```text
src/app/
├── models/
│   └── produto.model.ts
├── services/
│   └── produto.service.ts
├── components/
│   ├── navbar/
│   ├── produto-list/
│   └── produto-form/
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.ts

db.json
```

## Material da aula

O roteiro completo está em:

```text
docs/aula-angular-crud.md
```

## Observação para a aula

Este projeto usa componentes standalone e a sintaxe moderna de templates do Angular, como `@if` e `@for`.
