
import { Producto } from './producto';

export class Bebida extends Producto {
  private categoria: string;
  private tipoAlcohol: string;
  private ingredientes: string[];

  constructor(
    id: string,
    nombre: string,
    precio: number,
    imagen: string,
    categoria: string,
    tipoAlcohol: string,
    ingredientes: string[]
  ) {
    super(id, nombre, precio, imagen);
    this.categoria = categoria;
    this.tipoAlcohol = tipoAlcohol;
    this.ingredientes = ingredientes;
  }

  getCategoria(): string {
    return this.categoria;
  }

  getTipoAlcohol(): string {
    return this.tipoAlcohol;
  }

  getIngredientes(): string[] {
    return [...this.ingredientes];
  }

  obtenerTipo(): string {
    return 'Bebida';
  }
}
