import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { VeiculoForm } from './components/veiculo-form/veiculo-form';
import { VeiculoList } from './components/veiculo-list/veiculo-list';
import { Veiculo } from './models/veiculo';

@Component({
  selector: 'app-root',
  imports: [Navbar, VeiculoForm, VeiculoList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  veiculoParaEditar: Veiculo | null = null;

  // Referência para a lista (usamos um flag para forçar reload)
  recarregarLista = false;

  onSalvo(): void {
    this.veiculoParaEditar = null;
    this.recarregarLista = !this.recarregarLista;
  }

  onEditarVeiculo(veiculo: Veiculo): void {
    this.veiculoParaEditar = { ...veiculo };
  }

  onCancelouEdicao(): void {
    this.veiculoParaEditar = null;
  }
}
