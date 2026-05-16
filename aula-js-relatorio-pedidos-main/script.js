const pedidos = [
    {
        id: 1,
        cliente: { nome: 'Ana', cidade: 'Curitiba' },
        status: 'pago',
        itens: [
            { nome: 'Mouse', categoria: 'Perifericos', preco: 120, qtd: 1 },
            { nome: 'Teclado', categoria: 'Perifericos', preco: 250, qtd: 1 },
        ],
    },
    {
        id: 2,
        cliente: { nome: 'Bruno', cidade: 'Sao Paulo' },
        status: 'pendente',
        itens: [{ nome: 'Monitor', categoria: 'Video', preco: 900, qtd: 1 }],
    },
    {
        id: 3,
        cliente: { nome: 'Carla', cidade: 'Florianopolis' },
        status: 'pago',
        itens: [
            { nome: 'Headset', categoria: 'Audio', preco: 300, qtd: 2 },
            { nome: 'Webcam', categoria: 'Video', preco: 200, qtd: 1 },
        ],
    },
    {
        id: 4,
        cliente: { nome: 'Ana', cidade: 'Curitiba' },
        status: 'cancelado',
        itens: [{ nome: 'Mousepad', categoria: 'Perifericos', preco: 80, qtd: 1 }],
    },
];

const formatarMoeda = valor => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

// TODO 1: Use destructuring no parametro e template literal.
// Retorno esperado: "Ana (Curitiba)"
const formatarCliente = ({ nome, cidade }) => `${nome} (${cidade})`;

// TODO 2: Use rest para somar valores variaveis.
const somar = (...valores) => valores.reduce((acc, value) => acc + value, 0);

// TODO 3: Use destructuring de array para pegar o primeiro item.
const obterPrimeiroItemNome = ({ itens }) => {
    const [primeiroItem] = itens;
    return primeiroItem.nome;
};

// TODO 4: Calcule subtotal de um pedido com reduce.
// Dica: subtotal = soma de (preco * qtd) de cada item.
const calcularSubtotal = itens => itens.reduce((acc, { preco, qtd }) => acc + preco * qtd, 0);

// TODO 5: Gere novo objeto com spread, sem mutar o original.
// Adicione os campos:
// - clienteFormatado
// - subtotal
// - quantidadeItens
// - primeiroItem
const enriquecerPedido = pedido => {
    const clienteFormatado = formatarCliente(pedido.cliente);
    const subtotal = calcularSubtotal(pedido.itens);
    const quantidadeItens = pedido.itens.reduce((acc, { qtd }) => acc + qtd, 0);

    const pedidoEnriquecido = {
        ...pedido,
        clienteFormatado,
        subtotal,
        quantidadeItens,
        primeiroItem: obterPrimeiroItemNome(pedido),
    };

    return pedidoEnriquecido;
};

// TODO 6: Retorne somente pedidos com status "pago".
const filtrarPagos = lista => lista.filter(pedido => pedido.status === 'pago');

// TODO 7: Gere linhas de resumo com map.
// Exemplo:
// "Pedido #1 | Ana (Curitiba) | Itens: 2 | Primeiro: Mouse | Subtotal: R$ 370,00"
const gerarResumoPedidos = listaEnriquecida =>
    listaEnriquecida.map(
        item =>
            `Pedido #${item.id} | ${item.clienteFormatado} | ${item.quantidadeItens} | ${item.primeiroItem} | ${formatarMoeda(item.subtotal)}`
    );

// TODO 8: Calcule faturamento total somente dos pedidos pagos.
const calcularFaturamentoTotal = listaPagos => listaPagos.reduce((acc, { subtotal }) => acc + subtotal, 0);

// TODO 9: Calcule faturamento por categoria usando reduce.
// Saida esperada (aprox):
// { Perifericos: 370, Audio: 600, Video: 200 }
const calcularFaturamentoPorCategoria = listaPagos =>
    listaPagos.reduce((acc, { itens }) => {
        itens.forEach(({ categoria, preco, qtd }) => {
            acc[categoria] = (acc[categoria] || 0) + preco * qtd;
        });
        return acc;
    }, {});

// TODO 10: Boa pratica de escopo.
// Troque qualquer "var" por let/const (se houver)
// e mantenha cada variavel no menor escopo possivel.

// Execucao
const pedidosEnriquecidos = pedidos.map(enriquecerPedido);
const pedidosPagos = filtrarPagos(pedidosEnriquecidos);

console.log('\nRESUMO DOS PEDIDOS:');
gerarResumoPedidos(pedidosEnriquecidos).forEach(linha => console.log(linha));

console.log('\nFATURAMENTO TOTAL (apenas pagos):', formatarMoeda(calcularFaturamentoTotal(pedidosPagos)));
console.log('FATURAMENTO POR CATEGORIA (apenas pagos):', calcularFaturamentoPorCategoria(pedidosPagos));
console.log('SOMA RAPIDA (10, 20, 30):', somar(10, 20, 30));