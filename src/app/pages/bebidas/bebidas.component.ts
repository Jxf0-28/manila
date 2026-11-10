
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

import { BebidasService } from '../../servicios/bebidas.service';
import { CarritoService } from '../../servicios/carrito.service';
import { Bebida } from '../../entidades/bebida';

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
  bebidas: Bebida[] = [];

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

            const datos = respuesta.drinks?.[0];

            if (!datos) return null;

            const ingredientes = this.obtenerIngredientes(datos);

            const tieneIngrediente = ingredientes.some(
              (item: string) =>
                this.normalizar(item) === this.normalizar(ingredienteBuscado)
            );

            if (ingredienteBuscado && !tieneIngrediente) {
              return null;
            }

            const precio = Math.floor(Math.random() * 15000) + 8000;

            return this.bebidasService.crearBebida(
              datos.idDrink,
              datos.strDrink,
              precio,
              datos.strDrinkThumb,
              datos.strCategory || '',
              datos.strAlcoholic || '',
              ingredientes
            );

          })
          .filter((bebida): bebida is Bebida => bebida !== null);

        if (this.bebidas.length === 0) {
          this.mensaje = ingredienteBuscado
            ? 'No se encontraron bebidas con ese ingrediente.'
            : 'No se encontraron bebidas.';
        }

        this.cargando = false;

        console.log('Bebidas como entidades:', this.bebidas);

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

  agregarAlCarrito(bebida: Bebida): void {

    this.carritoService.agregarProducto({
      id: bebida.getId(),
      nombre: bebida.getNombre(),
      imagen: bebida.getImagen(),
      precio: bebida.getPrecio()
    }, 'bebida');

    this.mostrarMensajeCarrito(bebida.getNombre());
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
