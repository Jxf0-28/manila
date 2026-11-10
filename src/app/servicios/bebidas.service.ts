
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { Bebida } from '../entidades/bebida';

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

  // Filtrar bebidas alcohólicas, no alcohólicas o todas
  filtrarPorAlcohol(tipo: string): Observable<any> {

    if (tipo) {
      return this.http.get<any>(
        this.url + 'filter.php?a=' + encodeURIComponent(tipo)
      );
    }

    return forkJoin({
      alcoholicas: this.http.get<any>(
        this.url + 'filter.php?a=Alcoholic'
      ),
      noAlcoholicas: this.http.get<any>(
        this.url + 'filter.php?a=Non_Alcoholic'
      )
    }).pipe(
      map((respuestas) => {
        const todas = [
          ...(respuestas.alcoholicas.drinks || []),
          ...(respuestas.noAlcoholicas.drinks || [])
        ];

        const bebidasUnicas = Array.from(
          new Map(
            todas.map((bebida: any) => [bebida.idDrink, bebida])
          ).values()
        );

        return { drinks: bebidasUnicas };
      })
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

  // Crear un objeto de nuestra entidad Bebida
  crearBebida(
    id: string,
    nombre: string,
    precio: number,
    imagen: string,
    categoria: string,
    tipoAlcohol: string,
    ingredientes: string[]
  ): Bebida {
    return new Bebida(
      id,
      nombre,
      precio,
      imagen,
      categoria,
      tipoAlcohol,
      ingredientes
    );
  }

}
