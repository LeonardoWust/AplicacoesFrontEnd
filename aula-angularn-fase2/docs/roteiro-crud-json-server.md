# Roteiro: evoluindo o projeto para CRUD com json-server

Este roteiro explica como sair do ultimo commit e chegar ao codigo atual, com o CRUD de produtos funcionando usando Angular + `json-server`.

## Objetivo

A ideia e transformar a tela que apenas listava produtos em uma tela simples de CRUD:

- listar produtos vindos do `json-server`;
- cadastrar um novo produto;
- editar um produto existente;
- excluir um produto;
- atualizar a tabela depois de cada operacao.

O foco foi modificar o minimo possivel, usando os componentes que ja existiam:

- `ProdutoForm`, para cadastrar;
- `ProdutoList`, para listar, editar e excluir;
- `ProdutoService`, para centralizar as chamadas HTTP.

## 1. Habilitar chamadas HTTP no Angular

Arquivo: `src/app/app.config.ts`

Antes, o projeto tinha o `ProdutoService` usando `HttpClient`, mas o aplicativo ainda nao registrava o provider do HTTP.

Por isso foi adicionado:

```ts
import { provideHttpClient } from '@angular/common/http';
```

E nos providers:

```ts
provideHttpClient(),
```

Por que isso e necessario:

O `HttpClient` so funciona quando o Angular sabe como cria-lo. Sem `provideHttpClient()`, o service pode ate compilar, mas a aplicacao falha ao tentar usar requisicoes HTTP.

Tambem foi adicionado:

```ts
provideZonelessChangeDetection(),
```

Por que isso entrou:

Nesta versao do Angular, a aplicacao esta usando o modelo novo de deteccao de mudancas. Sem essa configuracao e sem chamar a deteccao depois das respostas HTTP, a tela podia ficar presa em "Carregando produtos...", mesmo com a API respondendo corretamente.

## 2. Ajustar o modelo `Produto`

Arquivo: `src/app/models/produto.ts`

Antes:

```ts
id: number;
```

Depois:

```ts
id?: number | string;
```

Por que mudar:

Quando criamos um produto novo pelo formulario, ainda nao temos `id`. Quem gera o `id` e o `json-server`.

Outro detalhe: o `json-server` pode trabalhar com `id` numerico ou texto. No `db.json` atual os ids existentes estao como string:

```json
"id": "1"
```

Entao o tipo ficou mais flexivel:

- `id?`, porque produto novo ainda nao tem id;
- `number | string`, porque o `json-server` pode devolver qualquer um dos dois formatos.

## 3. Deixar o service aceitar ids do json-server

Arquivo: `src/app/services/produto.service.ts`

O service ja tinha os metodos principais:

- `listar()`;
- `criar()`;
- `atualizar()`;
- `excluir()`.

A mudanca foi pequena: permitir que `atualizar` e `excluir` recebam `number | string`.

Antes:

```ts
atualizar(produto: Produto, id: number)
excluir(id: number)
```

Depois:

```ts
atualizar(produto: Produto, id: number | string)
excluir(id: number | string)
```

Por que mudar:

Como os ids do `db.json` podem vir como string, o service precisa aceitar string tambem. Assim evitamos erro de TypeScript e deixamos o codigo alinhado com os dados reais da API.

## 4. Fazer o formulario salvar no json-server

Arquivos:

- `src/app/components/produto-form/produto-form.ts`
- `src/app/components/produto-form/produto-form.html`

Antes, o metodo `salvar()` apenas mostrava um alerta:

```ts
alert('Produto sera salvo aqui');
```

Agora ele usa o `ProdutoService`:

```ts
this.produtoService.criar(this.produto).subscribe({
  next: () => {
    this.produto = { nome: '', descricao: '', preco: 0 };
    this.salvo.emit();
    this.cdr.detectChanges();
  },
  error: (erro) => console.error('Erro ao salvar produto:', erro),
});
```

Por que isso funciona:

- `criar(this.produto)` faz um `POST` para `http://localhost:3000/produtos`;
- o `json-server` grava o novo produto no `db.json`;
- depois de salvar, o formulario limpa os campos;
- o evento `salvo.emit()` avisa o componente pai que a lista precisa ser recarregada.

Tambem foi importado o `FormsModule`:

```ts
imports: [FormsModule],
```

Por que isso e necessario:

O HTML passou a usar `[(ngModel)]`, e o `ngModel` so funciona quando o componente importa `FormsModule`.

No HTML, os inputs passaram a preencher o objeto `produto`:

```html
<input type="text" name="nome" [(ngModel)]="produto.nome" />
<input name="descricao" [(ngModel)]="produto.descricao" />
<input type="number" name="preco" [(ngModel)]="produto.preco" />
```

Por que usar `name`:

Quando usamos `ngModel` dentro de um `<form>`, o Angular precisa que cada campo tenha um `name`.

O botao tambem virou submit:

```html
<form class="form" (ngSubmit)="salvar()">
  ...
  <button type="submit">Cadastrar</button>
</form>
```

Assim o formulario chama `salvar()` de forma natural quando o usuario clica em "Cadastrar".

