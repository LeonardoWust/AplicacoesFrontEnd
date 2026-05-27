import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Veiculo } from '../../models/veiculo';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-veiculo-form',
  imports: [FormsModule],
  templateUrl: './veiculo-form.html',
  styleUrl: './veiculo-form.css'
})
export class VeiculoForm implements OnChanges {
  @Input() veiculoParaEditar: Veiculo | null = null;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelouEdicao = new EventEmitter<void>();

  private readonly veiculoService = inject(VeiculoService);

  modoEdicao = false;
  mensagem = '';
  mensagemTipo: 'sucesso' | 'erro' | '' = '';
  salvando = false;

  veiculo: Veiculo = this.veiculoVazio();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['veiculoParaEditar'] && this.veiculoParaEditar) {
      this.veiculo = { ...this.veiculoParaEditar };
      this.modoEdicao = true;
      this.limparMensagem();
    }
  }

  veiculoVazio(): Veiculo {
    return {
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      cor: '',
      placa: '',
      preco: 0,
      disponivel: true
    };
  }

  salvar(): void {
    this.salvando = true;
    this.limparMensagem();

    if (this.modoEdicao && this.veiculo.id) {
      this.veiculoService.atualizar(this.veiculo.id, this.veiculo).subscribe({
        next: () => {
          this.exibirMensagem('Veículo atualizado com sucesso!', 'sucesso');
          this.cancelarEdicao();
          this.salvo.emit();
          this.salvando = false;
        },
        error: () => {
          this.exibirMensagem('Erro ao atualizar veículo. Verifique se a API está rodando.', 'erro');
          this.salvando = false;
        }
      });
    } else {
      this.veiculoService.criar(this.veiculo).subscribe({
        next: () => {
          this.exibirMensagem('Veículo cadastrado com sucesso!', 'sucesso');
          this.veiculo = this.veiculoVazio();
          this.salvo.emit();
          this.salvando = false;
        },
        error: () => {
          this.exibirMensagem('Erro ao cadastrar veículo. Verifique se a API está rodando.', 'erro');
          this.salvando = false;
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.veiculo = this.veiculoVazio();
    this.modoEdicao = false;
    this.cancelouEdicao.emit();
  }

  exibirMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = texto;
    this.mensagemTipo = tipo;
    setTimeout(() => this.limparMensagem(), 4000);
  }

  limparMensagem(): void {
    this.mensagem = '';
    this.mensagemTipo = '';
  }
}
