# Aula Prática: CRUD com Angular 21 + Fake API

## Professor: Lucas Fogaça
## Duração: 60 minutos
## Público: Iniciantes em Angular

---

## Sumário

1. [O que vamos construir](#1-o-que-vamos-construir)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Conceitos iniciais (5 min)](#3-conceitos-iniciais)
4. [Estrutura do projeto (5 min)](#4-estrutura-do-projeto)
5. [O Modelo — Produto (5 min)](#5-o-modelo--produto)
6. [A Fake API — json-server (5 min)](#6-a-fake-api--json-server)
7. [O Service — ProdutoService (10 min)](#7-o-service--produtoservice)
8. [O Componente de Listagem (10 min)](#8-o-componente-de-listagem)
9. [O Componente de Formulário (10 min)](#9-o-componente-de-formulário)
10. [Rotas e Navegação (5 min)](#10-rotas-e-navegação)
11. [Testando o CRUD completo (5 min)](#11-testando-o-crud-completo)
12. [Resumo e exercícios](#12-resumo-e-exercícios)

---

## 1. O que vamos construir

Um **Gerenciador de Produtos** com as 4 operações de um CRUD:

| Operação | Ação | Método HTTP |
|----------|------|-------------|
| **C**reate | Criar um novo produto | POST |
| **R**ead | Listar todos os produtos | GET |
| **U**pdate | Editar um produto existente | PUT |
| **D**elete | Excluir um produto | DELETE |

### Tela final que teremos:

```
┌─────────────────────────────────────────────────┐
│  📦 Gerenciador de Produtos                     │
│  [Listar Produtos]  [+ Novo Produto]            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───┬──────────┬──────────────┬────────┬──────┐│
│  │ID │ Nome     │ Descrição    │ Preço  │Ações ││
│  ├───┼──────────┼──────────────┼────────┼──────┤│
│  │ 1 │ Notebook │ Dell 15...   │R$3.500 │✏️ 🗑️ ││
│  │ 2 │ Mouse    │ Logitech...  │R$  450 │✏️ 🗑️ ││
│  │ 3 │ Teclado  │ Mecânico...  │R$  380 │✏️ 🗑️ ││
│  └───┴──────────┴──────────────┴────────┴──────┘│
└─────────────────────────────────────────────────┘
```

---

## 2. Pré-requisitos

Antes de começar, garanta que tem instalado:

- **Node.js** (versão 20.19+, 22.12+ ou 24+) — baixe em https://nodejs.org
- **Angular CLI** — instale com:
  ```bash
  npm install -g @angular/cli
  ```
- **Editor de código** — recomendamos o VS Code

Para verificar se está tudo OK:
```bash
node --version    # deve mostrar v20.19+, v22.12+ ou v24+
ng version        # deve mostrar Angular CLI
```

---

## 3. Conceitos Iniciais (5 min)

Antes de colocar a mão na massa, vamos entender **o que é Angular**:

### O que é Angular?

Angular é um **framework** (conjunto de ferramentas) do Google para construir **aplicações web** (sites interativos). Pense nele como uma caixa de ferramentas completa para construir sites modernos.

### Conceitos-chave que usaremos hoje:

| Conceito | O que é | Analogia |
|----------|---------|----------|
| **Componente** | Um pedaço da tela (HTML + CSS + TS) | Um bloco de Lego |
| **Service** | Código que busca dados (conversa com a API) | O garçom do restaurante |
| **Rota** | Define qual componente mostra em cada URL | O índice do livro |
| **Modelo** | A "forma" dos nossos dados (interface) | Uma ficha de cadastro |
| **Formulário** | Captura dados digitados pelo usuário | Um formulário de papel |

### Como o Angular se comunica com a API:

```
┌──────────┐    HTTP GET/POST/PUT/DELETE    ┌──────────┐
│  Angular  │  ◄─────────────────────────►  │  API     │
│ (Frontend)│     (via HttpClient)          │(Backend) │
└──────────┘                                └──────────┘
    Navegador                                 Servidor
```

O **Service** faz o papel de "garçom": o componente pede os dados pro service, e o service vai buscar na API.

---

## 4. Estrutura do Projeto (5 min)

### Criando o projeto

```bash
ng new aula-angular-crud --standalone --style=css --routing --skip-tests
cd aula-angular-crud
```

Explicando cada flag:
- `--standalone`: Usa componentes independentes (não precisa de módulos) — padrão do Angular moderno
- `--style=css`: Usa CSS puro para estilos
- `--routing`: Já cria o sistema de rotas
- `--skip-tests`: Não cria arquivos de teste (para simplificar a aula)

### Estrutura de pastas que criaremos:

```
src/app/
├── models/
│   └── produto.model.ts       ← A "ficha" do produto
├── services/
│   └── produto.service.ts     ← O "garçom" que busca dados
├── components/
│   ├── navbar/                ← Barra de navegação
│   │   ├── navbar.ts
│   │   ├── navbar.html
│   │   └── navbar.css
│   ├── produto-list/          ← Tela de listagem
│   │   ├── produto-list.ts
│   │   ├── produto-list.html
│   │   └── produto-list.css
│   └── produto-form/          ← Tela de cadastro/edição
│       ├── produto-form.ts
│       ├── produto-form.html
│       └── produto-form.css
├── app.ts                     ← Componente principal (raiz)
├── app.html                   ← Template principal
├── app.css                    ← Estilo principal
├── app.routes.ts              ← Definição de rotas
└── app.config.ts              ← Configuração do app
db.json                        ← Banco de dados fake (JSON Server)
```

---

## 5. O Modelo — Produto (5 min)

> 🎯 **Objetivo**: Definir **qual é a "forma"** dos nossos dados.

Arquivo: `src/app/models/produto.model.ts`

```typescript
export interface Produto {
  id?: number;       // Opcional: a API gera automaticamente
  nome: string;      // Nome do produto — obrigatório
  descricao: string; // Descrição detalhada — obrigatório
  preco: number;     // Preço em reais — obrigatório
}
```

### Explicação linha a linha:

```typescript
export interface Produto {
```
- `export`: Permite que **outros arquivos** usem este modelo
- `interface`: Define um **contrato** — diz "qual é a forma dos dados". Não é código que roda, é **documentação** para o TypeScript saber o que esperar
- `Produto`: Nome do nosso modelo. Começa com maiúscula por convenção

```typescript
  id?: number;
```
- `id?`: O `?` significa que é **opcional**. Quando **criamos** um produto novo, não temos o ID ainda (a API gera). Quando **recebemos** da API, o ID vem preenchido
- `number`: É um número inteiro

```typescript
  nome: string;
  descricao: string;
  preco: number;
```
- Campos **obrigatórios** (sem `?`)
- `string`: Texto (palavras, frases)
- `number`: Número (para fazer cálculos)

**Analogia**: A interface é como uma **ficha de cadastro** em branco. Ela diz quais campos existem e que tipo de informação vai em cada um.

---

## 6. A Fake API — json-server (5 min)

> 🎯 **Objetivo**: Ter uma API rodando localmente sem precisar programar backend.

Arquivo: `db.json` (na raiz do projeto)

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Notebook Dell",
      "descricao": "Notebook Dell Inspiron 15, 8GB RAM, 256GB SSD",
      "preco": 3500.00
    },
    {
      "id": 2,
      "nome": "Mouse Logitech",
      "descricao": "Mouse sem fio Logitech MX Master 3",
      "preco": 450.00
    },
    {
      "id": 3,
      "nome": "Teclado Mecânico",
      "descricao": "Teclado mecânico RGB HyperX Alloy",
      "preco": 380.00
    }
  ]
}
```

### O que é o json-server?

O **json-server** é uma ferramenta que transforma um arquivo JSON em uma API REST completa, automaticamente! Ele gera:

| URL | Método | O que faz |
|-----|--------|-----------|
| `GET /produtos` | GET | Lista todos os produtos |
| `GET /produtos/1` | GET | Busca produto com ID 1 |
| `POST /produtos` | POST | Cria um novo produto |
| `PUT /produtos/1` | PUT | Atualiza o produto com ID 1 |
| `DELETE /produtos/1` | DELETE | Exclui o produto com ID 1 |

### Instalação:

```bash
npm install json-server@0.17.4
```

### Scripts no `package.json`:

```json
{
  "scripts": {
    "start": "ng serve",
    "api": "json-server --watch db.json --port 3000",
    "start:all": "concurrently \"npm start\" \"npm run api\""
  }
}
```

- `npm start`: Roda só o Angular (porta 4200)
- `npm run api`: Roda só a API (porta 3000)
- `npm run start:all`: Roda **os dois ao mesmo tempo** — é o que usaremos na aula!

Para rodar o projeto completo:
```bash
npm run start:all
```

> **Importante**: O Angular roda em `http://localhost:4200` e a API em `http://localhost:3000`. São dois servidores diferentes!

---

## 7. O Service — ProdutoService (10 min)

> 🎯 **Objetivo**: Criar o "garçom" que busca e envia dados para a API.

Arquivo: `src/app/services/produto.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Explicação linha a linha:

#### Imports (linhas 1-4)

```typescript
import { Injectable } from '@angular/core';
```
- `Injectable`: Decorador que diz "esta classe pode ser **injetada** em outras classes". É o que permite o Angular fornecer o service automaticamente

```typescript
import { HttpClient } from '@angular/common/http';
```
- `HttpClient`: Classe do Angular que faz **requisições HTTP** (GET, POST, PUT, DELETE). É o nosso "telefone" para falar com a API

```typescript
import { Observable } from 'rxjs';
```
- `Observable`: Tipo do RxJS que representa um **valor que chega no futuro**. Quando pedimos dados pra API, não recebemos na hora — recebemos quando o servidor responder. O Observable avisa quando os dados chegarem

```typescript
import { Produto } from '../models/produto.model';
```
- Importa nosso modelo de Produto para usar como tipo

#### Decorador @Injectable (linhas 6-8)

```typescript
@Injectable({
  providedIn: 'root'
})
```
- `@Injectable`: Marca a classe como um **service** injetável
- `providedIn: 'root'`: O Angular cria **uma única instância** dessa classe para toda a aplicação (padrão Singleton). Economiza memória!

#### Classe e Construtor (linhas 9-11)

```typescript
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';
```
- `private apiUrl`: Endereço base da nossa API. Usamos `private` para indicar que é **interno** da classe

```typescript
  constructor(private http: HttpClient) {}
```
- **Injeção de dependência**: O Angular **automaticamente** cria o HttpClient e entrega aqui. Não precisamos fazer `new HttpClient()` — o Angular cuida disso!

#### Método listar — READ (linhas 13-15)

```typescript
  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }
```
- `listar()`: Nome do método
- `: Observable<Produto[]>`: Retorna um Observable que vai emitir um **array** (lista) de Produtos
- `this.http.get<Produto[]>(this.apiUrl)`: Faz um GET para `http://localhost:3000/produtos`
- O `<Produto[]>` é um **generic** — diz ao TypeScript "a resposta será uma lista de Produtos"

#### Método buscarPorId — READ por ID (linhas 17-19)

```typescript
  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }
```
- Igual ao `listar`, mas busca **um único** produto pelo ID
- `${this.apiUrl}/${id}` vira, por exemplo, `http://localhost:3000/produtos/1`
- Usa **template literal** (crase + `${}`) para concatenar a URL com o ID

#### Método criar — CREATE (linhas 21-23)

```typescript
  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }
```
- `this.http.post()`: Faz um POST — **cria** um novo recurso na API
- O segundo argumento `produto` é o **corpo** da requisição (os dados do produto)
- A API responde com o produto criado (agora com ID gerado)

#### Método atualizar — UPDATE (linhas 25-27)

```typescript
  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }
```
- `this.http.put()`: Faz um PUT — **substitui** todos os dados do produto com esse ID
- A URL inclui o ID para a API saber **qual** produto atualizar

#### Método excluir — DELETE (linhas 29-31)

```typescript
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
```
- `this.http.delete()`: Faz um DELETE — **remove** o produto
- `Observable<void>`: A API não retorna dados, apenas confirma que excluiu

---

## 8. O Componente de Listagem (10 min)

> 🎯 **Objetivo**: Criar a tela principal que mostra todos os produtos em uma tabela.

### TypeScript: `src/app/components/produto-list/produto-list.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css'
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  carregando = false;
  erro = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: (e) => {
        this.erro = 'Erro ao carregar produtos. Verifique se a API está rodando.';
        this.carregando = false;
        console.error(e);
      }
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluir(id).subscribe({
        next: () => this.carregarProdutos(),
        error: (e) => {
          this.erro = 'Erro ao excluir produto.';
          console.error(e);
        }
      });
    }
  }
}
```

### Explicação linha a linha:

#### Imports (linhas 1-5)

```typescript
import { Component, OnInit } from '@angular/core';
```
- `Component`: Decorador que marca a classe como componente
- `OnInit`: Interface com método `ngOnInit()` que roda quando o componente é inicializado

```typescript
import { RouterLink } from '@angular/router';
```
- `RouterLink`: Permite usar `routerLink` no HTML para navegar sem recarregar a página

```typescript
import { CurrencyPipe } from '@angular/common';
```
- `CurrencyPipe`: Transforma número em formato de moeda (ex: 3500 → R$ 3.500,00)

#### Decorador @Component (linhas 7-13)

```typescript
@Component({
  selector: 'app-produto-list',    // Tag HTML: <app-produto-list>
  standalone: true,                 // Componente independente
  imports: [RouterLink, CurrencyPipe], // Dependências do template
  templateUrl: './produto-list.html',  // Arquivo HTML
  styleUrl: './produto-list.css'       // Arquivo CSS
})
```
- `selector`: Nome da tag HTML que representa este componente
- `standalone: true`: Não precisa ser declarado em um módulo (Angular moderno)
- `imports`: Outros componentes/diretivas que o template precisa
- `templateUrl`: Arquivo HTML separado (poderia ser `template: '...'` inline)

#### Propriedades (linhas 14-17)

```typescript
  produtos: Produto[] = [];    // Lista de produtos (começa vazia)
  carregando = false;           // Estado de loading
  erro = '';                    // Mensagem de erro (vazio = sem erro)
```

#### Construtor (linha 19)

```typescript
  constructor(private produtoService: ProdutoService) {}
```
- **Injeção de dependência**: O Angular entrega automaticamente o `ProdutoService`
- `private`: Cria uma propriedade com o mesmo nome acessível na classe

#### ngOnInit — Ciclo de vida (linhas 21-23)

```typescript
  ngOnInit(): void {
    this.carregarProdutos();
  }
```
- `ngOnInit()`: Método do Angular que roda **automaticamente** quando o componente aparece na tela
- É o lugar certo para **buscar dados iniciais**

#### carregarProdutos — Busca dados (linhas 25-38)

```typescript
  carregarProdutos(): void {
    this.carregando = true;   // Mostra "carregando..."
    this.erro = '';           // Limpa erro anterior
    this.produtoService.listar().subscribe({
```
- `.subscribe()`: "Inscreve-se" no Observable — começa a escutar os dados
- Sem `subscribe()`, a requisição **não acontece**! O Observable é "preguiçoso"

```typescript
      next: (dados) => {        // Quando dados chegam (sucesso)
        this.produtos = dados;  // Guarda na lista
        this.carregando = false; // Esconde "carregando"
      },
      error: (e) => {            // Quando dá erro
        this.erro = 'Erro ao carregar...';
        this.carregando = false;
        console.error(e);        // Loga erro no console
      }
```
- `next`: Função que roda quando os dados chegam com sucesso
- `error`: Função que roda quando algo dá errado

#### excluir — Deleta produto (linhas 40-50)

```typescript
  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
```
- `confirm()`: Mostra janela de confirmação do navegador (OK / Cancelar)

```typescript
      this.produtoService.excluir(id).subscribe({
        next: () => this.carregarProdutos(),
```
- Depois de excluir, **recarrega a lista** para mostrar a tabela atualizada

### Template HTML: `src/app/components/produto-list/produto-list.html`

```html
<div class="container">
  @if (erro) {
    <div class="alert alert-error">
      {{ erro }}
    </div>
  }

  @if (carregando) {
    <div class="loading">
      <div class="spinner"></div>
      <p>Carregando produtos...</p>
    </div>
  }

  @if (!carregando && produtos.length === 0 && !erro) {
    <div class="empty-state">
      <p>Nenhum produto cadastrado.</p>
      <a routerLink="/novo" class="btn btn-primary">Cadastrar primeiro produto</a>
    </div>
  }

  @if (!carregando && produtos.length > 0) {
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          @for (produto of produtos; track produto.id) {
            <tr>
              <td>{{ produto.id }}</td>
              <td><strong>{{ produto.nome }}</strong></td>
              <td>{{ produto.descricao }}</td>
              <td class="preco">{{ produto.preco | currency:'BRL' }}</td>
              <td class="acoes">
                <a [routerLink]="['/editar', produto.id]" class="btn btn-sm btn-warning">
                  ✏️ Editar
                </a>
                <button (click)="excluir(produto.id!)" class="btn btn-sm btn-danger">
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</div>
```

### Explicação do template linha a linha:

#### Controle de fluxo @if (novo no Angular 17+)

```html
@if (erro) {
  <div class="alert alert-error">{{ erro }}</div>
}
```
- `@if (condição) { ... }`: Mostra o HTML **só se** a condição for verdadeira
- Substitui o antigo `*ngIf` — agora é sintaxe nativa do Angular!

#### Loading e estado vazio

```html
@if (carregando) { ... }           <!-- Mostra spinner -->
@if (!carregando && produtos.length === 0 && !erro) { ... }  <!-- Lista vazia -->
@if (!carregando && produtos.length > 0) { ... }   <!-- Tabela com dados -->
```
- Três estados mutuamente exclusivos: carregando / vazio / com dados
- As condições garantem que **só um** aparece por vez

#### Loop @for (novo no Angular 17+)

```html
@for (produto of produtos; track produto.id) {
  <tr>
    <td>{{ produto.id }}</td>
    ...
  </tr>
}
```
- `@for (item of lista; track id)`: Repete o HTML para cada item da lista
- `track produto.id`: Diz ao Angular como identificar cada item (necessário para performance)
- Substitui o antigo `*ngFor`

#### Interpolação e pipe

```html
<td>{{ produto.nome }}</td>
<td>{{ produto.preco | currency:'BRL' }}</td>
```
- `{{ expressão }}`: **Interpolação** — mostra o valor da variável no HTML
- `| currency:'BRL'`: **Pipe** — transforma o valor. O currency pipe formata como moeda

#### Binding de evento

```html
<button (click)="excluir(produto.id!)">🗑️ Excluir</button>
```
- `(click)`: **Event binding** — quando o botão for clicado, chama o método `excluir()`
- `produto.id!`: O `!` diz ao TypeScript "confia, esse valor não é undefined"

#### Navegação

```html
<a [routerLink]="['/editar', produto.id]">✏️ Editar</a>
```
- `[routerLink]`: **Property binding** — navega para a rota `/editar/1` (ou outro ID)
- Usa colchetes `[]` para fazer binding dinâmico (com variável)

---

## 9. O Componente de Formulário (10 min)

> 🎯 **Objetivo**: Criar a tela de cadastro e edição de produtos usando **Reactive Forms**.

### TypeScript: `src/app/components/produto-form/produto-form.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css'
})
export class ProdutoFormComponent implements OnInit {
  form!: FormGroup;
  editando = false;
  produtoId?: number;
  carregando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    this.produtoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.produtoId) {
      this.editando = true;
      this.carregarProduto(this.produtoId);
    }
  }

  criarFormulario(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      preco: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  carregarProduto(id: number): void {
    this.carregando = true;
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.form.patchValue(produto);
        this.carregando = false;
      },
      error: (e) => {
        this.erro = 'Produto não encontrado.';
        this.carregando = false;
        console.error(e);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const produto: Produto = this.form.value;
    this.carregando = true;

    const requisicao = this.editando
      ? this.produtoService.atualizar(this.produtoId!, produto)
      : this.produtoService.criar(produto);

    requisicao.subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.erro = 'Erro ao salvar produto.';
        this.carregando = false;
        console.error(e);
      }
    });
  }
}
```

### Explicação linha a linha:

#### Imports de formulário

```typescript
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
```
- `FormBuilder`: Classe auxiliar que **simplifica a criação** de formulários
- `FormGroup`: Representa o **formulário inteiro** (conjunto de campos)
- `ReactiveFormsModule`: Módulo necessário para reactive forms funcionarem
- `Validators`: Funções de **validação** (required, minLength, etc.)

#### Imports de roteamento

```typescript
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
```
- `Router`: Permite **navegar** via código (ex: `this.router.navigate(['/'])`)
- `ActivatedRoute`: Dá acesso aos **parâmetros da URL** (ex: `/editar/3` → pega o `3`)
- `RouterLink`: Permite usar `routerLink` no HTML

#### Propriedades

```typescript
  form!: FormGroup;     // O formulário (o ! diz: "será inicializado no ngOnInit")
  editando = false;     // true = modo edição, false = modo criação
  produtoId?: number;   // ID do produto (só existe se editando)
  carregando = false;   // Mostra spinner
  erro = '';            // Mensagem de erro
```

#### Injeção no construtor

```typescript
  constructor(
    private fb: FormBuilder,           // Construtor de formulários
    private produtoService: ProdutoService, // Nosso service
    private router: Router,            // Para navegar programaticamente
    private route: ActivatedRoute       // Para ler parâmetros da URL
  ) {}
```
- Quatro dependências injetadas automaticamente pelo Angular

#### ngOnInit

```typescript
  ngOnInit(): void {
    this.criarFormulario();  // Cria o formulário vazio

    // Tenta pegar o ID da URL
    this.produtoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.produtoId) {            // Se tem ID na URL → modo edição
      this.editando = true;
      this.carregarProduto(this.produtoId);
    }
  }
```
- `this.route.snapshot.paramMap.get('id')`: Pega o `:id` da URL `/editar/:id`
- Se a URL é `/novo`, não tem `id` → modo criação
- Se a URL é `/editar/3`, `id = 3` → modo edição

#### criarFormulario

```typescript
  criarFormulario(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      preco: ['', [Validators.required, Validators.min(0.01)]]
    });
  }
```
- `this.fb.group({...})`: Cria um grupo de campos
- Cada campo: `nomeCampo: [valorInicial, [validadores]]`
- `Validators.required`: Campo **obrigatório**
- `Validators.minLength(3)`: Mínimo de **3 caracteres**
- `Validators.min(0.01)`: Valor mínimo de **0.01** (não pode ser zero ou negativo)

#### carregarProduto (edição)

```typescript
  carregarProduto(id: number): void {
    this.carregando = true;
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.form.patchValue(produto);  // Preenche o formulário com dados
        this.carregando = false;
      },
```
- `patchValue()`: **Preenche** os campos do formulário com os dados do produto. É como preencher automaticamente os campos para o usuário editar

#### salvar

```typescript
  salvar(): void {
    if (this.form.invalid) {           // Se formulário tem erros
      this.form.markAllAsTouched();    // Marca todos como "tocados" (mostra erros)
      return;                          // Para aqui, não salva
    }

    const produto: Produto = this.form.value;  // Pega os valores do formulário
```
- `this.form.invalid`: Verifica se algum campo falhou na validação
- `this.form.markAllAsTouched()`: Força mostrar as mensagens de erro em todos os campos
- `this.form.value`: Objeto com `{ nome: '...', descricao: '...', preco: ... }`

```typescript
    const requisicao = this.editando
      ? this.produtoService.atualizar(this.produtoId!, produto)  // PUT
      : this.produtoService.criar(produto);                      // POST
```
- **Operador ternário** (`condição ? se verdadeiro : se falso`)
- Se editando → `atualizar()` (PUT)
- Se criando → `criar()` (POST)

```typescript
    requisicao.subscribe({
      next: () => this.router.navigate(['/']),  // Volta para listagem
```
- Depois de salvar, navega de volta para a página inicial

### Template HTML: `src/app/components/produto-form/produto-form.html`

```html
<div class="container">
  <div class="card">
    <h2>{{ editando ? '✏️ Editar Produto' : '📦 Novo Produto' }}</h2>
```
- O título muda dinamicamente: "Editar" se `editando = true`, "Novo" se `false`

```html
    <form [formGroup]="form" (ngSubmit)="salvar()" class="form">
```
- `[formGroup]="form"`: Conecta o formulário HTML ao `FormGroup` do TypeScript
- `(ngSubmit)`: Quando o formulário for submetido (Enter ou botão submit), chama `salvar()`

```html
      <input
        formControlName="nome"
        [class.is-invalid]="form.get('nome')?.invalid && form.get('nome')?.touched"
      />
```
- `formControlName="nome"`: Conecta este input ao campo `nome` do FormGroup
- `[class.is-invalid]="..."`: Adiciona a classe CSS `is-invalid` se o campo é inválido E foi tocado

```html
      @if (form.get('nome')?.invalid && form.get('nome')?.touched) {
        <div class="invalid-feedback">
          Nome é obrigatório (mínimo 3 caracteres).
        </div>
      }
```
- Mostra mensagem de erro **só se** o campo é inválido E o usuário já clicou nele (touched)

---

## 10. Rotas e Navegação (5 min)

> 🎯 **Objetivo**: Conectar URLs aos componentes.

Arquivo: `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { ProdutoListComponent } from './components/produto-list/produto-list';
import { ProdutoFormComponent } from './components/produto-form/produto-form';

export const routes: Routes = [
  { path: '', component: ProdutoListComponent },           // URL: /
  { path: 'novo', component: ProdutoFormComponent },       // URL: /novo
  { path: 'editar/:id', component: ProdutoFormComponent }, // URL: /editar/1
  { path: '**', redirectTo: '' }                           // Qualquer outra → volta pra /
];
```

### Explicação:

| Rota | Componente | O que acontece |
|------|-----------|----------------|
| `''` (vazio) | `ProdutoListComponent` | Lista produtos na tela inicial |
| `'novo'` | `ProdutoFormComponent` | Formulário vazio para criar produto |
| `'editar/:id'` | `ProdutoFormComponent` | Formulário preenchido para editar |
| `'**'` | `redirectTo: ''` | URL inválida → redireciona pra inicial |

- `:id`: É um **parâmetro dinâmico**. Na URL `/editar/3`, o `:id` vale `3`

### Configuração: `src/app/app.config.ts`

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()        // ← IMPORTANTE! Habilita o HttpClient
  ]
};
```
- `provideZoneChangeDetection()`: Faz o Angular atualizar a tela depois de eventos assíncronos, como a resposta do `HttpClient`
- `provideHttpClient()`: Registra o HttpClient no app. **Sem isso**, o service não consegue fazer requisições HTTP!

### Componente raiz: `src/app/app.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
```

### Template raiz: `src/app/app.html`

```html
<app-navbar />
<main>
  <router-outlet />
</main>
```
- `<app-navbar />`: Mostra a barra de navegação (sempre visível)
- `<router-outlet />`: Onde o Angular **renderiza o componente da rota atual**. É como uma TV que troca de canal conforme a URL muda

---

## 11. Testando o CRUD Completo (5 min)

### Passo 1: Iniciar o projeto

```bash
npm run start:all
```

Isso sobe dois servidores:
- Angular: `http://localhost:4200`
- API: `http://localhost:3000`

### Passo 2: Testar cada operação

#### CREATE (Criar)
1. Clique em **"+ Novo Produto"**
2. Preencha: Nome, Descrição, Preço
3. Clique em **"Cadastrar"**
4. Produto aparece na tabela!

#### READ (Listar)
1. Acesse `http://localhost:4200`
2. Todos os produtos aparecem na tabela
3. O preço já vem formatado em R$

#### UPDATE (Editar)
1. Clique em **"✏️ Editar"** em qualquer produto
2. Os campos são preenchidos automaticamente
3. Altere o que quiser
4. Clique em **"Atualizar"**
5. Volta para a lista com dados atualizados!

#### DELETE (Excluir)
1. Clique em **"🗑️ Excluir"** em qualquer produto
2. Confirme na janela que aparece
3. Produto some da tabela!

### Passo 3: Testar validações

1. Tente cadastrar sem preencher nada
2. Veja as mensagens de erro aparecem
3. Tente colocar preço negativo — não permite!

### Passo 4: Ver a API direto no navegador

Acesse `http://localhost:3000/produtos` — você verá o JSON bruto!

---

## 12. Resumo e Exercícios

### O que aprendemos:

| Conceito | O que fazemos |
|----------|---------------|
| **Interface** | Define a forma dos dados |
| **Service** | Faz requisições HTTP (GET, POST, PUT, DELETE) |
| **Observable** | Representa dados que chegam no futuro |
| **Componente** | Controla uma parte da tela (HTML + CSS + TS) |
| **@if / @for** | Controle de fluxo no template |
| **Reactive Forms** | Formulários com validação |
| **Router** | Navegação entre telas |
| **json-server** | API fake para desenvolvimento |

### Fluxo completo do CRUD:

```
┌──────────┐    clique    ┌──────────┐   .subscribe()  ┌──────────┐  HTTP   ┌─────┐
│  Template │  ────────►  │Componente│  ─────────────►  │ Service  │ ──────► │ API │
│  (HTML)   │             │  (TS)    │                  │  (TS)    │         │(JSON)│
└──────────┘             └──────────┘  ◄─────────────  └──────────┘ ◄────── └─────┘
                              │           dados voltam        │        resposta
                              ▼                              │
                         atualiza a                     transforma em
                         tela (HTML)                    Observable
```

### Exercícios propostos:

1. **Fácil**: Adicione um campo `categoria` ao produto (modifique a interface, o service, o formulário e a tabela)

2. **Médio**: Adicione um campo de busca que filtra produtos pelo nome (filtre a lista usada no `@for`)

3. **Desafiador**: Implemente "confirmar antes de excluir" com um modal ao invés do `confirm()` do navegador

---

## Comandos úteis

```bash
# Criar novo projeto
ng new nome-do-projeto

# Criar componente
ng generate component components/nome-componente

# Criar service
ng generate service services/nome-service

# Rodar o Angular
ng serve

# Rodar a API fake
npm run api

# Rodar os dois juntos
npm run start:all

# Build de produção
ng build
```

---

## Referências

- [Documentação oficial do Angular](https://angular.dev)
- [Angular - Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular - Routing](https://angular.dev/guide/routing)
- [json-server](https://github.com/typicode/json-server)
- [RxJS - Observables](https://rxjs.dev/guide/observable)
