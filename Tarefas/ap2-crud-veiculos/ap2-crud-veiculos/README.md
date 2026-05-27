# AP2 - Aplicações Front-End

## Identificação

Nome: Leonardo Gonçalves Wust
Curso: Análise e Desenvolvimento de Sistemas
Disciplina: Aplicações Front-End
Instituição: ULBRA

## Tema do projeto

CRUD de Veículos com Angular e JSON Server.

## Descrição

Aplicação desenvolvida em Angular para cadastro, listagem, edição e exclusão de veículos, utilizando JSON Server como API simulada. A interface permite gerenciar um catálogo de veículos com informações de marca, modelo, ano, cor, placa, preço e disponibilidade.

## Tecnologias utilizadas

- Angular 19
- TypeScript
- HTML5
- CSS3
- JSON Server
- Git e GitHub

## Entidade: Veículo

```typescript
export interface Veiculo {
  id?: number | string;
  marca: string;      // Ex: Toyota, Honda
  modelo: string;     // Ex: Corolla, Civic
  ano: number;        // Ex: 2023
  cor: string;        // Ex: Prata, Preto
  placa: string;      // Ex: ABC-1234
  preco: number;      // Ex: 85000
  disponivel: boolean; // true = disponível para venda
}
```

## Estrutura do projeto

```
src/app/
  components/
    navbar/           → Cabeçalho da aplicação
    veiculo-form/     → Formulário de cadastro e edição
    veiculo-list/     → Listagem com ações de editar e excluir
  models/
    veiculo.ts        → Interface TypeScript da entidade
  services/
    veiculo.service.ts → Comunicação com a API (JSON Server)
  app.ts              → Componente raiz
  app.config.ts       → Configuração do HttpClient
db.json               → Banco de dados fake (JSON Server)
```

## Como executar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/usuario/ap2-crud-veiculos.git
```

2. Acesse a pasta do projeto:

```bash
cd ap2-crud-veiculos
```

3. Instale as dependências:

```bash
npm install
```

4. Execute a API fake (JSON Server) — em um terminal:

```bash
npm run api
```

A API ficará disponível em: `http://localhost:3000/veiculos`

5. Em outro terminal, execute o Angular:

```bash
npm start
```

6. Acesse no navegador:

```
http://localhost:4200
```

> **Dica:** Para rodar ambos com um único comando:
> ```bash
> npm run start:all
> ```

## Link do vídeo demonstrativo

https://drive.google.com/file/d/1WLcykoprVaS7Q2eDSLV0M8fN5i-UpWFE/view?usp=sharing

## Funcionalidades

- ✅ Cadastro de veículos com validação de campos
- ✅ Listagem de todos os veículos cadastrados
- ✅ Edição de veículos existentes (formulário pré-preenchido)
- ✅ Exclusão com confirmação antes de remover
- ✅ Integração com JSON Server (API REST simulada)
- ✅ Indicador de carregamento (spinner)
- ✅ Mensagem quando não há veículos cadastrados
- ✅ Feedback visual de sucesso e erro nas operações
- ✅ Layout responsivo
- ✅ Formatação de preço em Real (R$)
- ✅ Badge visual de status (Disponível / Vendido)
