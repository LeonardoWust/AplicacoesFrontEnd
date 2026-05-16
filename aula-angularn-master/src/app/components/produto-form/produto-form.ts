import { Component } from '@angular/core';

@Component({
  selector: 'app-produto-form',
  imports: [],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm {
  title = "Novo Produto";

  salvar(): void{
    alert('Produto será salvo aqui');
  }
}
