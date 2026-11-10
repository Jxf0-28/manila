
export abstract class Producto {

  private id: string;
  private nombre: string;
  private precio: number;
  private imagen: string;

  constructor(
    id: string,
    nombre: string,
    precio: number,
    imagen: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }

  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getPrecio(): number {
    return this.precio;
  }

  getImagen(): string {
    return this.imagen;
  }

  setPrecio(precio: number): void {
    if (precio >= 0) {
      this.precio = precio;
    }
  }

  abstract obtenerTipo(): string;

}
