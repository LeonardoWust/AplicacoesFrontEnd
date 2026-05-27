import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-produto-list',
  imports: [CurrencyPipe],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css',
})
export class ProdutoList {
  produtos = [
    {
      id: 1,
      nome:"Notebook Dell",
      descricao:"Notebook Dell Inspiron 15",
      preco: 2500
    },
    {
      id: 2,
      nome:"Mouse Logitech",
      descricao:"Mouse sem fio",
      preco: 450
    }
  ]
}