## 5. Fazer a lista recarregar depois do cadastro

Arquivo: `src/app/app.html`

Antes:

```html
<app-produto-form />
<app-produto-list />
```

Depois:

```html
<app-produto-form (salvo)="lista.corregarProdutos()" />
<app-produto-list #lista />
```

Por que mudar:

O formulario e a lista sao componentes separados. Quando o formulario salva um produto, a lista nao sabe disso automaticamente.

Com esse ajuste:

- `#lista` cria uma referencia para o componente da lista;
- `(salvo)` escuta o evento emitido pelo formulario;
- quando o formulario salva, o Angular chama `lista.corregarProdutos()`.

Resultado: cadastrou, a tabela atualiza.

Observacao:

O metodo se chama `corregarProdutos()` no codigo atual. O nome parece ser um erro de digitacao, mas foi mantido para mexer o minimo possivel.

## 6. Atualizar a tela depois de carregar produtos

Arquivo: `src/app/components/produto-list/produto-list.ts`

Foi adicionado:

```ts
private readonly cdr = inject(ChangeDetectorRef);
```

Depois de receber os dados da API:

```ts
this.produtos = dados;
this.carregando = false;
this.cdr.detectChanges();
```

E tambem no erro:

```ts
this.carregando = false;
this.cdr.detectChanges();
```

Por que isso foi necessario:

O `subscribe()` recebe os dados de forma assincrona. Como a aplicacao esta com deteccao de mudancas zoneless, chamar `detectChanges()` garante que o Angular atualize a tela depois da resposta HTTP.

Sem isso, a requisicao podia voltar com sucesso, mas a interface continuar mostrando "Carregando produtos...".

## 7. Ligar os botoes Editar e Excluir

Arquivo: `src/app/components/produto-list/produto-list.html`

Antes, os botoes nao faziam nada:

```html
<button type="button">Editar</button>
<button type="button">Excluir</button>
```

Depois:

```html
<button type="button" (click)="editar(produto)">Editar</button>
<button type="button" (click)="excluir(produto)">Excluir</button>
```

Por que mudar:

Agora cada botao chama um metodo no componente e passa o produto da linha atual.

Assim o componente sabe exatamente qual produto deve ser editado ou excluido.

## 8. Implementar a edicao simples

Arquivo: `src/app/components/produto-list/produto-list.ts`

Para manter a implementacao simples, a edicao foi feita com `prompt()`.

Fluxo:

1. o usuario clica em "Editar";
2. o sistema pergunta o novo nome;
3. pergunta a nova descricao;
4. pergunta o novo preco;
5. valida se o preco e numero;
6. chama `produtoService.atualizar(...)`;
7. recarrega a lista.

Trecho principal:

```ts
this.produtosService.atualizar({ ...produto, nome, descricao, preco }, produto.id).subscribe({
  next: () => this.corregarProdutos(),
  error: (erro) => console.error('Erro ao atualizar produto:', erro),
});
```

Por que usar `{ ...produto, nome, descricao, preco }`:

Isso copia o produto original e substitui apenas os campos alterados. Assim o `id` e qualquer outro dado existente continuam no objeto enviado para o `json-server`.

## 9. Implementar a exclusao simples

Arquivo: `src/app/components/produto-list/produto-list.ts`

A exclusao foi feita com `confirm()`:

```ts
if (!produto.id || !confirm(`Excluir ${produto.nome}?`)) {
  return;
}
```

Depois:

```ts
this.produtosService.excluir(produto.id).subscribe({
  next: () => this.corregarProdutos(),
  error: (erro) => console.error('Erro ao excluir produto:', erro),
});
```

Por que usar confirmacao:

Excluir e uma acao destrutiva. Mesmo em um exemplo simples, e melhor confirmar antes de remover o registro do `db.json`.

Depois da exclusao, a lista e carregada novamente para remover a linha da tela.

## 10. Como testar

Suba a API:

```bash
npm run api
```

Em outro terminal, suba o Angular:

```bash
npm start
```

Abra:

```text
http://localhost:4200
```

Teste o fluxo:

1. veja se os produtos do `db.json` aparecem na tabela;
2. preencha nome, descricao e preco;
3. clique em "Cadastrar";
4. confira se o produto novo aparece na tabela;
5. clique em "Editar" e altere os dados;
6. confira se a linha foi atualizada;
7. clique em "Excluir";
8. confirme a exclusao;
9. confira se a linha saiu da tabela.

Para validar compilacao:

```bash
npm run build
```

## Resumo da evolucao

O ultimo commit tinha a base visual e o service quase pronto, mas ainda faltava ligar a interface ao `json-server`.

A evolucao atual fez isso com poucas mudancas:

- configurou o Angular para usar HTTP;
- adaptou o tipo do `id` ao formato do `json-server`;
- conectou o formulario ao `POST`;
- conectou os botoes da tabela ao `PUT` e `DELETE`;
- recarregou a lista apos salvar, editar e excluir;
- garantiu que a tela atualize depois das respostas HTTP.

Com isso, o CRUD fica funcional sem criar rotas, sem criar telas novas e sem refatorar a estrutura do projeto.
