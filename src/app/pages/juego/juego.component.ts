
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ComidasService } from '../../servicios/comidas.service';
import { BebidasService } from '../../servicios/bebidas.service';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {

  private comidasService = inject(ComidasService);
  private bebidasService = inject(BebidasService);

  casillas = Array(16).fill('');

  posiciones: number[] = [];
  encontradas: number[] = [];

  comida: any = null;
  bebida: any = null;

  intentos = 0;
  mensaje = 'Encuentra la comida y la bebida.';
  terminado = false;
  cargando = false;

  constructor() {
    this.iniciarJuego();
  }

  iniciarJuego(): void {

    this.cargando = true;
    this.terminado = false;

    this.posiciones = [];
    this.encontradas = [];

    this.intentos = 0;

    this.comida = null;
    this.bebida = null;

    this.mensaje = 'Cargando comida y bebida...';

    // Consultar las dos APIs al mismo tiempo
    forkJoin({
      comida: this.comidasService.obtenerComidaAleatoria(),
      bebida: this.bebidasService.obtenerBebidaAleatoria()
    }).subscribe({

      next: (respuesta) => {

        this.comida = respuesta.comida.meals?.[0];
        this.bebida = respuesta.bebida.drinks?.[0];

        if (!this.comida || !this.bebida) {
          this.cargando = false;
          this.mensaje = 'No se pudieron cargar los elementos. Intenta nuevamente.';
          return;
        }

        // Elegir dos posiciones diferentes
        while (this.posiciones.length < 2) {

          const posicion = Math.floor(Math.random() * 16);

          if (!this.posiciones.includes(posicion)) {
            this.posiciones.push(posicion);
          }

        }

        this.cargando = false;
        this.mensaje = 'Encuentra la comida y la bebida.';

      },

      error: () => {

        this.cargando = false;
        this.mensaje = 'Error al cargar las APIs. Intenta nuevamente.';

      }

    });

  }

  seleccionar(indice: number): void {

    if (this.encontradas.includes(indice) || this.terminado || this.cargando) {
      return;
    }

    this.intentos++;

    if (this.posiciones.includes(indice)) {

      this.encontradas.push(indice);

      if (indice === this.posiciones[0]) {
        this.mensaje = '¡Encontraste la comida! Ahora busca la bebida.';
      }

      if (indice === this.posiciones[1]) {
        this.mensaje = '¡Encontraste la bebida! Ahora busca la comida.';
      }

      if (this.encontradas.length === 2) {

        this.mensaje = '¡Felicitaciones! Encontraste la comida y la bebida.';
        this.terminado = true;

      }

    } else {

      this.mensaje = 'Aquí no hay nada. ¡Sigue intentando!';

    }

  }

  mostrarImagen(indice: number): string {

    if (!this.encontradas.includes(indice)) {
      return '';
    }

    if (indice === this.posiciones[0]) {
      return this.comida?.strMealThumb || '';
    }

    if (indice === this.posiciones[1]) {
      return this.bebida?.strDrinkThumb || '';
    }

    return '';

  }

  obtenerNombre(indice: number): string {

    if (indice === this.posiciones[0]) {
      return this.comida?.strMeal || '';
    }

    if (indice === this.posiciones[1]) {
      return this.bebida?.strDrink || '';
    }

    return '';

  }

}
