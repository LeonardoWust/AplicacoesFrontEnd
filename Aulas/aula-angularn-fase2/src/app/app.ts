import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { ProdutoForm } from './components/produto-form/produto-form';
import { ProdutoList } from './components/produto-list/produto-list';

@Component({
  selector: 'app-root',
  imports: [Navbar, ProdutoForm, ProdutoList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  nome = 'Lucas Fogaça'
}
