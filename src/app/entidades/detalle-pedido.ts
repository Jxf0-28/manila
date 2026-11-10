
import { Producto } from './producto';

export class DetallePedido {

  private producto: Producto;
  private cantidad: number;

  constructor(producto: Producto, cantidad: number = 1) {
    this.producto = producto;
    this.cantidad = Math.max(1, cantidad);
  }

  getProducto(): Producto {
    return this.producto;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  calcularSubtotal(): number {
    return this.producto.getPrecio() * this.cantidad;
  }

}
