# 📝 Exercício — Lista de Tarefas Interativa

**Disciplina:** Aplicações Frontend  
**Aula:** 02 — Revisão HTML, CSS e JavaScript  
**Formato:** Dojo + Pair Programming

---

## 🎯 O que você vai construir

Uma página web de **Lista de Tarefas** onde o usuário consegue:

- Digitar e **adicionar** tarefas à lista
- **Concluir** uma tarefa (texto riscado)
- **Remover** uma tarefa da lista
- Ver um **contador** que atualiza automaticamente

---

## 📁 Arquivos do projeto

```
projeto/
├── README.md           ← Você está aqui
├── index.html          ← Estrutura da página (HTML)
└── assets/
    ├── css/
    │   └── style.css   ← Visual da página (CSS)
    └── js/
        └── script.js   ← Comportamento (JavaScript)
```

> Abra os três arquivos no VS Code e siga as etapas abaixo.  
> Localize cada `TODO` nos arquivos e substitua pelo código correto.

---

## 👥 Dinâmica Dojo

- Trabalhe em **dupla**: um é o **Piloto** (digita), o outro é o **Co-piloto** (orienta).
- **Troquem de papel** a cada etapa.
- Discutam as decisões em voz alta — o raciocínio importa tanto quanto o código.

---

## 🔨 Etapa 1 — HTML `index.html` (~8 min)

**Piloto desta etapa:** Aluno A

Abra o `index.html` e resolva os comentários `TODO`:

### TODO 1 — Meta tag de viewport
Adicione dentro do `<head>` a tag que torna a página responsiva.

> **Por quê?** Sem ela, celulares renderizam a página no tamanho de um desktop e encolhem tudo.

---

### TODO 2 — Vincular o CSS externo
Ainda no `<head>`, importe o arquivo de estilos.

> **Por quê?** CSS externo mantém a separação de responsabilidades: HTML = estrutura, CSS = visual.

---

### TODO 3 — Campo de texto
Dentro da `<section id="formulario">`, crie o input.

> `id="inputTarefa"` → será usado pelo JavaScript para ler o que o usuário digitou.

---

### TODO 4 — Botão Adicionar
Logo após o input, crie o botão.

> `onclick` é um **evento HTML** — ao clicar, o navegador executa a função `adicionarTarefa()`.

---

### TODO 5 — Lista de tarefas
Dentro da `<section id="listaTarefas">`, crie a lista vazia.

> O JavaScript vai preencher essa lista dinamicamente. Por isso começa vazia.

---

### TODO 6 — Vincular o JavaScript
**Antes** do `</body>`, importe o script.

> **Por quê antes do `</body>` e não no `<head>`?**  
> Garante que todo o HTML já foi carregado antes de o JS tentar acessar os elementos.

---

✅ **Teste:** Abra o `index.html` no navegador. Você deve ver o cabeçalho, um campo de texto e um botão (sem estilo ainda).

---

## 🎨 Etapa 2 — CSS `assets/css/style.css` (~10 min)

**Troca de papéis:** Aluno B vira Piloto

Abra o `style.css`. Cada `TODO` indica onde adicionar o código:

### TODO A — Reset universal

> O seletor `*` seleciona **todos** os elementos. Zeramos as margens padrão do navegador.

---

### TODO B — Corpo da página

---

### TODO C — Cabeçalho

---

### TODO D — Área principal centralizada

> `margin: auto` nas laterais **centraliza** um bloco com largura definida.

---

### TODO E — Formulário em linha (Flexbox)

> `display: flex` coloca os filhos (input e botão) lado a lado automaticamente.

---

### TODO F — Campo de texto

> `flex: 1` faz o input **crescer** para ocupar todo o espaço disponível ao lado do botão.

---

### TODO G — Botão

---

### TODO H — Efeito hover no botão

> `:hover` é uma **pseudo-classe** — aplica o estilo somente quando o mouse está sobre o elemento.

