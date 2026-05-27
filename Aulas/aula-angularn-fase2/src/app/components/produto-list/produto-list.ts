import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-list',
  imports: [CurrencyPipe],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css',
})
export class ProdutoList {
  private readonly produtosService = inject(ProdutoService);
  private readonly cdr = inject(ChangeDetectorRef);
  produtos : Produto[] = [];
  carregando: boolean = false;
 
  ngOnInit() {
    this.corregarProdutos();
  }

  corregarProdutos() : void{
    this.carregando = true;
    this.produtosService.listar().subscribe({
      next: (dados) => { 
        this.produtos = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => 
        {
          console.error('Erro ao carregar produtos:', erro)
          this.carregando = false;
          this.cdr.detectChanges();
        }
    })
  }

  editar(produto: Produto): void {
    if (!produto.id) {
      return;
    }

    const nome = prompt('Nome:', produto.nome);
    if (nome === null) {
      return;
    }

    const descricao = prompt('Descrição:', produto.descricao);
    if (descricao === null) {
      return;
    }

    const precoTexto = prompt('Preço:', String(produto.preco));
    if (precoTexto === null) {
      return;
    }

    const preco = Number(precoTexto);
    if (Number.isNaN(preco)) {
      alert('Preço inválido');
      return;
    }

    this.produtosService.atualizar({ ...produto, nome, descricao, preco }, produto.id).subscribe({
      next: () => this.corregarProdutos(),
      error: (erro) => console.error('Erro ao atualizar produto:', erro),
    });
  }

  excluir(produto: Produto): void {
    if (!produto.id || !confirm(`Excluir ${produto.nome}?`)) {
      return;
    }

    this.produtosService.excluir(produto.id).subscribe({
      next: () => this.corregarProdutos(),
      error: (erro) => console.error('Erro ao excluir produto:', erro),
    });
  }
}
