
import { Producto } from './producto';

export class Comida extends Producto {
  private categoria: string;
  private ingredientes: string[];
  private tieneIngrediente: boolean;

  constructor(
    id: string,
    nombre: string,
    precio: number,
    imagen: string,
    categoria: string,
    ingredientes: string[]
  ) {
    super(id, nombre, precio, imagen);
    this.categoria = categoria;
    this.ingredientes = ingredientes;
    this.tieneIngrediente = false;
  }

  getCategoria(): string {
    return this.categoria;
  }

  getIngredientes(): string[] {
    return [...this.ingredientes];
  }

  getTieneIngrediente(): boolean {
    return this.tieneIngrediente;
  }

  setTieneIngrediente(valor: boolean): void {
    this.tieneIngrediente = valor;
  }

  obtenerTipo(): string {
    return 'Comida';
  }
}
