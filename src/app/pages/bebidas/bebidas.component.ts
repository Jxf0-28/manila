
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

import { BebidasService } from '../../servicios/bebidas.service';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  private bebidasService = inject(BebidasService);
  private carritoService = inject(CarritoService);
  private temporizadorMensaje: any;
  categorias: any[] = [];
  bebidas: any[] = [];

  categoriaSeleccionada = '';

  nombreBusqueda = '';
  ingredienteBusqueda = '';

  tipoAlcohol = '';

  cargando = false;
  mensaje = '';
  mensajeCarrito = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.bebidasService.obtenerCategorias().subscribe({
      next: (respuesta) => {
        this.categorias = respuesta.drinks || [];

        if (this.categorias.length > 0) {
          this.categoriaSeleccionada = this.categorias[0].strCategory;
          this.cargarBebidas();
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.mensaje = 'No se pudieron cargar las categorías.';
      }
    });
  }

  cargarBebidas(): void {
    if (!this.categoriaSeleccionada) return;

    this.cargando = true;
    this.mensaje = '';
    this.mensajeCarrito = '';

    this.bebidasService
      .obtenerBebidasPorCategoria(this.categoriaSeleccionada)
      .subscribe({
        next: (respuesta) => {
          this.cargarDetalles(respuesta.drinks || []);
        },
        error: (error) => {
          console.error('Error al cargar bebidas:', error);
          this.mensaje = 'No se pudieron cargar las bebidas.';
          this.bebidas = [];
          this.cargando = false;
        }
      });
  }

  buscarPorNombre(): void {
    if (!this.nombreBusqueda.trim()) {
      this.cargarBebidas();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.mensajeCarrito = '';

    this.bebidasService.buscarBebida(this.nombreBusqueda).subscribe({
      next: (respuesta) => {
        this.cargarDetalles(respuesta.drinks || []);
      },
      error: (error) => {
        console.error('Error al buscar bebida:', error);
        this.mensaje = 'No se pudo realizar la búsqueda.';
        this.bebidas = [];
        this.cargando = false;
      }
    });
  }

  buscarPorIngrediente(): void {
    if (!this.ingredienteBusqueda.trim()) {
      this.cargarBebidas();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.mensajeCarrito = '';

    const ingrediente = this.ingredienteBusqueda
      .trim()
      .replace(/\s+/g, '_');

    this.bebidasService.buscarIngrediente(ingrediente).subscribe({
      next: (respuesta) => {
        this.cargarDetalles(respuesta.drinks || [], ingrediente);
      },
      error: (error) => {
        console.error('Error al buscar ingrediente:', error);
        this.mensaje = 'No se pudo buscar el ingrediente.';
        this.bebidas = [];
        this.cargando = false;
      }
    });
  }

  filtrarAlcohol(): void {
    if (!this.tipoAlcohol) {
      this.cargarBebidas();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.mensajeCarrito = '';

    this.bebidasService.filtrarPorAlcohol(this.tipoAlcohol).subscribe({
      next: (respuesta) => {
        this.cargarDetalles(respuesta.drinks || []);
      },
      error: (error) => {
        console.error('Error al filtrar bebidas:', error);
        this.mensaje = 'No se pudieron filtrar las bebidas.';
        this.bebidas = [];
        this.cargando = false;
      }
    });
  }

  cargarDetalles(resultados: any[], ingredienteBuscado = ''): void {

    if (resultados.length === 0) {
      this.bebidas = [];
      this.mensaje = 'No se encontraron bebidas.';
      this.cargando = false;
      return;
    }

    const consultas: Observable<any>[] = resultados.map((bebida: any) =>
      this.bebidasService.obtenerDetalleBebida(bebida.idDrink)
    );

    forkJoin(consultas).subscribe({
      next: (detalles: any[]) => {

        this.bebidas = detalles
          .map((respuesta: any) => {

            const bebida = respuesta.drinks?.[0];

            if (!bebida) return null;

            const ingredientes = this.obtenerIngredientes(bebida);

            const tieneIngrediente = ingredientes.some(
              (item: string) =>
                this.normalizar(item) === this.normalizar(ingredienteBuscado)
            );

            return {
              ...bebida,
              ingredientes: ingredientes,
              tieneIngrediente: tieneIngrediente,
              precio: Math.floor(Math.random() * 15000) + 8000
            };

          })
          .filter((bebida: any) => {

            if (!bebida) return false;

            if (ingredienteBuscado) {
              return bebida.tieneIngrediente;
            }

            return true;

          });

        if (this.bebidas.length === 0) {
          this.mensaje = 'No se encontraron bebidas con ese ingrediente.';
        }

        this.cargando = false;

        console.log('Bebidas recibidas:', this.bebidas);

      },
      error: (error) => {
        console.error('Error al consultar detalles:', error);
        this.mensaje = 'No se pudieron cargar los ingredientes.';
        this.bebidas = [];
        this.cargando = false;
      }
    });

  }

  obtenerIngredientes(bebida: any): string[] {

    const ingredientes: string[] = [];

    for (let i = 1; i <= 15; i++) {

      const ingrediente = bebida['strIngredient' + i];

      if (ingrediente && ingrediente.trim()) {
        ingredientes.push(ingrediente.trim());
      }

    }

    return ingredientes;

  }

  normalizar(texto: string): string {

    return texto
      .toLowerCase()
      .replace(/_/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  }

  agregarAlCarrito(bebida: any): void {

  this.carritoService.agregarProducto({
    id: bebida.idDrink,
    nombre: bebida.strDrink,
    imagen: bebida.strDrinkThumb,
    precio: bebida.precio
  }, 'bebida');

  this.mostrarMensajeCarrito(bebida.strDrink);

}
  mostrarMensajeCarrito(nombre: string): void {

  clearTimeout(this.temporizadorMensaje);

  this.mensajeCarrito = nombre + ' se agregó al carrito.';

  this.temporizadorMensaje = setTimeout(() => {
    this.mensajeCarrito = '';
  }, 3000);

}

  imagenAlternativa(event: Event): void {

    const imagen = event.target as HTMLImageElement;

    imagen.src = 'https://placehold.co/400x250/292929/c9a45c?text=MANILA';

  }

}
