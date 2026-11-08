
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  private http = inject(HttpClient);

  private url = 'https://www.themealdb.com/api/json/v1/1/';

  // Obtener las categorías de comidas
  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(
      this.url + 'list.php?c=list'
    );
  }

  // Obtener comidas de una categoría
  obtenerComidasPorCategoria(categoria: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'filter.php?c=' + encodeURIComponent(categoria)
    );
  }

  // Buscar comidas por nombre
  buscarComida(nombre: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'search.php?s=' + encodeURIComponent(nombre)
    );
  }

  // Buscar comidas por ingrediente
  buscarIngrediente(ingrediente: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'filter.php?i=' + encodeURIComponent(ingrediente)
    );
  }

  // Obtener los detalles y los ingredientes de una comida
  obtenerDetalleComida(id: string): Observable<any> {
    return this.http.get<any>(
      this.url + 'lookup.php?i=' + encodeURIComponent(id)
    );
  }

  // Obtener una comida aleatoria para el juego
  obtenerComidaAleatoria(): Observable<any> {
    return this.http.get<any>(
      this.url + 'random.php'
    );
  }

}
