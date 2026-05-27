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
