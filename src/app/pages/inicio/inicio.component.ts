
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ComidasService } from '../../servicios/comidas.service';
import { BebidasService } from '../../servicios/bebidas.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  private comidasService = inject(ComidasService);
  private bebidasService = inject(BebidasService);

  comidaDestacada: any = null;
  bebidaDestacada: any = null;

  cargandoDestacados = true;

  ngOnInit(): void {
    this.cargarComidaDestacada();
    this.cargarBebidaDestacada();
  }

  cargarComidaDestacada(): void {

    this.comidasService.buscarComida('Arrabiata').subscribe({

      next: (respuesta) => {

        const comida = respuesta.meals?.[0];

        if (comida) {

          this.comidasService
            .obtenerDetalleComida(comida.idMeal)
            .subscribe({

              next: (detalle) => {

                const resultado = detalle.meals?.[0];

                if (resultado) {
                  this.comidaDestacada = {
                    ...resultado,
                    precio: 18000
                  };
                }

                this.verificarCarga();

              },

              error: (error) => {
                console.error('Error al cargar detalles de comida:', error);
                this.verificarCarga();
              }

            });

        } else {
          this.verificarCarga();
        }

      },

      error: (error) => {
        console.error('Error al cargar comida destacada:', error);
        this.verificarCarga();
      }

    });

  }

  cargarBebidaDestacada(): void {

    this.bebidasService.filtrarPorAlcohol('Non_Alcoholic').subscribe({

      next: (respuesta) => {

        const bebida = respuesta.drinks?.[0];

        if (bebida) {

          this.bebidasService
            .obtenerDetalleBebida(bebida.idDrink)
            .subscribe({

              next: (detalle) => {

                const resultado = detalle.drinks?.[0];

                if (resultado) {
                  this.bebidaDestacada = {
                    ...resultado,
                    precio: 12000
                  };
                }

                this.verificarCarga();

              },

              error: (error) => {
                console.error('Error al cargar detalles de bebida:', error);
                this.verificarCarga();
              }

            });

        } else {
          this.verificarCarga();
        }

      },

      error: (error) => {
        console.error('Error al cargar bebida destacada:', error);
        this.verificarCarga();
      }

    });

  }

  verificarCarga(): void {

    if (this.comidaDestacada !== null ||
        this.bebidaDestacada !== null) {

      if (this.comidaDestacada && this.bebidaDestacada) {
        this.cargandoDestacados = false;
      }

    }

    if (!this.comidaDestacada && !this.bebidaDestacada) {
      this.cargandoDestacados = false;
    }

  }

  imagenAlternativa(event: Event): void {

    const imagen = event.target as HTMLImageElement;

    imagen.src = 'https://placehold.co/400x250/292929/c9a45c?text=MANILA';

  }

}
