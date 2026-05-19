import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  imports: [FormsModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm {
  @Output() salvo = new EventEmitter<void>();

  private readonly produtoService = inject(ProdutoService);
  private readonly cdr = inject(ChangeDetectorRef);

  title = "Novo Produto";
  produto: Produto = {
    nome: '',
    descricao: '',
    preco: 0,
  };

  salvar(): void{
    this.produtoService.criar(this.produto).subscribe({
      next: () => {
        this.produto = { nome: '', descricao: '', preco: 0 };
        this.salvo.emit();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao salvar produto:', erro),
    });
  }
}
