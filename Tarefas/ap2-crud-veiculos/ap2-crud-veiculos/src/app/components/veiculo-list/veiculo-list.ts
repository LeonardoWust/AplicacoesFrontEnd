import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-veiculo-list',
  templateUrl: './veiculo-list.html',
  styleUrl: './veiculo-list.css'
})
export class VeiculoList implements OnInit {
  @Output() editarVeiculo = new EventEmitter<Veiculo>();

  private readonly veiculoService = inject(VeiculoService);

  veiculos: Veiculo[] = [];
  carregando = false;
  erro = '';

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.carregando = true;
    this.erro = '';

    this.veiculoService.listar().subscribe({
      next: (dados) => {
        this.veiculos = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar veículos. Verifique se a API está rodando (npm run api).';
        this.carregando = false;
      }
    });
  }

  editar(veiculo: Veiculo): void {
    this.editarVeiculo.emit(veiculo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(veiculo: Veiculo): void {
    if (!veiculo.id) return;

    const confirmou = confirm(
      `⚠️ Deseja excluir o veículo?\n\n${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmou) return;

    this.veiculoService.excluir(veiculo.id).subscribe({
      next: () => this.carregarVeiculos(),
      error: () => alert('Erro ao excluir veículo. Tente novamente.')
    });
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
