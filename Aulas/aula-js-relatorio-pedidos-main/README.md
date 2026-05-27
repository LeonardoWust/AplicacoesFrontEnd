# Exercicio - Aula 3

## Conteudo da aula
JavaScript moderno (ES6+) e boas praticas

Topicos cobrados neste exercicio:
- funcoes (declaracao e arrow functions)
- template literals
- destructuring de objetos e arrays
- spread/rest
- let/const e escopo
- manipulacao de arrays e objetos com map/filter/reduce  

## Objetivo
Implementar funcoes utilitarias para processar dados de pedidos e gerar informacoes de negocio de forma clara, reutilizavel e sem mutacao desnecessaria.

Ao final, o script deve produzir:
- resumo por pedido
- faturamento total (somente pagos)
- faturamento por categoria (somente pagos)

## Por que isso e importante no mundo real
Em projetos reais de front-end, voce recebe dados brutos de APIs e precisa transforma-los em informacoes para telas, dashboards e relatorios.

Este exercicio treina exatamente esse fluxo:
- transformar listas com `map`, `filter` e `reduce`
- evitar bugs ao nao mutar dados originais
- escrever funcoes pequenas e reutilizaveis
- preparar dados confiaveis para decisao de negocio (ex.: total vendido e categorias com maior receita)

## Estrutura
```text
Aula3/
  README.md
  script.js
```

## Como rodar
1. Abra `script.js`.
2. Implemente os `TODO`.
3. Execute com `node script.js`.

## Exercicios guiados (roteiro)

### Etapa 1 - Funcoes e sintaxe ES6+
1. Implemente `formatarCliente` com arrow function, destructuring e template literal.
2. Implemente `somar` com parametro rest.
3. Implemente `obterPrimeiroItemNome` com destructuring de array.

### Etapa 2 - Arrays e objetos
1. Implemente `calcularSubtotal` com `reduce`.
2. Implemente `enriquecerPedido` com spread sem mutar o objeto original.
3. Valide que `pedidos` original continua igual.

### Etapa 3 - map/filter/reduce
1. Implemente `filtrarPagos` com `filter`.
2. Implemente `gerarResumoPedidos` com `map`.
3. Implemente `calcularFaturamentoTotal` com `reduce`.
4. Implemente `calcularFaturamentoPorCategoria` com `reduce`.

### Etapa 4 - Boas praticas
1. Use `const` por padrao e `let` apenas quando necessario.
2. Mantenha variaveis no menor escopo possivel.
3. Evite efeitos colaterais e mutacao desnecessaria.

## Checklist (Definition of Done)
- [ ] Usa pelo menos 3 arrow functions.
- [ ] Usa template literal em pelo menos 1 funcao.
- [ ] Usa destructuring de objeto e de array.
- [ ] Usa spread para criar novo objeto.
- [ ] Usa rest em funcao variadica.
- [ ] Resolve com `map`, `filter` e `reduce`.
- [ ] Exibe no console resumo, total e por categoria.

## Desafio extra (opcional)
1. Ordene o resumo por maior subtotal.
2. Crie `topCliente(listaPagos)` para identificar quem mais gastou.
3. Formate moeda com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.

---
Disciplina: Aplicacoes Front-End | Aula 3 | 2026/1