---

### TODO I — Remover marcadores da lista

---

### TODO J — Estilo de cada item da lista

> `justify-content: space-between` empurra o texto para a esquerda e os botões para a direita.

---

### TODO K — Classe para tarefa concluída

> Esta classe será **adicionada e removida** pelo JavaScript ao clicar em "Concluir".

---

### TODO L — Responsividade (Media Query)

> Quando a tela for menor que 480px (celular), o input e o botão ficam **empilhados** em vez de lado a lado.

---

### TODO M — Rodapé

---

✅ **Teste:** Recarregue o navegador. A página deve estar estilizada. Redimensione a janela para ver a responsividade.

---

## ⚙️ Etapa 3 — JavaScript `assets/js/script.js` (~12 min)

**Troca de papéis:** Aluno A volta a ser Piloto

Abra o `script.js` e preencha cada `TODO`:

---

### TODO 1 — Variável global

> Variável que registra quantas tarefas existem na lista. Atualizada a cada adição/remoção.

---

### TODO 2 e 3 — Ler o input

> `.value` lê o texto digitado. `.trim()` remove espaços extras nas bordas.

---

### TODO 4 — Validação

> `return` dentro de uma função **encerra** a execução. Nada mais é feito se o campo estiver vazio.

---

### TODO 5 — Obter a lista

---

### TODO 6 — Criar o elemento `<li>`

> `createElement` cria um nó HTML **na memória**. Ele ainda não aparece na página.

---

### TODO 7 — Montar o conteúdo do item

> As crases `` ` `` formam um **template literal** — permitem interpolar variáveis com `${...}`.  
> `this` nos eventos passa o próprio botão como argumento para a função.

---

### TODO 8 — Adicionar o item à lista

> `appendChild` **insere** o nó no DOM. Ele aparece na página depois desta linha.

---

### TODO 9 — Limpar o campo

> Limpa o input e devolve o foco para o usuário digitar a próxima tarefa sem recliques.

---

### TODO 10 — Atualizar o contador

---

### TODO 11 e 12 — Remover tarefa

> Estrutura DOM gerada pelo TODO 7:
> ```
> <li>              ← botao.parentElement.parentElement
>   <span>
>   <div>           ← botao.parentElement
>     <button>      ← botao (parâmetro recebido via "this")
> ```

---

### TODO 13 — Atualizar contador após remoção

---

### TODO 14 e 15 — Concluir tarefa

> `classList.toggle("concluida")` **adiciona** a classe se não existir, **remove** se já existir.  
> Isso aplica ou retira o CSS de texto riscado definido no `style.css`.

---

### TODO 16 e 17 — Atualizar o contador na tela

---

✅ **Teste final:** Adicione tarefas, conclua, remova. O contador deve atualizar a cada ação. Verifique o console do navegador (F12) — não deve haver erros em vermelho.

---

## 🧪 Checklist antes de entregar

- [ ] Página abre sem erros no console (F12 → aba Console)
- [ ] CSS externo aplicado (página está estilizada)
- [ ] Tarefas são adicionadas ao clicar no botão
- [ ] Campo vazio exibe alerta e não adiciona
- [ ] Contador atualiza corretamente (singular e plural)
- [ ] Botão "Concluir" risca o texto da tarefa
- [ ] Botão "Remover" exclui a tarefa da lista
- [ ] Layout se adapta em telas pequenas (redimensione a janela)

---

## 🏆 Desafio Extra

Faça o botão **Enter** do teclado também adicionar a tarefa.

> `addEventListener` é a forma moderna de registrar eventos em JavaScript.

---

## 📚 Referências Rápidas

| Assunto | Link |
|---------|------|
| HTML | https://www.w3schools.com/html |
| CSS | https://www.w3schools.com/css |
| JavaScript | https://www.w3schools.com/js |
| DOM | https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model |
| Flexbox | https://css-tricks.com/snippets/css/a-guide-to-flexbox |
