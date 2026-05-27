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
