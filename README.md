# MANILA - Plataforma Web de Restaurante

**MANILA** es una aplicación web desarrollada con Angular que busca ofrecer una experiencia digital moderna e intuitiva para explorar productos gastronómicos y gestionar pedidos de un restaurante.

El proyecto integra diferentes herramientas de desarrollo web, consumo de APIs externas y funcionalidades interactivas para simular el funcionamiento de una plataforma de pedidos en línea.

---

## Descripción del proyecto

MANILA permite a los usuarios conocer la propuesta gastronómica del restaurante, consultar diferentes opciones de comidas y bebidas, agregar productos a un carrito de compras y generar un comprobante de pedido en formato PDF.

Su diseño está enfocado en ofrecer una navegación sencilla, una presentación visual agradable y una experiencia organizada.

## Funcionalidades principales

### Inicio
- Presentación del restaurante.
- Información sobre su identidad y esencia.
- Diseño visual acorde con la temática del proyecto.

### Comidas
- Consulta de diferentes platos gastronómicos.
- Obtención de información mediante una API externa.
- Búsqueda de comidas.
- Visualización de detalles de los productos.
- Opción para agregar productos al carrito.

### Bebidas
- Consulta de diferentes bebidas.
- Clasificación de bebidas con alcohol y sin alcohol.
- Búsqueda por nombre e ingrediente.
- Consulta de información mediante una API externa.
- Opción para agregar productos al carrito.

### Pedidos
- Visualización de productos agregados al carrito.
- Eliminación de productos.
- Cálculo automático del total.
- Organización de la información del cliente.
- Generación de comprobantes en PDF.

### Juego
- Sección interactiva que complementa la experiencia de navegación.
- Funcionalidad recreativa dentro de la plataforma.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Angular | Framework principal del proyecto. |
| TypeScript | Lógica y programación de los componentes. |
| JavaScript | Funcionalidades e interacción. |
| HTML5 | Estructura de las páginas. |
| CSS3 | Diseño y estilos visuales. |
| Bootstrap | Componentes y organización del diseño. |
| APIs REST | Obtención de información de comidas y bebidas. |
| JSON | Intercambio y manejo de datos. |
| RxJS | Manejo de operaciones asíncronas. |
| jsPDF | Generación de documentos PDF. |
| Git y GitHub | Control de versiones y almacenamiento del código. |
| Vercel | Despliegue de la aplicación web. |

## APIs utilizadas

El proyecto utiliza servicios externos para consultar información de productos:

- **TheMealDB:** API utilizada para obtener información de comidas.  
  https://www.themealdb.com/api.php

- **TheCocktailDB:** API utilizada para consultar información de bebidas y cócteles.  
  https://www.thecocktaildb.com/api.php

## Instalación y ejecución

Para ejecutar MANILA en un entorno local, sigue estos pasos:

**1. Clonar el repositorio**

```bash
git clone https://github.com/Julito/manila.git
```

**2. Ingresar a la carpeta del proyecto**

```bash
cd manila
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Ejecutar el servidor de desarrollo**

```bash
ng serve
```

**5. Abrir la aplicación**

Ingresa desde el navegador a:

```text
http://localhost:4200/
```

## Estructura del proyecto

```text
manila/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── servicios/
│   │   └── app.component.ts
│   │
│   ├── assets/
│   ├── index.html
│   └── styles.css
│
├── angular.json
├── package.json
├── package-lock.json
└── README.md
```

*La estructura puede variar según la organización actual del proyecto.*

## Objetivo académico

Este proyecto tiene como finalidad aplicar y fortalecer conocimientos relacionados con el desarrollo de aplicaciones web, especialmente en:

- Desarrollo de aplicaciones con Angular.
- Creación y organización de componentes.
- Programación con TypeScript y JavaScript.
- Consumo de APIs externas.
- Lectura y procesamiento de información en formato JSON.
- Manejo de servicios y comunicación entre componentes.
- Diseño de interfaces con HTML, CSS y Bootstrap.
- Gestión de versiones mediante Git y GitHub.
- Publicación de aplicaciones web mediante Vercel.

## Despliegue

La aplicación está preparada para su publicación mediante Vercel, permitiendo acceder a MANILA desde un navegador web.

**Enlace del proyecto:** Pendiente de publicación.

---

## Autor

**Julito**

Proyecto académico desarrollado como parte del proceso de aprendizaje en programación y desarrollo web.

**MANILA - Una experiencia digital para descubrir, elegir y disfrutar.**
