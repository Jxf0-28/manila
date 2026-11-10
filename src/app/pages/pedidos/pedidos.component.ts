
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import { Cliente } from '../../entidades/cliente';
import { Pedido } from '../../entidades/pedido';

import { CarritoService } from '../../servicios/carrito.service';

@Component({  
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit, OnDestroy {

  private carritoService = inject(CarritoService);
  private carritoSuscripcion?: Subscription;

  productos: any[] = [];
  pedidoActual?: Pedido;

  nombre = '';
  celular = '';
  direccion = '';

  mensaje = '';

  ngOnInit(): void {
    this.carritoSuscripcion = this.carritoService.carrito$.subscribe({
      next: (productos) => {
        this.productos = productos;
      }
    });
  }

  ngOnDestroy(): void {
    this.carritoSuscripcion?.unsubscribe();
  }

  cambiarCantidad(producto: any, cantidad: number): void {
    const nuevaCantidad = producto.cantidad + cantidad;

    if (nuevaCantidad >= 1) {
      this.carritoService.cambiarCantidad(
        producto.id,
        producto.tipo,
        nuevaCantidad
      );
    }
  }

  eliminarProducto(producto: any): void {
    this.carritoService.eliminarProducto(
      producto.id,
      producto.tipo
    );

    this.mensaje = 'Producto eliminado del carrito.';
  }

  calcularCantidadProductos(): number {
    return this.productos.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  }

  calcularSubtotal(): number {
    return this.productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );
  }

  // Cargar logo

  cargarLogo(): Promise<{
    datos: string;
    ancho: number;
    alto: number;
  }> {

    return new Promise((resolve, reject) => {

      const imagen = new Image();

      imagen.src = 'assets/logo_manila.png';

      imagen.onload = () => {

        const canvas = document.createElement('canvas');

        canvas.width = imagen.naturalWidth;
        canvas.height = imagen.naturalHeight;

        const contexto = canvas.getContext('2d');

        if (!contexto) {
          reject('No se pudo procesar el logo.');
          return;
        }

        contexto.drawImage(
          imagen,
          0,
          0,
          imagen.naturalWidth,
          imagen.naturalHeight
        );

        resolve({
          datos: canvas.toDataURL('image/png'),
          ancho: imagen.naturalWidth,
          alto: imagen.naturalHeight
        });
      };

      imagen.onerror = () => {
        reject('No se encontró el logo.');
      };
    });
  }

  // Confirmar pedido

  async confirmarPedido(): Promise<void> {

  if (this.productos.length === 0) {
    this.mensaje = 'Agrega productos antes de confirmar el pedido.';
    return;
  }

  if (
    !this.nombre.trim() ||
    !this.celular.trim() ||
    !this.direccion.trim()
  ) {
    this.mensaje = 'Completa todos los datos para la entrega.';
    return;
  }

  try {

    // Crear el objeto Cliente
    const cliente = new Cliente(
      '',
      this.nombre.trim(),
      this.celular.trim(),
      this.direccion.trim()
    );

    // Crear el objeto Pedido con los productos del carrito
    this.pedidoActual = this.carritoService.crearPedido(cliente);

    // Generar el comprobante
    await this.generarPDF();

    this.mensaje = '¡Pedido confirmado! Tu comprobante PDF se ha descargado.';

  } catch (error) {

    console.error('Error al generar el PDF:', error);

    this.mensaje = 'No se pudo generar el PDF. Revisa el logo.';

  }

}

  // Generar PDF en una sola página

  async generarPDF(): Promise<void> {

    const documento = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const anchoPagina = 210;
    const altoPagina = 297;
    const margen = 15;
    const anchoContenido = anchoPagina - margen * 2;

    const dorado: [number, number, number] = [201, 164, 92];
    const oscuro: [number, number, number] = [41, 41, 41];
    const gris: [number, number, number] = [110, 110, 110];

    const formatoPrecio = (precio: number): string => {
      return '$ ' + precio.toLocaleString('es-CO');
    };

    const fecha = new Date().toLocaleDateString('es-CO');

    // Encabezado

    const logo = await this.cargarLogo();

    const proporcion = Math.min(
      43 / logo.ancho,
      25 / logo.alto
    );

    const anchoLogo = logo.ancho * proporcion;
    const altoLogo = logo.alto * proporcion;

    documento.addImage(
      logo.datos,
      'PNG',
      margen,
      12,
      anchoLogo,
      altoLogo
    );

    documento.setFont('helvetica', 'bold');
    documento.setFontSize(19);
    documento.setTextColor(...oscuro);

    documento.text(
      'COMPROBANTE',
      anchoPagina - margen,
      20,
      { align: 'right' }
    );

    documento.setFont('helvetica', 'normal');
    documento.setFontSize(11);
    documento.setTextColor(...gris);

    documento.text(
      'DE PEDIDO',
      anchoPagina - margen,
      27,
      { align: 'right' }
    );

    documento.text(
      'Fecha: ' + fecha,
      anchoPagina - margen,
      35,
      { align: 'right' }
    );

    // Separador

    documento.setDrawColor(...dorado);
    documento.setLineWidth(1);

    documento.line(
      margen,
      45,
      anchoPagina - margen,
      45
    );

    // Datos del cliente

    documento.setFont('helvetica', 'bold');
    documento.setFontSize(13);
    documento.setTextColor(...oscuro);

    documento.text('DATOS DEL CLIENTE', margen, 55);

    documento.setFillColor(248, 246, 240);

    documento.roundedRect(
      margen,
      60,
      anchoContenido,
      31,
      3,
      3,
      'F'
    );

    documento.setFontSize(9);
    documento.setFont('helvetica', 'normal');
    documento.setTextColor(...gris);

    documento.text('Nombre:', margen + 5, 69);
    documento.text('Celular:', margen + 5, 78);
    documento.text('Dirección:', margen + 5, 87);

    documento.setFont('helvetica', 'bold');
    documento.setTextColor(...oscuro);

    // Evitar que los datos largos se salgan de la tarjeta

    const nombrePDF = documento.splitTextToSize(
      this.nombre,
      125
    )[0];

    const direccionPDF = documento.splitTextToSize(
      this.direccion,
      125
    )[0];

    documento.text(nombrePDF, margen + 32, 69);
    documento.text(this.celular, margen + 32, 78);
    documento.text(direccionPDF, margen + 32, 87);

    // Detalle del pedido

    documento.setFont('helvetica', 'bold');
    documento.setFontSize(13);
    documento.setTextColor(...oscuro);

    documento.text('DETALLE DEL PEDIDO', margen, 103);

    // Ajustar el espacio y el texto según la cantidad de productos

    const cantidadProductos = this.productos.length;

    const espacioDisponible = 145;

    const altoFila = Math.min(
      12,
      espacioDisponible / Math.max(cantidadProductos, 1)
    );

    let tamanoTexto = 9;

    if (cantidadProductos > 12) {
      tamanoTexto = 8;
    }

    if (cantidadProductos > 18) {
      tamanoTexto = 7;
    }

    if (cantidadProductos > 25) {
      tamanoTexto = 6;
    }

    let posicionY = 109;

    // Encabezado de los productos

    documento.setFillColor(41, 41, 41);

    documento.roundedRect(
      margen,
      posicionY,
      anchoContenido,
      9,
      2,
      2,
      'F'
    );

    documento.setFont('helvetica', 'bold');
    documento.setFontSize(8);
    documento.setTextColor(255, 255, 255);

    documento.text('PRODUCTO', margen + 4, posicionY + 6);
    documento.text('CANT.', 112, posicionY + 6);
    documento.text('PRECIO', 132, posicionY + 6);
    documento.text(
      'SUBTOTAL',
      anchoPagina - margen - 4,
      posicionY + 6,
      { align: 'right' }
    );

    posicionY += 9;

    // Mostrar productos en filas compactas

    this.productos.forEach((producto, indice) => {

      const colorFondo = indice % 2 === 0
        ? [250, 250, 250]
        : [242, 242, 242];

      documento.setFillColor(
        colorFondo[0],
        colorFondo[1],
        colorFondo[2]
      );

      documento.rect(
        margen,
        posicionY,
        anchoContenido,
        altoFila,
        'F'
      );

      documento.setFont('helvetica', 'normal');
      documento.setFontSize(tamanoTexto);
      documento.setTextColor(...oscuro);

      // Nombre del producto en una sola línea

      let nombreProducto = producto.nombre;

      const anchoNombre = 87;

      while (
        documento.getTextWidth(nombreProducto) > anchoNombre &&
        nombreProducto.length > 3
      ) {
        nombreProducto = nombreProducto.substring(
          0,
          nombreProducto.length - 1
        );
      }

      if (nombreProducto !== producto.nombre) {
        nombreProducto = nombreProducto.substring(
          0,
          nombreProducto.length - 2
        ) + '...';
      }

      const alturaTexto = Math.max(3, altoFila / 2 + 1);

      documento.text(
        nombreProducto,
        margen + 4,
        posicionY + alturaTexto
      );

      // Cantidad

      documento.text(
        String(producto.cantidad),
        115,
        posicionY + alturaTexto
      );

      // Precio unitario

      documento.text(
        formatoPrecio(producto.precio),
        132,
        posicionY + alturaTexto
      );

      // Subtotal

      documento.setFont('helvetica', 'bold');

      documento.text(
        formatoPrecio(producto.precio * producto.cantidad),
        anchoPagina - margen - 4,
        posicionY + alturaTexto,
        { align: 'right' }
      );

      posicionY += altoFila;
    });

    // Total del pedido

    posicionY += 5;

    documento.setFillColor(...oscuro);

    documento.roundedRect(
      margen,
      posicionY,
      anchoContenido,
      20,
      3,
      3,
      'F'
    );

    documento.setFont('helvetica', 'bold');
    documento.setFontSize(12);
    documento.setTextColor(255, 255, 255);

    documento.text(
      'TOTAL A PAGAR',
      margen + 6,
      posicionY + 12
    );

    documento.setFontSize(14);
    documento.setTextColor(230, 195, 120);

    documento.text(
      formatoPrecio(
  this.pedidoActual?.calcularTotal() ?? this.calcularSubtotal()
) + ' COP',
      anchoPagina - margen - 6,
      posicionY + 12,
      { align: 'right' }
    );

    // Pie de página

    posicionY += 29;

    documento.setDrawColor(...dorado);

    documento.line(
      margen,
      posicionY,
      anchoPagina - margen,
      posicionY
    );

    documento.setFont('helvetica', 'italic');
    documento.setFontSize(10);
    documento.setTextColor(...gris);

    documento.text(
      'Gracias por elegir MANILA Restaurante.',
      anchoPagina / 2,
      posicionY + 8,
      { align: 'center' }
    );

    documento.setFont('helvetica', 'normal');
    documento.setFontSize(8);

    documento.text(
      'Comprobante generado digitalmente.',
      anchoPagina / 2,
      posicionY + 14,
      { align: 'center' }
    );

    // Descargar PDF

    documento.save('Pedido-MANILA.pdf');
  }
}
