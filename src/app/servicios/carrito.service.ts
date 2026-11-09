
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // Aquí guardamos los productos del carrito
  private productos: any[] = [];

  // Permite compartir los productos con otros componentes
  private carritoSubject = new BehaviorSubject<any[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  // Agregar un producto al carrito
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

  // Eliminar un producto del carrito
  eliminarProducto(id: string, tipo: string): void {

    this.productos = this.productos.filter(
      item => !(item.id === id && item.tipo === tipo)
    );

    this.actualizarCarrito();

  }

  // Cambiar la cantidad de un producto
  cambiarCantidad(id: string, tipo: string, cantidad: number): void {

    const producto = this.productos.find(
      item => item.id === id && item.tipo === tipo
    );

    if (producto) {

      producto.cantidad = Math.max(1, cantidad);

      this.actualizarCarrito();

    }

  }

  // Actualizar la información compartida
  private actualizarCarrito(): void {

    this.carritoSubject.next([...this.productos]);

  }

  // Calcular el total de la compra
  calcularTotal(): number {

    return this.productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );

  }

  // Vaciar el carrito
  vaciarCarrito(): void {

    this.productos = [];

    this.actualizarCarrito();

  }

}
