import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Cliente } from '../entidades/cliente';
import { Comida } from '../entidades/comida';
import { Bebida } from '../entidades/bebida';
import { Pedido } from '../entidades/pedido';
import { Producto } from '../entidades/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private productos: any[] = [];

  private carritoSubject = new BehaviorSubject<any[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  agregarProducto(producto: any, tipo: string): void {

    const productoExistente = this.productos.find(
      item => item.id === producto.id && item.tipo === tipo
    );

    if (productoExistente) {

      productoExistente.cantidad++;

    } else {

      this.productos.push({
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: producto.precio,
        tipo: tipo,
        cantidad: 1
      });

    }

    this.actualizarCarrito();

  }

  eliminarProducto(id: string, tipo: string): void {

    this.productos = this.productos.filter(
      item => !(item.id === id && item.tipo === tipo)
    );

    this.actualizarCarrito();

  }

  cambiarCantidad(id: string, tipo: string, cantidad: number): void {

    const producto = this.productos.find(
      item => item.id === id && item.tipo === tipo
    );

    if (producto) {

      producto.cantidad = Math.max(1, cantidad);

      this.actualizarCarrito();

    }

  }

  private actualizarCarrito(): void {

    this.carritoSubject.next([...this.productos]);

  }

  calcularTotal(): number {

    return this.productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );

  }

  vaciarCarrito(): void {

    this.productos = [];

    this.actualizarCarrito();

  }

  // Crear un pedido utilizando las entidades

  crearPedido(cliente: Cliente): Pedido {

    const pedido = new Pedido(cliente);

    this.productos.forEach(item => {

      let producto: Producto;

      if (item.tipo === 'comida') {

        producto = new Comida(
          item.id,
          item.nombre,
          item.precio,
          item.imagen,
          '',
          []
        );

      } else {

        producto = new Bebida(
          item.id,
          item.nombre,
          item.precio,
          item.imagen,
          '',
          '',
          []
        );

      }

      pedido.agregarProducto(producto, item.cantidad);

    });

    return pedido;

  }

}