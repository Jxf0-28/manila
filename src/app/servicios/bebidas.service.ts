
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  private http = inject(HttpClient);

  private url = 'https://www.thecocktaildb.com/api/json/v1/1/';

  // Obtener las categorías de bebidas
  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(
      this.url + 'list.php?c=list'
    );
  }

  // Obtener bebidas de una categoría
  obtenerBebidasPorCategoria(categoria: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'filter.php?c=' + encodeURIComponent(categoria)
    );
  }

  // Buscar bebidas por nombre
  buscarBebida(nombre: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'search.php?s=' + encodeURIComponent(nombre)
    );
  }

  // Buscar bebidas por ingrediente
  buscarIngrediente(ingrediente: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'filter.php?i=' + encodeURIComponent(ingrediente)
    );
  }

  // Filtrar bebidas alcohólicas o no alcohólicas
  filtrarPorAlcohol(tipo: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'filter.php?a=' + encodeURIComponent(tipo)
    );
  }

  // Obtener detalles e ingredientes de una bebida
  obtenerDetalleBebida(id: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'lookup.php?i=' + encodeURIComponent(id)
    );
  }

  // Obtener una bebida aleatoria para el juego
  obtenerBebidaAleatoria(): Observable<any> {
    return this.http.get<any>(
      this.url + 'random.php'
    );
  }

}
