
export class Cliente {

  private identificacion: string;
  private nombre: string;
  private telefono: string;
  private direccion: string;

  constructor(
    identificacion: string,
    nombre: string,
    telefono: string,
    direccion: string
  ) {
    this.identificacion = identificacion;
    this.nombre = nombre;
    this.telefono = telefono;
    this.direccion = direccion;
  }

  getIdentificacion(): string {
    return this.identificacion;
  }

  getNombre(): string {
    return this.nombre;
  }

  getTelefono(): string {
    return this.telefono;
  }

  getDireccion(): string {
    return this.direccion;
  }

  actualizarDatos(
    nombre: string,
    telefono: string,
    direccion: string
  ): void {
    this.nombre = nombre;
    this.telefono = telefono;
    this.direccion = direccion;
  }

}
