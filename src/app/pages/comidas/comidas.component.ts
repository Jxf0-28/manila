
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

import { ComidasService } from '../../servicios/comidas.service';
import { CarritoService } from '../../servicios/carrito.service';
import { Comida } from '../../entidades/comida';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  private temporizadorMensaje: any;

  private comidasService = inject(ComidasService);
  private carritoService = inject(CarritoService);

  categorias: any[] = [];
  comidas: Comida[] = [];

  categoriaSeleccionada = '';
  nombreBusqueda = '';
  ingredienteBusqueda = '';

  ingredienteBuscado = '';
  busquedaIngredienteActiva = false;

  cargando = false;
  mensaje = '';
  mensajeCarrito = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.comidasService.obtenerCategorias().subscribe({
      next: (respuesta) => {
        this.categorias = respuesta.meals || [];

        if (this.categorias.length > 0) {
          this.categoriaSeleccionada = this.categorias[0].strCategory;
          this.cargarComidas();
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.mensaje = 'No se pudieron cargar las categorías.';
      }
    });
  }

  cargarComidas(): void {
    if (!this.categoriaSeleccionada) return;

    this.busquedaIngredienteActiva = false;
    this.cargando = true;
    this.mensaje = '';

    this.comidasService
      .obtenerComidasPorCategoria(this.categoriaSeleccionada)
      .subscribe({
        next: (respuesta) => {
          this.cargarDetalles(respuesta.meals || []);
        },
        error: (error) => {
          console.error('Error al cargar comidas:', error);
          this.mensaje = 'No se pudieron cargar las comidas.';
          this.comidas = [];
          this.cargando = false;
        }
      });
  }

  buscarPorNombre(): void {
    if (!this.nombreBusqueda.trim()) {
      this.cargarComidas();
      return;
    }

    this.busquedaIngredienteActiva = false;
    this.cargando = true;
    this.mensaje = '';

    this.comidasService.buscarComida(this.nombreBusqueda).subscribe({
      next: (respuesta) => {
        this.cargarDetalles(respuesta.meals || []);
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.mensaje = 'No se pudo realizar la búsqueda.';
        this.comidas = [];
        this.cargando = false;
      }
    });
  }

  buscarPorIngrediente(): void {
    if (!this.ingredienteBusqueda.trim()) {
      this.cargarComidas();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.busquedaIngredienteActiva = true;
    this.ingredienteBuscado = this.ingredienteBusqueda.trim();

    const ingredienteAPI = this.ingredienteBuscado.replace(/\s+/g, '_');

    this.comidasService.buscarIngrediente(ingredienteAPI).subscribe({
      next: (respuesta) => {
        this.cargarDetalles(respuesta.meals || []);
      },
      error: (error) => {
        console.error('Error al buscar ingrediente:', error);
        this.mensaje = 'No se pudo realizar la búsqueda.';
        this.comidas = [];
        this.cargando = false;
      }
    });
  }

  cargarDetalles(resultados: any[]): void {
    if (resultados.length === 0) {
      this.comidas = [];
      this.mensaje = 'No se encontraron comidas.';
      this.cargando = false;
      return;
    }

    const consultas: Observable<any>[] = resultados.map((comida: any) =>
      this.comidasService.obtenerDetalleComida(comida.idMeal)
    );

    forkJoin(consultas).subscribe({
      next: (detalles: any[]) => {

        this.comidas = detalles
          .map((respuesta: any) => {
            const datos = respuesta.meals?.[0];

            if (!datos) return null;

            const ingredientes = this.obtenerIngredientes(datos);

            const tieneIngrediente = ingredientes.some(
              (ingrediente: string) =>
                this.normalizar(ingrediente) ===
                this.normalizar(this.ingredienteBuscado)
            );

            const precio = Math.floor(Math.random() * 20000) + 10000;

            const comida = this.comidasService.crearComida(
              datos.idMeal,
              datos.strMeal,
              precio,
              datos.strMealThumb,
              datos.strCategory || this.categoriaSeleccionada,
              ingredientes
            );

            comida.setTieneIngrediente(tieneIngrediente);

            return comida;
          })
          .filter((comida): comida is Comida => {
            if (!comida) return false;

            if (this.busquedaIngredienteActiva) {
              return comida.getTieneIngrediente();
            }

            return true;
          });

        if (this.comidas.length === 0) {
          this.mensaje = 'No se encontraron comidas con ese ingrediente.';
        }

        this.cargando = false;
        console.log('Comidas como entidades:', this.comidas);
      },
      error: (error) => {
        console.error('Error al consultar detalles:', error);
        this.mensaje = 'No se pudieron cargar los ingredientes.';
        this.comidas = [];
        this.cargando = false;
      }
    });
  }

  obtenerIngredientes(comida: any): string[] {
    const ingredientes: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingrediente = comida['strIngredient' + i];

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

  agregarAlCarrito(comida: Comida): void {
    this.carritoService.agregarProducto({
      id: comida.getId(),
      nombre: comida.getNombre(),
      imagen: comida.getImagen(),
      precio: comida.getPrecio()
    }, 'comida');

    this.mostrarMensajeCarrito(comida.getNombre());
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
