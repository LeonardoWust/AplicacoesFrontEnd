import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:3000/produtos';
  private readonly http = inject(HttpClient);

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  criar(produto: Produto) : Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(produto: Produto, id: number | string) : Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number | string) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
