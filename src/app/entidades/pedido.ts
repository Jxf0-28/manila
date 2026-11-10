import { Cliente } from './cliente';
import { Producto } from './producto';
import { DetallePedido } from './detalle-pedido';

export class Pedido {

  private cliente: Cliente;
  private detalles: DetallePedido[];
  private fecha: Date;

  constructor(cliente: Cliente) {
    this.cliente = cliente;
    this.detalles = [];
    this.fecha = new Date();
  }

  getCliente(): Cliente {
    return this.cliente;
  }

  getDetalles(): DetallePedido[] {
    return [...this.detalles];
  }

  getFecha(): Date {
    return this.fecha;
  }

  agregarProducto(producto: Producto, cantidad: number = 1): void {

    const existente = this.detalles.find(detalle =>
      detalle.getProducto().getId() === producto.getId() &&
      detalle.getProducto().obtenerTipo() === producto.obtenerTipo()
    );

    if (existente) {

      for (let i = 0; i < cantidad; i++) {
        existente.aumentarCantidad();
      }

    } else {

      this.detalles.push(
        new DetallePedido(producto, cantidad)
      );

    }

  }

  eliminarProducto(id: string): void {
    this.detalles = this.detalles.filter(detalle =>
      detalle.getProducto().getId() !== id
    );
  }

  calcularTotal(): number {
    return this.detalles.reduce(
      (total, detalle) => total + detalle.calcularSubtotal(),
      0
    );
  }

}