import { Routes } from '@angular/router';
import { ProdutoListComponent } from './components/produto-list/produto-list';
import { ProdutoFormComponent } from './components/produto-form/produto-form';

export const routes: Routes = [
  { path: '', component: ProdutoListComponent },
  { path: 'novo', component: ProdutoFormComponent },
  { path: 'editar/:id', component: ProdutoFormComponent },
  { path: '**', redirectTo: '' }
];
